// One command for every test: `npm test`
// Starts the fake Square API and a fresh local site (empty storage), runs unit,
// storefront and studio tests in order, then shuts everything down.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const PORT = 8790;
const persist = fs.mkdtempSync(path.join(os.tmpdir(), 'um-test-'));
// Fake Square runs in its own process: the test run below blocks this one.
const square = spawn(process.execPath, ['test/fake-square.mjs'], { cwd: root, stdio: 'ignore' });
const wr = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['wrangler', 'dev', '-c', 'wrangler.site.jsonc', '--port', String(PORT), '--ip', '127.0.0.1', '--persist-to', persist, '--log-level', 'error'], { cwd: root, shell: process.platform === 'win32', stdio: 'ignore' });
let code = 1;
try {
  for (let i = 0; i < 60; i++) { try { if ((await fetch(`http://127.0.0.1:${PORT}/api/catalog`)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 1000)); }
  const env = { ...process.env, SITE: `http://127.0.0.1:${PORT}` };
  code = spawnSync(process.execPath, ['--test', '--test-concurrency=1', '--test-reporter=spec', 'test/shop.unit.test.mjs', 'test/site.e2e.test.mjs', 'test/studio.e2e.test.mjs'], { cwd: root, env, stdio: 'inherit' }).status;
} finally {
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(wr.pid), '/T', '/F'], { stdio: 'ignore' }); else wr.kill();
  square.kill();
  fs.rmSync(persist, { recursive: true, force: true });
}
process.exit(code);
