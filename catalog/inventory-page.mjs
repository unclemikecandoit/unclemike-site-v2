// Writes public/inventory.html — a one-page owner review of catalog/products.json.
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const cat = JSON.parse(fs.readFileSync(path.join(root, 'catalog/products.json'), 'utf8'));
const notesFile = path.join(root, 'catalog/owner-notes.json');
const notes = fs.existsSync(notesFile) ? JSON.parse(fs.readFileSync(notesFile, 'utf8')) : {};
for (const p of cat.products) Object.assign(p, { ownerNote: '', sources: [] }, notes[p.id]);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const money = (c) => '$' + (c / 100).toFixed(2);
const groups = {};
for (const p of cat.products) (groups[p.collection] ||= []).push(p);
const card = (p) => `<article class="${p.status}${p.ownerNote ? ' noted' : ''}">
  <div class="imgs">${p.images.map((i) => `<img src="${i.replace('.jpg', '-sm.jpg')}" alt="" loading="lazy">`).join('')}</div>
  <h3>${esc(p.title)}</h3><p class="price">${money(p.price)} · ${p.type}${p.legacyId ? ' · existing listing' : ' · NEW'}</p>
  <p>${esc(p.description)}</p>
  ${p.ownerNote ? `<p class="note">${p.status === 'hold' ? '⛔ ' : '⚠︎ '}${esc(p.ownerNote)}</p>` : ''}
  <details><summary>${p.sources.length} source photo${p.sources.length > 1 ? 's' : ''}</summary>${p.sources.map((s) => `<code>${esc(s)}</code>`).join('<br>')}</details>
</article>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Product Inventory</title><style>
:root{--bg:#f6f3ee;--card:#fff;--ink:#1d1b18;--mute:#6b655c;--line:#e4ddd2;--warn:#fff4d6;--hold:#ffe1dc}
@media (prefers-color-scheme:dark){:root{--bg:#171512;--card:#221f1b;--ink:#f3eee6;--mute:#a59d90;--line:#3a352e;--warn:#3a3120;--hold:#45231e}}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.45 system-ui,sans-serif;padding:16px}
h1{margin:.2em 0}.sum{color:var(--mute)}h2{margin:28px 0 10px;border-bottom:2px solid var(--line);padding-bottom:6px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
article{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px}
article.noted{background:var(--warn)}article.hold{background:var(--hold)}
.imgs{display:flex;gap:6px}.imgs img{flex:1;min-width:0;aspect-ratio:1;object-fit:contain;background:#fff;border-radius:8px}
h3{font-size:15px;margin:8px 0 2px}.price{margin:0;color:var(--mute);font-size:13px}p{margin:6px 0}.note{font-size:13px;font-weight:600}
details{font-size:12px;color:var(--mute)}code{font-size:11px;word-break:break-all}
</style></head><body>
<h1>Product inventory</h1>
<p class="sum">${cat.products.length} products from 48 supplied photos + existing catalog · ${cat.products.filter((p) => !p.legacyId).length} new · ${cat.products.filter((p) => p.status === 'hold').length} on hold · ${cat.products.filter((p) => p.ownerNote && p.status !== 'hold').length} with a note for you. Apparel: any design on a T-shirt ($20) or sweatshirt ($40), finalised by inquiry — no garment photos supplied.</p>
${Object.entries(groups).map(([g, ps]) => `<h2>${esc(g)} <small>(${ps.length})</small></h2><div class="grid">${ps.map(card).join('')}</div>`).join('')}
</body></html>`;
fs.writeFileSync(path.join(root, 'catalog/inventory.html'), html.replaceAll('src="/img/', 'src="../img/'));
console.log('wrote catalog/inventory.html');
