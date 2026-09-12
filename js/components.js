function getSiteRoot() {
  const path = window.location.pathname;

  /*
    GitHub Pages project site:
    /unclemike-site-v2/

    We calculate the path back to the repo root depending
    on how deep the current page is.
  */

  if (
    path.includes("/build/ranchero/") ||
    path.includes("/build/C10/")
  ) {
    return "../../";
  }

  if (
    path.includes("/build/") ||
    path.includes("/make/") ||
    path.includes("/figure-it-out/") ||
    path.includes("/about/")
  ) {
    return "../";
  }

  return "./";
}


function renderSiteHeader() {
  const headerMount = document.getElementById("site-header");

  if (!headerMount) return;

  const root = getSiteRoot();

  headerMount.innerHTML = `
    <header class="site-header">

      <div class="wrap nav-wrap">

        <a
          class="site-logo"
          href="${root}"
          aria-label="Uncle Mike Can Do It — Home"
        >
          <img
            src="${root}5DC2AA26-E6DE-4633-9476-78BF6FE3118C.png"
            alt="Uncle Mike Can Do It"
          >
        </a>


        <nav
          class="site-nav"
          aria-label="Main navigation"
        >

          <a
            class="nav-button"
            href="${root}make/"
          >
            <span>Make</span>
          </a>


          <a
            class="nav-button"
            href="${root}build/"
          >
            <span>Build</span>
          </a>


          <a
            class="nav-button nav-button-wide"
            href="${root}figure-it-out/"
          >
            <span>
              Figure It<br>
              Out
            </span>
          </a>


          <a
            class="nav-button"
            href="${root}about/"
          >
            <span>About</span>
          </a>

        </nav>

      </div>

    </header>
  `;
}


function renderSiteFooter() {
  const footerMount = document.getElementById("site-footer");

  if (!footerMount) return;

  const root = getSiteRoot();

  footerMount.innerHTML = `
    <footer class="site-footer">

      <div class="wrap footer-wrap">

        <a
          href="${root}"
          style="text-decoration:none;"
        >
          Uncle Mike Can Do It
        </a>

        <span>
          Built · Fixed · Designed · Figured Out
        </span>

      </div>

    </footer>
  `;
}


renderSiteHeader();
renderSiteFooter();
