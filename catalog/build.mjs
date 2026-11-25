// Builds catalog/products.json and web images in public/img/ from inventory-source.mjs.
// Usage: node catalog/build.mjs [path-to-product-photos-folder]
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { products, apparel, PRICES, SHIPPING } from './inventory-source.mjs';

const root = path.resolve(import.meta.dirname, '..');
const photos = process.argv[2] || path.join(os.homedir(), 'OneDrive', 'Desktop', 'product photos');
const imgDir = path.join(root, 'img', 'p');
const slugify = (s) => s.toLowerCase().replace(/\*/g, '').replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const resolveSrc = (s) => s.startsWith('photos:') ? path.join(photos, s.slice(7)) : path.join(root, s);

const jobs = [];
const out = [];
const notes = {};
const seen = new Set();
for (const p of products) {
  const type = p.type || 'sticker';
  let id = slugify(p.title);
  while (seen.has(id)) id += '-2';
  seen.add(id);
  const sources = [p.src, ...(p.alt || [])];
  const images = [];
  // Primary image: catalog art for existing stickers; every source photo for hats.
  const used = type === 'hat' ? sources : [p.src];
  used.forEach((s, i) => {
    const file = resolveSrc(s);
    if (!fs.existsSync(file)) throw new Error('Missing source image: ' + file);
    const name = `${id}${i ? '-' + (i + 1) : ''}`;
    jobs.push({ in: file, out: path.join(imgDir, name + '.jpg'), size: 900 });
    jobs.push({ in: file, out: path.join(imgDir, name + '-sm.jpg'), size: 420 });
    images.push(`/img/p/${name}.jpg`);
  });
  out.push({
    id, type, title: p.title, collection: p.collection,
    description: p.art,
    price: PRICES[type],
    images,
    legacyId: p.legacyId ?? null,
    status: p.hold ? 'hold' : 'live',
    // Existing live-site listings count as approved; new designs wait for Mike's review.
    approved: p.legacyId != null && !p.hold,
  });
  // Owner notes and source paths stay private (catalog/owner-notes.json is not committed).
  notes[id] = { ownerNote: p.note || '', sources: sources.map((s) => s.replace(/^photos:/, 'product photos/')) };
}
const manifest = path.join(os.tmpdir(), 'um-resize-' + process.pid + '.json');
fs.writeFileSync(manifest, JSON.stringify(jobs));
execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', path.join(root, 'catalog', 'resize.ps1'), '-Manifest', manifest], { stdio: 'inherit' });
fs.rmSync(manifest);
const catalog = { version: new Date().toISOString(), prices: PRICES, shipping: SHIPPING, products: out, apparel };
fs.writeFileSync(path.join(root, 'catalog', 'products.json'), JSON.stringify(catalog, null, 2));
fs.writeFileSync(path.join(root, 'catalog', 'owner-notes.json'), JSON.stringify(notes, null, 2));
const counts = out.reduce((a, p) => ((a[p.type] = (a[p.type] || 0) + 1), a), {});
console.log('Products:', out.length, counts, 'held:', out.filter((p) => p.status === 'hold').length, 'images:', jobs.length);
