/* =========================================================
   UNCLE MIKE'S SHOP RADIO
   Tiny persistent Spotify player
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
     RADIO UI
     ======================================================= */

  mount.innerHTML = `

    <aside
      class="shop-radio"
      aria-label="Uncle Mike's Shop Radio"
    >

      <div class="shop-radio-face">

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


      <div
        class="shop-radio-engine"
        aria-hidden="true"
      >
        <div id="shop-radio-spotify-engine"></div>
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
      }


      /* =====================================================
         RADIO
         ===================================================== */

      .shop-radio {
        position:
          relative;

        width:
          100%;
      }


      .shop-radio-face {
        display:
          grid;

        grid-template-columns:
          20px
          minmax(0, 1fr)
          29px;

        align-items:
          center;

        box-sizing:
          border-box;

        width:
          100%;

        min-height:
          40px;

        padding:
          4px
          5px
          4px
          7px;

        border:
          1px solid
          rgba(69, 225, 232, 0.52);

        background:
          linear-gradient(
            145deg,
            #171816,
            #080908 72%
          );

        box-shadow:
          0 8px 24px
          rgba(0, 0, 0, 0.52),
          inset 0 0 0 1px
          rgba(255, 255, 255, 0.025);
      }


      /* =====================================================
         MUSIC NOTE
         ===================================================== */

      .shop-radio-note {
        color:
          #49e1e8;

        font-size:
          0.78rem;

        line-height:
          1;
      }


      /* =====================================================
         COPY
         ===================================================== */

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
          #49e1e8;

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
         REAL PLAY BUTTON
         ===================================================== */

      .shop-radio-play {
        display:
          grid;

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
          rgba(69, 225, 232, 0.78);

        border-radius:
          50%;

        background:
          #071011;

        color:
          #49e1e8;

        cursor:
          pointer;

        -webkit-appearance:
          none;

        appearance:
          none;

        box-shadow:
          0 0 8px
          rgba(69, 225, 232, 0.2);

        animation:
          shop-radio-halo
          2.4s
          ease-in-out
          infinite;

        transition:
          transform
          150ms ease,
          opacity
          150ms ease;
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
         PLAYING
         ===================================================== */

      .shop-radio.is-playing
      .shop-radio-play {
        animation:
          none;

        box-shadow:
          0 0 12px
          rgba(69, 225, 232, 0.4);
      }


      .shop-radio.is-playing
      .shop-radio-play-icon {
        margin-left:
          0;
      }


      /* =====================================================
         LOADING
         ===================================================== */

      .shop-radio:not(.is-ready)
      .shop-radio-play {
        opacity:
          0.62;
      }


      /* =====================================================
         SPOTIFY ENGINE

         Spotify replaces our inner DIV
         with its iframe.

         Keep the real player alive in
         the DOM but clip the entire
         engine to one invisible pixel.
         ===================================================== */

      .shop-radio-engine {
        position:
          fixed;

        left:
          0;

        bottom:
          0;

        width:
          1px;

        height:
          1px;

        overflow:
          hidden;

        clip-path:
          inset(50%);

        opacity:
          0;

        pointer-events:
          none;
      }


      .shop-radio-engine iframe {
        display:
          block !important;

        width:
          300px !important;

        height:
          152px !important;

        max-width:
          none !important;

        border:
          0 !important;
      }


      /* =====================================================
         HALO
         ===================================================== */

      @keyframes shop-radio-halo {

        0%,
        100% {
          box-shadow:
            0 0 0 0
            rgba(69, 225, 232, 0.02),
            0 0 6px
            rgba(69, 225, 232, 0.16);
        }

        50% {
          box-shadow:
            0 0 0 4px
            rgba(69, 225, 232, 0.07),
            0 0 13px
            rgba(69, 225, 232, 0.48);
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


  const playButton =
    mount.querySelector(
      ".shop-radio-play"
    );


  const playIcon =
    mount.querySelector(
      ".shop-radio-play-icon"
    );


  /* =======================================================
     UI STATE
     ======================================================= */

  function renderState() {

    radio.classList.toggle(
      "is-ready",
      playerReady
    );


    radio.classList.toggle(
      "is-playing",
      isPlaying
    );


    playIcon.textContent =
      isPlaying
        ? "❚❚"
        : "▶";


    playButton.setAttribute(
      "aria-label",
      isPlaying
        ? "Pause Shop Radio"
        : "Play Shop Radio"
    );
  }


  renderState();


  /* =======================================================
     PLAY / PAUSE
     ======================================================= */

  function togglePlayback() {

    if (!controller) {
      return;
    }


    /*
     * This click is the user's direct
     * interaction, which is important
     * for mobile browser playback rules.
     */
    controller.togglePlay();
  }


  playButton.addEventListener(
    "click",
    togglePlayback
  );


  /* =======================================================
     CREATE SPOTIFY PLAYER
     ======================================================= */

  function createSpotifyController(
    IFrameAPI
  ) {

    /*
     * Guard against the API callback
     * firing more than once.
     */
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


        /*
         * Spotify controller exists.
         */
        playerReady =
          true;

        renderState();


        /*
         * Spotify confirms actual
         * playback has started.
         */
        EmbedController.addListener(
          "playback_started",
          function () {

            isPlaying =
              true;

            renderState();

          }
        );


        /*
         * Keep our custom button
         * synchronized with Spotify.
         */
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


            renderState();

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
     LOAD SPOTIFY IFRAME API ONCE
     ======================================================= */

  const existingApiScript =
    document.querySelector(
      'script[data-spotify-iframe-api="true"]'
    );


  if (!existingApiScript) {

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
