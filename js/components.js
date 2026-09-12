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
   UNCLE MIKE RESPONSE BANK
   ========================================================= */

const UNCLE_MIKE_TRANSITION_LINES = [

  {
    text: "FUCK AROUND. FIND OUT.",
    style: "wide"
  },

  {
    text: "THAT LOOKED EXPENSIVE.",
    style: "wide"
  },

  {
    text: "GIMME A MINUTE.",
    style: "normal"
  },

  {
    text: "THERE’S YOUR PROBLEM.",
    style: "normal"
  },

  {
    text: "WELL THAT AIN’T RIGHT.",
    style: "wide"
  },

  {
    text: "I KNOW A GUY…<br>THE GUY IS ME.",
    style: "stacked"
  },

  {
    text: "WE’RE GONNA NEED A BIGGER HAMMER.",
    style: "wide"
  },

  {
    text: "TECHNICALLY, IT WORKS.",
    style: "wide"
  },

  {
    text: "GOOD ENOUGH FOR WHO IT’S FOR.",
    style: "wide"
  },

  {
    text: "THAT’S A TOMORROW PROBLEM.",
    style: "wide"
  },

  {
    text: "YOU SAW NOTHING.",
    style: "normal"
  },

  {
    text: "JUST FUCKING SEND IT.",
    style: "wide"
  },

  {
    text: "HAVE YOU TRIED HITTING IT?",
    style: "wide"
  },

  {
    text: "CAN’T BE STUCK IF IT’S LIQUID.",
    style: "wide"
  },

  {
    text: "THIS IS WHY WE CAN’T HAVE NICE THINGS.",
    style: "wide"
  },

  {
    text: "THAT SOUNDED EXPENSIVE.",
    style: "wide"
  },

  {
    text: "LET HIM COOK.",
    style: "normal"
  },

  {
    text: "FOR LEGAL REASONS,<br>THAT’S A JOKE.",
    style: "stacked"
  },

  {
    text: "DON’T MAKE IT WEIRD.",
    style: "normal"
  },

  {
    text: "MOVING ON.",
    style: "short"
  },

  {
    text: "MY SAFEWORD IS<br>“PINEAPPLE JUICE.”",
    style: "stacked"
  },

  {
    text: "AUTISM HAS ENTERED THE CHAT.",
    style: "wide"
  },

  {
    text: "HYPERFIXATION ACTIVATED.",
    style: "wide"
  },

  {
    text: "WE’LL DO IT LIVE.",
    style: "normal"
  },

  {
    text: "WAIT TILL YOU SEE THIS SHIT.",
    style: "wide"
  }

];



/* =========================================================
   SHUFFLED DECK

   Every phrase is shown once before anything repeats.
   The remaining deck survives page navigation for the
   duration of the browser session.
   ========================================================= */

const UNCLE_MIKE_DECK_KEY =
  "uncleMikeTransitionDeckV1";


function shuffleArray(array) {
  const shuffled = [...array];

  for (
    let i = shuffled.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [
      shuffled[i],
      shuffled[j]
    ] = [
      shuffled[j],
      shuffled[i]
    ];
  }

  return shuffled;
}


function makeFreshTransitionDeck() {
  return shuffleArray(
    UNCLE_MIKE_TRANSITION_LINES.map(
      (_, index) => index
    )
  );
}


function getTransitionDeck() {
  try {
    const saved =
      sessionStorage.getItem(
        UNCLE_MIKE_DECK_KEY
      );

    if (saved) {
      const parsed =
        JSON.parse(saved);

      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.every(
          (index) =>
            Number.isInteger(index) &&
            index >= 0 &&
            index <
              UNCLE_MIKE_TRANSITION_LINES.length
        )
      ) {
        return parsed;
      }
    }
  }

  catch {
    /* If storage is unavailable, just use a fresh deck. */
  }

  return makeFreshTransitionDeck();
}


function saveTransitionDeck(deck) {
  try {
    sessionStorage.setItem(
      UNCLE_MIKE_DECK_KEY,
      JSON.stringify(deck)
    );
  }

  catch {
    /* Navigation still works if storage is unavailable. */
  }
}


function getNextTransitionLine() {
  let deck =
    getTransitionDeck();

  if (deck.length === 0) {
    deck =
      makeFreshTransitionDeck();
  }

  const nextIndex =
    deck.shift();

  saveTransitionDeck(deck);

  return (
    UNCLE_MIKE_TRANSITION_LINES[
      nextIndex
    ]
  );
}



/* =========================================================
   CREATE TRANSITION
   ========================================================= */

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
        getNextTransitionLine();


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
        1400
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
