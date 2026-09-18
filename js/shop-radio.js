/* =========================================================
   UNCLE MIKE'S SHOP RADIO
   Tiny persistent Spotify launcher
   ========================================================= */

(function initShopRadio() {
  const mount =
    document.getElementById("shop-radio");

  if (!mount) return;


  /*
   * Never rebuild the radio during
   * persistent internal navigation.
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
     RADIO
     ======================================================= */

  mount.innerHTML = `

    <a
      class="shop-radio"
      href="${PLAYLIST_URL}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Uncle Mike's Shop Radio on Spotify"
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


      <span
        class="shop-radio-play"
        aria-hidden="true"
      >
        ▶
      </span>

    </a>

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
          10px;

        bottom:
          10px;

        z-index:
          8500;

        width:
          170px;

        font-family:
          Arial,
          Helvetica,
          sans-serif;
      }


      /* =====================================================
         RADIO
         ===================================================== */

      .shop-radio {
        display:
          grid;

        grid-template-columns:
          22px
          minmax(0, 1fr)
          30px;

        align-items:
          center;

        box-sizing:
          border-box;

        width:
          100%;

        min-height:
          42px;

        padding:
          5px 6px 5px 8px;

        border:
          1px solid
          rgba(69, 225, 232, 0.5);

        background:
          linear-gradient(
            145deg,
            #171816,
            #080908 72%
          );

        color:
          inherit;

        text-decoration:
          none;

        box-shadow:
          0 8px 24px
          rgba(0, 0, 0, 0.5),
          inset 0 0 0 1px
          rgba(255, 255, 255, 0.025);

        transition:
          transform
          150ms ease,
          border-color
          150ms ease;
      }


      .shop-radio:hover {
        transform:
          translateY(-2px);

        border-color:
          rgba(69, 225, 232, 0.8);
      }


      /* =====================================================
         NOTE
         ===================================================== */

      .shop-radio-note {
        color:
          #49e1e8;

        font-size:
          0.86rem;

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
          0.34rem;

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
          0.72rem;

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
         PLAY
         ===================================================== */

      .shop-radio-play {
        display:
          grid;

        place-items:
          center;

        width:
          25px;

        height:
          25px;

        border:
          1px solid
          rgba(69, 225, 232, 0.7);

        border-radius:
          50%;

        background:
          #071011;

        color:
          #49e1e8;

        font-size:
          0.52rem;

        line-height:
          1;

        box-shadow:
          0 0 8px
          rgba(69, 225, 232, 0.2);

        animation:
          shop-radio-halo
          2.4s
          ease-in-out
          infinite;
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
         MOBILE
         ===================================================== */

      @media (max-width: 560px) {

        #shop-radio {
          right:
            7px;

          bottom:
            7px;

          width:
            160px;
        }


        .shop-radio {
          grid-template-columns:
            20px
            minmax(0, 1fr)
            28px;

          min-height:
            40px;

          padding:
            4px 5px 4px 7px;
        }


        .shop-radio-note {
          font-size:
            0.78rem;
        }


        .shop-radio-kicker {
          font-size:
            0.31rem;
        }


        .shop-radio-title {
          font-size:
            0.67rem;
        }


        .shop-radio-play {
          width:
            23px;

          height:
            23px;

          font-size:
            0.48rem;
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

})();
