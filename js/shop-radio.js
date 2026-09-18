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
     PLAYER STATE
     ======================================================= */

  let spotifyController = null;
  let isPlaying = false;
  let spotifyReady = false;


  /* =======================================================
     RADIO
     ======================================================= */

  mount.innerHTML = `

    <aside
      class="shop-radio"
      aria-label="Uncle Mike's Shop Radio"
    >

      <div class="shop-radio-face">

        <button
          class="shop-radio-main"
          type="button"
          aria-label="Play or pause Shop Radio"
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


        <a
          class="shop-radio-spotify-link"
          href="${PLAYLIST_URL}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open playlist in Spotify"
        >
          ↗
        </a>

      </div>


      <div
        class="shop-radio-status"
        aria-live="polite"
      >
        Garage Songs For A Better Tomorrow
      </div>


      <div
        id="shop-radio-spotify-embed"
        class="shop-radio-spotify-embed"
        aria-hidden="true"
      ></div>

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
          12px;

        bottom:
          12px;

        z-index:
          8500;

        width:
          min(
            285px,
            calc(100vw - 24px)
          );

        font-family:
          Arial,
          Helvetica,
          sans-serif;
      }


      /* =====================================================
         FACEPLATE
         ===================================================== */

      .shop-radio {
        position:
          relative;

        overflow:
          hidden;

        border:
          1px solid
          rgba(69, 225, 232, 0.42);

        background:
          linear-gradient(
            145deg,
            #171816,
            #090a09 70%
          );

        box-shadow:
          0 10px 30px
          rgba(0, 0, 0, 0.48),
          inset 0 0 0 1px
          rgba(255, 255, 255, 0.025);
      }


      .shop-radio-face {
        display:
          grid;

        grid-template-columns:
          minmax(0, 1fr)
          38px
          30px;

        align-items:
          stretch;

        min-height:
          52px;
      }


      /* =====================================================
         BRAND / MAIN BUTTON
         ===================================================== */

      .shop-radio-main {
        display:
          flex;

        align-items:
          center;

        gap:
          10px;

        min-width:
          0;

        padding:
          8px 10px;

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
      }


      .shop-radio-note {
        flex:
          0 0 auto;

        color:
          #49e1e8;

        font-size:
          1.05rem;

        line-height:
          1;
      }


      .shop-radio-copy {
        display:
          block;

        min-width:
          0;
      }


      .shop-radio-kicker {
        display:
          block;

        margin-bottom:
          1px;

        color:
          var(--muted);

        font-size:
          0.46rem;

        font-weight:
          900;

        letter-spacing:
          0.15em;

        line-height:
          1;

        text-transform:
          uppercase;
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
          0.98rem;

        line-height:
          1.05;

        letter-spacing:
          0.01em;

        text-overflow:
          ellipsis;

        text-transform:
          uppercase;

        white-space:
          nowrap;
      }


      /* =====================================================
         PLAY BUTTON
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
          30px;

        height:
          30px;

        padding:
          0;

        border:
          1px solid
          rgba(69, 225, 232, 0.7);

        border-radius:
          50%;

        background:
          #071011;

        color:
          #49e1e8;

        cursor:
          pointer;

        box-shadow:
          0 0 8px
          rgba(69, 225, 232, 0.22);

        transition:
          transform
          150ms ease,
          border-color
          150ms ease;
      }


      .shop-radio-play:hover {
        transform:
          scale(1.06);
      }


      .shop-radio-play-icon {
        display:
          block;

        margin-left:
          2px;

        font-size:
          0.62rem;

        line-height:
          1;
      }


      .shop-radio:not(.is-playing)
      .shop-radio-play {
        animation:
          shop-radio-halo
          2.3s
          ease-in-out
          infinite;
      }


      .shop-radio.is-playing
      .shop-radio-play {
        animation:
          none;

        box-shadow:
          0 0 12px
          rgba(69, 225, 232, 0.34);
      }


      .shop-radio.is-playing
      .shop-radio-play-icon {
        margin-left:
          0;
      }


      /* =====================================================
         SPOTIFY LINK
         ===================================================== */

      .shop-radio-spotify-link {
        display:
          grid;

        place-items:
          center;

        border-left:
          1px solid
          rgba(234, 215, 173, 0.13);

        color:
          var(--paper);

        font-size:
          0.8rem;

        font-weight:
          900;

        text-decoration:
          none;

        transition:
          background
          150ms ease,
          color
          150ms ease;
      }


      .shop-radio-spotify-link:hover {
        background:
          rgba(69, 225, 232, 0.08);

        color:
          #49e1e8;
      }


      /* =====================================================
         STATUS STRIP
         ===================================================== */

      .shop-radio-status {
        overflow:
          hidden;

        padding:
          4px 10px 5px;

        border-top:
          1px solid
          rgba(69, 225, 232, 0.14);

        background:
          #071011;

        color:
          rgba(234, 215, 173, 0.72);

        font-size:
          0.43rem;

        font-weight:
          800;

        letter-spacing:
          0.11em;

        line-height:
          1.15;

        text-overflow:
          ellipsis;

        text-transform:
          uppercase;

        white-space:
          nowrap;
      }


      .shop-radio.is-playing
      .shop-radio-status {
        color:
          #49e1e8;
      }


      /* =====================================================
         SPOTIFY EMBED
         Keep the real player alive,
         but don't let it become the UI.
         ===================================================== */

      .shop-radio-spotify-embed {
        position:
          absolute;

        left:
          -10000px;

        top:
          -10000px;

        width:
          300px;

        height:
          152px;

        overflow:
          hidden;

        opacity:
          0;

        pointer-events:
          none;
      }


      .shop-radio-spotify-embed iframe {
        width:
          300px !important;

        height:
          152px !important;
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
            0 0 7px
            rgba(69, 225, 232, 0.16);
        }

        50% {
          box-shadow:
            0 0 0 5px
            rgba(69, 225, 232, 0.07),
            0 0 16px
            rgba(69, 225, 232, 0.48);
        }

      }


      /* =====================================================
         MOBILE
         ===================================================== */

      @media (max-width: 560px) {

        #shop-radio {
          right:
            8px;

          bottom:
            8px;

          width:
            236px;
        }


        .shop-radio-face {
          grid-template-columns:
            minmax(0, 1fr)
            36px
            28px;

          min-height:
            48px;
        }


        .shop-radio-main {
          gap:
            8px;

          padding:
            7px 8px;
        }


        .shop-radio-note {
          font-size:
            0.92rem;
        }


        .shop-radio-kicker {
          font-size:
            0.4rem;
        }


        .shop-radio-title {
          font-size:
            0.86rem;
        }


        .shop-radio-play {
          width:
            28px;

          height:
            28px;
        }


        .shop-radio-status {
          padding:
            3px 8px 4px;

          font-size:
            0.38rem;
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
            none !important;
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

  const mainButton =
    mount.querySelector(
      ".shop-radio-main"
    );

  const playButton =
    mount.querySelector(
      ".shop-radio-play"
    );

  const playIcon =
    mount.querySelector(
      ".shop-radio-play-icon"
    );

  const status =
    mount.querySelector(
      ".shop-radio-status"
    );


  /* =======================================================
     STATE
     ======================================================= */

  function updatePlayerState() {

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


    if (!spotifyReady) {
      status.textContent =
        "Loading The Shop Radio...";
    }

    else if (isPlaying) {
      status.textContent =
        "Shop Radio · Playing";
    }

    else {
      status.textContent =
        "Garage Songs For A Better Tomorrow";
    }
  }


  updatePlayerState();


  /* =======================================================
     PLAY / PAUSE
     ======================================================= */

  function toggleRadio() {

    if (!spotifyController) {

      status.textContent =
        "Radio's Warming Up...";

      return;
    }


    spotifyController.togglePlay();
  }


  playButton.addEventListener(
    "click",
    toggleRadio
  );


  mainButton.addEventListener(
    "click",
    toggleRadio
  );


  /* =======================================================
     SPOTIFY IFRAME API
     ======================================================= */

  window.onSpotifyIframeApiReady =
    function (IFrameAPI) {

      const element =
        document.getElementById(
          "shop-radio-spotify-embed"
        );


      if (!element) return;


      const options = {
        width: 300,
        height: 152,
        url: PLAYLIST_URL
      };


      IFrameAPI.createController(
        element,
        options,
        function (EmbedController) {

          spotifyController =
            EmbedController;


          EmbedController.addListener(
            "ready",
            function () {

              spotifyReady =
                true;

              updatePlayerState();

            }
          );


          EmbedController.addListener(
            "playback_started",
            function () {

              isPlaying =
                true;

              updatePlayerState();

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


              updatePlayerState();

            }
          );

        }
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

    const spotifyScript =
      document.createElement("script");


    spotifyScript.src =
      "https://open.spotify.com/embed/iframe-api/v1";

    spotifyScript.async =
      true;

    spotifyScript.dataset.spotifyIframeApi =
      "true";


    document.body.appendChild(
      spotifyScript
    );
  }

})();
