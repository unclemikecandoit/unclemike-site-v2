function renderSiteHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  /*
    Figure out how deep the current page is so the shared header
    works from the homepage, category pages, and project pages.
  */
  const path = window.location.pathname;
  let root = "./";

  if (path.includes("/build/ranchero/") || path.includes("/build/C10/")) {
    root = "../../";
  } else if (
    path.includes("/build/") ||
    path.includes("/make/") ||
    path.includes("/figure-it-out/") ||
    path.includes("/about/")
  ) {
    root = "../";
  }

  header.innerHTML = `
    <header class="site-header">
      <div class="wrap nav-wrap">

        <a
          class="site-logo"
          href="${root}"
          aria-label="Uncle Mike Can Do It — Home"
        >
          <img
            src="${root}uncle-mike-can-do-it-logo.png"
            alt="Uncle Mike Can Do It"
          >
        </a>

        <nav class="site-nav" aria-label="Main navigation">

          <a class="nav-button" href="${root}make/">
            <span>Make</span>
          </a>

          <a class="nav-button" href="${root}build/">
            <span>Build</span>
          </a>

          <a class="nav-button nav-button-wide" href="${root}figure-it-out/">
            <span>Figure It<br>Out</span>
          </a>

          <a class="nav-button" href="${root}about/">
            <span>About</span>
          </a>

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
        <span>Uncle Mike Can Do It</span>
        <span>Built · Fixed · Designed · Figured Out</span>
      </div>
    </footer>
  `;
}


renderSiteHeader();
renderSiteFooter();
