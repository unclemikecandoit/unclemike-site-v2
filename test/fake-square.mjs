// Minimal fake of the two Square endpoints the site uses, for local tests.
// POST /v2/online-checkout/payment-links  → creates an unpaid order
// GET  /v2/orders/:id                     → returns the order
// POST /__pay/:orderId                    → test hook: marks the order paid
// GET  /__last                            → test hook: last payment-link request body
import http from 'node:http';
const orders = new Map();
let last = null;
const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
export function start(port = 4199) {
  const server = http.createServer(async (req, res) => {
    let body = '';
    for await (const c of req) body += c;
    const url = new URL(req.url, 'http://x');
    if (req.method === 'POST' && url.pathname === '/v2/online-checkout/payment-links') {
      if (req.headers.authorization !== 'Bearer test-token') return send(res, 401, { errors: [{ code: 'UNAUTHORIZED' }] });
      const b = JSON.parse(body); last = b;
      const id = 'ord_' + Math.random().toString(36).slice(2, 10);
      const total = b.order.line_items.reduce((n, l) => n + l.base_price_money.amount * Number(l.quantity), 0) + (b.checkout_options.shipping_fee?.charge.amount || 0);
      orders.set(id, { id, state: 'OPEN', reference_id: b.order.reference_id, total_money: { amount: total, currency: 'USD' }, net_amount_due_money: { amount: total, currency: 'USD' }, tenders: [] });
      return send(res, 200, { payment_link: { id: 'pl_' + id, order_id: id, url: `http://127.0.0.1:${port}/pay/${id}?redirect=${encodeURIComponent(b.checkout_options.redirect_url)}` } });
    }
    if (req.method === 'GET' && url.pathname.startsWith('/v2/orders/')) {
      const o = orders.get(url.pathname.slice(11));
      return o ? send(res, 200, { order: o }) : send(res, 404, { errors: [{ code: 'NOT_FOUND' }] });
    }
    if (url.pathname.startsWith('/__pay/')) {
      const o = orders.get(url.pathname.slice(7));
      if (!o) return send(res, 404, {});
      o.tenders = [{ id: 't1', type: 'CARD' }]; o.net_amount_due_money = { amount: 0, currency: 'USD' };
      return send(res, 200, { ok: true });
    }
    if (url.pathname.startsWith('/pay/')) {
      // Stands in for Square's hosted page: pay, then go back to the shop.
      const id = url.pathname.slice(5); const o = orders.get(id);
      if (o) { o.tenders = [{ id: 't1', type: 'CARD' }]; o.net_amount_due_money = { amount: 0, currency: 'USD' }; }
      res.writeHead(302, { Location: url.searchParams.get('redirect') }); return res.end();
    }
    if (url.pathname.startsWith('/__payref/')) {
      const o = [...orders.values()].find((x) => x.reference_id === url.pathname.slice(10));
      if (!o) return send(res, 404, {});
      o.tenders = [{ id: 't1', type: 'CARD' }]; o.net_amount_due_money = { amount: 0, currency: 'USD' };
      return send(res, 200, { ok: true });
    }
    if (url.pathname === '/__last') return send(res, 200, last || {});
    send(res, 404, {});
  });
  return new Promise((r, j) => { server.once('error', j); server.listen(port, '127.0.0.1', () => r(server)); });
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())) start().then(() => console.log('fake square on 4199'));
