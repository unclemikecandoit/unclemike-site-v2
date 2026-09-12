function renderSiteHeader() {
  const header = document.getElementById("site-header");

  if (!header) return;

  header.innerHTML = `
    <header class="site-header">
      <div class="wrap nav-wrap">

        <a class="site-logo" href="/">
          Uncle Mike Can Do It
        </a>

        <nav class="site-nav" aria-label="Main navigation">
          <a href="/make/">Make</a>
          <a href="/build/">Build</a>
          <a href="/figure-it-out/">Figure It Out</a>
          <a href="/about/">About</a>
        </nav>

      </div>
    </header>
  `;
}


function renderSiteFooter() {
  const footer = document.getElementById("site-footer");

  if (!footer) return;

  footer.innerHTML = `
    <footer class="site-footer">
      <div class="wrap footer-wrap">

        <span>
          Uncle Mike Can Do It
        </span>

        <span>
          Built · Fixed · Designed · Figured Out
        </span>

      </div>
    </footer>
  `;
}


renderSiteHeader();
renderSiteFooter();
