/* =========================================================
   UNCLE MIKE'S SHOP RADIO
   Persistent expandable Spotify player
   Vintage tuner edition
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

  let tunerPosition = 53;
  let tunerRotation = 18;


  /* =======================================================
     RADIO HTML
     ======================================================= */

  mount.innerHTML = `

    <aside
      class="shop-radio"
      aria-label="Uncle Mike's Shop Radio"
    >

      <!-- ===============================================
           EXPANDED RADIO
           =============================================== -->

      <section
        class="shop-radio-panel"
        aria-hidden="true"
      >

        <!-- =============================================
             VINTAGE RADIO HEADER
             ============================================= -->

        <div class="shop-radio-console">

          <div class="shop-radio-console-top">

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


          <!-- ===========================================
               TUNER
               =========================================== -->

          <div class="shop-radio-tuner">

            <!-- LEFT KNOB -->

            <div
              class="shop-radio-knob-unit"
              aria-hidden="true"
            >

              <div class="shop-radio-knob-ring">

                <div class="shop-radio-knob shop-radio-volume-knob">

                  <span class="shop-radio-knob-marker"></span>

                </div>

              </div>

              <span class="shop-radio-knob-label">
                Vol
              </span>

            </div>


            <!-- TUNER GLASS -->

            <div class="shop-radio-dial">

              <div class="shop-radio-dial-glass">

                <div class="shop-radio-station">

                  <span>
                    FM
                  </span>

                  <strong>
                    Garage Songs
                  </strong>

                  <small>
                    For A Better Tomorrow
                  </small>

                </div>


                <div class="shop-radio-frequency">

                  <span>88</span>
                  <span>92</span>
                  <span>96</span>
                  <span>100</span>
                  <span>104</span>
                  <span>108</span>

                </div>


                <div class="shop-radio-scale">

                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>

                </div>


                <div
                  class="shop-radio-needle"
                  aria-hidden="true"
                ></div>

              </div>

            </div>


            <!-- RIGHT KNOB -->

            <div
              class="shop-radio-knob-unit"
              aria-hidden="true"
            >

              <div class="shop-radio-knob-ring">

                <div class="shop-radio-knob shop-radio-tune-knob">

                  <span class="shop-radio-knob-marker"></span>

                </div>

              </div>

              <span class="shop-radio-knob-label">
                Tune
              </span>

            </div>

          </div>

        </div>


        <!-- =============================================
             SPOTIFY
             ============================================= -->

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
          aria-label="Open Shop Radio"
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

        --radio-cream:
          #ead7ad;

        --radio-orange:
          #ff8a32;
      }


      .shop-radio {
        position:
          relative;

        width:
          100%;
      }


      /* =====================================================
         COLLAPSED FACEPLATE
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
            0.72
          );

        background:
          linear-gradient(
            145deg,
            #181916,
            #070807 72%
          );

        box-shadow:
          0 8px 24px
          rgba(0, 0, 0, 0.58),
          inset 0 0 0 1px
          rgba(255, 255, 255, 0.025);
      }


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
            0.55
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
            0.28
          );
      }


      /* =====================================================
         COLLAPSED PLAY / PAUSE
         Always green. Always alive.
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


      /*
       * Playing keeps the same neon language.
       * Only the glyph changes.
       */

      .shop-radio.is-playing
      .shop-radio-play {
        background:
          #061008;

        color:
          var(--radio-green-bright);

        border-color:
          var(--radio-green-bright);

        animation:
          shop-radio-halo
          2.1s
          ease-in-out
          infinite;
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
         VINTAGE CONSOLE
         ===================================================== */

      .shop-radio-console {
        position:
          relative;

        overflow:
          hidden;

        padding-bottom:
          8px;

        border-bottom:
          1px solid
          rgba(
            var(--radio-green-rgb),
            0.2
          );

        background:
          linear-gradient(
            180deg,
            #181914 0%,
            #0b0c0a 100%
          );
      }


      .shop-radio-console::before {
        content:
          "";

        position:
          absolute;

        inset:
          0;

        pointer-events:
          none;

        background:
          repeating-linear-gradient(
            90deg,
            rgba(255,255,255,0.012) 0,
            rgba(255,255,255,0.012) 1px,
            transparent 1px,
            transparent 5px
          );

        opacity:
          0.5;
      }


      /* =====================================================
         BRAND / CLOSE
         ===================================================== */

      .shop-radio-console-top {
        position:
          relative;

        z-index:
          2;

        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          12px;

        min-height:
          38px;

        padding:
          7px 8px 5px 10px;
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
          0.36rem;

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
          0.9rem;

        line-height:
          1;

        text-transform:
          uppercase;

        text-shadow:
          0 0 10px
          rgba(
            var(--radio-green-rgb),
            0.3
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
          rgba(234, 215, 173, 0.28);

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
         TUNER ASSEMBLY
         ===================================================== */

      .shop-radio-tuner {
        position:
          relative;

        z-index:
          2;

        display:
          grid;

        grid-template-columns:
          39px
          minmax(0, 1fr)
          39px;

        align-items:
          center;

        gap:
          6px;

        padding:
          3px 8px 1px;
      }


      /* =====================================================
         KNOBS
         ===================================================== */

      .shop-radio-knob-unit {
        display:
          grid;

        justify-items:
          center;

        gap:
          4px;
      }


      .shop-radio-knob-ring {
        display:
          grid;

        place-items:
          center;

        width:
          31px;

        height:
          31px;

        border:
          1px solid
          rgba(
            var(--radio-green-rgb),
            0.52
          );

        border-radius:
          50%;

        background:
          radial-gradient(
            circle,
            rgba(
              var(--radio-green-rgb),
              0.12
            ),
            transparent 65%
          );

        box-shadow:
          0 0 7px
          rgba(
            var(--radio-green-rgb),
            0.12
          ),
          inset 0 0 0 2px
          rgba(0,0,0,0.55);
      }


      .shop-radio-knob {
        position:
          relative;

        width:
          23px;

        height:
          23px;

        border:
          1px solid
          rgba(234, 215, 173, 0.28);

        border-radius:
          50%;

        background:
          repeating-conic-gradient(
            from 0deg,
            #20211d 0deg 8deg,
            #0b0c0a 8deg 14deg
          );

        box-shadow:
          inset 0 0 0 4px
          #11120f,
          inset 2px 2px 4px
          rgba(255,255,255,0.05),
          0 3px 6px
          rgba(0,0,0,0.7);
      }


      .shop-radio-volume-knob {
        transform:
          rotate(-24deg);
      }


      .shop-radio-tune-knob {
        transform:
          rotate(18deg);

        transition:
          transform 420ms
          cubic-bezier(.2,.8,.2,1);
      }


      .shop-radio-knob-marker {
        position:
          absolute;

        top:
          2px;

        left:
          50%;

        width:
          1px;

        height:
          6px;

        background:
          var(--radio-cream);

        box-shadow:
          0 0 3px
          rgba(234,215,173,0.45);

        transform:
          translateX(-50%);
      }


      .shop-radio-knob-label {
        color:
          var(--muted);

        font-size:
          0.29rem;

        font-weight:
          900;

        letter-spacing:
          0.13em;

        line-height:
          1;

        text-transform:
          uppercase;
      }


      /* =====================================================
         DIAL GLASS
         ===================================================== */

      .shop-radio-dial {
        min-width:
          0;

        padding:
          2px;

        border:
          1px solid
          rgba(234,215,173,0.22);

        background:
          #050604;

        box-shadow:
          inset 0 0 12px
          rgba(0,0,0,0.8);
      }


      .shop-radio-dial-glass {
        position:
          relative;

        height:
          54px;

        overflow:
          hidden;

        border:
          1px solid
          rgba(
            var(--radio-green-rgb),
            0.22
          );

        background:
          linear-gradient(
            180deg,
            #061008,
            #020503
          );

        box-shadow:
          inset 0 0 14px
          rgba(
            var(--radio-green-rgb),
            0.08
          );
      }


      .shop-radio-dial-glass::after {
        content:
          "";

        position:
          absolute;

        inset:
          0;

        pointer-events:
          none;

        background:
          linear-gradient(
            115deg,
            rgba(255,255,255,0.07),
            transparent 24%,
            transparent 70%,
            rgba(255,255,255,0.025)
          );
      }


      /* =====================================================
         STATION NAME
         ===================================================== */

      .shop-radio-station {
        position:
          absolute;

        top:
          5px;

        left:
          6px;

        right:
          6px;

        display:
          grid;

        grid-template-columns:
          auto 1fr;

        align-items:
          baseline;

        column-gap:
          4px;

        color:
          var(--radio-green-bright);
      }


      .shop-radio-station span {
        grid-row:
          1 / 3;

        align-self:
          center;

        color:
          var(--radio-orange);

        font-size:
          0.31rem;

        font-weight:
          900;

        letter-spacing:
          0.08em;
      }


      .shop-radio-station strong {
        overflow:
          hidden;

        font-family:
          Georgia,
          "Times New Roman",
          serif;

        font-size:
          0.47rem;

        letter-spacing:
          0.04em;

        line-height:
          1;

        text-overflow:
          ellipsis;

        text-transform:
          uppercase;

        white-space:
          nowrap;

        text-shadow:
          0 0 6px
          rgba(
            var(--radio-green-rgb),
            0.38
          );
      }


      .shop-radio-station small {
        margin-top:
          2px;

        color:
          rgba(234,215,173,0.72);

        font-size:
          0.25rem;

        font-weight:
          800;

        letter-spacing:
          0.06em;

        line-height:
          1;

        text-transform:
          uppercase;
      }


      /* =====================================================
         FREQUENCY NUMBERS
         ===================================================== */

      .shop-radio-frequency {
        position:
          absolute;

        left:
          6px;

        right:
          6px;

        bottom:
          12px;

        display:
          flex;

        justify-content:
          space-between;

        color:
          rgba(234,215,173,0.76);

        font-size:
          0.27rem;

        font-weight:
          800;

        line-height:
          1;
      }


      /* =====================================================
         SCALE
         ===================================================== */

      .shop-radio-scale {
        position:
          absolute;

        left:
          7px;

        right:
          7px;

        bottom:
          5px;

        display:
          flex;

        align-items:
          end;

        justify-content:
          space-between;

        height:
          5px;

        border-bottom:
          1px solid
          rgba(234,215,173,0.4);
      }


      .shop-radio-scale span {
        display:
          block;

        width:
          1px;

        height:
          3px;

        background:
          rgba(234,215,173,0.5);
      }


      .shop-radio-scale span:nth-child(3n + 1) {
        height:
          5px;
      }


      /* =====================================================
         ORANGE NEEDLE
         ===================================================== */

      .shop-radio-needle {
        position:
          absolute;

        left:
          53%;

        bottom:
          4px;

        width:
          2px;

        height:
          19px;

        background:
          var(--radio-orange);

        box-shadow:
          0 0 4px
          rgba(255,138,50,0.95),
          0 0 8px
          rgba(255,138,50,0.45);

        transform:
          translateX(-50%);

        transition:
          left 420ms
          cubic-bezier(.2,.8,.2,1);
      }


      /* =====================================================
         SPOTIFY PLAYER
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
       * Spotify owns the actual iframe.
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
         GREEN BREATHING HALO
         ===================================================== */

      @keyframes shop-radio-halo {

        0%,
        100% {
          border-color:
            rgba(
              var(--radio-green-rgb),
              0.72
            );

          box-shadow:
            0 0 4px
            rgba(
              var(--radio-green-rgb),
              0.3
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


        .shop-radio-panel,
        .shop-radio-needle,
        .shop-radio-tune-knob {
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


  const needle =
    mount.querySelector(
      ".shop-radio-needle"
    );


  const tuneKnob =
    mount.querySelector(
      ".shop-radio-tune-knob"
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


  renderPlayerState();


  /* =======================================================
     TUNER MOVEMENT

     Decorative only.
     A playback start nudges the physical tuner to a
     slightly different station position.
     ======================================================= */

  function moveTuner() {

    tunerPosition += 13;


    if (tunerPosition > 82) {
      tunerPosition =
        24;
    }


    tunerRotation += 27;


    if (tunerRotation > 145) {
      tunerRotation =
        -42;
    }


    if (needle) {

      needle.style.left =
        tunerPosition + "%";

    }


    if (tuneKnob) {

      tuneKnob.style.transform =
        "rotate(" +
        tunerRotation +
        "deg)";

    }

  }


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


            moveTuner();


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
