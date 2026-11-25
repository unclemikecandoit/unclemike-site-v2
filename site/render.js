// Server-rendered public pages. Everything is readable without JavaScript;
// shop.js adds the bag. All catalog text is HTML-escaped.
import { TYPE_LABEL, isLive, publicProduct } from './shop.js';
import { DEFAULT_CONTENT } from './content.js';
const words = (catalog) => ({ ...DEFAULT_CONTENT, ...(catalog && catalog.content) });

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const money = (c) => (c % 100 === 0 ? '$' + c / 100 : c < 100 ? c + '¢' : '$' + (c / 100).toFixed(2));
const ASSET_V = '9'; // bump when s/site.css or s/shop.js change
const small = (src) => src.replace(/\.jpg$/, '-sm.jpg');

const ORDER = ['GFY Collection', 'Hard Hat Stickers', 'Autism Performance Brands', 'Leather-Patch Hats', 'Sticker Sheets'];
const FILTERS = [
  ['all', 'Everything'], ['GFY Collection', 'GFY'], ['Hard Hat Stickers', 'Hard Hat'], ['Autism Performance Brands', 'Autism Performance'],
  ['Leather-Patch Hats', 'Hats'], ['Sticker Sheets', 'Sheets'],
];

function layout({ title, description, body, canonical, extraHead = '', content = DEFAULT_CONTENT }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}<meta name="theme-color" content="#16130f">
<link rel="stylesheet" href="/s/site.css?v=${ASSET_V}"><script src="/s/shop.js?v=${ASSET_V}" defer></script>${extraHead}</head>
<body><a class="skip" href="#main">Skip to products</a>
<header class="top"><a class="mark" href="/" aria-label="Uncle Mike Can Do It — home">UNCLE MIKE<span>CAN DO IT.</span></a>
<button class="bag-btn" type="button" data-open-bag aria-haspopup="dialog">Bag <b id="bag-count">0</b></button></header>
<main id="main">${body}</main>
<footer class="foot"><div><strong>Uncle Mike Can Do It.</strong> And you can too.<br>${esc(content.footer)}</div>
<nav aria-label="More"><a href="/#custom">Custom orders &amp; questions</a><a href="/make/">Projects &amp; stories</a><a href="/about/">About Mike</a></nav>
<p class="fine">Secure checkout by Square. Prices in USD. Shipping and any sales tax are shown before you pay.</p></footer>
<dialog id="bag" aria-labelledby="bag-title"><form method="dialog" class="bag-head"><h2 id="bag-title">Your bag</h2><button aria-label="Close bag">✕</button></form>
<div id="bag-lines"><p class="empty">Your bag is empty. Go grab something funny.</p></div>
<div class="bag-foot"><p class="row">Subtotal <span id="bag-subtotal">$0</span></p><p class="row">Shipping <span id="bag-ship">—</span></p><p class="sub">Total <b id="bag-total">$0</b></p><p class="fine" id="bag-note">Any sales tax is added at secure Square checkout.</p>
<p id="bag-error" class="err" role="alert" hidden></p><button id="checkout" class="btn big" type="button" disabled>Checkout</button></div></dialog>
</body></html>`;
}

function card(p, eager) {
  const img = p.images[0];
  return `<article class="card" data-c="${esc(p.collection)}" data-q="${esc((p.title + ' ' + p.description).toLowerCase())}">
<a class="pic" href="/p/${esc(p.id)}/"><img src="${esc(small(img))}" alt="${esc(p.title)}" width="420" height="420" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></a>
<div class="meta"><h3><a href="/p/${esc(p.id)}/">${esc(p.title)}</a></h3><span class="price">${money(p.price)}</span></div>
<button class="add" type="button" data-add="${esc(p.id)}" aria-label="Add ${esc(p.title)} to bag">Add to bag</button></article>`;
}

function catalogData(catalog) {
  // Minimal data the bag needs; checkout re-prices everything on the server.
  const items = Object.fromEntries(catalog.products.filter(isLive).map((p) => [p.id, { t: p.title, p: p.price, y: p.type, i: small(p.images[0]) }]));
  const data = { items, ship: catalog.shipping || { envelope: 0, package: 0, freeOver: 0 } };
  return `<script id="catalog-data" type="application/json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

