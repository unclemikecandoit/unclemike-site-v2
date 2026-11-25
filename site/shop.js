// Catalog access, server-side cart pricing and Square integration.
import bundled from '../catalog/products.json' with { type: 'json' };

export const TYPE_LABEL = { sticker: 'Sticker', sheet: 'Sticker sheet', hat: 'Leather-patch hat', tshirt: 'T-shirt', sweatshirt: 'Sweatshirt' };

export const BUNDLED = bundled;

/**
 * Public catalog: the studio's published snapshot in KV. Before the first publish,
 * the bundled build — limited to approved items unless SHOW_UNAPPROVED=1 (local preview).
 */
export async function getCatalog(env) {
  const published = env.DATA ? await env.DATA.get('catalog:published', 'json') : null;
  if (published) return published;
  const all = env.SHOW_UNAPPROVED === '1';
  return { ...bundled, products: bundled.products.filter((p) => p.status === 'live' && (all || p.approved)) };
}

export const isLive = (p) => p.status === 'live';

/** Public view of a product: never exposes owner notes or source paths. */
export const publicProduct = ({ id, type, title, collection, description, price, images }) => ({ id, type, title, collection, description, price, images });

export class CartError extends Error {}

/**
 * Validates a browser cart and prices it from the catalog. Throws CartError
 * (whole cart rejected) on anything invalid — never silently drops items.
 */
export function priceCart(catalog, body) {
  const items = body && Array.isArray(body.items) ? body.items : null;
  if (!items || items.length === 0) throw new CartError('Your bag is empty.');
  if (items.length > 60) throw new CartError('Too many different items in one order (max 60).');
  const byId = new Map(catalog.products.filter(isLive).map((p) => [p.id, p]));
  const merged = new Map();
  for (const it of items) {
    if (!it || typeof it.id !== 'string' || it.id.length > 80) throw new CartError('Your bag contains an invalid item.');
    if (!Number.isInteger(it.qty) || it.qty < 1 || it.qty > 100) throw new CartError('Quantities must be whole numbers from 1 to 100.');
    const p = byId.get(it.id);
    if (!p) throw new CartError('One item in your bag is no longer available. Please remove it and try again.');
    merged.set(p.id, (merged.get(p.id) || 0) + it.qty);
  }
  const lines = [];
  let subtotal = 0, count = 0;
  for (const [id, qty] of merged) {
    if (qty > 100) throw new CartError('Quantities must be whole numbers from 1 to 100.');
    const p = byId.get(id);
    if (!Number.isInteger(p.price) || p.price <= 0) throw new CartError(`${p.title} is not available for checkout.`);
    lines.push({ id, title: p.title, type: p.type, qty, unit: p.price });
    subtotal += p.price * qty; count += qty;
  }
  if (count > 500) throw new CartError('That is a big order! Please send an inquiry for 500+ items.');
  return { lines, subtotal, count, shipping: shippingFor(catalog.shipping, lines, subtotal) };
}

export const PACKAGE_TYPES = new Set(['hat', 'tshirt', 'sweatshirt']);
/** Shipping rule: envelope rate for stickers/sheets only, package rate if a hat or garment is included. */
export function shippingFor(rules, lines, subtotal) {
  const r = rules || { envelope: 0, package: 0, freeOver: 0 };
  if (r.freeOver > 0 && subtotal >= r.freeOver) return 0;
  return lines.some((l) => PACKAGE_TYPES.has(l.type)) ? r.package : r.envelope;
}

