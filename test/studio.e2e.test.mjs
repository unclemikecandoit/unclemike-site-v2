// Studio workflow tests. Run against a FRESH local instance (empty KV):
//   npx wrangler dev -c wrangler.site.jsonc --port 8788 --persist-to <new temp dir>
//   SITE=http://127.0.0.1:8788 node --test test/studio.e2e.test.mjs
// Requires .dev.vars (OWNER_PASSWORD etc.) and test/fake-square.mjs running on :4199.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const SITE = process.env.SITE || 'http://127.0.0.1:8788';
const PASSWORD = fs.readFileSync(new URL('../.dev.vars', import.meta.url), 'utf8').match(/^OWNER_PASSWORD=(.*)$/m)[1].trim();
let jar = '';
const call = async (path, { body, form, method, cookie = jar, origin } = {}) => {
  const headers = { Cookie: cookie };
  if (origin) headers.Origin = origin;
  let payload;
  if (form) payload = form; else if (body !== undefined) { payload = JSON.stringify(body); headers['Content-Type'] = 'application/json'; }
  const r = await fetch(SITE + path, { method: method || (payload ? 'POST' : 'GET'), headers, body: payload, redirect: 'manual' });
  const text = await r.text();
  let json; try { json = JSON.parse(text); } catch {}
  return { status: r.status, json, text, headers: r.headers };
};
const state = async () => (await call('/api/studio/state')).json;
const ops = async (list) => { const s = await state(); return call('/api/studio/products', { body: { ops: list, baseVersion: s.draft.version } }); };
const home = async () => (await call('/', { cookie: '' })).text;

test('studio is private', async () => {
  const page = await call('/studio');
  assert.equal(page.status, 200);
  assert.match(page.headers.get('x-robots-tag'), /noindex/);
  assert.equal((await call('/api/studio/state', { cookie: '' })).status, 401);
  assert.equal((await call('/api/studio/state', { cookie: 'um_studio=9999999999.forged' })).status, 401);
  assert.equal((await call('/api/studio/login', { body: { password: 'wrong' } })).status, 401);
});

test('owner can sign in', async () => {
  const r = await call('/api/studio/login', { body: { password: PASSWORD } });
  assert.equal(r.status, 200);
  const c = r.headers.get('set-cookie');
  assert.match(c, /HttpOnly/); assert.match(c, /SameSite=Strict/);
  jar = c.split(';')[0];
  const s = await state();
  assert.equal(s.draft.products.length, 50);
  const review = s.draft.products.filter((p) => p.status !== 'hidden' && p.approvedRev !== p.rev);
  assert.equal(review.length, 23, 'the 21 new hard-hat stickers + 2 hats wait for review');
  assert.equal(s.ai, false, 'no AI binding locally — reported honestly');
});

test('writes from other sites are refused', async () => {
  assert.equal((await call('/api/studio/publish', { body: {}, origin: 'https://evil.example' })).status, 403);
});

test('Brand Gate follows the exact rules', async () => {
  const g = async (body) => (await call('/api/studio/gate', { body })).json.result.decision;
  const sc = (a) => Object.fromEntries(['Brand Fit', 'Audience Value', 'Authenticity', 'Content Quality', 'Long-Term Brand Purpose'].map((c, i) => [c, a[i]]));
  assert.equal(await g({ message: 'x', scores: sc([2, 2, 2, 1, 1]) }), 'POST');
  assert.equal(await g({ message: 'x', scores: sc([2, 1, 1, 1, 1]) }), 'FIX');
  assert.equal(await g({ message: 'x', scores: sc([1, 1, 1, 1, 1]) }), 'PARK');
  assert.equal(await g({ message: 'x', scores: sc([0, 2, 2, 2, 2]) }), 'PARK');
  assert.equal(await g({ message: 'x', scores: sc([2, 0, 2, 2, 2]) }), 'PARK');
  assert.equal(await g({ message: 'x', scores: sc([2, 2, 2, 2, 2]), holds: { permission: true } }), 'HOLD');
  assert.equal(await g({ message: '', scores: sc([2, 2, 2, 2, 2]) }), 'INCOMPLETE');
});

test('approval is tied to the exact revision and HOLD blocks it', async () => {
  const s = await state();
  const p = s.draft.products.find((x) => x.id === 'soiled-my-britches');
  assert.equal((await ops([{ op: 'approve', id: p.id, rev: p.rev + 1 }])).status, 400);
  const held = s.draft.products.find((x) => x.id === 'burning-red-monster-no-wording');
  assert.equal((await ops([{ op: 'approve', id: held.id, rev: held.rev }])).status, 400);
  assert.equal((await ops([{ op: 'approve', id: p.id, rev: p.rev }])).status, 200);
});

test('nothing reaches customers until publish; unapproved edits keep the old version live', async () => {
  // Before the first publish the public site shows approved items only (local preview flag aside).
  assert.equal((await call('/api/studio/publish', { body: {} })).status, 200);
  let h = await home();
  assert.match(h, /Soiled My Britches/, 'approved + published');
  assert.doesNotMatch(h, /Pooped My Trousers/, 'still unapproved');
  // Edit an approved, published product without re-approving.
  await ops([{ op: 'update', id: 'plan-b', fields: { title: 'Plan B (edited)' } }]);
  const s = await state();
  const pb = s.draft.products.find((x) => x.id === 'plan-b');
  assert.notEqual(pb.approvedRev, pb.rev, 'editing invalidates approval');
  await call('/api/studio/publish', { body: {} });
  h = await home();
  assert.match(h, />Plan B</); assert.doesNotMatch(h, /Plan B \(edited\)/);
  await ops([{ op: 'approve', id: 'plan-b', rev: pb.rev }]);
  await call('/api/studio/publish', { body: {} });
  assert.match(await home(), /Plan B \(edited\)/);
});

