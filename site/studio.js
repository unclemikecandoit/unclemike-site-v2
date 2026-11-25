// Private publishing studio (owner only).
// Workflow: upload photos → automatic analysis & draft listing → review → approve → publish.
// Storage: Cloudflare KV (binding DATA). Keys:
//   catalog:draft       working catalog (products with rev/approvedRev), prices, shipping, content
//   catalog:published   public snapshot (what customers see)
//   pub:<ts> / hist:<ts> backups of published snapshots / previous drafts
//   img:<file>          uploaded images, public at /m/<file>
//   inq:* inqfile:* order:* oid:*  inquiries and orders (written by the public site)
//   notes               creative notes with Brand Gate reviews
import { BUNDLED, TYPE_LABEL, verifyOrder } from './shop.js';
import { STUDIO_HTML } from './studio-page.js';

const SECURITY = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'" };
const json = (d, s = 200, h = {}) => new Response(JSON.stringify(d), { status: s, headers: { 'Content-Type': 'application/json', ...SECURITY, ...h } });
const TYPES = ['sticker', 'sheet', 'hat', 'tshirt', 'sweatshirt'];
const COOKIE = 'um_studio';
const DAY = 86400;

// ── Brand Gate (exact rules from the project brief) ───────────────────
export const CRITERIA = ['Brand Fit', 'Audience Value', 'Authenticity', 'Content Quality', 'Long-Term Brand Purpose'];
export const HOLDS = { privacy: 'Privacy concern', permission: 'Missing permission', unsafe: 'Unsafe claim', inaccurate: 'Materially inaccurate claim' };
export function brandGate(g = {}) {
  const holds = Object.keys(HOLDS).filter((k) => g.holds?.[k] === true);
  if (holds.length) return { decision: 'HOLD', total: null, reasons: holds.map((k) => HOLDS[k]) };
  if (!String(g.message || '').trim()) return { decision: 'INCOMPLETE', total: null, reasons: ['Identify the central message first.'] };
  const s = CRITERIA.map((c) => g.scores?.[c]);
  if (s.some((x) => !Number.isInteger(x) || x < 0 || x > 2)) return { decision: 'INCOMPLETE', total: null, reasons: ['Score all five criteria from 0 to 2.'] };
  const total = s.reduce((a, b) => a + b, 0);
  const decision = s[0] === 0 || s[1] === 0 ? 'PARK' : total >= 8 ? 'POST' : total >= 6 ? 'FIX' : 'PARK';
  return { decision, total, reasons: CRITERIA.filter((_, i) => s[i] < 2).map((c) => `${c} scored ${s[CRITERIA.indexOf(c)]}/2.`) };
}

// ── Auth: password → signed, expiring, HttpOnly cookie ────────────────
const enc = new TextEncoder();
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function hmac(secret, msg) {
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', k, enc.encode(msg)));
}
const sha = async (s) => b64url(await crypto.subtle.digest('SHA-256', enc.encode(s)));
function safeEqual(a, b) { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }
const sessionKey = (env) => 'session|' + env.OWNER_PASSWORD + '|' + (env.SESSION_SECRET || '');
async function makeSession(env) { const exp = Math.floor(Date.now() / 1000) + 30 * DAY; return `${exp}.${await hmac(sessionKey(env), 'owner|' + exp)}`; }
async function isOwner(request, env) {
  if (!env.OWNER_PASSWORD) return false;
  const c = (request.headers.get('Cookie') || '').split(/;\s*/).find((x) => x.startsWith(COOKIE + '='));
  if (!c) return false;
  const [exp, sig] = c.slice(COOKIE.length + 1).split('.');
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, await hmac(sessionKey(env), 'owner|' + exp));
}
const cookie = (url, value, maxAge) => `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${url.protocol === 'https:' ? '; Secure' : ''}`;

// ── Draft catalog ──────────────────────────────────────────────────────
import { DEFAULT_CONTENT } from './content.js';