const squareBase = (env) => env.SQUARE_BASE_URL || (env.SQUARE_ENV === 'production' ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com');

async function square(env, method, path, body) {
  if (!env.SQUARE_ACCESS_TOKEN || !env.SQUARE_LOCATION_ID) throw new Error('Square is not configured');
  const res = await fetch(squareBase(env) + path, {
    method,
    headers: { Authorization: `Bearer ${env.SQUARE_ACCESS_TOKEN}`, 'Square-Version': '2026-01-22', 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('Square error', method, path, res.status, JSON.stringify(data.errors || data));
    throw new Error('Square request failed');
  }
  return data;
}

/** Creates a Square-hosted checkout for a priced cart. Returns {url, ref}. */
export async function createCheckout(env, origin, priced) {
  const ref = crypto.randomUUID().replace(/-/g, '').slice(0, 20);
  const shipping = priced.shipping;
  const body = {
    idempotency_key: ref,
    order: {
      location_id: env.SQUARE_LOCATION_ID,
      reference_id: ref,
      line_items: priced.lines.map((l) => ({
        name: `${l.title} (${TYPE_LABEL[l.type] || l.type})`.slice(0, 500),
        quantity: String(l.qty),
        base_price_money: { amount: l.unit, currency: 'USD' },
      })),
      pricing_options: { auto_apply_taxes: true },
    },
    checkout_options: {
      redirect_url: `${origin}/thanks/?ref=${ref}`,
      ask_for_shipping_address: true,
      allow_tipping: false,
      ...(shipping > 0 ? { shipping_fee: { name: 'Shipping', charge: { amount: shipping, currency: 'USD' } } } : {}),
    },
  };
  const data = await square(env, 'POST', '/v2/online-checkout/payment-links', body);
  const link = data.payment_link;
  if (!link?.url || !link.order_id) throw new Error('Square did not return a checkout link');
  const record = { ref, squareEnv: env.SQUARE_ENV === 'production' ? 'production' : 'sandbox', orderId: link.order_id, linkId: link.id, lines: priced.lines, subtotal: priced.subtotal, shipping, status: 'pending', created: new Date().toISOString() };
  if (env.DATA) {
    const ttl = { expirationTtl: 60 * 60 * 24 * 365 };
    await env.DATA.put(`order:${ref}`, JSON.stringify(record), ttl);
    await env.DATA.put(`oid:${link.order_id}`, ref, ttl);
  }
  return { url: link.url, ref };
}

/** True only when Square reports the order as fully paid. */
export const orderIsPaid = (o) => !!o && o.state !== 'CANCELED' && ((o.tenders?.length > 0 && o.net_amount_due_money?.amount === 0) || o.state === 'COMPLETED');

/** Looks up our order record and verifies payment with Square (server-to-server). */
export async function verifyOrder(env, ref) {
  if (!/^[a-f0-9]{20}$/.test(ref || '') || !env.DATA) return { found: false };
  const rec = await env.DATA.get(`order:${ref}`, 'json');
  if (!rec) return { found: false };
  const here = env.SQUARE_ENV === 'production' ? 'production' : 'sandbox';
  if ((rec.squareEnv || 'sandbox') !== here) return { found: false }; // test orders never mix with real ones
  if (rec.status === 'paid') return { found: true, paid: true, rec };
  const { order } = await square(env, 'GET', `/v2/orders/${encodeURIComponent(rec.orderId)}`);
  if (orderIsPaid(order)) {
    rec.status = 'paid';
    rec.paidAt = new Date().toISOString();
    rec.total = order.total_money?.amount;
    await env.DATA.put(`order:${ref}`, JSON.stringify(rec), { expirationTtl: 60 * 60 * 24 * 365 });
  }
  return { found: true, paid: rec.status === 'paid', rec };
}

/** Verifies a Square webhook signature (HMAC-SHA256 over notification URL + raw body). */
export async function verifySquareSignature(env, url, raw, signature) {
  if (!env.SQUARE_WEBHOOK_SIGNATURE_KEY || !signature) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.SQUARE_WEBHOOK_SIGNATURE_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(url + raw)));
  const expected = btoa(String.fromCharCode(...mac));
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

/** Marks an order paid when Square's webhook reports a completed payment. */
export async function handleSquareEvent(env, event) {
  const payment = event?.data?.object?.payment;
  if (!payment || payment.status !== 'COMPLETED' || !payment.order_id || !env.DATA) return;
  const ref = await env.DATA.get(`oid:${payment.order_id}`);
  if (!ref) return;
  const rec = await env.DATA.get(`order:${ref}`, 'json');
  if (rec && rec.status !== 'paid') {
    Object.assign(rec, { status: 'paid', paidAt: new Date().toISOString(), paymentId: payment.id, total: payment.total_money?.amount });
    await env.DATA.put(`order:${ref}`, JSON.stringify(rec), { expirationTtl: 60 * 60 * 24 * 365 });
  }
}