export function shipLine(s) {
  if (!s) return '';
  const parts = s.envelope === s.package ? [`Shipping ${money(s.envelope)} per order`] : [`Shipping: stickers & sheets ${money(s.envelope)}`, `orders with a hat or shirt ${money(s.package)}`];
  if (s.freeOver > 0) parts.push(`free over ${money(s.freeOver)}`);
  return parts.join(' · ') + '.';
}

export function homePage(catalog, origin) {
  const live = catalog.products.filter(isLive);
  const sorted = [...live].sort((a, b) => ORDER.indexOf(a.collection) - ORDER.indexOf(b.collection));
  const prices = catalog.prices;
  const hats = live.filter((p) => p.type === 'hat');
  const w = words(catalog);
  const body = `
<section class="hero"><div><p class="kicker">${esc(w.kicker)}</p><h1>${esc(w.headline)}<br><em>${esc(w.headline2)}</em></h1>
<p class="lede">${esc(w.lede)}</p></div>
<ul class="pricebar" aria-label="Prices"><li><a href="#shop" data-filter-link="all"><b>${money(prices.sticker)}</b>stickers</a></li><li><a href="#shop" data-filter-link="Sticker Sheets"><b>${money(prices.sheet)}</b>sheets of ~10</a></li>
<li><a href="#shop" data-filter-link="Leather-Patch Hats"><b>${money(prices.hat)}</b>leather-patch hats</a></li><li><a href="#shirts"><b>${money(prices.tshirt)}</b>T-shirts</a></li><li><a href="#shirts"><b>${money(prices.sweatshirt)}</b>sweatshirts</a></li></ul></section>
${hats.length ? `<section class="hats" aria-label="Leather-patch hats">${hats.map((h) => `<a class="hat" href="/p/${esc(h.id)}/"><img src="${esc(small(h.images[0]))}" alt="${esc(h.title)}" width="420" height="560" loading="eager"><span><b>${esc(h.title)}</b>Engraved leather patch · ${money(h.price)}</span></a>`).join('')}
<div class="hat-copy"><h2>${esc(w.hatsTitle)}</h2><p>${esc(w.hatsText)} Want your own design on a patch? <a href="#custom" data-kind="Hat">Ask Mike</a>.</p></div></section>` : ''}
<section id="shop" class="shop"><div class="shop-head"><h2>Pick your favorites</h2>
<label class="search"><span class="sr">Search designs</span><input id="q" type="search" placeholder="Search ${live.length} designs…" autocomplete="off"></label></div>
<div class="chips" role="group" aria-label="Filter">${FILTERS.filter(([k]) => k === 'all' || live.some((p) => p.collection === k)).map(([k, l], i) => `<button type="button" data-filter="${esc(k)}" aria-pressed="${i === 0}">${esc(l)}</button>`).join('')}</div>
<div class="grid" id="grid">${sorted.map((p, i) => card(p, i < 4)).join('')}</div><p class="none" id="none" hidden>No designs match that. Try another word — or <a href="#custom">ask for a custom one</a>.</p>
<p class="fine">${shipLine(catalog.shipping)}</p></section>
<section id="shirts" class="band"><div><h2>Any design on a shirt.</h2><p>Pick a sticker you love and Mike will put it on a T-shirt (<b>${money(prices.tshirt)}</b>) or sweatshirt (<b>${money(prices.sweatshirt)}</b>). Tell us the design, size and color — Mike confirms and sends a secure payment link.</p></div>
<a class="btn" href="#custom" data-kind="T-shirt">Request a shirt</a></section>
<section id="custom" class="custom"><div><h2>Custom work &amp; questions</h2><p>Your own sticker, a design on a shirt, a one-off engraved patch — or just a question. Attach a picture if you have one. Mike replies with a price before anything is made.</p></div>
<form id="inquiry" class="form" action="/api/inquiry" method="post" enctype="multipart/form-data">
<label>What do you want?<select name="kind" required><option>Custom stickers</option><option>T-shirt</option><option>Sweatshirt</option><option>Hat</option><option>Question</option><option>Something else</option></select></label>
<label>Design (if any)<input name="design" maxlength="120" placeholder="e.g. Plan B"></label>
<label>Your name<input name="name" required maxlength="80" autocomplete="name"></label>
<label>Email<input name="email" type="email" required maxlength="120" autocomplete="email"></label>
<label class="wide">Details<textarea name="message" required maxlength="3000" rows="4" placeholder="Sizes, colors, quantities, deadline…"></textarea></label>
<label class="wide">Picture (optional)<input name="file" type="file" accept="image/*"></label>
<label class="hp" aria-hidden="true">Leave empty<input name="website" tabindex="-1" autocomplete="off"></label>
<button class="btn big wide" type="submit">Send to Mike</button><p class="wide fine" id="inq-status" role="status"></p></form></section>
${catalogData(catalog)}`;
  return layout({ title: 'Uncle Mike Can Do It — stickers, leather-patch hats & shirts', description: `Original stickers from ${money(prices.sticker)}, engraved leather-patch hats, and custom shirts — handmade by Uncle Mike.`, canonical: origin + '/', body, content: w });
}

