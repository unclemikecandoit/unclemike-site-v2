// Uncle Mike Can Do It — storefront, checkout, inquiries (and the private studio).
import { getCatalog, getSales, isLive, priceCart, CartError, createCheckout, verifyOrder, verifySquareSignature, handleSquareEvent } from './shop.js';
import { homePage, productPage, thanksPage, notFoundPage, catalogJson } from './render.js';
import { handleStudio } from './studio.js';

const SECURITY = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob:; style-src 'self'; script-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
const html = (body, status = 200, cache = 'public, max-age=60') => new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': cache, ...SECURITY } });
export const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...SECURITY } });

// Best-effort per-isolate rate limit (Cloudflare WAF rules can add a hard limit later).
const hits = new Map();
function limited(request, bucket, max, env) {
  if (env?.TEST_NO_RATE_LIMIT === '1') return false;
  const key = bucket + (request.headers.get('CF-Connecting-IP') || 'local');
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now - h.t > 60_000) { hits.set(key, { t: now, n: 1 }); if (hits.size > 5000) hits.clear(); return false; }
  return ++h.n > max;
}

async function readJson(request, maxBytes) {
  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > maxBytes) throw new CartError('Request too large.');
  const text = await request.text();
  if (text.length > maxBytes) throw new CartError('Request too large.');
  try { return JSON.parse(text); } catch { throw new CartError('Invalid request.'); }
}

const sameOrigin = (request, url) => {
  const o = request.headers.get('Origin');
  return !o || o === url.origin;
};

async function inquiry(request, env) {
  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > 7_000_000) return json({ ok: false, error: 'That picture is too large (max ~6 MB).' }, 413);
  const form = await request.formData();
  const get = (k, max) => String(form.get(k) || '').trim().slice(0, max);
  if (get('website', 200)) return json({ ok: true }); // honeypot: quietly ignore bots
  const rec = { kind: get('kind', 40), design: get('design', 120), name: get('name', 80), email: get('email', 120), message: get('message', 3000), created: new Date().toISOString(), status: 'new' };
  if (!rec.name || !rec.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rec.email)) return json({ ok: false, error: 'Please add your name, a valid email and some details.' }, 400);
  const id = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
  const file = form.get('file');
  if (file && typeof file === 'object' && file.size > 0) {
    if (!/^image\/(jpeg|png|webp|gif|heic|heif)$/.test(file.type) || file.size > 6_000_000) return json({ ok: false, error: 'Please attach a JPG, PNG or WebP picture under 6 MB.' }, 400);
    await env.DATA.put(`inqfile:${id}`, await file.arrayBuffer(), { metadata: { type: file.type, name: String(file.name).slice(0, 100) } });
    rec.file = true;
  }
  await env.DATA.put(`inq:${id}`, JSON.stringify(rec));
  return json({ ok: true });
}

export default {
  async fetch(request, env, ctx) {
    const res = await route(request, env, ctx);
    if (env.NOINDEX !== '1') return res;
    // Preview deployments stay out of search engines.
    const out = new Response(res.body, res);
    out.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return out;
  },
};

async function route(request, env, ctx) {
  {
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      if (path === '/studio' || path.startsWith('/studio/') || path.startsWith('/api/studio/') || path.startsWith('/m/')) return await handleStudio(request, env, ctx, url);

      if (path === '/' && request.method === 'GET') return html(homePage(await getCatalog(env), url.origin, await getSales(env)));
      if (path.startsWith('/p/') && request.method === 'GET') {
        const id = path.slice(3).replace(/\/$/, '');
        if (!path.endsWith('/')) return Response.redirect(url.origin + path + '/', 301);
        const catalog = await getCatalog(env);
        const p = catalog.products.find((x) => x.id === id && isLive(x));
        return p ? html(productPage(catalog, p, url.origin, await getSales(env))) : html(notFoundPage(), 404);
      }
      if (path === '/thanks/' && request.method === 'GET') return html(thanksPage(await getCatalog(env)), 200, 'no-store');
      if (path === '/stickers' || path.startsWith('/stickers/') && !/\.(png|jpe?g|webp|gif)$/i.test(path)) return Response.redirect(url.origin + '/#shop', 301);
      if (path === '/index.html') return Response.redirect(url.origin + '/', 301);

      if (path === '/api/catalog' && request.method === 'GET') return json(catalogJson(await getCatalog(env)));

      if (path === '/api/checkout' && request.method === 'POST') {
        if (!sameOrigin(request, url)) return json({ ok: false, error: 'Forbidden' }, 403);
        let priced;
        try { priced = priceCart(await getCatalog(env), await readJson(request, 16_000)); }
        catch (e) { if (e instanceof CartError) return json({ ok: false, error: e.message }, 400); throw e; }
        if (limited(request, 'co', 10, env)) return json({ ok: false, error: 'Too many attempts — please wait a minute.' }, 429);
        try {
          const { url: checkoutUrl } = await createCheckout(env, url.origin, priced);
          return json({ ok: true, url: checkoutUrl, subtotal: priced.subtotal });
        } catch (e) {
          console.error('checkout', e);
          return json({ ok: false, error: 'Checkout is unavailable right now. Please try again in a few minutes.' }, 502);
        }
      }

      if (path.startsWith('/api/order/') && request.method === 'GET') {
        if (limited(request, 'ord', 60, env)) return json({ ok: false, error: 'Too many requests' }, 429);
        try {
          const r = await verifyOrder(env, path.slice(11));
          if (!r.found) return json({ ok: false, error: 'Order not found' }, 404);
          return json({ ok: true, paid: r.paid, lines: r.rec.lines.map(({ id, title, qty, unit }) => ({ id, title, qty, unit })) });
        } catch (e) {
          console.error('verify', e);
          return json({ ok: false, error: 'Could not reach Square to confirm yet.' }, 502);
        }
      }

      if (path === '/api/square/webhook' && request.method === 'POST') {
        const raw = await request.text();
        const notifyUrl = env.SQUARE_WEBHOOK_URL || url.origin + path;
        if (!(await verifySquareSignature(env, notifyUrl, raw, request.headers.get('x-square-hmacsha256-signature')))) return json({ ok: false }, 401);
        await handleSquareEvent(env, JSON.parse(raw));
        return json({ ok: true });
      }

      if (path === '/api/inquiry' && request.method === 'POST') {
        if (!sameOrigin(request, url)) return json({ ok: false, error: 'Forbidden' }, 403);
        if (limited(request, 'inq', 5, env)) return json({ ok: false, error: 'Too many messages — please wait a minute.' }, 429);
        return await inquiry(request, env);
      }

      if (path.startsWith('/api/')) return json({ ok: false, error: 'Not found' }, 404);
      // Everything else: static files (legacy story pages, images, CSS, JS).
      const res = await env.ASSETS.fetch(request);
      return res.status === 404 ? html(notFoundPage(), 404) : res;
    } catch (e) {
      console.error('unhandled', path, e);
      return path.startsWith('/api/') ? json({ ok: false, error: 'Something went wrong.' }, 500) : html(notFoundPage().replace('That one wandered off.', 'Something went wrong.'), 500, 'no-store');
    }
  }
}
