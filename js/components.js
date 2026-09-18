/* =========================================================
   UNCLE MIKE — SHARED SITE SYSTEM
   Persistent navigation + transitions + video management
   ========================================================= */


/* =========================================================
   SITE ROOT
   ========================================================= */

function getSiteRoot() {
  const path = window.location.pathname;

  if (
    path.includes("/build/ranchero/") ||
    path.includes("/build/C10/") ||
    path.includes("/make/crooked-gate/")
  ) {
    return "../../";
  }

  if (
    path.includes("/build/") ||
    path.includes("/make/") ||
    path.includes("/figure-it-out/") ||
    path.includes("/about/") ||
    path.includes("/contact/")
  ) {
    return "../";
  }

  return "./";
}



/* =========================================================
   ROUTES
   ========================================================= */

const UNCLE_MIKE_ROUTES = {
  "/": {
    script: "/js/home.js",
    renderer: "renderHomePage",
    title: "Uncle Mike Can Do It"
  },

  "/make/": {
    script: "/js/make.js",
    renderer: "renderMakePage",
    title: "Make | Uncle Mike Can Do It"
  },

  "/build/": {
    script: "/js/build.js",
    renderer: "renderBuildPage",
    title: "Builds | Uncle Mike Can Do It"
  },

  "/figure-it-out/": {
    script: "/js/figure-it-out.js",
    renderer: "renderFigureItOutPage",
    title: "Figure It Out | Uncle Mike Can Do It"
  },

  "/about/": {
    script: "/js/about.js",
    renderer: "renderAboutPage",
    title: "About | Uncle Mike Can Do It"
  },

  "/contact/": {
    script: "/js/contact.js",
    renderer: "renderContactPage",
    title: "Contact | Uncle Mike Can Do It"
  },

  "/build/ranchero/": {
    script: "/js/ranchero.js",
    renderer: "renderRancheroPage",
    title: "1965 Ford Ranchero | Uncle Mike Can Do It"
  },

  "/build/C10/": {
    script: "/js/c10.js",
    renderer: "renderC10Page",
    title: "1972 Chevy C10 | Uncle Mike Can Do It"
  },

  "/make/crooked-gate/": {
    script: "/js/crooked-gate.js",
    renderer: "renderCrookedGatePage",
    title: "Crooked Gate Seasonings | Uncle Mike Can Do It"
  }
};


function normalizeRoutePath(pathname) {
  let path = pathname || "/";

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  if (
    path !== "/" &&
    !path.endsWith("/")
  ) {
    path += "/";
  }

  return path;
}


function getCurrentRoute() {
  return normalizeRoutePath(
    window.location.pathname
  );
}


function getRouteConfig(pathname) {
  const path =
    normalizeRoutePath(pathname);

  return (
    UNCLE_MIKE_ROUTES[path] ||
    null
  );
}



/* =========================================================
   ROUTER STATE
   ========================================================= */

window.UNCLE_MIKE_ROUTER_ACTIVE = true;

const loadedRouteScripts =
  new Map();

