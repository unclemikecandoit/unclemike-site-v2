// Bag, filters, checkout, inquiry and order confirmation. Prices shown here are
// for display only — the server re-prices every checkout from the catalog.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const dataEl = $('#catalog-data');
  const DATA = dataEl ? JSON.parse(dataEl.textContent) : { items: {}, ship: null };
  const CAT = DATA.items;
  const PACKAGE = new Set(['hat', 'tshirt', 'sweatshirt']);
  const shipFor = (ids, sub) => {
    const s = DATA.ship; if (!s) return 0;
    if (s.freeOver > 0 && sub >= s.freeOver) return 0;
    return ids.some((id) => PACKAGE.has(CAT[id].y)) ? s.package : s.envelope;
  };
  const KEY = 'um-bag-v2';
  const money = (c) => (c % 100 === 0 ? '$' + c / 100 : c < 100 ? c + '¢' : '$' + (c / 100).toFixed(2));
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = (b) => { try { localStorage.setItem(KEY, JSON.stringify(b)); } catch {} };
  let bag = load();
  // Drop anything no longer sold (only when we know the full catalog).
  if (dataEl) for (const id of Object.keys(bag)) if (!CAT[id]) delete bag[id];

  const dlg = $('#bag');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  function render() {
    const ids = Object.keys(bag).filter((id) => CAT[id]);
    const count = ids.reduce((n, id) => n + bag[id], 0);
    const sub = ids.reduce((n, id) => n + bag[id] * CAT[id].p, 0);
    $('#bag-count').textContent = count;
    $('#bag-subtotal').textContent = money(sub);
    const ship = count ? shipFor(ids, sub) : 0;
    $('#bag-ship').textContent = ship ? money(ship) : count ? 'Free' : '—';
    $('#bag-total').textContent = money(sub + ship);
    const s = DATA.ship;
    $('#bag-note').textContent = (s && s.freeOver > 0 && count && ship > 0 && sub < s.freeOver ? `Add ${money(s.freeOver - sub)} more for free shipping. ` : '') + 'Any sales tax is added at secure Square checkout.';
    $('#checkout').disabled = count === 0;
    $('#bag-lines').innerHTML = ids.length ? ids.map((id) => `<div class="line"><img src="${esc(CAT[id].i)}" alt=""><div><div class="t">${esc(CAT[id].t)}</div><div class="u">${money(CAT[id].p)} each</div></div>
      <div class="qty"><button type="button" data-dec="${esc(id)}" aria-label="One fewer ${esc(CAT[id].t)}">−</button><span>${bag[id]}</span><button type="button" data-inc="${esc(id)}" aria-label="One more ${esc(CAT[id].t)}">+</button></div></div>`).join('')
      : '<p class="empty">Your bag is empty. Go grab something funny.</p>';
    save(bag);
  }

  let toastTimer;
  function toast(msg) {
    let t = $('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
    t.innerHTML = `<span>${esc(msg)}</span><button type="button" data-open-bag>View bag</button>`;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), 3500);
  }

  const openBag = () => { render(); $('#bag-error').hidden = true; dlg.showModal(); };

  document.addEventListener('click', (e) => {
    const t = e.target.closest('button,a');
    if (!t) return;
    if (t.dataset.add) {
      const id = t.dataset.add;
      if (!CAT[id]) return;
      bag[id] = Math.min(100, (bag[id] || 0) + 1);
      render();
      const b = $('.bag-btn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
      t.classList.add('added'); const label = t.textContent; t.textContent = 'Added ✓';
      setTimeout(() => { t.classList.remove('added'); t.textContent = label; }, 1200);
      if (t.hasAttribute('data-open-after')) openBag(); else toast(`${CAT[id].t} added`);
    } else if (t.hasAttribute('data-open-bag')) { $('.toast')?.remove(); openBag(); }
    else if (t.dataset.inc) { bag[t.dataset.inc] = Math.min(100, bag[t.dataset.inc] + 1); render(); }
    else if (t.dataset.dec) { const id = t.dataset.dec; if (--bag[id] <= 0) delete bag[id]; render(); }
    else if (t.dataset.filter) setFilter(t.dataset.filter);
    else if (t.dataset.filterLink) setFilter(t.dataset.filterLink);
    if (t.hasAttribute('data-close-bag')) {
      dlg.close();
      // Pre-fill the request with what's in the bag so Mike can quote it.
      const f = $('#inquiry'), ids = Object.keys(bag).filter((id) => CAT[id]);
      if (f && ids.length && !f.message.value) f.message.value = 'Country: \nItems: ' + ids.map((id) => `${bag[id]} x ${CAT[id].t}`).join(', ');
      if (!f && ids.length) sessionStorage.setItem('um-inq-items', ids.map((id) => `${bag[id]} x ${CAT[id].t}`).join(', '));
    }
    if (t.dataset.kind) {
      const f = $('#inquiry');
      if (f) { f.kind.value = t.dataset.kind; if (t.dataset.design) f.design.value = t.dataset.design; }
      else sessionStorage.setItem('um-inq', JSON.stringify({ kind: t.dataset.kind, design: t.dataset.design || '' }));
    }
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

  // Filters + search
  let filter = 'all';
  function applyFilter() {
    const q = ($('#q')?.value || '').trim().toLowerCase();
    let shown = 0;
    for (const c of $$('#grid .card')) {
      const ok = (filter === 'all' || (filter === 'stickers' ? c.dataset.t === 'sticker' : c.dataset.c === filter)) && (!q || c.dataset.q.includes(q));
      c.hidden = !ok; if (ok) shown++;
    }
    const none = $('#none'); if (none) none.hidden = shown > 0;
  }
  function setFilter(f) {
    if (!$$('[data-filter]').some((b) => b.dataset.filter === f)) f = 'all'; // unknown quick link → show everything
    filter = f; $$('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === f))); applyFilter();
  }
  $('#q')?.addEventListener('input', applyFilter);

  // Checkout: server prices the cart and returns a Square-hosted payment page.
  $('#checkout').addEventListener('click', async (e) => {
    const btn = e.currentTarget, err = $('#bag-error');
    btn.disabled = true; btn.textContent = 'Opening secure checkout…'; err.hidden = true;
    try {
      const items = Object.entries(bag).filter(([id]) => CAT[id]).map(([id, qty]) => ({ id, qty }));
      const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok || !d.url) throw new Error(d.error || 'Checkout is unavailable right now.');
      location.href = d.url;
    } catch (x) {
      err.textContent = x.message; err.hidden = false; btn.disabled = false; btn.textContent = 'Checkout';
    }
  });

  // Inquiry form (pictures are shrunk on the phone before upload).
  const form = $('#inquiry');
  if (form) {
    try { const pre = JSON.parse(sessionStorage.getItem('um-inq')); if (pre) { form.kind.value = pre.kind; if (pre.design) form.design.value = pre.design; sessionStorage.removeItem('um-inq'); } } catch {}
    try { const items = sessionStorage.getItem('um-inq-items'); if (items) { form.message.value = 'Country: \nItems: ' + items; sessionStorage.removeItem('um-inq-items'); } } catch {}
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const st = $('#inq-status'), btn = form.querySelector('button[type=submit]');
      btn.disabled = true; st.className = 'wide fine'; st.textContent = 'Sending…';
      try {
        const fd = new FormData(form);
        const f = fd.get('file');
        if (f && f.size > 0 && /^image\/(jpeg|png|webp)$/.test(f.type)) fd.set('file', await shrink(f), 'picture.jpg');
        const r = await fetch('/api/inquiry', { method: 'POST', body: fd });
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.ok) throw new Error(d.error || 'Could not send. Please try again.');
        form.reset(); st.className = 'wide ok'; st.textContent = 'Sent! Mike will get back to you by email.';
      } catch (x) { st.className = 'wide err'; st.textContent = x.message; }
      btn.disabled = false;
    });
  }
  async function shrink(file) {
    try {
      const img = await createImageBitmap(file);
      const s = Math.min(1, 1600 / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      return await new Promise((res) => c.toBlob((b) => res(b || file), 'image/jpeg', 0.85));
    } catch { return file; }
  }

  // Order confirmation: only a server-verified Square payment counts as paid.
  const thanks = $('#thanks');
  if (thanks) {
    const ref = new URLSearchParams(location.search).get('ref') || '';
    let tries = 0;
    const check = async () => {
      tries++;
      try {
        const r = await fetch('/api/order/' + encodeURIComponent(ref));
        const d = await r.json().catch(() => ({}));
        if (r.status === 404) return show('notfound');
        if (d.ok && d.paid) {
          // Remove only what was purchased.
          for (const l of d.lines) { if (bag[l.id]) { bag[l.id] -= l.qty; if (bag[l.id] <= 0) delete bag[l.id]; } }
          render();
          $('#thanks-lines').innerHTML = '<ul class="lines">' + d.lines.map((l) => `<li><span>${l.qty} × ${esc(l.title)}</span><b>${money(l.qty * l.unit)}</b></li>`).join('') + '</ul>';
          return show('paid');
        }
      } catch {}
      if (tries < 8) setTimeout(check, Math.min(1500 * tries, 6000)); else show('pending');
    };
    const show = (s) => {
      thanks.dataset.state = s;
      const [h, m] = {
        paid: ['Thank you! Your order is in.', 'Payment confirmed. Square is emailing your receipt, and Mike will get your order packed up.'],
        pending: ['We haven’t seen your payment yet.', 'If you finished paying, it can take a minute — refresh this page shortly. Your bag is saved, so nothing is lost.'],
        notfound: ['We couldn’t find that order.', 'If you were charged, reply to your Square receipt email and Mike will sort it out.'],
      }[s];
      $('h1', thanks).textContent = h; $('#thanks-msg').textContent = m;
    };
    check();
  }

  render();
})();
