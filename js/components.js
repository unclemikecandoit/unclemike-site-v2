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



/* =========================================================
   HEADER
   ========================================================= */

function renderSiteHeader() {
  const headerMount =
    document.getElementById("site-header");


  if (!headerMount) return;


  const root =
    getSiteRoot();


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
            <span>
              Make
            </span>
          </a>


          <a
            class="nav-button"
            href="${root}build/"
          >
            <span>
              Build
            </span>
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
            <span>
              About
            </span>
          </a>


        </nav>

      </div>

    </header>

  `;
}



/* =========================================================
   FOOTER
   ========================================================= */

function renderSiteFooter() {
  const footerMount =
    document.getElementById("site-footer");


  if (!footerMount) return;


  const root =
    getSiteRoot();


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



/* =========================================================
   WRENCH TRANSITION
   ========================================================= */

function createSiteToolTransition() {

  if (
    document.getElementById("site-tool-transition")
  ) {
    return;
  }


  const transition =
    document.createElement("div");


  transition.id =
    "site-tool-transition";


  transition.className =
    "site-tool-transition";


  transition.setAttribute(
    "aria-hidden",
    "true"
  );


  transition.innerHTML = `

    <div class="site-tool-transition-inner">


      <svg
        class="site-tool-wrench"
        viewBox="0 0 64 64"
        aria-hidden="true"
      >

        <path
          fill="currentColor"
          d="
            M54.3 7.8
            c-5.2-5.2-13.1-6.5-19.7-3.3
            l8.6 8.6
            -7.4 7.4
            -8.6-8.6
            c-3.2 6.6-1.9 14.5 3.3 19.7
            c1.8 1.8 3.9 3.1 6.2 4
            L14.1 58.2
            c-2.6 2.6-6.8 2.6-9.4 0
            s-2.6-6.8 0-9.4
            l22.6-22.6
            c-.9-2.3-2.2-4.4-4-6.2
            c-5.2-5.2-6.5-13.1-3.3-19.7
            l8.6 8.6
            7.4-7.4
            -8.6-8.6
            c6.6-3.2 14.5-1.9 19.7 3.3
            c6.5 6.5 6.9 16.8 1.3 23.8
            l-7.8-7.8
            -7.4 7.4
            7.8 7.8
            c7-5.6 7.4-15.9 1.3-22.6z
          "
        />

      </svg>


      <span class="site-tool-spark"></span>

      <span class="site-tool-spark"></span>

      <span class="site-tool-spark"></span>


    </div>

  `;


  document.body.appendChild(
    transition
  );

}



/* =========================================================
   INTERNAL LINK BEHAVIOR
   ========================================================= */

function initSiteLinkTransitions() {

  const transition =
    document.getElementById(
      "site-tool-transition"
    );


  if (!transition) return;


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  document.addEventListener(
    "click",
    (event) => {


      const link =
        event.target.closest("a[href]");


      if (!link) return;


      /*
        Do not interfere with modified clicks,
        new tabs, downloads, etc.
      */

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }


      if (
        link.hasAttribute("download")
      ) {
        return;
      }


      if (
        link.target &&
        link.target !== "_self"
      ) {
        return;
      }


      let destination;


      try {

        destination =
          new URL(
            link.href,
            window.location.href
          );

      }

      catch {

        return;

      }


      /*
        Only animate normal HTTP / HTTPS
        links on this same website.
      */

      if (
        destination.protocol !== "http:" &&
        destination.protocol !== "https:"
      ) {
        return;
      }


      if (
        destination.origin !==
        window.location.origin
      ) {
        return;
      }


      /*
        Same-page anchor?

        Let normal smooth scrolling handle it.
      */

      if (
        destination.pathname ===
          window.location.pathname &&
        destination.search ===
          window.location.search &&
        destination.hash
      ) {
        return;
      }


      /*
        Exact current URL?

        Nothing to do.
      */

      if (
        destination.href ===
        window.location.href
      ) {
        return;
      }


      /*
        Accessibility preference:
        don't artificially delay navigation.
      */

      if (reducedMotion) {
        return;
      }


      event.preventDefault();


      transition.classList.remove(
        "is-active"
      );


      /*
        Restart animation cleanly even if
        links are clicked quickly.
      */

      void transition.offsetWidth;


      transition.classList.add(
        "is-active"
      );


      window.setTimeout(
        () => {

          window.location.href =
            destination.href;

        },
        330
      );

    }
  );

}



/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function initScrollReveal() {

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reducedMotion) {
    return;
  }


  document.documentElement.classList.add(
    "has-reveal-motion"
  );


  const selector = [
    ".category-card",
    ".project-card",
    ".project-detail-card",
    ".video-card",
    ".project-media-placeholder"
  ].join(", ");


  const observer =
    new IntersectionObserver(

      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }


            entry.target.classList.add(
              "is-visible"
            );


            observer.unobserve(
              entry.target
            );

          }
        );

      },

      {
        threshold: 0.12,

        rootMargin:
          "0px 0px -25px 0px"
      }

    );


  function registerRevealElements(
    root = document
  ) {

    /*
      Root itself may be one of the cards.
    */

    if (
      root.matches &&
      root.matches(selector) &&
      !root.dataset.revealRegistered
    ) {

      root.dataset.revealRegistered =
        "true";


      root.classList.add(
        "scroll-reveal"
      );


      observer.observe(
        root
      );

    }


    /*
      Then find matching children.
    */

    if (
      !root.querySelectorAll
    ) {
      return;
    }


    root
      .querySelectorAll(selector)
      .forEach(
        (element) => {

          if (
            element.dataset.revealRegistered
          ) {
            return;
          }


          element.dataset.revealRegistered =
            "true";


          element.classList.add(
            "scroll-reveal"
          );


          observer.observe(
            element
          );

        }
      );

  }


  /*
    Catch everything already on the page.
  */

  registerRevealElements(
    document
  );


  /*
    BUILD and other pages inject content
    through JavaScript after components.js runs.

    This keeps the system automatic.
  */

  const mutationObserver =
    new MutationObserver(
      (mutations) => {

        mutations.forEach(
          (mutation) => {

            mutation.addedNodes.forEach(
              (node) => {

                if (
                  node.nodeType !== 1
                ) {
                  return;
                }


                registerRevealElements(
                  node
                );

              }
            );

          }
        );

      }
    );


  mutationObserver.observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );

}



/* =========================================================
   BOOT
   ========================================================= */

renderSiteHeader();

renderSiteFooter();

createSiteToolTransition();

initSiteLinkTransitions();

initScrollReveal();