let siteNavigationRunning = false;



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
            src="${root}B9AEDA13-4CAE-4E5F-8631-0932FD665538.png"
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
              Let's Make<br>
              It
            </span>
          </a>

          <a
            class="nav-button"
            href="${root}build/"
          >
            <span>Builds</span>
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
              About<br>
              Me
            </span>
          </a>

          <a
            class="nav-button"
            href="${root}contact/"
          >
            <span>Contact</span>
          </a>
        </nav>

      </div>
    </header>
  `;
}



/* =========================================================
   SHARED CONTACT CTA
   ========================================================= */

function getContactCTA() {
  const path =
    window.location.pathname;

  const root =
    getSiteRoot();

  const isContact =
    path.includes("/contact/");


  if (isContact) {
    return "";
  }


  return `
    <section class="site-contact-cta">

      <div class="wrap">

        <div class="site-contact-cta-inner">

          <p class="site-contact-eyebrow">
            Ready To Make It Happen?
          </p>

          <h2>
            Contact Me.
          </h2>

          <p class="site-contact-copy">
            Got an idea, a project, or a problem
            that needs figuring out?
            Tell me what you're trying to make happen.
          </p>

          <a
            class="site-contact-button"
            href="${root}contact/"
          >
            Let's Do It →
          </a>

        </div>

      </div>

    </section>
  `;
}



/* =========================================================
   SHARED BOTTOM NAVIGATION
   ========================================================= */

function getBottomNavigation() {
  const path =
    window.location.pathname;

  const root =
    getSiteRoot();


  const isMake =
    path.includes("/make/");

  const isBuild =
    path.includes("/build/");

  const isFigure =
    path.includes("/figure-it-out/");

  const isAbout =
    path.includes("/about/");

  const isContact =
    path.includes("/contact/");


  const isMakeProject =
    path.includes("/make/crooked-gate/");

  const isBuildProject =
    path.includes("/build/ranchero/") ||
    path.includes("/build/C10/");


  const isHome =
    !isMake &&
    !isBuild &&
    !isFigure &&
    !isAbout &&
    !isContact;


  if (isHome) {
    return "";
  }


  let parentLink = "";


  if (isMakeProject) {
    parentLink = `
      <a
        class="site-bottom-link site-bottom-parent"
        href="${root}make/"
      >
        ← Let's Make It
      </a>
    `;
  }


  if (isBuildProject) {
    parentLink = `
      <a
        class="site-bottom-link site-bottom-parent"
        href="${root}build/"
      >
        ← Builds
      </a>
    `;
  }


  const homeLink = `
    <a
      class="site-bottom-link"
      href="${root}"
    >
      ← Home
    </a>
  `;


  const aboutLink =
    isAbout
      ? ""
      : `
        <a
          class="site-bottom-link site-bottom-about"
          href="${root}about/"
        >
          About Me →
        </a>
      `;


  return `
    <section class="site-bottom-navigation">

      <div class="wrap">

        <p class="site-bottom-eyebrow">
          Keep Looking
        </p>

        <nav
          class="site-bottom-links"
          aria-label="Page navigation"
        >

          ${parentLink}

          ${homeLink}

          ${aboutLink}

        </nav>

      </div>

    </section>
  `;
}



/* =========================================================
   SHARED CTA + BOTTOM NAV STYLES
   ========================================================= */

function injectSharedNavigationStyles() {
  if (
    document.getElementById(
      "site-shared-navigation-styles"
    )
  ) {
    return;
  }


  const style =
    document.createElement("style");


  style.id =
    "site-shared-navigation-styles";


  style.textContent = `

    .site-contact-cta {
      padding:
        clamp(78px, 10vw, 125px)
        0;

      border-top:
        1px solid
        rgba(234, 215, 173, 0.2);
    }


    .site-contact-cta-inner {
      max-width:
        820px;
    }


    .site-contact-eyebrow {
      margin:
        0
        0
        16px;

      color:
        var(--muted);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size:
        0.78rem;

      font-weight:
        800;

      letter-spacing:
        0.18em;

      text-transform:
        uppercase;
    }


    .site-contact-cta h2 {
      margin:
        0
        0
        22px;

      color:
        var(--paper);

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size:
        clamp(
          3rem,
          8vw,
          6.5rem
        );

      line-height:
        0.9;

      letter-spacing:
        -0.04em;
    }


    .site-contact-copy {
      max-width:
        650px;

      margin:
        0
        0
        30px;

      color:
        var(--copy);

      font-size:
        clamp(
          1rem,
          2vw,
          1.2rem
        );

      line-height:
        1.55;
    }


    .site-contact-button {
      display:
        inline-block;

      padding:
        15px
        20px;

      border:
        1px solid
        var(--paper);

      background:
        var(--paper);

      color:
        var(--ink);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size:
        0.9rem;

      font-weight:
        900;

      letter-spacing:
        0.11em;

      line-height:
        1;

      text-decoration:
        none;

      text-transform:
        uppercase;

      transition:
        transform
        160ms ease,
        opacity
        160ms ease;
    }


    .site-contact-button:hover {
      transform:
        translateY(-2px);

      opacity:
        0.86;
    }


    .site-bottom-navigation {
      padding:
        clamp(70px, 10vw, 120px)
        0
        clamp(70px, 9vw, 105px);

      border-top:
        1px solid
        rgba(234, 215, 173, 0.2);
    }


    .site-bottom-eyebrow {
      margin:
        0
        0
        24px;

      color:
        var(--muted);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size:
        0.78rem;

      font-weight:
        800;

      letter-spacing:
        0.18em;

      text-transform:
        uppercase;
    }


    .site-bottom-links {
      display:
        flex;

      flex-wrap:
        wrap;

      align-items:
        center;

      gap:
        16px 34px;
    }


    .site-bottom-link {
      display:
        inline-block;

      color:
        var(--paper);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size:
        clamp(
          0.88rem,
          2.5vw,
          1.05rem
        );

      font-weight:
        800;

      line-height:
        1.2;

      letter-spacing:
        0.11em;

      text-decoration:
        underline;

      text-decoration-thickness:
        1px;

      text-underline-offset:
        5px;

      text-transform:
        uppercase;

      transition:
        opacity
        160ms ease,
        transform
        160ms ease;
    }


    .site-bottom-link:hover {
      opacity:
        0.72;

      transform:
        translateY(-1px);
    }


    .site-bottom-parent {
      margin-right:
        auto;
    }


    .site-bottom-about {
      margin-left:
        auto;
    }


    @media (
      max-width: 620px
    ) {

      .site-contact-cta {
        padding:
          68px
          0;
      }


      .site-contact-cta h2 {
        font-size:
          clamp(
            3rem,
            15vw,
            4.8rem
          );
      }


      .site-contact-button {
        box-sizing:
          border-box;

        width:
          100%;

        padding:
          17px
          20px;

        text-align:
          center;
      }


      .site-bottom-links {
        display:
          grid;

        grid-template-columns:
          1fr 1fr;

        gap:
          24px 20px;
      }


      .site-bottom-parent {
        grid-column:
          1 / -1;

        margin-right:
          0;
      }


      .site-bottom-about {
        margin-left:
          0;

        text-align:
          right;
      }

    }

  `;


  document.head.appendChild(
    style
  );
}



/* =========================================================
   REMOVE OLD PAGE-SPECIFIC BACK LINKS
   ========================================================= */

function removeLegacyBackLinks() {
  const page =
    document.getElementById(
      "page-content"
    );

  if (!page) return;


  const legacyLabels = [
    "BACK TO MAKE",
    "BACK TO BUILD",
    "BACK TO FIGURE IT OUT",
    "BACK HOME"
  ];


  page
    .querySelectorAll("a[href]")
    .forEach(
      (link) => {

        const label =
          link.textContent
            .replace(/[←→]/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .toUpperCase();


        if (
          legacyLabels.includes(
            label
          )
        ) {
          link.remove();
        }

      }
    );
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

    ${getContactCTA()}

    ${getBottomNavigation()}

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
   PERSISTENT SHOP RADIO MOUNT
   This element NEVER gets replaced during internal navigation.
   ========================================================= */

function createShopRadioMount() {
  if (
    document.getElementById(
      "shop-radio"
    )
  ) {
    return;
  }


  const radio =
    document.createElement("div");

  radio.id =
    "shop-radio";

  radio.setAttribute(
    "aria-label",
    "Uncle Mike's Shop Radio"
  );


  const footerMount =
    document.getElementById(
      "site-footer"
    );


  if (footerMount) {
    document.body.insertBefore(
      radio,
      footerMount
    );
  }

  else {
    document.body.appendChild(
      radio
    );
  }
}



/* =========================================================
   LOAD PERSISTENT SHOP RADIO
   ========================================================= */

function loadShopRadio() {
  if (
    document.querySelector(
      'script[data-shop-radio-script="true"]'
    )
  ) {
    return;
  }


  const script =
    document.createElement("script");


  script.src =
    "/js/shop-radio.js";

  script.dataset.shopRadioScript =
    "true";


  document.head.appendChild(
    script
  );
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
   SHUFFLED TRANSITION DECK
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
    /* Use a fresh deck. */
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
    /* Navigation still works. */
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
   ROUTE SCRIPT LOADER
   ========================================================= */

function loadRouteScript(route) {
  const config =
    getRouteConfig(route);

  if (!config) {
    return Promise.reject(
      new Error(
        `Unknown route: ${route}`
      )
    );
  }


  const existingRenderer =
    window[config.renderer];


  if (
    typeof existingRenderer ===
    "function"
  ) {
    return Promise.resolve();
  }


  if (
    loadedRouteScripts.has(
      config.script
    )
  ) {
    return loadedRouteScripts.get(
      config.script
    );
  }


  const promise =
    new Promise(
      (resolve, reject) => {

        const script =
          document.createElement(
            "script"
          );


        script.src =
          config.script;

        script.async =
          true;


        script.onload =
          () => {

            if (
              typeof window[
                config.renderer
              ] !== "function"
            ) {
              reject(
                new Error(
                  `Renderer ${config.renderer} was not found.`
                )
              );

              return;
            }


            resolve();
          };


        script.onerror =
          () => {
            reject(
              new Error(
                `Could not load ${config.script}`
              )
            );
          };


        document.head.appendChild(
          script
        );

      }
    );


  loadedRouteScripts.set(
    config.script,
    promise
  );


  return promise;
}



/* =========================================================
   PRELOAD ROUTE RENDERERS
   ========================================================= */

function preloadRouteRenderers() {
  Object.keys(
    UNCLE_MIKE_ROUTES
  ).forEach(
    (route) => {

      loadRouteScript(route)
        .catch(() => {
          /*
           * Do nothing here.
           * If a route cannot preload,
           * normal navigation remains
           * available as fallback.
           */
        });

    }
  );
}



/* =========================================================
   VIDEO MANAGEMENT
   ========================================================= */

let videoVisibilityObserver = null;


function pauseAllPageVideos(
  exceptVideo = null
) {
  const page =
    document.getElementById(
      "page-content"
    );

  if (!page) return;


  page
    .querySelectorAll("video")
    .forEach(
      (video) => {

        if (
          video === exceptVideo
        ) {
          return;
        }


        if (!video.paused) {
          video.pause();
        }

      }
    );
}


function initPageVideoManagement() {
  const page =
    document.getElementById(
      "page-content"
    );

  if (!page) return;


  if (videoVisibilityObserver) {
    videoVisibilityObserver.disconnect();
  }


  videoVisibilityObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            const video =
              entry.target;


            if (
              !entry.isIntersecting ||
              entry.intersectionRatio < 0.15
            ) {
              if (!video.paused) {
                video.pause();
              }
            }

          }
        );

      },
      {
        threshold: [
          0,
          0.15,
          0.5,
          1
        ]
      }
    );


  page
    .querySelectorAll("video")
    .forEach(
      (video) => {

        videoVisibilityObserver.observe(
          video
        );


        video.addEventListener(
          "play",
          () => {
            pauseAllPageVideos(
              video
            );
          }
        );

      }
    );
}



/* =========================================================
   SCROLL REVEAL
   ========================================================= */

let revealObserver = null;


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


  if (revealObserver) {
    revealObserver.disconnect();
  }


  revealObserver =
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


            revealObserver.unobserve(
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


  document
    .querySelectorAll(selector)
    .forEach(
      (element) => {

        element.classList.add(
          "scroll-reveal"
        );


        delete element.dataset
          .revealRegistered;


        revealObserver.observe(
          element
        );

      }
    );
}



/* =========================================================
   RENDER CURRENT ROUTE
   ========================================================= */

async function renderCurrentRoute() {
  const route =
    getCurrentRoute();

  const config =
    getRouteConfig(route);


  if (!config) {
    return false;
  }


  try {
    await loadRouteScript(
      route
    );
  }

  catch (error) {
    return false;
  }


  const renderer =
    window[config.renderer];


  if (
    typeof renderer !==
    "function"
  ) {
    return false;
  }


  renderer();


  document.title =
    config.title;


  renderSiteHeader();

  renderSiteFooter();

  removeLegacyBackLinks();

  initScrollReveal();

  initPageVideoManagement();


  return true;
}



/* =========================================================
   INTERNAL NAVIGATION
   ========================================================= */

async function navigateTo(
  destination,
  options = {}
) {
  const {
    replace = false,
    scroll = true
  } = options;


  const url =
    destination instanceof URL
      ? destination
      : new URL(
          destination,
          window.location.href
        );


  const route =
    normalizeRoutePath(
      url.pathname
    );


  const config =
    getRouteConfig(route);


  if (!config) {
    window.location.href =
      url.href;

    return;
  }


  try {
    await loadRouteScript(
      route
    );
  }

  catch {
    window.location.href =
      url.href;

    return;
  }


  pauseAllPageVideos();


  if (replace) {
    history.replaceState(
      {
        uncleMikeRoute: route
      },
      "",
      url.href
    );
  }

  else {
    history.pushState(
      {
        uncleMikeRoute: route
      },
      "",
      url.href
    );
  }


  const rendered =
    await renderCurrentRoute();


  if (!rendered) {
    window.location.href =
      url.href;

    return;
  }


  if (url.hash) {
    const target =
      document.querySelector(
        url.hash
      );


    if (target) {
      target.scrollIntoView();
    }
  }

  else if (scroll) {
    window.scrollTo(
      {
        top: 0,
        left: 0,
        behavior: "instant"
      }
    );
  }
}



/* =========================================================
   TRANSITION + INTERNAL LINK HANDLING
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


  document.addEventListener(
    "click",
    async (event) => {

      const link =
        event.target.closest(
          "a[href]"
        );


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
        link.hasAttribute(
          "download"
        )
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
        destination.protocol !==
          "http:" &&
        destination.protocol !==
          "https:"
      ) {
        return;
      }


      if (
        destination.origin !==
        window.location.origin
      ) {
        return;
      }


      const sameDocument =
        destination.pathname ===
          window.location.pathname &&
        destination.search ===
          window.location.search;


      if (
        sameDocument &&
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


      const destinationRoute =
        normalizeRoutePath(
          destination.pathname
        );


      if (
        !getRouteConfig(
          destinationRoute
        )
      ) {
        return;
      }


      event.preventDefault();


      if (siteNavigationRunning) {
        return;
      }


      siteNavigationRunning =
        true;


      if (reducedMotion) {
        await navigateTo(
          destination
        );

        siteNavigationRunning =
          false;

        return;
      }


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
        async () => {

          await navigateTo(
            destination
          );


          window.setTimeout(
            () => {
              siteNavigationRunning =
                false;
            },
            350
          );

        },
        700
      );

    }
  );
}



/* =========================================================
   BACK / FORWARD
   ========================================================= */

function initHistoryNavigation() {
  window.addEventListener(
    "popstate",
    async () => {

      if (siteNavigationRunning) {
        return;
      }


      siteNavigationRunning =
        true;


      pauseAllPageVideos();


      const rendered =
        await renderCurrentRoute();


      if (!rendered) {
        window.location.reload();
        return;
      }


      if (window.location.hash) {
        const target =
          document.querySelector(
            window.location.hash
          );


        if (target) {
          target.scrollIntoView();
        }
      }

      else {
        window.scrollTo(
          {
            top: 0,
            left: 0,
            behavior: "instant"
          }
        );
      }


      siteNavigationRunning =
        false;

    }
  );
}



/* =========================================================
   BOOT
   ========================================================= */

async function bootUncleMikeSite() {

  injectSharedNavigationStyles();

  createSiteTransition();

  createShopRadioMount();

  loadShopRadio();


  /*
   * Render shared chrome immediately.
   */
  renderSiteHeader();

  renderSiteFooter();


  /*
   * The page-specific script in each
   * HTML shell will NOT self-render now
   * because ROUTER_ACTIVE is true.
   *
   * So components.js renders the initial
   * route itself.
   */
  const rendered =
    await renderCurrentRoute();


  if (!rendered) {
    window.UNCLE_MIKE_ROUTER_ACTIVE =
      false;

    return;
  }


  initSiteLinkTransitions();

  initHistoryNavigation();


  preloadRouteRenderers();
}


bootUncleMikeSite();