export function productPage(catalog, p, origin) {
  const live = catalog.products.filter(isLive);
  const more = live.filter((x) => x.collection === p.collection && x.id !== p.id).slice(0, 8);
  const ld = { '@context': 'https://schema.org', '@type': 'Product', name: p.title, description: p.description, image: p.images.map((i) => origin + i), offers: { '@type': 'Offer', price: (p.price / 100).toFixed(2), priceCurrency: 'USD', availability: 'https://schema.org/InStock' } };
  const shirt = p.type === 'sticker' ? `<p class="also">Want this on a shirt? <a href="/#custom" data-kind="T-shirt" data-design="${esc(p.title)}">T-shirt ${money(catalog.prices.tshirt)} · sweatshirt ${money(catalog.prices.sweatshirt)}</a></p>` : '';
  const body = `<nav class="crumbs"><a href="/#shop">← All products</a></nav>
<section class="pdp"><div class="gallery">${p.images.map((i, n) => `<img src="${esc(i)}" alt="${esc(p.title)}${n ? ' — view ' + (n + 1) : ''}" width="900" height="900" ${n ? 'loading="lazy"' : 'fetchpriority="high"'}>`).join('')}</div>
<div class="buy"><p class="kicker">${esc(p.type === 'sticker' ? p.collection + ' · Sticker' : p.collection)}</p><h1>${esc(p.title)}</h1><p class="big-price">${money(p.price)}</p>
<p>${esc(p.description)}</p>
<button class="btn big" type="button" data-add="${esc(p.id)}" data-open-after>Add to bag</button>${shirt}</div></section>
${more.length ? `<section class="shop"><h2>More from ${esc(p.collection)}</h2><div class="grid">${more.map((x) => card(x, false)).join('')}</div></section>` : ''}
${catalogData(catalog)}`;
  return layout({ title: `${p.title} — ${money(p.price)} | Uncle Mike Can Do It`, description: `${p.title}. ${p.description}`.slice(0, 160), canonical: `${origin}/p/${p.id}/`, body, content: words(catalog), extraHead: `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>` });
}

export function thanksPage(catalog) {
  const body = `<section class="thanks" id="thanks" data-state="checking"><h1>Checking your payment…</h1>
<p class="lede" id="thanks-msg">One moment while we confirm your order with Square.</p><div id="thanks-lines"></div>
<p><a class="btn" href="/">Back to the shop</a></p></section>${catalogData(catalog)}`;
  return layout({ title: 'Your order | Uncle Mike Can Do It', description: 'Order confirmation', body });
}

export function notFoundPage() {
  return layout({ title: 'Not found | Uncle Mike Can Do It', description: 'Page not found', body: `<section class="thanks"><h1>That one wandered off.</h1><p class="lede">The page you wanted isn’t here.</p><p><a class="btn" href="/">Shop everything</a></p></section>` });
}

export const catalogJson = (catalog) => ({ prices: catalog.prices, products: catalog.products.filter(isLive).map(publicProduct) });
