export const STUDIO_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><title>Studio — Uncle Mike</title><meta name="theme-color" content="#16130f">
<link rel="stylesheet" href="/s/studio.css?v=6"><script src="/s/studio.js?v=6" defer></script></head>
<body>
<section id="login" class="login" hidden><form id="login-form"><h1>UNCLE MIKE<span>STUDIO</span></h1>
<label>Password<input type="password" name="password" autocomplete="current-password" required></label>
<button class="btn primary" type="submit">Sign in</button><p class="err" id="login-err" role="alert"></p></form></section>
<div id="app" hidden>
<header class="bar"><div class="brand">STUDIO</div>
<a class="ghost" href="/" target="_blank" rel="noopener">View site ↗</a>
<button id="publish" class="btn primary" type="button">Publish</button></header>
<p id="pubinfo" class="pubinfo"></p>
<main id="view"></main>
<nav class="tabs" aria-label="Studio sections">
<button data-tab="products" aria-current="page"><span>▦</span>Products</button>
<button data-tab="upload"><span>＋</span>Upload</button>
<button data-tab="inbox"><span>✉</span>Inbox</button>
<button data-tab="notes"><span>✎</span>Notes</button>
<button data-tab="settings"><span>⚙</span>Settings</button></nav>
</div>
<div id="toast" class="toast" role="status" hidden></div>
</body></html>`;
