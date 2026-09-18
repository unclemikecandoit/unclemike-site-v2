/* =========================================================
   UNCLE MIKE'S SHOP RADIO
   Persistent Spotify player
   ========================================================= */

(function initShopRadio() {
  const mount =
    document.getElementById("shop-radio");

  if (!mount) return;

  /*
   * Never rebuild the player.
   * The entire point is keeping the same
   * Spotify iframe alive while the site's
   * page content changes around it.
   */
  if (mount.dataset.radioReady === "true") {
    return;
  }

  mount.dataset.radioReady = "true";


  const PLAYLIST_ID =
    "4IaHVqj1E8kTJvVVgLYzMK";

  const PLAYLIST_URL =
    `https://open.spotify.com/playlist/${PLAYLIST_ID}`;

  const EMBED_URL =
    `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`;


  mount.innerHTML = `
    <aside
      class="shop-radio"
      aria-label="Uncle Mike's Shop Radio"
    >

      <div class="shop-radio-top">

        <div class="shop-radio-brand">

          <span class="shop-radio-kicker">
            Uncle Mike's
          </span>

          <strong class="shop-radio-title">
            Shop Radio
          </strong>

        </div>


        <button
          class="shop-radio-collapse"
          type="button"
          aria-label="Collapse Shop Radio"
          aria-expanded="true"
        >
          —
        </button>

      </div>


      <div class="shop-radio-body">

        <div class="shop-radio-screen">

          <div class="shop-radio-screen-copy">

            <span class="shop-radio-now">
              Now Playing
            </span>

            <strong>
              Garage Songs For A Better Tomorrow
            </strong>

          </div>

          <span
            class="shop-radio-live"
            aria-hidden="true"
          >
            ●
          </span>

        </div>


        <div class="shop-radio-player">

          <iframe
            class="shop-radio-spotify"
            title="Uncle Mike's Shop Radio"
            src="${EMBED_URL}"
            width="100%"
            height="152"
            frameborder="0"
            allowfullscreen=""
            allow="
              autoplay;
              clipboard-write;
              encrypted-media;
              fullscreen;
              picture-in-picture
            "
            loading="eager"
          ></iframe>

        </div>


        <div class="shop-radio-bottom">

          <span class="shop-radio-motto">
            Music Makes The Work Go Faster.
          </span>

          <a
            class="shop-radio-open"
            href="${PLAYLIST_URL}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open In Spotify ↗
          </a>

        </div>

      </div>


      <button
        class="shop-radio-collapsed-button"
        type="button"
        aria-label="Open Shop Radio"
      >
        <span aria-hidden="true">♫</span>
        <strong>Shop Radio</strong>
        <span class="shop-radio-mini-play" aria-hidden="true">▶</span>
      </button>

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
         RADIO MOUNT
         ===================================================== */

      #shop-radio {
        position:
          fixed;

        right:
          18px;

        bottom:
          18px;

        z-index:
          8500;

        width:
          min(
            390px,
            calc(100vw - 36px)
          );

        font-family:
          Arial,
          Helvetica,
          sans-serif;
      }


      .shop-radio {
        position:
          relative;

        overflow:
          hidden;

        border:
          1px solid
          rgba(69, 225, 232, 0.48);

        background:
          linear-gradient(
            145deg,
            #161715,
            #080908 68%
          );

        box-shadow:
          0 18px 50px
          rgba(0, 0, 0, 0.55),
          inset 0 0 0 1px
          rgba(255, 255, 255, 0.025);
      }


      /* =====================================================
         TOP PLATE
         ===================================================== */

      .shop-radio-top {
        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          18px;

        padding:
          13px 14px 12px;

        border-bottom:
          1px solid
          rgba(69, 225, 232, 0.22);

        background:
          linear-gradient(
            180deg,
            rgba(255,255,255,0.035),
            rgba(255,255,255,0)
          );
      }


      .shop-radio-brand {
        display:
          flex;

        align-items:
          baseline;

        gap:
          8px;

        min-width:
          0;

        text-transform:
          uppercase;
      }


      .shop-radio-kicker {
        color:
          #49e1e8;

        font-size:
          0.58rem;

        font-weight:
          900;

        letter-spacing:
          0.16em;

        white-space:
          nowrap;
      }


      .shop-radio-title {
        color:
          #49e1e8;

        font-family:
          Georgia,
          "Times New Roman",
          serif;

        font-size:
          1.18rem;

        line-height:
          1;

        letter-spacing:
          -0.02em;

        text-transform:
          uppercase;

        white-space:
          nowrap;
      }


      .shop-radio-collapse {
        display:
          grid;

        flex:
          0 0 auto;

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
          rgba(234, 215, 173, 0.3);

        background:
          #0b0b09;

        color:
          var(--paper);

        cursor:
          pointer;

        font-size:
          1.2rem;

        font-weight:
          900;

        line-height:
          1;
      }


      /* =====================================================
         BODY
         ===================================================== */

      .shop-radio-body {
        padding:
          12px;
      }


      .shop-radio-screen {
        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          14px;

        margin-bottom:
          10px;

        padding:
          10px 12px;

        border:
          1px solid
          rgba(69, 225, 232, 0.24);

        background:
          #071011;

        box-shadow:
          inset 0 0 24px
          rgba(69, 225, 232, 0.055);
      }


      .shop-radio-screen-copy {
        min-width:
          0;
      }


      .shop-radio-now {
        display:
          block;

        margin-bottom:
          4px;

        color:
          #49e1e8;

        font-size:
          0.54rem;

        font-weight:
          900;

        letter-spacing:
          0.18em;

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
          0.73rem;

        font-weight:
          800;

        letter-spacing:
          0.055em;

        line-height:
          1.25;

        text-overflow:
          ellipsis;

        text-transform:
          uppercase;

        white-space:
          nowrap;
      }


      .shop-radio-live {
        flex:
          0 0 auto;

        color:
          #49e1e8;

        font-size:
          0.75rem;

        text-shadow:
          0 0 10px
          rgba(69, 225, 232, 0.9);
      }


      /* =====================================================
         SPOTIFY
         ===================================================== */

      .shop-radio-player {
        overflow:
          hidden;

        border:
          1px solid
          rgba(234, 215, 173, 0.16);

        background:
          #000;
      }


      .shop-radio-spotify {
        display:
          block;

        width:
          100%;

        border:
          0;
      }


      /* =====================================================
         BOTTOM
         ===================================================== */

      .shop-radio-bottom {
        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          14px;

        padding:
          11px 2px 1px;
      }


      .shop-radio-motto {
        color:
          var(--muted);

        font-size:
          0.52rem;

        font-weight:
          800;

        letter-spacing:
          0.1em;

        line-height:
          1.3;

        text-transform:
          uppercase;
      }


      .shop-radio-open {
        flex:
          0 0 auto;

        color:
          #49e1e8;

        font-size:
          0.58rem;

        font-weight:
          900;

        letter-spacing:
          0.1em;

        text-decoration:
          none;

        text-transform:
          uppercase;
      }


      .shop-radio-open:hover {
        text-decoration:
          underline;

        text-underline-offset:
          4px;
      }


      /* =====================================================
         COLLAPSED PLAYER
         ===================================================== */

      .shop-radio-collapsed-button {
        display:
          none;

        align-items:
          center;

        justify-content:
          flex-start;

        gap:
          10px;

        box-sizing:
          border-box;

        width:
          100%;

        min-height:
          52px;

        padding:
          12px 14px;

        border:
          1px solid
          rgba(69, 225, 232, 0.5);

        background:
          linear-gradient(
            145deg,
            #161715,
            #080908
          );

        color:
          #49e1e8;

        cursor:
          pointer;

        box-shadow:
          0 14px 40px
          rgba(0, 0, 0, 0.5);

        font-family:
          Arial,
          Helvetica,
          sans-serif;

        text-transform:
          uppercase;
      }


      .shop-radio-collapsed-button > span:first-child {
        font-size:
          1.05rem;
      }


      .shop-radio-collapsed-button strong {
        font-family:
          Georgia,
          "Times New Roman",
          serif;

        font-size:
          0.95rem;

        letter-spacing:
          0.02em;
      }


      .shop-radio-mini-play {
        display:
          grid;

        place-items:
          center;

        width:
          28px;

        height:
          28px;

        margin-left:
          auto;

        border:
          1px solid
          rgba(69, 225, 232, 0.65);

        border-radius:
          50%;

        font-size:
          0.65rem;

        animation:
          shop-radio-halo
          2.4s
          ease-in-out
          infinite;
      }


      .shop-radio.is-collapsed
      .shop-radio-top,

      .shop-radio.is-collapsed
      .shop-radio-body {
        display:
          none;
      }


      .shop-radio.is-collapsed
      .shop-radio-collapsed-button {
        display:
          flex;
      }


      /* =====================================================
         CYAN PLAY HALO
         ===================================================== */

      @keyframes shop-radio-halo {

        0%,
        100% {
          box-shadow:
            0 0 0 0
            rgba(69, 225, 232, 0.05),
            0 0 8px
            rgba(69, 225, 232, 0.16);
        }

        50% {
          box-shadow:
            0 0 0 7px
            rgba(69, 225, 232, 0.08),
            0 0 20px
            rgba(69, 225, 232, 0.55);
        }

      }


      /* =====================================================
         MOBILE
         ===================================================== */

      @media (max-width: 560px) {

        #shop-radio {
          right:
            10px;

          bottom:
            10px;

          width:
            calc(100vw - 20px);
        }


        .shop-radio-top {
          padding:
            11px 12px;
        }


        .shop-radio-body {
          padding:
            9px;
        }


        .shop-radio-screen {
          margin-bottom:
            8px;

          padding:
            8px 10px;
        }


        .shop-radio-player iframe {
          height:
            152px;
        }


        .shop-radio-bottom {
          padding-top:
            9px;
        }


        .shop-radio-motto {
          display:
            none;
        }


        .shop-radio-open {
          margin-left:
            auto;
        }

      }


      /* =====================================================
         REDUCED MOTION
         ===================================================== */

      @media (
        prefers-reduced-motion: reduce
      ) {

        .shop-radio-mini-play {
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
     COLLAPSE / EXPAND
     ======================================================= */

  const radio =
    mount.querySelector(
      ".shop-radio"
    );

  const collapseButton =
    mount.querySelector(
      ".shop-radio-collapse"
    );

  const collapsedButton =
    mount.querySelector(
      ".shop-radio-collapsed-button"
    );


  function collapseRadio() {
    radio.classList.add(
      "is-collapsed"
    );

    collapseButton.setAttribute(
      "aria-expanded",
      "false"
    );
  }


  function expandRadio() {
    radio.classList.remove(
      "is-collapsed"
    );

    collapseButton.setAttribute(
      "aria-expanded",
      "true"
    );
  }


  collapseButton.addEventListener(
    "click",
    collapseRadio
  );


  collapsedButton.addEventListener(
    "click",
    expandRadio
  );
})();