test('upload creates a draft, flags duplicates, serves the image', async () => {
  const img = fs.readFileSync(new URL('../img/p/nope-sm.jpg', import.meta.url));
  await ops([{ op: 'hash', id: 'nope', hash: 'f0f0f0f0f0f0f0f0' }]);
  const fd = new FormData();
  fd.set('full', new Blob([img], { type: 'image/jpeg' }), 'full.jpg');
  fd.set('sm', new Blob([img], { type: 'image/jpeg' }), 'sm.jpg');
  fd.set('meta', JSON.stringify({ type: 'sticker', collection: 'Test Batch', analyze: true, hash: 'f0f0f0f0f0f0f0f1' }));
  const r = await call('/api/studio/upload', { form: fd });
  assert.equal(r.status, 200, r.text);
  const p = r.json.product;
  assert.equal(p.price, 50); assert.equal(p.approvedRev, 0); assert.equal(p.collection, 'Test Batch');
  assert.equal(p.similar[0].id, 'nope', 'near-identical fingerprint is flagged');
  assert.equal(p.ai.ok, false); assert.match(p.ai.error, /not connected/);
  const pic = await call(p.images[0], { cookie: '' });
  assert.equal(pic.status, 200);
  // Second photo of the same item
  const fd2 = new FormData();
  fd2.set('full', new Blob([img], { type: 'image/jpeg' }), 'full.jpg'); fd2.set('sm', new Blob([img], { type: 'image/jpeg' }), 'sm.jpg');
  fd2.set('meta', JSON.stringify({ addTo: p.id }));
  const r2 = await call('/api/studio/upload', { form: fd2 });
  assert.equal(r2.json.product.images.length, 2);
  // Merge into the existing design, as the review screen offers.
  assert.equal((await ops([{ op: 'merge', ids: ['nope', p.id] }])).status, 200);
  const s = await state();
  assert.equal(s.draft.products.find((x) => x.id === 'nope').images.length, 3);
  assert.ok(!s.draft.products.some((x) => x.id === p.id));
});

test('bulk edit, settings and shipping flow through to checkout', async () => {
  const s = await state();
  const ids = s.draft.products.filter((p) => p.collection === 'Hard Hat Stickers' && p.status === 'live').map((p) => p.id);
  assert.equal((await ops(ids.map((id) => ({ op: 'update', id, fields: { price: 75 } })))).status, 200);
  const s2 = await state();
  assert.equal((await ops(ids.map((id) => ({ op: 'approve', id, rev: s2.draft.products.find((p) => p.id === id).rev })))).status, 200);
  assert.equal((await call('/api/studio/settings', { body: { shipping: { envelope: 150, package: 800, freeOver: 0 } } })).status, 200);
  assert.equal((await call('/api/studio/settings', { body: { shipping: { envelope: -1 } } })).status, 400);
  assert.equal((await call('/api/studio/settings', { body: { content: { headline: 'Test headline' } } })).status, 200);
  await call('/api/studio/publish', { body: {} });
  const h = await home();
  assert.match(h, /Test headline/);
  assert.match(h, /Pooped My Trousers/);
  const co = await fetch(SITE + '/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ id: 'pooped-my-trousers', qty: 2 }] }) });
  const d = await co.json();
  assert.equal(d.subtotal, 150, 'new bulk price used by checkout');
  const sent = await (await fetch('http://127.0.0.1:4199/__last')).json();
  assert.equal(sent.checkout_options.shipping_fee.charge.amount, 150, 'envelope rate for stickers only');
});

test('backups can be restored', async () => {
  const h = (await call('/api/studio/history')).json;
  assert.ok(h.snapshots.length >= 3);
  const oldest = h.snapshots[h.snapshots.length - 1].key;
  assert.equal((await call('/api/studio/restore', { body: { key: oldest } })).status, 200);
  assert.doesNotMatch(await home(), /Plan B \(edited\)/);
});

test('inbox shows customer inquiries', async () => {
  const f = new FormData();
  f.set('kind', 'Hat'); f.set('name', 'Test Customer'); f.set('email', 'customer@example.com'); f.set('message', 'Custom patch please');
  assert.equal((await fetch(SITE + '/api/inquiry', { method: 'POST', body: f })).status, 200);
  const inbox = (await call('/api/studio/inbox')).json;
  assert.ok(inbox.inquiries.some((q) => q.message === 'Custom patch please'));
  assert.ok((await state()).inbox >= 1, 'Inbox tab shows a waiting count');
});

test('notes save with Brand Gate', async () => {
  const r = await call('/api/studio/notes', { body: { notes: [{ text: 'Sticker idea', gate: { message: 'Work humor', scores: { 'Brand Fit': 2, 'Audience Value': 2, Authenticity: 2, 'Content Quality': 1, 'Long-Term Brand Purpose': 1 } } }] } });
  assert.equal(r.json.notes[0].result.decision, 'POST');
});