function seedDraft() {
  return {
    version: 1, prices: { ...BUNDLED.prices }, shipping: { ...BUNDLED.shipping }, content: { ...DEFAULT_CONTENT },
    collections: [...new Set(BUNDLED.products.map((p) => p.collection))],
    products: BUNDLED.products.map((p) => ({
      id: p.id, type: p.type, title: p.title, collection: p.collection, description: p.description, price: p.price, images: p.images,
      status: p.status === 'hold' ? 'hidden' : 'live', rev: 1, approvedRev: p.approved ? 1 : 0, source: 'catalog', ownerNote: p.ownerNote || '',
      gate: p.status === 'hold' ? { holds: { permission: true }, message: '' } : undefined, updatedAt: BUNDLED.version,
    })),
  };
}
async function getDraft(env) { return (await env.DATA.get('catalog:draft', 'json')) || seedDraft(); }
async function saveDraft(env, draft, prev) {
  if (prev) await env.DATA.put(`hist:${Date.now()}`, JSON.stringify(prev), { expirationTtl: 30 * DAY });
  draft.version = (draft.version || 0) + 1;
  await env.DATA.put('catalog:draft', JSON.stringify(draft));
  return draft;
}
const needsReview = (p) => p.status !== 'hidden' && p.approvedRev !== p.rev;
const gateHold = (p) => brandGate(p.gate).decision === 'HOLD';
const publicFields = ({ id, type, title, collection, description, price, images }) => ({ id, type, title, collection, description, price, images, status: 'live' });

/** Builds the public snapshot: approved current revisions, else the last published revision. */
export function buildPublished(draft, prevPublished) {
  const prev = new Map((prevPublished?.products || []).map((p) => [p.id, p]));
  const products = [];
  for (const p of draft.products) {
    if (p.status !== 'live' || gateHold(p)) continue;
    if (p.approvedRev === p.rev) products.push(publicFields(p));
    else if (prev.has(p.id)) products.push(prev.get(p.id));
  }
  return { version: new Date().toISOString(), prices: draft.prices, shipping: draft.shipping, content: draft.content, products };
}

