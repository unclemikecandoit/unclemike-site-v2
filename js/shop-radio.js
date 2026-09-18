/* =========================================================
   UNCLE MIKE'S SHOP RADIO
   Persistent expandable Spotify player
   ========================================================= */

(function initShopRadio() {
  const mount =
    document.getElementById("shop-radio");

  if (!mount) return;

  /*
   * Never rebuild the radio.
   * components.js keeps #shop-radio alive
   * during internal site navigation.
   */
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
  let isExpanded = false;


  /* =======================================================
     RADIO HTML
     ======================================================= */

  mount.innerHTML = `

    <aside
      class="shop-radio"
      aria-label="Uncle Mike's Shop Radio"
    >

      <!-- ===============================================
           EXPANDED JUKEBOX
           =============================================== -->

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


        <!--
          Spotify owns everything inside this window:
          track list, previous/next, play/pause, etc.
        -->
        <div class="shop-radio-player-window">

          <div
            id="shop-radio-spotify-engine"
            class="shop-radio-spotify-engine"
          ></div>

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


      <!-- ===============================================
           TINY PERSISTENT FACEPLATE
           =============================================== -->

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

        --radio-green:
          #1DB954;

        --radio-green-bright:
          #1ED760;

        --radio-green-rgb:
          30, 215, 96;
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
          rgba(
            var(--radio-green-rgb),
            0.68
          );

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
         EXPAND BUTTON
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
          var(--radio-green-bright);

        font-size:
          0.78rem;

        line-height:
          1;

        text-shadow:
          0 0 9px
          rgba(
            var(--radio-green-rgb),
            0.45
          );
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
          var(--radio-green-bright);

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

        text-shadow:
          0 0 10px
          rgba(
            var(--radio-green-rgb),
            0.24
          );
      }


      /* =====================================================
         SMALL PLAY BUTTON
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
          var(--radio-green-bright);

        border-radius:
          50%;

        background:
          #061008;

        color:
          var(--radio-green-bright);

        cursor:
          pointer;

        -webkit-appearance:
          none;

        appearance:
          none;

        animation:
          shop-radio-halo
          2.1s
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
          rgba(
            var(--radio-green-rgb),
            0.72
          );

        background:
          linear-gradient(
            145deg,
            #171816,
            #080908 72%
          );

        box-shadow:
          0 18px 50px
          rgba(0, 0, 0, 0.68),
          0 0 18px
          rgba(
            var(--radio-green-rgb),
            0.08
          );

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
          rgba(
            var(--radio-green-rgb),
            0.25
          );
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
          var(--radio-green-bright);

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

        text-shadow:
          0 0 10px
          rgba(
            var(--radio-green-rgb),
            0.25
          );
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
         NOW PLAYING SCREEN
         ===================================================== */

      .shop-radio-screen {
        padding:
          6px 10px;

        border-bottom:
          1px solid
          rgba(
            var(--radio-green-rgb),
            0.2
          );

        background:
          #061008;
      }


      .shop-radio-screen span {
        display:
          block;

        margin-bottom:
          2px;

        color:
          var(--radio-green-bright);

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
         Spotify owns the iframe.
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


      /*
       * Size only.
       * Do NOT alter Spotify iframe permissions,
       * source, playback attributes or internals.
       */
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
         PANEL BOTTOM
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

        border-top:
          1px solid
          rgba(
            var(--radio-green-rgb),
            0.16
          );

        background:
          #090a09;
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
          var(--radio-green-bright);

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
          var(--radio-green);

        color:
          #050505;

        border-color:
          var(--radio-green-bright);

        box-shadow:
          0 0 7px
          rgba(
            var(--radio-green-rgb),
            0.7
          ),
          0 0 18px
          rgba(
            var(--radio-green-rgb),
            0.38
          );
      }


      .shop-radio.is-playing
      .shop-radio-play-icon {
        margin-left:
          0;
      }


      .shop-radio:not(.is-ready)
      .shop-radio-play {
        opacity:
          0.58;
      }


      /* =====================================================
         BRIGHT GREEN BREATHING HALO
         ===================================================== */

      @keyframes shop-radio-halo {

        0%,
        100% {
          border-color:
            rgba(
              var(--radio-green-rgb),
              0.7
            );

          box-shadow:
            0 0 4px
            rgba(
              var(--radio-green-rgb),
              0.28
            ),
            0 0 0 0
            rgba(
              var(--radio-green-rgb),
              0
            );
        }


        50% {
          border-color:
            var(--radio-green-bright);

          box-shadow:
            0 0 10px
            rgba(
              var(--radio-green-rgb),
              1
            ),
            0 0 22px
            rgba(
              var(--radio-green-rgb),
              0.72
            ),
            0 0 0 5px
            rgba(
              var(--radio-green-rgb),
              0.15
            );
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


  /* =======================================================
     EXPAND / COLLAPSE
     ======================================================= */

  function expandRadio() {

    isExpanded =
      true;


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

    isExpanded =
      false;


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
     PLAYER UI STATE
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


    const label =
      isPlaying
        ? "Pause Shop Radio"
        : "Play Shop Radio";


    playButton.setAttribute(
      "aria-label",
      label
    );

  }


  renderPlayerState();


  /* =======================================================
     COLLAPSED PLAY / PAUSE
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


  /* =======================================================
     CREATE SPOTIFY CONTROLLER
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
        "100%",

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


        renderPlayerState();


        /* ===============================================
           PLAYBACK STARTED
           =============================================== */

        EmbedController.addListener(
          "playback_started",
          function () {

            isPlaying =
              true;


            renderPlayerState();

          }
        );


        /* ===============================================
           PLAYBACK UPDATES
           =============================================== */

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
