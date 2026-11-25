// Uncle Mike Studio — owner-only client. All data comes from /api/studio/* after sign-in.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const money = (c) => '$' + (c / 100).toFixed(2);
  const toCents = (v) => { const n = Number(String(v).replace(/[$,\s]/g, '')); return Number.isFinite(n) ? Math.round(n * 100) : NaN; };
  const sm = (src) => src.replace(/\.jpg$/, '-sm.jpg');
  const TYPE_NAMES = { sticker: 'Sticker', sheet: 'Sticker sheet', hat: 'Hat', tshirt: 'T-shirt', sweatshirt: 'Sweatshirt' };

  let S = null; // studio state from server
  let tab = 'products', filter = 'review', query = '', open = null;
  const selected = new Set();

  // In-page confirm/prompt (browser pop-ups are blocked in some embedded browsers).
  function ask(message, { input = false, ok = 'OK', value = '' } = {}) {
    return new Promise((resolve) => {
      const d = document.createElement('dialog');
      d.className = 'ask';
      d.innerHTML = `<form method="dialog"><p>${esc(message).replace(/\n/g, '<br>')}</p>${input ? `<input name="v" value="${esc(value)}" autocomplete="off">` : ''}
        <div class="actions"><button class="btn" value="cancel" type="submit">Cancel</button><button class="btn primary" value="ok" type="submit">${esc(ok)}</button></div></form>`;
      document.body.append(d);
      d.addEventListener('close', () => { const yes = d.returnValue === 'ok'; const v = input ? $('input', d).value : true; d.remove(); resolve(yes ? v : null); });
      d.showModal();
      (input ? $('input', d) : $('button[value=ok]', d)).focus();
    });
  }

  function toast(msg, ms = 2600) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), ms); }

  async function api(path, opts = {}) {
    const init = { method: opts.method || (opts.body || opts.form ? 'POST' : 'GET'), headers: {} };
    if (opts.form) init.body = opts.form;
    else if (opts.body) { init.body = JSON.stringify(opts.body); init.headers['Content-Type'] = 'application/json'; }
    const r = await fetch('/api/studio/' + path, init);
    const d = await r.json().catch(() => ({ ok: false, error: 'Unexpected response' }));
    if (r.status === 401 && d.auth === false) { showLogin(); throw new Error('Please sign in.'); }
    if (d.stale) { await load(); }
    if (!r.ok || d.ok === false) throw new Error(d.error || 'Something went wrong.');
    return d;
  }

  // ── Auth ───────────────────────────────────────────────────────────
  function showLogin() { $('#app').hidden = true; $('#login').hidden = false; $('[name=password]').focus(); }
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    $('#login-err').textContent = '';
    try { await api('login', { body: { password: e.target.password.value } }); e.target.reset(); await load(); }
    catch (x) { $('#login-err').textContent = x.message; }
  });

  async function load() {
    S = await api('state');
    $('#login').hidden = true; $('#app').hidden = false;
    render();
  }
  function setDraft(d) { S.draft = d; refreshState(); }
  async function refreshState() { try { S = await api('state'); } catch {} render(); }

  // ── Header / publish ───────────────────────────────────────────────
  function renderHeader() {
    const review = S.draft.products.filter(needsReview).length;
    $('#publish').disabled = !S.changes;
    $('#publish').textContent = S.changes ? 'Publish changes' : 'Published ✓';
    $('#pubinfo').textContent = (S.publishedAt ? `Live site last published ${new Date(S.publishedAt).toLocaleString()}.` : 'Nothing published from the studio yet — the site shows the starting catalog.') + ` ${S.willPublish} products will be public. ${review} need${review === 1 ? 's' : ''} review.` + (S.square !== 'production' ? ' Checkout: Square sandbox (test mode).' : '');
  }
  $('#publish').addEventListener('click', async () => {
    const review = S.draft.products.filter(needsReview).length;
    if (!await ask(`Publish now?\n\n${S.willPublish} products will be visible to customers.${review ? `\n${review} unreviewed item(s) stay private until you approve them.` : ''}\n\nThe previous version is backed up and can be restored in Settings.`)) return;
    try { const d = await api('publish', { body: {} }); toast(`Published — ${d.count} products live.`); await refreshState(); } catch (x) { toast(x.message, 5000); }
  });

  // ── Tabs ───────────────────────────────────────────────────────────
  function setTab(t) { tab = t; $$('.tabs button').forEach((x) => (x.dataset.tab === t ? x.setAttribute('aria-current', 'page') : x.removeAttribute('aria-current'))); render(); scrollTo(0, 0); }
  $$('.tabs button').forEach((b) => b.addEventListener('click', () => setTab(b.dataset.tab)));
  function render() { if (!S) return; renderHeader(); ({ products: renderProducts, upload: renderUpload, inbox: renderInbox, notes: renderNotes, settings: renderSettings })[tab](); }

  // ── Products ───────────────────────────────────────────────────────
  const needsReview = (p) => p.status !== 'hidden' && p.approvedRev !== p.rev;
  const isHold = (p) => p.gate && p.gate.holds && Object.values(p.gate.holds).some(Boolean);
  const FILTERS = [['review', 'Needs review', needsReview], ['live', 'Approved', (p) => p.status === 'live' && !needsReview(p)], ['hidden', 'Hidden / held', (p) => p.status === 'hidden' || isHold(p)], ['all', 'All', () => true]];

  function badges(p) {
    const pub = S.publishedIds.includes(p.id) || (!S.publishedAt && p.approvedRev > 0 && p.source === 'catalog');
    const out = [];
    if (isHold(p)) out.push('<span class="b bad">Brand Gate HOLD</span>');
    if (p.status === 'hidden') out.push('<span class="b">Hidden</span>');
    else if (needsReview(p)) out.push(`<span class="b review">${p.approvedRev ? 'Edited — re-approve' : 'Needs review'}</span>`);
    else out.push('<span class="b ok">Approved</span>');
    if (pub) out.push('<span class="b info">On site</span>');
    if (p.similar && p.similar.length) out.push('<span class="b review">Possible duplicate</span>');
    if (p.ownerNote) out.push('<span class="b">Note</span>');
    return out.join('');
  }

  function renderProducts() {
    const ps = S.draft.products;
    const f = FILTERS.find((x) => x[0] === filter) || FILTERS[0];
    const q = query.toLowerCase();
    const shown = ps.filter(f[2]).filter((p) => !q || (p.title + ' ' + p.collection + ' ' + p.description).toLowerCase().includes(q));
    for (const id of [...selected]) if (!ps.some((p) => p.id === id)) selected.delete(id);
    $('#view').innerHTML = `
      <div class="chips" role="group" aria-label="Show">${FILTERS.map(([k, l, fn]) => `<button data-filter="${k}" aria-pressed="${k === filter}">${l} <b>${ps.filter(fn).length}</b></button>`).join('')}</div>
      <input id="search" type="search" placeholder="Search products…" value="${esc(query)}">
      ${selected.size ? bulkBar() : ''}
      <div class="row" style="justify-content:space-between;margin:8px 0"><label class="row" style="flex-direction:row;gap:6px;color:var(--ink)"><input type="checkbox" id="selall" style="width:auto" ${shown.length && shown.every((p) => selected.has(p.id)) ? 'checked' : ''}> Select all ${shown.length}</label>
      ${filter === 'review' && shown.length ? `<span class="meta" style="font-size:12px;color:var(--mute)">Tap an item to check it, then Approve.</span>` : ''}</div>
      <div class="list">${shown.map(itemHtml).join('') || `<p class="empty">${filter === 'review' ? 'Nothing waiting for review. 🎉' : 'No products here.'}</p>`}</div>`;
    $('#search').addEventListener('input', (e) => { query = e.target.value; const pos = e.target.selectionStart; renderProducts(); const s = $('#search'); s.focus(); s.setSelectionRange(pos, pos); });
  }

  function bulkBar() {
    return `<div class="bulk"><b>${selected.size} selected</b>
      <button class="btn ok" data-bulk="approve">Approve</button>
      <button class="btn" data-bulk="price">Set price</button>
      <button class="btn" data-bulk="collection">Set collection</button>
      <button class="btn" data-bulk="type">Set type</button>
      <button class="btn" data-bulk="hide">Hide</button>
      <button class="btn" data-bulk="show">Show</button>
      ${selected.size > 1 ? '<button class="btn" data-bulk="merge">Merge photos into one</button>' : ''}
      <button class="btn" data-bulk="delete">Delete</button>
      <button class="btn" data-bulk="clear">✕</button></div>`;
  }

  function itemHtml(p) {
    const o = open === p.id;
    return `<div class="item ${o ? 'open' : ''}" data-id="${esc(p.id)}">
      <div class="head" data-toggle="${esc(p.id)}"><input type="checkbox" data-sel="${esc(p.id)}" ${selected.has(p.id) ? 'checked' : ''} aria-label="Select ${esc(p.title)}">
      <img src="${esc(sm(p.images[0]))}" alt="" loading="lazy"><div><div class="t">${esc(p.title)}</div><div class="s">${esc(TYPE_NAMES[p.type] || p.type)} · ${esc(p.collection)}${p.images.length > 1 ? ` · ${p.images.length} photos` : ''}</div><div class="badges">${badges(p)}</div></div>
      <div class="price">${money(p.price)}</div></div>
      ${o ? editorHtml(p) : ''}</div>`;
  }

  function editorHtml(p) {
    const ai = p.ai;
    const aiBox = ai ? (ai.ok
      ? `<div class="box ai"><b>AI read this photo</b> <span class="meta">(${esc(ai.confidence)} confidence — always check)</span>
          ${ai.wording ? `<p>Wording: “${esc(ai.wording)}”</p>` : '<p>No wording found.</p>'}<p>Suggested: <b>${esc(ai.title)}</b> · ${esc(TYPE_NAMES[ai.type] || ai.type || '?')}</p><p>${esc(ai.description)}</p>
          <button class="btn" type="button" data-use-ai="${esc(p.id)}">Use these suggestions</button></div>`
      : `<div class="box"><b>No automatic description:</b> ${esc(ai.error)} ${S.ai ? `<button class="btn" type="button" data-analyze="${esc(p.id)}">Try recognition</button>` : ''}</div>`)
      : (S.ai ? `<div class="box"><button class="btn" type="button" data-analyze="${esc(p.id)}">Read this photo with AI</button> <span class="meta">Uses a little of the free daily allowance.</span></div>` : '');
    const dup = p.similar && p.similar.length ? `<div class="box dup"><b>Looks like something you already have:</b>${p.similar.map((s) => `<p>${esc(s.title)} <button class="btn" type="button" data-mergeinto="${esc(s.id)}" data-from="${esc(p.id)}">Add these photos to it</button></p>`).join('')}<button class="btn" type="button" data-notdup="${esc(p.id)}">It’s a different design</button></div>` : '';
    return `<form class="editor" data-edit="${esc(p.id)}">
      <div class="pics">${p.images.map((src, i) => `<div class="pic"><img src="${esc(sm(src))}" alt="">${i === 0 ? '<span class="first">Main</span>' : `<button type="button" title="Make main photo" data-main="${i}" style="right:34px">★</button>`}${p.images.length > 1 ? `<button type="button" title="Remove photo" data-rmimg="${i}">✕</button>` : ''}</div>`).join('')}</div>
      ${dup}${aiBox}
      ${p.ownerNote ? `<div class="box"><b>Note:</b> ${esc(p.ownerNote)}</div>` : ''}
      <label>Title<input name="title" value="${esc(p.title)}" maxlength="140" required></label>
      <div class="grid2"><label>Type<select name="type">${Object.entries(TYPE_NAMES).map(([k, v]) => `<option value="${k}" ${k === p.type ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <label>Price<input name="price" inputmode="decimal" value="${(p.price / 100).toFixed(2)}"></label></div>
      <label>Collection<input name="collection" value="${esc(p.collection)}" list="collections" maxlength="60"></label>
      <datalist id="collections">${S.draft.collections.map((c) => `<option value="${esc(c)}">`).join('')}</datalist>
      <label>Description (customers see this)<textarea name="description" rows="3" maxlength="1000">${esc(p.description)}</textarea></label>
      <details><summary>Brand Gate ${p.gate ? '' : '(optional)'}</summary>${gateHtml(p.gate, 'pg')}</details>
      <div class="actions">
        <button class="btn" type="submit">Save changes</button>
        ${needsReview(p) && !isHold(p) ? `<button class="btn ok" type="button" data-approve="${esc(p.id)}" data-rev="${p.rev}">Approve as shown</button>` : ''}
        ${!needsReview(p) && p.status === 'live' ? `<button class="btn" type="button" data-unapprove="${esc(p.id)}">Un-approve</button>` : ''}
        <button class="btn" type="button" data-status="${p.status === 'hidden' ? 'live' : 'hidden'}">${p.status === 'hidden' ? 'Show on site' : 'Hide from site'}</button>
        <button class="btn danger" type="button" data-delete="${esc(p.id)}">Delete</button>
        <a class="ghost" href="/p/${esc(p.id)}/" target="_blank" rel="noopener">Preview ↗</a></div>
      <p class="meta" style="font-size:12px;color:var(--mute)">Saving creates a new version; customers keep seeing the last approved version until you approve and publish.</p></form>`;
  }

  // Brand Gate editor (shared by products and notes)
  function gateHtml(g = {}, prefix) {
    const sc = g.scores || {}, h = g.holds || {};
    return `<div class="gate" data-gate="${prefix}"><label>Central message<input data-g="message" value="${esc(g.message || '')}" maxlength="500" placeholder="What is this really saying?"></label>
      ${S.criteria.map((c) => `<div class="crit"><span>${esc(c)}</span><span class="seg">${[0, 1, 2].map((n) => `<button type="button" data-score="${esc(c)}" data-v="${n}" aria-pressed="${sc[c] === n}">${n}</button>`).join('')}</span></div>`).join('')}
      <div class="checks">${Object.entries(S.holds).map(([k, l]) => `<label><input type="checkbox" data-hold="${k}" ${h[k] ? 'checked' : ''}> ${esc(l)}</label>`).join('')}</div>
      <div class="decision ${gateResult(g).decision}">${gateLabel(g)}</div></div>`;
  }
  function gateResult(g = {}) {
    const holds = Object.keys(S.holds).filter((k) => g.holds?.[k]);
    if (holds.length) return { decision: 'HOLD' };
    if (!String(g.message || '').trim()) return { decision: 'INCOMPLETE' };
    const s = S.criteria.map((c) => g.scores?.[c]);
    if (s.some((x) => ![0, 1, 2].includes(x))) return { decision: 'INCOMPLETE' };
    const t = s.reduce((a, b) => a + b, 0);
    return { decision: s[0] === 0 || s[1] === 0 ? 'PARK' : t >= 8 ? 'POST' : t >= 6 ? 'FIX' : 'PARK', total: t };
  }
  function gateLabel(g) { const r = gateResult(g); return { POST: `POST (${r.total}/10) — recommended; you still decide`, FIX: `FIX (${r.total}/10) — improve before posting`, PARK: `PARK${r.total != null ? ` (${r.total}/10)` : ''} — not now`, HOLD: 'HOLD — resolve the flagged issue first', INCOMPLETE: 'Incomplete — add the message and all five scores' }[r.decision]; }
  function readGate(el) {
    const g = { message: $('[data-g=message]', el).value, scores: {}, holds: {} };
    $$('[data-score]', el).forEach((b) => { if (b.getAttribute('aria-pressed') === 'true') g.scores[b.dataset.score] = Number(b.dataset.v); });
    $$('[data-hold]', el).forEach((c) => (g.holds[c.dataset.hold] = c.checked));
    return g;
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-score]');
    if (!b) return;
    $$(`[data-score="${CSS.escape(b.dataset.score)}"]`, b.closest('.gate')).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const gate = b.closest('.gate'); const d = $('.decision', gate); const g = readGate(gate); d.className = 'decision ' + gateResult(g).decision; d.textContent = gateLabel(g);
  });
  document.addEventListener('change', (e) => {
    const gate = e.target.closest('.gate'); if (!gate) return;
    const d = $('.decision', gate); const g = readGate(gate); d.className = 'decision ' + gateResult(g).decision; d.textContent = gateLabel(g);
  });

  async function ops(list, msg) {
    try { const d = await api('products', { body: { ops: list, baseVersion: S.draft.version } }); S.draft = d.draft; if (msg) toast(msg); await refreshState(); return true; }
    catch (x) { toast(x.message, 5000); return false; }
  }

  // Product list interactions
  document.addEventListener('click', async (e) => {
    if (tab !== 'products') return;
    const t = e.target;
    const fb = t.closest('[data-filter]'); if (fb) { filter = fb.dataset.filter; open = null; renderProducts(); return; }
    if (t.matches('[data-sel]')) { t.checked ? selected.add(t.dataset.sel) : selected.delete(t.dataset.sel); renderProducts(); return; }
    if (t.id === 'selall') { const f = FILTERS.find((x) => x[0] === filter); const q = query.toLowerCase(); const ids = S.draft.products.filter(f[2]).filter((p) => !q || (p.title + ' ' + p.collection + ' ' + p.description).toLowerCase().includes(q)).map((p) => p.id); t.checked ? ids.forEach((i) => selected.add(i)) : ids.forEach((i) => selected.delete(i)); renderProducts(); return; }
    const head = t.closest('[data-toggle]'); if (head && !t.matches('input')) { open = open === head.dataset.toggle ? null : head.dataset.toggle; renderProducts(); $(`[data-id="${CSS.escape(head.dataset.toggle)}"]`)?.scrollIntoView({ block: 'nearest' }); return; }
    const bulk = t.closest('[data-bulk]'); if (bulk) return runBulk(bulk.dataset.bulk);
    const item = t.closest('[data-id]'); const id = item?.dataset.id; const p = id && S.draft.products.find((x) => x.id === id);
    if (!p) return;
    if (t.dataset.approve) { if (await ops([{ op: 'approve', id, rev: Number(t.dataset.rev) }], 'Approved. Press Publish when you’re ready.')) open = nextReview(id); renderProducts(); }
    else if (t.dataset.unapprove) ops([{ op: 'unapprove', id }], 'Approval removed.');
    else if (t.dataset.status) ops([{ op: 'update', id, fields: { status: t.dataset.status } }], t.dataset.status === 'hidden' ? 'Hidden from the site.' : 'Will show on the site after approval.');
    else if (t.dataset.delete) { if (await ask(`Delete “${p.title}”? This can’t be undone (published backups keep old versions).`)) { open = null; ops([{ op: 'delete', id }], 'Deleted.'); } }
    else if (t.dataset.rmimg) ops([{ op: 'update', id, fields: { images: p.images.filter((_, i) => i !== Number(t.dataset.rmimg)) } }], 'Photo removed.');
    else if (t.dataset.main) { const i = Number(t.dataset.main); const imgs = [p.images[i], ...p.images.filter((_, j) => j !== i)]; ops([{ op: 'update', id, fields: { images: imgs } }], 'Main photo changed.'); }
    else if (t.dataset.useAi) { const f = $(`form[data-edit="${CSS.escape(id)}"]`); f.title.value = p.ai.title || f.title.value; if (p.ai.description) f.description.value = p.ai.description; if (p.ai.type) { f.type.value = p.ai.type; f.price.value = (S.draft.prices[p.ai.type] / 100).toFixed(2); } toast('Filled in — check it, then Save.'); }
    else if (t.dataset.analyze) { t.disabled = true; t.textContent = 'Reading photo…'; try { const d = await api('analyze', { body: { id } }); S.draft = d.draft; toast('Photo read — check the suggestion.'); } catch (x) { toast(x.message, 5000); await refreshState(); } renderProducts(); }
    else if (t.dataset.mergeinto) { if (await ops([{ op: 'merge', ids: [t.dataset.mergeinto, t.dataset.from] }], 'Photos added to the existing product.')) open = t.dataset.mergeinto; renderProducts(); }
    else if (t.dataset.notdup) ops([{ op: 'notdup', id }], 'Marked as a different design.');
  });
  function nextReview(after) { const list = S.draft.products.filter(needsReview); return list.find((p) => p.id !== after)?.id || null; }

  document.addEventListener('submit', async (e) => {
    const f = e.target.closest('form[data-edit]'); if (!f) return;
    e.preventDefault();
    const id = f.dataset.edit;
    const price = toCents(f.price.value);
    if (!Number.isInteger(price) || price < 1) return toast('Enter a price like 0.50 or 30.', 4000);
    const gateEl = $('.gate', f); const g = readGate(gateEl);
    const p = S.draft.products.find((x) => x.id === id);
    const fields = { title: f.title.value, type: f.type.value, price, collection: f.collection.value, description: f.description.value };
    if (p.gate || g.message || Object.keys(g.scores).length || Object.values(g.holds).some(Boolean)) fields.gate = g;
    ops([{ op: 'update', id, fields }], 'Saved. Approve it when it looks right.');
  });

  async function runBulk(kind) {
    const ids = [...selected];
    if (kind === 'clear') { selected.clear(); return renderProducts(); }
    const ps = ids.map((id) => S.draft.products.find((p) => p.id === id));
    let list = [];
    if (kind === 'approve') {
      const ok = ps.filter((p) => needsReview(p) && !isHold(p));
      if (!ok.length) return toast('Nothing selected needs approval.');
      if (!await ask(`Approve ${ok.length} product(s) exactly as they are now?${ok.length < ps.length ? `\n(${ps.length - ok.length} skipped: already approved, hidden or on HOLD.)` : ''}`)) return;
      list = ok.map((p) => ({ op: 'approve', id: p.id, rev: p.rev }));
    } else if (kind === 'price') {
      const v = await ask('New price for the selected items (e.g. 0.50 or 30):', { input: true }); if (v == null) return;
      const c = toCents(v); if (!Number.isInteger(c) || c < 1) return toast('That isn’t a valid price.');
      list = ids.map((id) => ({ op: 'update', id, fields: { price: c } }));
    } else if (kind === 'collection') {
      const v = await ask(`Collection name for the selected items:\n(${S.draft.collections.join(', ')})`, { input: true }); if (!v) return;
      list = ids.map((id) => ({ op: 'update', id, fields: { collection: v } }));
    } else if (kind === 'type') {
      const v = await ask('Type for the selected items: sticker, sheet, hat, tshirt or sweatshirt', { input: true }); if (!v) return;
      const t = v.trim().toLowerCase().replace(/[^a-z]/g, ''); if (!TYPE_NAMES[t]) return toast('Unknown type.');
      const setPrice = await ask(`Also set their price to the ${TYPE_NAMES[t]} price (${money(S.draft.prices[t])})?`);
      list = ids.map((id) => ({ op: 'update', id, fields: setPrice ? { type: t, price: S.draft.prices[t] } : { type: t } }));
    } else if (kind === 'hide' || kind === 'show') list = ids.map((id) => ({ op: 'update', id, fields: { status: kind === 'hide' ? 'hidden' : 'live' } }));
    else if (kind === 'merge') {
      if (!await ask(`Combine the photos of these ${ids.length} items into ONE product (“${ps[0].title}”)? The other entries are removed.`)) return;
      list = [{ op: 'merge', ids }];
    } else if (kind === 'delete') { if (!await ask(`Delete ${ids.length} product(s)? This can’t be undone.`)) return; list = ids.map((id) => ({ op: 'delete', id })); }
    if (await ops(list, `Done — ${ids.length} item(s) updated.`)) selected.clear();
    renderProducts();
  }

  // ── Upload ─────────────────────────────────────────────────────────
  let queue = []; // {file, url, full, sm, hash, group, status}
  let groupN = 0;
  function renderUpload() {
    const cols = S.draft.collections;
    $('#view').innerHTML = `<h2>Add new merchandise</h2>
      <p style="color:var(--mute);margin-top:-4px">Pick photos (as many as you like). Each photo becomes a draft listing${S.ai ? ' that AI fills in for you' : ''}. Several photos of the same item? Select them and tap “Same product”.</p>
      <div class="grid2"><label>What are they?<select id="up-type">${S.ai ? '<option value="auto">Let AI decide</option>' : ''}${Object.entries(TYPE_NAMES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label>
      <label>Collection<input id="up-col" list="up-cols" value="New Arrivals" maxlength="60"><datalist id="up-cols">${cols.map((c) => `<option value="${esc(c)}">`).join('')}</datalist></label></div>
      ${S.ai ? `<label class="row" style="flex-direction:row;gap:8px;margin:10px 0;color:var(--ink)"><input id="up-ai" type="checkbox" checked style="width:auto"> Read each photo with AI (free daily allowance; fills title, wording and description)</label>`
        : '<p class="box" style="margin:10px 0">Automatic photo recognition isn’t connected in this preview, so new items arrive with a placeholder name for you to fill in. It switches on when the site runs on Cloudflare.</p>'}
      <label class="drop" for="up-files"><b>📷 Choose photos</b>or take new ones</label>
      <input id="up-files" type="file" accept="image/*" multiple hidden>
      <div id="up-q"></div>`;
    $('#up-files').addEventListener('change', (e) => addFiles([...e.target.files]));
    renderQueue();
  }
  async function addFiles(files) {
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const item = { file, status: 'Preparing…', group: 0, sel: false };
      queue.push(item); renderQueue();
      try { Object.assign(item, await prepare(file)); item.status = 'Ready'; } catch { item.status = 'Can’t read this photo'; item.bad = true; }
      renderQueue();
    }
  }
  function renderQueue() {
    const el = $('#up-q'); if (!el) return;
    if (!queue.length) { el.innerHTML = ''; return; }
    const ready = queue.filter((q) => !q.bad && !q.done).length;
    const anySel = queue.some((q) => q.sel);
    el.innerHTML = `<div class="thumbs">${queue.map((q, i) => `<div class="thumb ${q.sel ? 'sel' : ''}" data-q="${i}">${q.preview ? `<img src="${q.preview}" alt="">` : '<div style="aspect-ratio:1"></div>'}${q.group ? `<span class="g">Item ${q.group}</span>` : ''}<div class="st">${esc(q.status)}</div></div>`).join('')}</div>
      <div class="actions">${anySel ? '<button class="btn" type="button" id="q-group">Same product (group)</button><button class="btn" type="button" id="q-ungroup">Ungroup</button><button class="btn danger" type="button" id="q-rm">Remove</button>' : ''}
      <button class="btn primary" type="button" id="q-go" ${ready ? '' : 'disabled'}>Upload ${ready} photo${ready === 1 ? '' : 's'}</button>
      ${queue.some((q) => q.done) ? '<button class="btn" type="button" id="q-clear">Clear finished</button>' : ''}</div>
      <div class="progress" style="margin-top:10px"><i id="q-bar"></i></div>`;
  }
  document.addEventListener('click', async (e) => {
    if (tab !== 'upload') return;
    const th = e.target.closest('[data-q]'); if (th) { const q = queue[Number(th.dataset.q)]; if (!q.done) q.sel = !q.sel; return renderQueue(); }
    if (e.target.id === 'q-group') { groupN++; queue.filter((q) => q.sel).forEach((q) => { q.group = groupN; q.sel = false; }); renderQueue(); }
    if (e.target.id === 'q-ungroup') { queue.filter((q) => q.sel).forEach((q) => { q.group = 0; q.sel = false; }); renderQueue(); }
    if (e.target.id === 'q-rm') { queue = queue.filter((q) => !q.sel); renderQueue(); }
    if (e.target.id === 'q-clear') { queue = queue.filter((q) => !q.done); renderQueue(); }
    if (e.target.id === 'q-go') uploadAll();
  });
  async function uploadAll() {
    const go = $('#q-go'); go.disabled = true;
    const type = $('#up-type').value, collection = $('#up-col').value, analyze = !!$('#up-ai')?.checked;
    const todo = queue.filter((q) => !q.bad && !q.done);
    const groupTarget = {};
    let n = 0, made = 0, failed = 0;
    for (const q of todo) {
      q.status = 'Uploading…'; renderQueue();
      const fd = new FormData();
      fd.set('full', q.full, 'full.jpg'); fd.set('sm', q.sm, 'sm.jpg');
      const addTo = q.group && groupTarget[q.group];
      fd.set('meta', JSON.stringify({ type, collection, analyze: analyze && !addTo, hash: q.hash, addTo: addTo || undefined }));
      try {
        const d = await api('upload', { form: fd });
        S.draft = d.draft;
        if (q.group && !addTo) groupTarget[q.group] = d.product.id;
        if (!addTo) made++;
        q.done = true; q.status = addTo ? 'Added to item' : (d.product.ai?.ok ? 'Read by AI ✓' : 'Uploaded ✓');
      } catch (x) { q.status = x.message; failed++; }
      n++; renderQueue(); const bar = $('#q-bar'); if (bar) bar.style.width = (100 * n / todo.length) + '%';
    }
    await refreshState();
    toast(`${made} new draft listing${made === 1 ? '' : 's'} ready for review${failed ? ` · ${failed} failed` : ''}.`, 4000);
    if (made && !failed) { filter = 'review'; setTab('products'); }
  }
  // Shrinks a photo on the phone (keeps uploads small) and fingerprints it for duplicate checks.
  async function prepare(file) {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const jpeg = (max) => { const s = Math.min(1, max / Math.max(bmp.width, bmp.height)); const c = document.createElement('canvas'); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s); const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(bmp, 0, 0, c.width, c.height); return new Promise((r) => c.toBlob(r, 'image/jpeg', 0.85)); };
    const full = await jpeg(900), smb = await jpeg(420);
    return { full, sm: smb, preview: URL.createObjectURL(smb), hash: dhash(bmp) };
  }
  function dhash(src) {
    const c = document.createElement('canvas'); c.width = 9; c.height = 8; const x = c.getContext('2d', { willReadFrequently: true });
    x.fillStyle = '#fff'; x.fillRect(0, 0, 9, 8); x.drawImage(src, 0, 0, 9, 8);
    const d = x.getImageData(0, 0, 9, 8).data; let bits = '';
    for (let y = 0; y < 8; y++) for (let i = 0; i < 8; i++) { const a = (y * 9 + i) * 4, b = a + 4; bits += (d[a] + d[a + 1] + d[a + 2]) > (d[b] + d[b + 1] + d[b + 2]) ? '1' : '0'; }
    return bits.match(/.{4}/g).map((n) => parseInt(n, 2).toString(16)).join('');
  }
  // Fingerprint existing products once so new uploads can be checked against them.
  async function fingerprintCatalog() {
    const missing = S.draft.products.filter((p) => !p.hash).slice(0, 80);
    if (!missing.length) return;
    const list = [];
    for (const p of missing) {
      try { const img = new Image(); img.src = sm(p.images[0]); await img.decode(); list.push({ op: 'hash', id: p.id, hash: dhash(img) }); } catch {}
    }
    if (list.length) { try { const d = await api('products', { body: { ops: list, baseVersion: S.draft.version } }); S.draft = d.draft; } catch {} }
  }

  // ── Inbox ──────────────────────────────────────────────────────────
  async function renderInbox() {
    $('#view').innerHTML = '<h2>Inbox</h2><p class="empty">Loading…</p>';
    let d; try { d = await api('inbox'); } catch (x) { $('#view').innerHTML = `<p class="err">${esc(x.message)}</p>`; return; }
    const paid = d.orders.filter((o) => o.status === 'paid');
    const toShip = paid.filter((o) => !o.shippedAt).length;
    $('#view').innerHTML = `<h2>Orders</h2>
      ${toShip ? `<p><a class="btn primary" href="/api/studio/pirateship.csv">Download ${toShip} unshipped order${toShip === 1 ? '' : 's'} for Pirate Ship</a></p><p style="font-size:12px;color:var(--mute)">In Pirate Ship choose Import → Upload a spreadsheet. Mark orders shipped here afterwards.</p>` : ''}
      ${d.orders.map((o) => `<div class="card"><div class="row" style="justify-content:space-between"><b>${o.status === 'paid' ? (o.shippedAt ? '✅ Shipped' : '💰 Paid — to ship') : '⏳ Checkout started, not paid'}</b><span class="meta">${new Date(o.created).toLocaleString()}</span></div>
        <table>${o.lines.map((l) => `<tr><td>${l.qty} × ${esc(l.title)}</td><td style="text-align:right">${money(l.qty * l.unit)}</td></tr>`).join('')}<tr><td>Shipping</td><td style="text-align:right">${money(o.shipping || 0)}</td></tr></table>
        <div class="row" style="justify-content:space-between;margin-top:6px"><span class="meta">Order ${esc(o.ref)}${o.total != null ? ` · Paid ${money(o.total)} incl. tax` : ''}</span>${o.status === 'paid' ? `<button class="btn" data-ship="${esc(o.ref)}">${o.shippedAt ? 'Mark not shipped' : 'Mark shipped'}</button>` : ''}</div></div>`).join('') || '<p class="empty">No orders yet.</p>'}
      <h2>Messages &amp; custom requests</h2>
      ${d.inquiries.map((q) => `<div class="card" style="${q.status === 'done' ? 'opacity:.6' : ''}"><div class="row" style="justify-content:space-between"><b>${esc(q.kind)}${q.design ? ` · ${esc(q.design)}` : ''}</b><span class="meta">${new Date(q.created).toLocaleString()}</span></div>
        <p style="white-space:pre-wrap;margin:6px 0">${esc(q.message)}</p><p class="meta">${esc(q.name)} · ${esc(q.email)}</p>
        <div class="actions"><a class="btn primary" href="mailto:${encodeURIComponent(q.email)}?subject=${encodeURIComponent('Re: your ' + q.kind + ' request — Uncle Mike Can Do It')}">Reply by email</a>
        ${q.file ? `<a class="btn" href="/api/studio/inqfile/${esc(q.key.slice(4))}" target="_blank" rel="noopener">See their picture</a>` : ''}
        <button class="btn" data-inq="${esc(q.key)}" data-st="${q.status === 'done' ? 'new' : 'done'}">${q.status === 'done' ? 'Mark not done' : 'Mark done'}</button></div></div>`).join('') || '<p class="empty">No messages yet.</p>'}`;
  }
  document.addEventListener('click', async (e) => {
    if (tab !== 'inbox') return;
    const s = e.target.closest('[data-ship]'); if (s) { try { await api('shipped', { body: { ref: s.dataset.ship } }); renderInbox(); } catch (x) { toast(x.message); } }
    const q = e.target.closest('[data-inq]'); if (q) { try { await api('inquiry', { body: { key: q.dataset.inq, status: q.dataset.st } }); renderInbox(); } catch (x) { toast(x.message); } }
  });

  // ── Notes (creative notes + Brand Gate) ────────────────────────────
  let notes = null;
  async function renderNotes() {
    if (!notes) { $('#view').innerHTML = '<p class="empty">Loading…</p>'; try { notes = (await api('notes')).notes; } catch (x) { $('#view').innerHTML = `<p class="err">${esc(x.message)}</p>`; return; } }
    $('#view').innerHTML = `<h2>Creative notes</h2><p style="color:var(--mute);margin-top:-4px">Ideas, sayings, product plans. Run anything through your Brand Gate before it goes public — POST is a recommendation, you always decide.</p>
      <form id="note-new" class="card"><label>New note<textarea name="text" rows="3" maxlength="5000" placeholder="Idea for a sticker, a post, a project…" required></textarea></label><p><button class="btn primary" type="submit">Save note</button></p></form>
      ${notes.map((n, i) => `<div class="card" data-note="${i}"><textarea data-ntext rows="3" maxlength="5000">${esc(n.text)}</textarea>
        <details ${n.gate?.message ? 'open' : ''}><summary>Brand Gate — <span class="decision ${gateResult(n.gate).decision}">${gateResult(n.gate).decision}</span></summary>${gateHtml(n.gate, 'n' + i)}</details>
        <div class="actions" style="margin-top:8px"><button class="btn" data-nsave="${i}">Save</button><button class="btn danger" data-ndel="${i}">Delete</button><span class="meta" style="font-size:12px;color:var(--mute)">${new Date(n.created).toLocaleDateString()}</span></div></div>`).join('')}`;
  }
  async function saveNotes(msg) { try { notes = (await api('notes', { body: { notes } })).notes; toast(msg); } catch (x) { toast(x.message); } renderNotes(); }
  document.addEventListener('submit', (e) => { if (e.target.id !== 'note-new') return; e.preventDefault(); notes.unshift({ text: e.target.text.value, created: new Date().toISOString(), gate: {} }); saveNotes('Note saved.'); });
  document.addEventListener('click', async (e) => {
    if (tab !== 'notes') return;
    const s = e.target.closest('[data-nsave]'); if (s) { const i = Number(s.dataset.nsave); const card = s.closest('[data-note]'); notes[i].text = $('[data-ntext]', card).value; notes[i].gate = readGate($('.gate', card)); saveNotes('Saved.'); }
    const d = e.target.closest('[data-ndel]'); if (d && await ask('Delete this note?')) { notes.splice(Number(d.dataset.ndel), 1); saveNotes('Deleted.'); }
  });

  // ── Settings ───────────────────────────────────────────────────────
  async function renderSettings() {
    const d = S.draft, c = d.content;
    $('#view').innerHTML = `<h2>Prices</h2><form id="set-prices" class="card"><div class="grid2">${Object.entries(TYPE_NAMES).map(([k, v]) => `<label>${v}<input name="${k}" inputmode="decimal" value="${(d.prices[k] / 100).toFixed(2)}"></label>`).join('')}</div>
      <p style="font-size:12px;color:var(--mute)">Default price for new items of each type. To change existing items, select them in Products → Set price.</p><button class="btn primary" type="submit">Save prices</button></form>
      <h2>Shipping</h2><form id="set-ship" class="card"><div class="grid2"><label>Stickers &amp; sheets only (envelope)<input name="envelope" inputmode="decimal" value="${(d.shipping.envelope / 100).toFixed(2)}"></label>
      <label>Any hat or shirt (package)<input name="package" inputmode="decimal" value="${(d.shipping.package / 100).toFixed(2)}"></label>
      <label>Free shipping over (0 = never)<input name="freeOver" inputmode="decimal" value="${(d.shipping.freeOver / 100).toFixed(2)}"></label></div>
      <p style="font-size:12px;color:var(--mute)">Charged at checkout. Buy the actual labels in Pirate Ship using the Orders download.</p><button class="btn primary" type="submit">Save shipping</button></form>
      <h2>Homepage words</h2><form id="set-content" class="card">
      <label>Small line above the headline<input name="kicker" value="${esc(c.kicker)}" maxlength="80"></label>
      <div class="grid2"><label>Headline<input name="headline" value="${esc(c.headline)}" maxlength="60"></label><label>Headline, second line (orange)<input name="headline2" value="${esc(c.headline2)}" maxlength="60"></label></div>
      <label>Intro sentence<textarea name="lede" rows="2" maxlength="300">${esc(c.lede)}</textarea></label>
      <label>Hats heading<input name="hatsTitle" value="${esc(c.hatsTitle)}" maxlength="100"></label>
      <label>Hats text<textarea name="hatsText" rows="2" maxlength="300">${esc(c.hatsText)}</textarea></label>
      <label>Footer line<input name="footer" value="${esc(c.footer)}" maxlength="200"></label>
      <button class="btn primary" type="submit">Save words</button></form>
      <p style="font-size:12px;color:var(--mute)">Price, shipping and wording changes go live when you press Publish.</p>
      <h2>Backups</h2><div class="card" id="backups"><p class="empty">Loading…</p></div>
      <p><button class="btn" id="signout">Sign out</button></p>`;
    try {
      const h = await api('history');
      $('#backups').innerHTML = h.snapshots.length ? `<p style="font-size:13px;color:var(--mute)">Every publish saves the previous live version. Restoring puts that version back on the site immediately.</p>` + h.snapshots.slice(0, 15).map((s) => `<div class="row" style="justify-content:space-between;padding:4px 0">${new Date(s.at).toLocaleString()}<button class="btn" data-restore="${esc(s.key)}">Restore</button></div>`).join('') : '<p class="empty">No backups yet — one is made each time you publish.</p>';
    } catch {}
  }
  document.addEventListener('submit', async (e) => {
    const f = e.target; if (!['set-prices', 'set-ship', 'set-content'].includes(f.id)) return;
    e.preventDefault();
    const body = {};
    if (f.id === 'set-content') body.content = Object.fromEntries([...new FormData(f)].map(([k, v]) => [k, String(v)]));
    else { const vals = Object.fromEntries([...new FormData(f)].map(([k, v]) => [k, toCents(v)])); if (Object.values(vals).some((v) => !Number.isInteger(v) || v < 0)) return toast('Use amounts like 1.50 or 8.'); body[f.id === 'set-prices' ? 'prices' : 'shipping'] = vals; }
    try { const d = await api('settings', { body }); S.draft = d.draft; toast('Saved. Publish to put it on the site.'); await refreshState(); } catch (x) { toast(x.message, 5000); }
  });
  document.addEventListener('click', async (e) => {
    if (tab !== 'settings') return;
    const r = e.target.closest('[data-restore]');
    if (r && await ask('Put this older version back on the live site now?')) { try { await api('restore', { body: { key: r.dataset.restore } }); toast('Restored.'); await refreshState(); } catch (x) { toast(x.message); } }
    if (e.target.id === 'signout') { await api('logout', { body: {} }).catch(() => {}); S = null; showLogin(); }
  });

  load().then(fingerprintCatalog).catch(() => {});
})();
