// End-to-end checks against a running local site (wrangler dev on :8787)
// and the fake Square server (test/fake-square.mjs on :4199).
// Run: node --test test/site.e2e.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const SITE = process.env.SITE || 'http://127.0.0.1:8787';
const SQ = 'http://127.0.0.1:4199';
const post = (path, body, headers = {}) => fetch(SITE + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body), redirect: 'manual' });
const get = (path) => fetch(SITE + path, { redirect: 'manual' });

test('home page lists live products only, with no private data', async () => {
  const r = await get('/');
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-security-policy'), /default-src 'self'/);
  const h = await r.text();
  assert.match(h, /Plan B/);
  assert.match(h, /Rabbit Leather-Patch Hat/);
  assert.doesNotMatch(h, /Burning Red Monster/, 'held product must not be public');
  assert.doesNotMatch(h, /HOLD:|your call|product photos\//i, 'owner notes / source paths must not leak');
  assert.equal((h.match(/class="card"/g) || []).length, 49);
});

test('collection filters really hide other products', async () => {
  const h = await (await get('/')).text();
  assert.match(h, /data-filter="stickers"/, 'All stickers filter');
  assert.match(h, /data-filter-link="stickers"/, 'price quick link goes to stickers');
  assert.match(h, /data-t="sticker"/);
  const css = await (await get('/s/site.css')).text();
  assert.match(css, /\[hidden\]\{display:none!important\}/, 'hidden cards cannot be overridden by card layout');
});

test('public catalog API omits owner notes and sources', async () => {
  const d = await (await get('/api/catalog')).json();
  assert.equal(d.products.length, 49);
  for (const p of d.products) { assert.equal(p.ownerNote, undefined); assert.equal(p.sources, undefined); }
});

test('product page and legacy routes', async () => {
  assert.equal((await get('/p/plan-b/')).status, 200);
  assert.equal((await get('/p/plan-b')).status, 301);
  assert.equal((await get('/p/burning-red-monster-no-wording/')).status, 404);
  assert.equal((await get('/stickers/')).status, 301);
  assert.equal((await get('/make/')).status, 200);
  assert.equal((await get('/img/p/plan-b-sm.jpg')).status, 200);
});

test('private files are not served', async () => {
  for (const p of ['/catalog/products.json', '/.dev.vars', '/site/worker.js', '/wrangler.site.jsonc', '/.local/owner-key', '/package.json', '/PROJECT_BRIEF.md', '/.git/config']) {
    assert.equal((await get(p)).status, 404, p);
  }
});

test('invalid carts are rejected as a whole', async () => {
  const bad = [
    {}, { items: [] }, { items: 'x' },
    { items: [{ id: 'plan-b', qty: 0 }] }, { items: [{ id: 'plan-b', qty: 101 }] }, { items: [{ id: 'plan-b', qty: 1.5 }] },
    { items: [{ id: 'plan-b', qty: '2' }] }, { items: [{ id: 'nope', qty: 1 }, { id: 'no-such-thing', qty: 1 }] },
    { items: [{ id: '__proto__', qty: 1 }] }, { items: [{ id: 'toString', qty: 1 }] }, { items: [{ id: 'constructor', qty: 1 }] },
    { items: [{ id: 'burning-red-monster-no-wording', qty: 1 }] },
    { items: [{ id: 'plan-b', qty: 60 }, { id: 'plan-b', qty: 60 }] },
  ];
  for (const b of bad) {
    const r = await post('/api/checkout', b);
    assert.equal(r.status, 400, JSON.stringify(b));
    assert.equal((await r.json()).ok, false);
  }
  assert.equal((await post('/api/checkout', '{not json')).status, 400);
  assert.equal((await post('/api/checkout', { items: [{ id: 'plan-b', qty: 1 }] }, { Origin: 'https://evil.example' })).status, 403);
});

let ref;
test('valid cart is priced on the server and sent to Square', async () => {
  const r = await post('/api/checkout', { items: [{ id: 'plan-b', qty: 3, price: 1 }, { id: 'rabbit-leather-patch-hat-camo', qty: 1 }, { id: 'gfy-sticker-sheet-10-designs', qty: 1 }] });
  const d = await r.json();
  assert.equal(r.status, 200, JSON.stringify(d));
  assert.equal(d.subtotal, 3 * 50 + 3000 + 500);
  const sent = await (await fetch(SQ + '/__last')).json();
  assert.deepEqual(sent.order.line_items.map((l) => [l.quantity, l.base_price_money.amount]), [['3', 50], ['1', 3000], ['1', 500]]);
  assert.equal(sent.checkout_options.shipping_fee.charge.amount, 1000);
  ref = sent.order.reference_id;
  assert.match(sent.checkout_options.redirect_url, new RegExp(`/thanks/\\?ref=${ref}$`));
});

test('return URL alone never confirms payment', async () => {
  const before = await (await get('/api/order/' + ref)).json();
  assert.equal(before.paid, false);
  assert.equal((await get('/api/order/ffffffffffffffffffff')).status, 404);
  assert.equal((await get('/api/order/../../x')).status, 404);
  const thanks = await (await get('/thanks/?ref=' + ref)).text();
  assert.match(thanks, /Checking your payment/);
});

test('order is confirmed only after Square reports payment', async () => {
  assert.equal((await (await get('/api/order/' + ref)).json()).paid, false);
  assert.equal((await fetch(SQ + '/__payref/' + ref)).status, 200); // customer pays on Square
  const after = await (await get('/api/order/' + ref)).json();
  assert.equal(after.paid, true);
  assert.deepEqual(after.lines.map((l) => [l.id, l.qty]), [['plan-b', 3], ['rabbit-leather-patch-hat-camo', 1], ['gfy-sticker-sheet-10-designs', 1]]);
});

test('webhook requires a valid Square signature', async () => {
  const body = JSON.stringify({ type: 'payment.updated', data: { object: { payment: { id: 'p1', status: 'COMPLETED', order_id: 'unknown' } } } });
  assert.equal((await post('/api/square/webhook', body, { 'x-square-hmacsha256-signature': 'bad' })).status, 401);
  const sig = crypto.createHmac('sha256', 'test-signature-key').update(SITE + '/api/square/webhook' + body).digest('base64');
  assert.equal((await post('/api/square/webhook', body, { 'x-square-hmacsha256-signature': sig })).status, 200);
});

test('inquiries validate input and accept a valid message', async () => {
  const fd = (o) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.set(k, v); return f; };
  const send = (o) => fetch(SITE + '/api/inquiry', { method: 'POST', body: fd(o) });
  assert.equal((await send({ name: 'A', email: 'bad', message: 'hi' })).status, 400);
  assert.equal((await send({ name: '', email: 'a@b.co', message: 'hi' })).status, 400);
  const ok = await send({ kind: 'T-shirt', design: 'Plan B', name: 'Test Buyer', email: 'buyer@example.com', message: 'Size L, black please' });
  assert.equal(ok.status, 200);
  assert.equal((await send({ name: 'Bot', email: 'b@b.co', message: 'spam', website: 'http://spam' })).status, 200);
});