function cleanText(v, max) { return typeof v === 'string' ? v.trim().slice(0, max) : undefined; }
function applyFields(p, f, draft) {
  const t = cleanText(f.title, 140); if (t !== undefined) { if (!t) throw new Error('Title cannot be empty.'); p.title = t; }
  const d = cleanText(f.description, 1000); if (d !== undefined) p.description = d;
  const c = cleanText(f.collection, 60); if (c !== undefined && c) { p.collection = c; if (!draft.collections.includes(c)) draft.collections.push(c); }
  if (f.type !== undefined) { if (!TYPES.includes(f.type)) throw new Error('Unknown product type.'); p.type = f.type; }
  if (f.price !== undefined) { if (!Number.isInteger(f.price) || f.price < 1 || f.price > 100000) throw new Error('Price must be between $0.01 and $1,000.'); p.price = f.price; }
  if (f.status !== undefined) { if (!['live', 'hidden'].includes(f.status)) throw new Error('Bad status.'); p.status = f.status; }
  if (f.images !== undefined) { if (!Array.isArray(f.images) || !f.images.length || f.images.some((i) => typeof i !== 'string' || !/^\/(img|m)\//.test(i))) throw new Error('A product needs at least one picture.'); p.images = f.images.slice(0, 12); }
  if (f.ownerNote !== undefined) p.ownerNote = cleanText(f.ownerNote, 1000) || '';
  if (f.gate !== undefined) p.gate = { message: cleanText(f.gate.message, 500) || '', scores: Object.fromEntries(CRITERIA.map((c) => [c, f.gate.scores?.[c]]).filter(([, v]) => Number.isInteger(v))), holds: Object.fromEntries(Object.keys(HOLDS).map((k) => [k, f.gate.holds?.[k] === true])) };
}
const slug = (s) => (s || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'item';
function uniqueId(draft, base) { let id = slug(base), n = 2; while (draft.products.some((p) => p.id === id)) id = `${slug(base)}-${n++}`; return id; }

function runOps(draft, ops) {
  const byId = (id) => { const p = draft.products.find((x) => x.id === id); if (!p) throw new Error('Product not found: ' + id); return p; };
  const results = [];
  for (const op of ops) {
    if (op.op === 'update') {
      const p = byId(op.id);
      const before = JSON.stringify([p.title, p.description, p.collection, p.type, p.price, p.status, p.images, p.gate]);
      applyFields(p, op.fields || {}, draft);
      // Any change customers would see invalidates approval (new revision).
      if (JSON.stringify([p.title, p.description, p.collection, p.type, p.price, p.status, p.images, p.gate]) !== before) { p.rev++; p.updatedAt = new Date().toISOString(); }
    } else if (op.op === 'approve') {
      const p = byId(op.id);
      if (op.rev !== p.rev) throw new Error(`"${p.title}" changed since you looked at it — please review it again.`);
      if (gateHold(p)) throw new Error(`"${p.title}" is on Brand Gate HOLD and cannot be approved.`);
      p.approvedRev = p.rev;
    } else if (op.op === 'unapprove') { byId(op.id).approvedRev = 0; }
    else if (op.op === 'delete') { const p = byId(op.id); draft.products = draft.products.filter((x) => x !== p); }
    else if (op.op === 'merge') {
      const [keep, ...rest] = (op.ids || []).map(byId);
      if (!keep || !rest.length) throw new Error('Pick at least two products to merge.');
      keep.images = [...new Set([...keep.images, ...rest.flatMap((r) => r.images)])].slice(0, 12); keep.rev++;
      draft.products = draft.products.filter((x) => !rest.includes(x));
    } else if (op.op === 'notdup') { byId(op.id).similar = []; }
    else if (op.op === 'hash') { byId(op.id).hash = String(op.hash || '').slice(0, 32); }
    else throw new Error('Unknown action.');
    results.push(op.op);
  }
  return results;
}

// ── Visual recognition (Cloudflare Workers AI, free daily allowance) ────
const AI_MODEL = '@cf/meta/llama-3.2-11b-vision-instruct';
const AI_PROMPT = `You are cataloguing merchandise for a small maker shop. Look at the photo.
Reply with ONLY a JSON object: {"type": one of "sticker","sheet","hat","tshirt","sweatshirt","other", "wording": exact visible text on the artwork (copy spelling exactly; "" if none), "title": short product title based on the wording or main subject (max 8 words), "description": one plain factual sentence describing what is visible (colors, subject, layout), "confidence": "high"|"medium"|"low"}.
Do not guess brand names, materials, sizes or anything not visible.`;
async function analyzeImage(env, bytes) {
  if (!env.AI) return { ok: false, error: 'Visual recognition is not connected in this environment.' };
  const input = { image: [...new Uint8Array(bytes)], prompt: AI_PROMPT, max_tokens: 300, temperature: 0.1 };
  let out;
  try {
    try { out = await env.AI.run(AI_MODEL, input); }
    catch (e) {
      if (!/agree|license|5016/i.test(String(e?.message))) throw e;
      await env.AI.run(AI_MODEL, { prompt: 'agree' }); // one-time acceptance of the model's license
      out = await env.AI.run(AI_MODEL, input);
    }
  } catch (e) {
    console.error('ai', e?.message);
    return { ok: false, error: /limit|quota|neuron|429|capacity/i.test(String(e?.message)) ? 'Today’s free recognition allowance is used up — fill in by hand or try tomorrow.' : 'Recognition failed for this photo — fill in by hand or tap “Try recognition” again.' };
  }
  const resp = out?.response ?? out?.description ?? '';
  const text = typeof resp === 'string' ? resp : JSON.stringify(resp);
  const m = text.match(/\{[\s\S]*\}/);
  try {
    const j = typeof resp === 'object' && resp ? resp : JSON.parse(m ? m[0] : text);
    const wording = String(j.wording || '').replace(/\s+/g, ' ').trim().slice(0, 300);
    // Prefer the artwork's own words for the title; fall back to the AI's short title.
    const small = new Set(['a', 'an', 'the', 'of', 'for', 'and', 'or', 'to', 'in', 'on', 'at', 'by', 'my']);
    const fromWording = wording && wording.split(' ').length <= 10 ? wording.toLowerCase().split(' ').map((w, i) => (i && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(' ') : '';
    const aiTitle = String(j.title || '').replace(/\s+(sticker|hat|t-?shirt|sweatshirt)$/i, '').slice(0, 120);
    return { ok: true, type: TYPES.includes(j.type) ? j.type : null, wording, title: fromWording || aiTitle, description: String(j.description || '').slice(0, 400), confidence: ['high', 'medium', 'low'].includes(j.confidence) ? j.confidence : 'low', model: AI_MODEL };
  } catch { return { ok: false, error: 'Recognition returned an unreadable answer.', raw: text.slice(0, 300) }; }
}

// ── Duplicate check: 64-bit difference hash computed in the browser ─────
const hamming = (a, b) => { let d = 0; for (let i = 0; i < 16; i++) { let x = parseInt(a[i], 16) ^ parseInt(b[i], 16); while (x) { d += x & 1; x >>= 1; } } return d; };
function similar(draft, hash, exceptId) {
  if (!/^[0-9a-f]{16}$/.test(hash || '')) return [];
  return draft.products.filter((p) => p.id !== exceptId && /^[0-9a-f]{16}$/.test(p.hash || '')).map((p) => ({ id: p.id, title: p.title, distance: hamming(hash, p.hash) })).filter((x) => x.distance <= 10).sort((a, b) => a.distance - b.distance).slice(0, 3);
}

// ── Helpers for inbox/orders ────────────────────────────────────────────
async function listJson(env, prefix, limit = 200) {
  const { keys } = await env.DATA.list({ prefix, limit });
  const vals = await Promise.all(keys.map((k) => env.DATA.get(k.name, 'json')));
  return keys.map((k, i) => ({ key: k.name, ...vals[i] })).filter((x) => x.created || x.version);
}
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
async function squareOrder(env, id) {
  const base = env.SQUARE_BASE_URL || (env.SQUARE_ENV === 'production' ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com');
  const r = await fetch(`${base}/v2/orders/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${env.SQUARE_ACCESS_TOKEN}`, 'Square-Version': '2026-01-22' } });
  return r.ok ? (await r.json()).order : null;
}

// ── Router ─────────────────────────────────────────────────────────────
const loginFails = new Map();
export async function handleStudio(request, env, ctx, url) {
  const path = url.pathname;
  const method = request.method;

  // Public images uploaded through the studio.
  if (path.startsWith('/m/') && method === 'GET') {
    const name = path.slice(3);
    if (!/^[a-z0-9-]+\.jpg$/.test(name)) return new Response('Not found', { status: 404 });
    const obj = await env.DATA.get('img:' + name, 'arrayBuffer');
    return obj ? new Response(obj, { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } }) : new Response('Not found', { status: 404 });
  }

  if (path === '/studio' || path === '/studio/') return new Response(STUDIO_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', ...SECURITY } });
  if (!path.startsWith('/api/studio/')) return new Response('Not found', { status: 404 });

  // All studio writes must come from the studio page itself.
  if (method !== 'GET' && request.headers.get('Origin') && request.headers.get('Origin') !== url.origin) return json({ ok: false, error: 'Forbidden' }, 403);
  const route = path.slice('/api/studio/'.length);

  if (route === 'login' && method === 'POST') {
    if (!env.OWNER_PASSWORD) return json({ ok: false, error: 'The studio password has not been set up yet.' }, 503);
    const ip = request.headers.get('CF-Connecting-IP') || 'local';
    const f = loginFails.get(ip);
    if (f && f.n >= 8 && Date.now() - f.t < 15 * 60_000) return json({ ok: false, error: 'Too many wrong passwords. Try again in 15 minutes.' }, 429);
    const body = await request.json().catch(() => ({}));
    const ok = typeof body.password === 'string' && safeEqual(await sha(body.password), await sha(env.OWNER_PASSWORD));
    if (!ok) { loginFails.set(ip, { n: (f && Date.now() - f.t < 15 * 60_000 ? f.n : 0) + 1, t: Date.now() }); return json({ ok: false, error: 'Wrong password.' }, 401); }
    loginFails.delete(ip);
    return json({ ok: true }, 200, { 'Set-Cookie': cookie(url, await makeSession(env), 30 * DAY) });
  }
  if (route === 'logout' && method === 'POST') return json({ ok: true }, 200, { 'Set-Cookie': cookie(url, '', 0) });
  if (!(await isOwner(request, env))) return json({ ok: false, error: 'Please sign in.', auth: false }, 401);

  try {
    if (route === 'state' && method === 'GET') {
      const draft = await getDraft(env);
      const published = await env.DATA.get('catalog:published', 'json');
      const pubIds = new Set((published?.products || []).map((p) => p.id));
      const preview = buildPublished(draft, published);
      const changes = published ? JSON.stringify(preview.products) !== JSON.stringify(published.products) || JSON.stringify([draft.prices, draft.shipping, draft.content]) !== JSON.stringify([published.prices, published.shipping, published.content]) : true;
      return json({ ok: true, draft, publishedAt: published?.version || null, publishedIds: [...pubIds], willPublish: preview.products.length, changes, ai: !!env.AI, square: env.SQUARE_ENV || 'sandbox', criteria: CRITERIA, holds: HOLDS, types: TYPE_LABEL });
    }

    if (route === 'products' && method === 'POST') {
      const body = await request.json();
      const draft = await getDraft(env);
      if (body.baseVersion && body.baseVersion !== draft.version) return json({ ok: false, error: 'The studio was changed in another window — reloading the latest.', stale: true }, 409);
      const prev = JSON.parse(JSON.stringify(draft));
      try { runOps(draft, Array.isArray(body.ops) ? body.ops.slice(0, 500) : []); }
      catch (e) { return json({ ok: false, error: e.message }, 400); }
      return json({ ok: true, draft: await saveDraft(env, draft, prev) });
    }

    if (route === 'settings' && method === 'POST') {
      const b = await request.json();
      const draft = await getDraft(env);
      const prev = JSON.parse(JSON.stringify(draft));
      const cents = (v, max) => { if (!Number.isInteger(v) || v < 0 || v > max) throw new Error('Amounts must be between $0 and $' + max / 100 + '.'); return v; };
      try {
        if (b.prices) for (const t of TYPES) if (b.prices[t] !== undefined) draft.prices[t] = cents(b.prices[t], 100000);
        if (b.shipping) for (const k of ['envelope', 'package', 'freeOver']) if (b.shipping[k] !== undefined) draft.shipping[k] = cents(b.shipping[k], 100000);
        if (b.content) for (const k of Object.keys(DEFAULT_CONTENT)) if (typeof b.content[k] === 'string') draft.content[k] = b.content[k].trim().slice(0, 400) || DEFAULT_CONTENT[k];
      } catch (e) { return json({ ok: false, error: e.message }, 400); }
      return json({ ok: true, draft: await saveDraft(env, draft, prev) });
    }

    if (route === 'upload' && method === 'POST') {
      // One product draft per upload; the browser sends a 900px and a 420px JPEG.
      const form = await request.formData();
      const full = form.get('full'), sm = form.get('sm');
      if (!full || !sm || full.size > 1_500_000 || sm.size > 400_000) return json({ ok: false, error: 'Picture missing or too large.' }, 400);
      const meta = JSON.parse(String(form.get('meta') || '{}'));
      const draft = await getDraft(env);
      const prev = JSON.parse(JSON.stringify(draft));
      const name = `u${Date.now().toString(36)}${crypto.randomUUID().slice(0, 6)}`;
      await env.DATA.put(`img:${name}.jpg`, await full.arrayBuffer());
      await env.DATA.put(`img:${name}-sm.jpg`, await sm.arrayBuffer());
      const image = `/m/${name}.jpg`;
      const hash = /^[0-9a-f]{16}$/.test(meta.hash || '') ? meta.hash : '';
      if (meta.addTo) { // extra photo for a product created earlier in this batch
        const p = draft.products.find((x) => x.id === meta.addTo);
        if (!p) return json({ ok: false, error: 'Product not found.' }, 404);
        p.images = [...p.images, image].slice(0, 12); p.rev++;
        return json({ ok: true, product: p, draft: await saveDraft(env, draft, prev) });
      }
      const type = TYPES.includes(meta.type) ? meta.type : 'sticker';
      let ai = null;
      if (meta.analyze && env.AI) ai = await analyzeImage(env, await sm.arrayBuffer());
      const aiType = ai?.ok && ai.type ? ai.type : null;
      const finalType = meta.type === 'auto' && aiType ? aiType : type;
      const title = (ai?.ok && ai.title) || cleanText(meta.title, 140) || 'New item — needs a name';
      const p = {
        id: uniqueId(draft, ai?.ok && ai.title ? ai.title : 'new-' + name), type: finalType, title,
        collection: cleanText(meta.collection, 60) || 'New Arrivals',
        description: (ai?.ok && ai.description) || '', price: draft.prices[finalType] || draft.prices.sticker, images: [image],
        status: 'live', rev: 1, approvedRev: 0, source: 'upload', hash, ai: ai || { ok: false, error: env.AI ? 'Recognition was turned off for this batch.' : 'Visual recognition is not connected in this environment.' },
        ownerNote: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      p.similar = similar(draft, hash, p.id);
      if (!draft.collections.includes(p.collection)) draft.collections.push(p.collection);
      draft.products.unshift(p);
      return json({ ok: true, product: p, draft: await saveDraft(env, draft, prev) });
    }

    if (route === 'analyze' && method === 'POST') {
      const { id } = await request.json();
      const draft = await getDraft(env);
      const p = draft.products.find((x) => x.id === id);
      if (!p) return json({ ok: false, error: 'Product not found.' }, 404);
      const img = p.images[0];
      const bytes = img.startsWith('/m/') ? await env.DATA.get('img:' + img.slice(3).replace('.jpg', '-sm.jpg'), 'arrayBuffer') : await (await env.ASSETS.fetch(new URL(img.replace('.jpg', '-sm.jpg'), url.origin))).arrayBuffer();
      const ai = await analyzeImage(env, bytes);
      const prev = JSON.parse(JSON.stringify(draft));
      p.ai = ai;
      return json({ ok: ai.ok, error: ai.error, ai, draft: await saveDraft(env, draft, prev) });
    }

    if (route === 'publish' && method === 'POST') {
      const draft = await getDraft(env);
      const prevPub = await env.DATA.get('catalog:published', 'json');
      const pub = buildPublished(draft, prevPub);
      if (!pub.products.length) return json({ ok: false, error: 'Nothing is approved yet — approve at least one product first.' }, 400);
      if (prevPub) await env.DATA.put(`pub:${Date.now()}`, JSON.stringify(prevPub), { expirationTtl: 365 * DAY });
      await env.DATA.put('catalog:published', JSON.stringify(pub));
      return json({ ok: true, publishedAt: pub.version, count: pub.products.length });
    }

    if (route === 'history' && method === 'GET') {
      const { keys } = await env.DATA.list({ prefix: 'pub:' });
      return json({ ok: true, snapshots: keys.map((k) => ({ key: k.name, at: new Date(Number(k.name.slice(4))).toISOString() })).reverse() });
    }
    if (route === 'restore' && method === 'POST') {
      const { key } = await request.json();
      if (!/^pub:\d+$/.test(key || '')) return json({ ok: false, error: 'Bad backup.' }, 400);
      const snap = await env.DATA.get(key, 'json');
      if (!snap) return json({ ok: false, error: 'Backup not found.' }, 404);
      const cur = await env.DATA.get('catalog:published', 'json');
      if (cur) await env.DATA.put(`pub:${Date.now()}`, JSON.stringify(cur), { expirationTtl: 365 * DAY });
      await env.DATA.put('catalog:published', JSON.stringify(snap));
      return json({ ok: true });
    }

    if (route === 'inbox' && method === 'GET') {
      const here = env.SQUARE_ENV === 'production' ? 'production' : 'sandbox';
      const [inquiries, allOrders] = await Promise.all([listJson(env, 'inq:'), listJson(env, 'order:')]);
      const orders = allOrders.filter((o) => (o.squareEnv || 'sandbox') === here);
      // Re-check recent unpaid orders with Square (covers customers who closed the tab after paying).
      const recent = orders.filter((o) => o.status !== 'paid' && Date.now() - Date.parse(o.created) < 14 * DAY * 1000).slice(0, 15);
      await Promise.all(recent.map(async (o) => { try { const r = await verifyOrder(env, o.ref); if (r.paid) Object.assign(o, r.rec); } catch {} }));
      inquiries.sort((a, b) => b.created.localeCompare(a.created)); orders.sort((a, b) => b.created.localeCompare(a.created));
      return json({ ok: true, inquiries, orders });
    }
    if (route === 'inquiry' && method === 'POST') {
      const { key, status } = await request.json();
      if (!/^inq:[a-z0-9-]+$/.test(key || '') || !['new', 'done'].includes(status)) return json({ ok: false, error: 'Bad request' }, 400);
      const rec = await env.DATA.get(key, 'json');
      if (!rec) return json({ ok: false, error: 'Not found' }, 404);
      rec.status = status; await env.DATA.put(key, JSON.stringify(rec));
      return json({ ok: true });
    }
    if (route.startsWith('inqfile/') && method === 'GET') {
      const id = route.slice(8);
      if (!/^[a-z0-9-]+$/.test(id)) return json({ ok: false }, 400);
      const { value, metadata } = await env.DATA.getWithMetadata('inqfile:' + id, 'arrayBuffer');
      return value ? new Response(value, { headers: { 'Content-Type': metadata?.type || 'application/octet-stream', 'Content-Disposition': 'inline', ...SECURITY } }) : json({ ok: false }, 404);
    }
    if (route === 'pirateship.csv' && method === 'GET') {
      // Paid orders with shipping addresses from Square, for Pirate Ship's spreadsheet import.
      const here = env.SQUARE_ENV === 'production' ? 'production' : 'sandbox';
      const orders = (await listJson(env, 'order:')).filter((o) => o.status === 'paid' && !o.shippedAt && (o.squareEnv || 'sandbox') === here);
      const rows = [['Order ID', 'Name', 'Company', 'Address 1', 'Address 2', 'City', 'State', 'Zip', 'Country', 'Email', 'Phone', 'Items', 'Order Total']];
      for (const o of orders) {
        const sq = await squareOrder(env, o.orderId).catch(() => null);
        const f = sq?.fulfillments?.find((x) => x.shipment_details)?.shipment_details?.recipient || {};
        const a = f.address || {};
        rows.push([o.ref, f.display_name, '', a.address_line_1, a.address_line_2, a.locality, a.administrative_district_level_1, a.postal_code, a.country || 'US', f.email_address, f.phone_number, o.lines.map((l) => `${l.qty}x ${l.title}`).join('; '), ((o.total ?? o.subtotal + o.shipping) / 100).toFixed(2)]);
      }
      return new Response(rows.map((r) => r.map(csvCell).join(',')).join('\r\n'), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="pirate-ship-${new Date().toISOString().slice(0, 10)}.csv"`, ...SECURITY } });
    }
    if (route === 'shipped' && method === 'POST') {
      const { ref } = await request.json();
      const rec = await env.DATA.get(`order:${ref}`, 'json');
      if (!rec) return json({ ok: false, error: 'Not found' }, 404);
      rec.shippedAt = rec.shippedAt ? null : new Date().toISOString();
      await env.DATA.put(`order:${ref}`, JSON.stringify(rec), { expirationTtl: 365 * DAY });
      return json({ ok: true, shippedAt: rec.shippedAt });
    }

    if (route === 'notes' && method === 'GET') return json({ ok: true, notes: (await env.DATA.get('notes', 'json')) || [] });
    if (route === 'notes' && method === 'POST') {
      const { notes } = await request.json();
      if (!Array.isArray(notes) || notes.length > 500) return json({ ok: false, error: 'Bad notes' }, 400);
      const clean = notes.map((n) => ({ id: String(n.id || crypto.randomUUID()).slice(0, 40), text: String(n.text || '').slice(0, 5000), created: n.created || new Date().toISOString(),
        gate: { message: String(n.gate?.message || '').slice(0, 500), scores: Object.fromEntries(CRITERIA.map((c) => [c, n.gate?.scores?.[c]]).filter(([, v]) => Number.isInteger(v) && v >= 0 && v <= 2)), holds: Object.fromEntries(Object.keys(HOLDS).map((k) => [k, n.gate?.holds?.[k] === true])) } }));
      await env.DATA.put('notes', JSON.stringify(clean));
      return json({ ok: true, notes: clean.map((n) => ({ ...n, result: brandGate(n.gate) })) });
    }
    if (route === 'gate' && method === 'POST') return json({ ok: true, result: brandGate(await request.json()) });

    return json({ ok: false, error: 'Not found' }, 404);
  } catch (e) {
    console.error('studio', route, e);
    return json({ ok: false, error: 'Something went wrong in the studio.' }, 500);
  }
}
