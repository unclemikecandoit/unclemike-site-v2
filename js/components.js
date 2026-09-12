function getSiteRoot() {
  const path = window.location.pathname;

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



/* =========================================================
   FOOTER
   ========================================================= */

function renderSiteFooter() {
  const footerMount =
    document.getElementById("site-footer");

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



/* =========================================================
   UNCLE MIKE TRANSITION
   ========================================================= */

const UNCLE_MIKE_TRANSITION_LINES = [
  {
    text: "DOLLAR DOLLAR BILLS Y’ALL",
    style: "wide"
  },
  {
    text: "HOLD MY WRENCH",
    style: "normal"
  },
  {
    text: "WELL, FUCK.",
    style: "short"
  },
  {
    text: "I CAN FIX THAT",
    style: "normal"
  },
  {
    text: "SEEMS UNRELATED.<br>IT ISN’T.",
    style: "stacked"
  },
  {
    text: "FUCK IT, I CAN MAKE THAT",
    style: "wide"
  },
  {
    text: "PROBABLY FINE",
    style: "normal"
  },
  {
    text: "PATTERN RECOGNIZED",
    style: "normal"
  },
  {
    text: "THIS SEEMS EXPENSIVE",
    style: "wide"
  },
  {
    text: "WHAT COULD GO WRONG?",
    style: "wide"
  }
];


function createSiteTransition() {
  if (
    document.getElementById(
      "site-text-transition"
    )
  ) {
    return;
  }

  const transition =
    document.createElement("div");

  transition.id =
    "site-text-transition";

  transition.className =
    "site-text-transition";

  transition.setAttribute(
    "aria-hidden",
    "true"
  );

  transition.innerHTML = `
    <div class="site-text-transition-inner">
      <div class="site-transition-line"></div>
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
      "site-text-transition"
    );

  if (!transition) return;

  const line =
    transition.querySelector(
      ".site-transition-line"
    );

  if (!line) return;

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  let transitionRunning = false;


  document.addEventListener(
    "click",
    (event) => {

      const link =
        event.target.closest("a[href]");

      if (!link) return;


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


      if (
        destination.pathname ===
          window.location.pathname &&
        destination.search ===
          window.location.search &&
        destination.hash
      ) {
        return;
      }


      if (
        destination.href ===
        window.location.href
      ) {
        return;
      }


      if (reducedMotion) {
        return;
      }


      if (transitionRunning) {
        event.preventDefault();
        return;
      }


      event.preventDefault();

      transitionRunning = true;


      const choice =
        UNCLE_MIKE_TRANSITION_LINES[
          Math.floor(
            Math.random() *
            UNCLE_MIKE_TRANSITION_LINES.length
          )
        ];


      line.innerHTML =
        choice.text;

      line.className =
        `site-transition-line is-${choice.style}`;


      transition.classList.remove(
        "is-active"
      );

      void transition.offsetWidth;

      transition.classList.add(
        "is-active"
      );


      window.setTimeout(
        () => {
          window.location.href =
            destination.href;
        },
        850
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

            if (!entry.isIntersecting) {
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


    if (!root.querySelectorAll) {
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


  registerRevealElements(
    document
  );


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

createSiteTransition();

initSiteLinkTransitions();

initScrollReveal();
