import test from 'node:test';
import assert from 'node:assert/strict';
import { shippingFor, priceCart, CartError } from '../site/shop.js';

const rules = { envelope: 150, package: 800, freeOver: 4000 };

test('stickers and sheets only ship at the envelope rate', () => {
  assert.equal(shippingFor(rules, [{ type: 'sticker' }, { type: 'sheet' }], 600), 150);
});
test('any hat or garment ships at the package rate', () => {
  assert.equal(shippingFor(rules, [{ type: 'sticker' }, { type: 'hat' }], 3050), 800);
});
test('free shipping applies at or over the threshold', () => {
  assert.equal(shippingFor(rules, [{ type: 'hat' }], 4000), 0);
  assert.equal(shippingFor({ ...rules, freeOver: 0 }, [{ type: 'hat' }], 99999), 800);
});
test('priced cart carries shipping from catalog rules', () => {
  const cat = { shipping: rules, products: [{ id: 'a', type: 'sticker', title: 'A', price: 50, status: 'live' }, { id: 'h', type: 'hat', title: 'H', price: 3000, status: 'live' }, { id: 'x', type: 'sticker', title: 'X', price: 50, status: 'hold' }] };
  assert.equal(priceCart(cat, { items: [{ id: 'a', qty: 2 }] }).shipping, 150);
  assert.equal(priceCart(cat, { items: [{ id: 'a', qty: 2 }, { id: 'h', qty: 1 }] }).shipping, 800);
  assert.throws(() => priceCart(cat, { items: [{ id: 'x', qty: 1 }] }), CartError);
});
