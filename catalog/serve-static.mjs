// Minimal local static server for public/ (preview only, binds to loopback).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const dir = path.resolve(import.meta.dirname, '..', 'public');
const types = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(dir, path.normalize(p));
  if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(Number(process.env.PORT) || 4180, '127.0.0.1', () => console.log('serving public/ on http://127.0.0.1:' + (process.env.PORT || 4180)));
