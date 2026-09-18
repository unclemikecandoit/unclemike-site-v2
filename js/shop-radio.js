/* =========================================================
   UNCLE MIKE'S SHOP RADIO
   Persistent expandable Spotify player
   ========================================================= */

(function initShopRadio() {
  const mount =
    document.getElementById("shop-radio");

  if (!mount) return;

  if (mount.dataset.radioReady === "true") {
    return;
  }

  mount.dataset.radioReady = "true";


  /* =======================================================
     PLAYLIST
     ======================================================= */

  const PLAYLIST_URL =
    "https://open.spotify.com/playlist/4IaHVqj1E8kTJvVVgLYzMK?si=XrKSnTQnQUaNwQTKKNCPRg&utm_source=sms&pi=5V8ykTZZSOGr8";


  /* =======================================================
     STATE
     ======================================================= */

  let controller = null;
  let playerReady = false;
  let isPlaying = false;


  /* =======================================================
     HTML
     ======================================================= */

  mount.innerHTML = `

    <aside
      class="shop-radio"
      aria-label="Uncle Mike's Shop Radio"
    >

      <section
        class="shop-radio-panel"
        aria-hidden="true"
      >

        <div class="shop-radio-panel-top">

          <div class="shop-radio-panel-brand">

            <span class="shop-radio-panel-kicker">
              Uncle Mike's
            </span>

            <strong class="shop-radio-panel-title">
              Shop Radio
            </strong>

          </div>


          <button
            class="shop-radio-close"
            type="button"
            aria-label="Collapse Shop Radio"
          >
            ×
          </button>

        </div>


        <div class="shop-radio-screen">

          <span>
            Now Playing
          </span>

          <strong>
            Garage Songs For A Better Tomorrow
          </strong>

        </div>


        <div class="shop-radio-player-window">

          <div
            id="shop-radio-spotify-engine"
            class="shop-radio-spotify-engine"
          ></div>

        </div>


        <div class="shop-radio-controls">

          <button
            class="shop-radio-control shop-radio-previous"
            type="button"
            aria-label="Previous track"
          >
            ⏮
          </button>


          <button
            class="shop-radio-control shop-radio-big-play"
            type="button"
            aria-label="Play Shop Radio"
          >
            <span
              class="shop-radio-big-play-icon"
              aria-hidden="true"
            >
              ▶
            </span>
          </button>


          <button
            class="shop-radio-control shop-radio-next"
            type="button"
            aria-label="Next track"
          >
            ⏭
          </button>

        </div>


        <div class="shop-radio-panel-bottom">

          <span>
            Music Makes The Work Go Faster.
          </span>

          <a
            href="${PLAYLIST_URL}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Spotify ↗
          </a>

        </div>

      </section>


      <div class="shop-radio-face">

        <button
          class="shop-radio-expand"
          type="button"
          aria-label="Open Shop Radio playlist"
          aria-expanded="false"
        >

          <span
            class="shop-radio-note"
            aria-hidden="true"
          >
            ♫
          </span>


          <span class="shop-radio-copy">

            <span class="shop-radio-kicker">
              Uncle Mike's
            </span>

            <strong class="shop-radio-title">
              Shop Radio
            </strong>

          </span>

        </button>


        <button
          class="shop-radio-play"
          type="button"
          aria-label="Play Shop Radio"
        >

          <span
            class="shop-radio-play-icon"
            aria-hidden="true"
          >
            ▶
          </span>

        </button>

      </div>

    </aside>

  `;


  /* =======================================================
     STYLES
     ======================================================= */

  if (
    !document.getElementById(
      "uncle-mike-shop-radio-styles"
    )
  ) {

    const style =
      document.createElement("style");


    style.id =
      "uncle-mike-shop-radio-styles";


    style.textContent = `

      /* =====================================================
         MOUNT
         ===================================================== */

      #shop-radio {
        position:
          fixed;

        right:
          7px;

        bottom:
          7px;

        z-index:
          8500;

        width:
          160px;

        font-family:
          Arial,
          Helvetica,
          sans-serif;

        --spotify-green:
          #1DB954;

        --spotify-green-bright:
          #1ed760;
      }


      .shop-radio {
        position:
          relative;

        width:
          100%;
      }


      /* =====================================================
         TINY FACEPLATE
         ===================================================== */

      .shop-radio-face {
        position:
          relative;

        z-index:
          2;

        display:
          grid;

        grid-template-columns:
          minmax(0, 1fr)
          30px;

        align-items:
          stretch;

        box-sizing:
          border-box;

        width:
          100%;

        min-height:
          40px;

        border:
          1px solid
          rgba(29, 185, 84, 0.72);

        background:
          linear-gradient(
            145deg,
            #171816,
            #080908 72%
          );

        box-shadow:
          0 8px 24px
          rgba(0, 0, 0, 0.55),
          inset 0 0 0 1px
          rgba(255, 255, 255, 0.025);
      }


      /* =====================================================
         EXPAND AREA
         ===================================================== */

      .shop-radio-expand {
        display:
          grid;

        grid-template-columns:
          20px
          minmax(0, 1fr);

        align-items:
          center;

        min-width:
          0;

        padding:
          4px 4px 4px 7px;

        border:
          0;

        background:
          transparent;

        color:
          inherit;

        cursor:
          pointer;

        text-align:
          left;

        -webkit-appearance:
          none;

        appearance:
          none;
      }


      .shop-radio-note {
        color:
          var(--spotify-green-bright);

        font-size:
          0.78rem;

        line-height:
          1;
      }


      .shop-radio-copy {
        display:
          block;

        min-width:
          0;

        padding:
          0 5px;
      }


      .shop-radio-kicker {
        display:
          block;

        margin-bottom:
          1px;

        color:
          var(--muted);

        font-size:
          0.31rem;

        font-weight:
          900;

        letter-spacing:
          0.14em;

        line-height:
          1;

        text-transform:
          uppercase;

        white-space:
          nowrap;
      }


      .shop-radio-title {
        display:
          block;

        overflow:
          hidden;

        color:
          var(--spotify-green-bright);

        font-family:
          Georgia,
          "Times New Roman",
          serif;

        font-size:
          0.67rem;

        font-weight:
          900;

        letter-spacing:
          0.015em;

        line-height:
          1.05;

        text-overflow:
          ellipsis;

        text-transform:
          uppercase;

        white-space:
          nowrap;
      }


      /* =====================================================
         COLLAPSED PLAY BUTTON
         ===================================================== */

      .shop-radio-play {
        display:
          grid;

        align-self:
          center;

        justify-self:
          center;

        place-items:
          center;

        width:
          24px;

        height:
          24px;

        padding:
          0;

        border:
          1px solid
          var(--spotify-green-bright);

        border-radius:
          50%;

        background:
          #07100a;

        color:
          var(--spotify-green-bright);

        cursor:
          pointer;

        -webkit-appearance:
          none;

        appearance:
          none;

        animation:
          shop-radio-green-pulse
          2.2s
          ease-in-out
          infinite;
      }


      .shop-radio-play:active {
        transform:
          scale(0.92);
      }


      .shop-radio-play-icon {
        display:
          block;

        margin-left:
          1px;

        font-size:
          0.48rem;

        line-height:
          1;
      }


      /* =====================================================
         EXPANDED PANEL
         ===================================================== */

      .shop-radio-panel {
        position:
          absolute;

        right:
          0;

        bottom:
          calc(100% + 7px);

        box-sizing:
          border-box;

        width:
          300px;

        overflow:
          hidden;

        border:
          1px solid
          rgba(29, 185, 84, 0.75);

        background:
          linear-gradient(
            145deg,
            #171816,
            #080908 72%
          );

        box-shadow:
          0 18px 50px
          rgba(0, 0, 0, 0.68);

        opacity:
          0;

        visibility:
          hidden;

        pointer-events:
          none;

        transform:
          translateY(8px)
          scale(0.98);

        transform-origin:
          bottom right;

        transition:
          opacity 160ms ease,
          transform 160ms ease,
          visibility 160ms ease;
      }


      .shop-radio.is-expanded
      .shop-radio-panel {
        opacity:
          1;

        visibility:
          visible;

        pointer-events:
          auto;

        transform:
          translateY(0)
          scale(1);
      }


      /* =====================================================
         PANEL HEADER
         ===================================================== */

      .shop-radio-panel-top {
        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          12px;

        min-height:
          40px;

        padding:
          7px 8px 7px 10px;

        border-bottom:
          1px solid
          rgba(29, 185, 84, 0.24);
      }


      .shop-radio-panel-brand {
        min-width:
          0;
      }


      .shop-radio-panel-kicker {
        display:
          block;

        margin-bottom:
          2px;

        color:
          var(--muted);

        font-size:
          0.38rem;

        font-weight:
          900;

        letter-spacing:
          0.16em;

        line-height:
          1;

        text-transform:
          uppercase;
      }


      .shop-radio-panel-title {
        display:
          block;

        color:
          var(--spotify-green-bright);

        font-family:
          Georgia,
          "Times New Roman",
          serif;

        font-size:
          0.88rem;

        line-height:
          1;

        text-transform:
          uppercase;
      }


      .shop-radio-close {
        display:
          grid;

        flex:
          0 0 auto;

        place-items:
          center;

        width:
          26px;

        height:
          26px;

        padding:
          0;

        border:
          1px solid
          rgba(234, 215, 173, 0.25);

        background:
          #0b0b09;

        color:
          var(--paper);

        cursor:
          pointer;

        font-size:
          1rem;

        line-height:
          1;

        -webkit-appearance:
          none;

        appearance:
          none;
      }


      /* =====================================================
         NOW PLAYING
         ===================================================== */

      .shop-radio-screen {
        padding:
          6px 10px;

        border-bottom:
          1px solid
          rgba(29, 185, 84, 0.2);

        background:
          #07100a;
      }


      .shop-radio-screen span {
        display:
          block;

        margin-bottom:
          2px;

        color:
          var(--spotify-green-bright);

        font-size:
          0.36rem;

        font-weight:
          900;

        letter-spacing:
          0.17em;

        text-transform:
          uppercase;
      }


      .shop-radio-screen strong {
        display:
          block;

        overflow:
          hidden;

        color:
          var(--paper-2);

        font-size:
          0.53rem;

        font-weight:
          800;

        letter-spacing:
          0.07em;

        text-overflow:
          ellipsis;

        text-transform:
          uppercase;

        white-space:
          nowrap;
      }


      /* =====================================================
         SPOTIFY PLAYER

         THIS is the important size fix.
         No giant fake 330px player cavity.
         ===================================================== */

      .shop-radio-player-window {
        width:
          100%;

        height:
          152px;

        overflow:
          hidden;

        background:
          #000;
      }


      .shop-radio-spotify-engine {
        width:
          100%;

        height:
          152px;
      }


      .shop-radio-spotify-engine iframe {
        display:
          block !important;

        width:
          100% !important;

        height:
          152px !important;

        max-width:
          none !important;

        border:
          0 !important;
      }


      /* =====================================================
         CONTROLS
         ===================================================== */

      .shop-radio-controls {
        display:
          grid;

        grid-template-columns:
          repeat(3, 34px);

        justify-content:
          center;

        align-items:
          center;

        gap:
          13px;

        padding:
          8px 10px;

        border-top:
          1px solid
          rgba(29, 185, 84, 0.15);

        border-bottom:
          1px solid
          rgba(29, 185, 84, 0.15);

        background:
          #090a09;
      }


      .shop-radio-control {
        display:
          grid;

        place-items:
          center;

        width:
          34px;

        height:
          30px;

        padding:
          0;

        border:
          1px solid
          rgba(234, 215, 173, 0.26);

        background:
          #0b0b09;

        color:
          var(--paper);

        cursor:
          pointer;

        font-size:
          0.68rem;

        line-height:
          1;

        -webkit-appearance:
          none;

        appearance:
          none;
      }


      .shop-radio-big-play {
        border-color:
          var(--spotify-green);

        color:
          var(--spotify-green-bright);

        box-shadow:
          0 0 10px
          rgba(29, 185, 84, 0.24);
      }


      .shop-radio-control:active {
        transform:
          scale(0.92);
      }


      /* =====================================================
         BOTTOM STRIP
         ===================================================== */

      .shop-radio-panel-bottom {
        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          10px;

        padding:
          7px 9px;
      }


      .shop-radio-panel-bottom span {
        color:
          var(--muted);

        font-size:
          0.35rem;

        font-weight:
          800;

        letter-spacing:
          0.08em;

        text-transform:
          uppercase;
      }


      .shop-radio-panel-bottom a {
        flex:
          0 0 auto;

        color:
          var(--spotify-green-bright);

        font-size:
          0.4rem;

        font-weight:
          900;

        letter-spacing:
          0.1em;

        text-decoration:
          none;

        text-transform:
          uppercase;
      }


      /* =====================================================
         PLAYING STATE
         ===================================================== */

      .shop-radio.is-playing
      .shop-radio-play {
        animation:
          none;

        background:
          var(--spotify-green);

        color:
          #050505;

        box-shadow:
          0 0 14px
          rgba(29, 185, 84, 0.6);
      }


      .shop-radio.is-playing
      .shop-radio-play-icon {
        margin-left:
          0;
      }


      .shop-radio:not(.is-ready)
      .shop-radio-play,

      .shop-radio:not(.is-ready)
      .shop-radio-control {
        opacity:
          0.58;
      }


      /* =====================================================
         GREEN BREATHING PULSE
         ===================================================== */

      @keyframes shop-radio-green-pulse {

        0%,
        100% {
          border-color:
            rgba(29, 185, 84, 0.72);

          box-shadow:
            0 0 4px
            rgba(29, 185, 84, 0.22),
            0 0 0 0
            rgba(29, 185, 84, 0);
        }


        50% {
          border-color:
            #1ed760;

          box-shadow:
            0 0 11px
            rgba(30, 215, 96, 0.95),
            0 0 0 5px
            rgba(30, 215, 96, 0.13);
        }

      }


      /* =====================================================
         MOBILE
         ===================================================== */

      @media (max-width: 560px) {

        .shop-radio-panel {
          width:
            min(
              300px,
              calc(100vw - 14px)
            );
        }

      }


      /* =====================================================
         DESKTOP
         ===================================================== */

      @media (min-width: 561px) {

        #shop-radio {
          right:
            12px;

          bottom:
            12px;

          width:
            170px;
        }

      }


      /* =====================================================
         REDUCED MOTION
         ===================================================== */

      @media (
        prefers-reduced-motion: reduce
      ) {

        .shop-radio-play {
          animation:
            none;
        }


        .shop-radio-panel {
          transition:
            none;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =======================================================
     ELEMENTS
     ======================================================= */

  const radio =
    mount.querySelector(
      ".shop-radio"
    );


  const panel =
    mount.querySelector(
      ".shop-radio-panel"
    );


  const expandButton =
    mount.querySelector(
      ".shop-radio-expand"
    );


  const closeButton =
    mount.querySelector(
      ".shop-radio-close"
    );


  const playButton =
    mount.querySelector(
      ".shop-radio-play"
    );


  const playIcon =
    mount.querySelector(
      ".shop-radio-play-icon"
    );


  const bigPlayButton =
    mount.querySelector(
      ".shop-radio-big-play"
    );


  const bigPlayIcon =
    mount.querySelector(
      ".shop-radio-big-play-icon"
    );


  const previousButton =
    mount.querySelector(
      ".shop-radio-previous"
    );


  const nextButton =
    mount.querySelector(
      ".shop-radio-next"
    );


  /* =======================================================
     EXPAND / COLLAPSE
     ======================================================= */

  function expandRadio() {

    radio.classList.add(
      "is-expanded"
    );


    panel.setAttribute(
      "aria-hidden",
      "false"
    );


    expandButton.setAttribute(
      "aria-expanded",
      "true"
    );

  }


  function collapseRadio() {

    radio.classList.remove(
      "is-expanded"
    );


    panel.setAttribute(
      "aria-hidden",
      "true"
    );


    expandButton.setAttribute(
      "aria-expanded",
      "false"
    );

  }


  expandButton.addEventListener(
    "click",
    expandRadio
  );


  closeButton.addEventListener(
    "click",
    collapseRadio
  );


  /* =======================================================
     PLAYER STATE
     ======================================================= */

  function renderPlayerState() {

    radio.classList.toggle(
      "is-ready",
      playerReady
    );


    radio.classList.toggle(
      "is-playing",
      isPlaying
    );


    const icon =
      isPlaying
        ? "❚❚"
        : "▶";


    playIcon.textContent =
      icon;


    bigPlayIcon.textContent =
      icon;


    const label =
      isPlaying
        ? "Pause Shop Radio"
        : "Play Shop Radio";


    playButton.setAttribute(
      "aria-label",
      label
    );


    bigPlayButton.setAttribute(
      "aria-label",
      label
    );

  }


  renderPlayerState();


  /* =======================================================
     PLAY / PAUSE
     ======================================================= */

  function togglePlayback() {

    if (!controller) {
      return;
    }


    controller.togglePlay();

  }


  playButton.addEventListener(
    "click",
    togglePlayback
  );


  bigPlayButton.addEventListener(
    "click",
    togglePlayback
  );


  /* =======================================================
     PREVIOUS
     ======================================================= */

  previousButton.addEventListener(
    "click",
    function () {

      if (
        controller &&
        typeof controller.previousTrack ===
        "function"
      ) {

        controller.previousTrack();

      }

    }
  );


  /* =======================================================
     NEXT
     ======================================================= */

  nextButton.addEventListener(
    "click",
    function () {

      if (
        controller &&
        typeof controller.nextTrack ===
        "function"
      ) {

        controller.nextTrack();

      }

    }
  );


  /* =======================================================
     SPOTIFY PERMISSIONS
     ======================================================= */

  function applySpotifyPermissions() {

    const iframe =
      mount.querySelector(
        ".shop-radio-spotify-engine iframe"
      );


    if (!iframe) {
      return;
    }


    iframe.setAttribute(
      "allow",
      "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    );


    iframe.setAttribute(
      "allowfullscreen",
      ""
    );

  }


  /* =======================================================
     CREATE SPOTIFY PLAYER
     ======================================================= */

  function createSpotifyController(
    IFrameAPI
  ) {

    if (controller) {
      return;
    }


    const engine =
      document.getElementById(
        "shop-radio-spotify-engine"
      );


    if (!engine) {
      return;
    }


    const options = {

      url:
        PLAYLIST_URL,

      width:
        300,

      height:
        152

    };


    IFrameAPI.createController(
      engine,
      options,
      function (
        EmbedController
      ) {

        controller =
          EmbedController;


        playerReady =
          true;


        applySpotifyPermissions();


        requestAnimationFrame(
          applySpotifyPermissions
        );


        renderPlayerState();


        EmbedController.addListener(
          "playback_started",
          function () {

            isPlaying =
              true;


            renderPlayerState();

          }
        );


        EmbedController.addListener(
          "playback_update",
          function (event) {

            if (
              !event ||
              !event.data
            ) {
              return;
            }


            isPlaying =
              !event.data.isPaused;


            renderPlayerState();

          }
        );

      }
    );

  }


  /* =======================================================
     SPOTIFY API READY
     ======================================================= */

  window.onSpotifyIframeApiReady =
    function (
      IFrameAPI
    ) {

      createSpotifyController(
        IFrameAPI
      );

    };


  /* =======================================================
     LOAD SPOTIFY API ONCE
     ======================================================= */

  if (
    !document.querySelector(
      'script[data-spotify-iframe-api="true"]'
    )
  ) {

    const script =
      document.createElement(
        "script"
      );


    script.src =
      "https://open.spotify.com/embed/iframe-api/v1";


    script.async =
      true;


    script.dataset.spotifyIframeApi =
      "true";


    document.body.appendChild(
      script
    );

  }

})();
