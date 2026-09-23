/* =========================================================
   UNCLE MIKE — STICKERS
   Storefront Engine

   Product inventory lives in:
   /js/sticker-products.js
   ========================================================= */

function renderStickersPage() {
  const page =
    document.getElementById("page-content");

  if (!page) return;


  /* =======================================================
     LOAD CATALOG
     ======================================================= */

  if (
    typeof UNCLE_MIKE_STICKER_CATALOG === "undefined" ||
    typeof UNCLE_MIKE_STICKER_COLLECTIONS === "undefined"
  ) {

    page.innerHTML = `
      <section class="page-section">
        <div class="wrap">
          <h1>Sticker catalog unavailable.</h1>
        </div>
      </section>
    `;

    return;
  }


  /* =======================================================
     PAGE
     ======================================================= */

  page.innerHTML = `

    <section class="page-section sticker-store-hero">

      <div class="wrap">

        <p class="eyebrow">
          Uncle Mike Stickers
        </p>

        <h1 class="sticker-store-title">
          Buy Stickers!
        </h1>

        <div class="sticker-store-pricing">

          <span>
            Stickers $1.99 Each
          </span>

          <span>
            Flash Packs $5.99
          </span>

        </div>

      </div>

    </section>


    ${UNCLE_MIKE_STICKER_COLLECTIONS.map(collection => {

      const stickers =
        UNCLE_MIKE_STICKER_CATALOG.filter(
          sticker =>
            sticker.collection === collection.id
        );

      if (!stickers.length) {
        return "";
      }

      return `

        <section
          class="sticker-collection"
          id="${collection.id}"
        >

          <div class="wrap">

            <div class="sticker-collection-heading">

              <h2 class="sticker-collection-title">
                ${collection.title}
              </h2>

            </div>


            <div class="sticker-grid">

              ${stickers.map(sticker => `

                <article
                  class="sticker-card"
                  data-sticker-number="${sticker.number}"
                >

                  <div class="sticker-card-image">

                    <img
                      src="${sticker.image}"
                      alt="Sticker #${String(sticker.number).padStart(2, "0")}"
                      loading="lazy"
                    >

                  </div>


                  <div class="sticker-card-controls">

                    <span class="sticker-number">
                      #${String(sticker.number).padStart(2, "0")}
                    </span>


                    <div
                      class="sticker-quantity"
                      aria-label="Quantity for sticker ${sticker.number}"
                    >

                      <button
                        class="sticker-quantity-button sticker-minus"
                        type="button"
                        aria-label="Remove one sticker"
                      >
                        −
                      </button>

                      <span
                        class="sticker-quantity-value"
                        aria-live="polite"
                      >
                        0
                      </span>

                      <button
                        class="sticker-quantity-button sticker-plus"
                        type="button"
                        aria-label="Add one sticker"
                      >
                        +
                      </button>

                    </div>

                  </div>

                </article>

              `).join("")}

            </div>

          </div>

        </section>

      `;

    }).join("")}


    <section
      class="sticker-collection flash-pack-section"
      id="flash-packs"
    >

      <div class="wrap">

        <div class="sticker-collection-heading">

          <h2 class="sticker-collection-title">
            Flash Packs
          </h2>

        </div>


        <div class="flash-pack-placeholder">

          <span>
            $5.99
          </span>

          <strong>
            Packs Coming Soon
          </strong>

        </div>

      </div>

    </section>


    <section
      class="sticker-order-bar"
      id="sticker-order-bar"
      hidden
    >

      <div class="sticker-order-bar-inner">

        <div class="sticker-order-summary">

          <strong id="sticker-order-count">
            0 Stickers
          </strong>

          <span id="sticker-order-total">
            $0.00
          </span>

        </div>


        <button
          class="sticker-order-button"
          id="sticker-order-button"
          type="button"
        >
          Order →
        </button>

      </div>

    </section>

  `;


  injectStickerStoreStyles();
  initializeStickerOrdering();
}



/* =========================================================
   ORDERING
   ========================================================= */

function initializeStickerOrdering() {

  const quantities = {};

  const cards =
    document.querySelectorAll(
      ".sticker-card[data-sticker-number]"
    );

  const orderBar =
    document.getElementById(
      "sticker-order-bar"
    );

  const orderCount =
    document.getElementById(
      "sticker-order-count"
    );

  const orderTotal =
    document.getElementById(
      "sticker-order-total"
    );

  const orderButton =
    document.getElementById(
      "sticker-order-button"
    );


  cards.forEach(card => {

    const number =
      Number(
        card.dataset.stickerNumber
      );

    quantities[number] = 0;


    const minus =
      card.querySelector(
        ".sticker-minus"
      );

    const plus =
      card.querySelector(
        ".sticker-plus"
      );

    const value =
      card.querySelector(
        ".sticker-quantity-value"
      );


    plus.addEventListener(
      "click",
      () => {

        quantities[number] += 1;

        value.textContent =
          quantities[number];

        updateStickerOrder();

      }
    );


    minus.addEventListener(
      "click",
      () => {

        if (
          quantities[number] === 0
        ) {
          return;
        }

        quantities[number] -= 1;

        value.textContent =
          quantities[number];

        updateStickerOrder();

      }
    );

  });


  /* =======================================================
     UPDATE ORDER
     ======================================================= */

  function updateStickerOrder() {

    const totalQuantity =
      Object.values(quantities)
        .reduce(
          (total, quantity) =>
            total + quantity,
          0
        );


    const totalPrice =
      totalQuantity * 1.99;


    if (totalQuantity === 0) {

      orderBar.hidden = true;

      return;

    }


    orderBar.hidden = false;


    orderCount.textContent =
      `${totalQuantity} ${
        totalQuantity === 1
          ? "Sticker"
          : "Stickers"
      }`;


    orderTotal.textContent =
      `$${totalPrice.toFixed(2)}`;

  }


  /* =======================================================
     ORDER BUTTON
     ======================================================= */

  orderButton.addEventListener(
    "click",
    () => {

      const selected = [];


      UNCLE_MIKE_STICKER_CATALOG
        .forEach(sticker => {

          const quantity =
            quantities[
              sticker.number
            ] || 0;


          if (quantity > 0) {

            selected.push(
              `#${String(sticker.number).padStart(2, "0")} × ${quantity}`
            );

          }

        });


      if (!selected.length) {
        return;
      }


      const totalQuantity =
        Object.values(quantities)
          .reduce(
            (total, quantity) =>
              total + quantity,
            0
          );


      const totalPrice =
        totalQuantity * 1.99;


      const orderText =
        [
          "Uncle Mike Sticker Order",
          "",
          ...selected,
          "",
          `${totalQuantity} ${
            totalQuantity === 1
              ? "sticker"
              : "stickers"
          }`,
          `$${totalPrice.toFixed(2)}`
        ].join("\n");


      /* Copy order to clipboard */

      if (
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {

        navigator.clipboard
          .writeText(orderText)
          .catch(() => {});

      }


      /* Open Instagram */

      window.open(
        "https://www.instagram.com/unclemikecandoit/",
        "_blank",
        "noopener,noreferrer"
      );

    }
  );

}



/* =========================================================
   STICKER STORE STYLES
   ========================================================= */

function injectStickerStoreStyles() {

  if (
    document.getElementById(
      "uncle-mike-sticker-store-styles"
    )
  ) {
    return;
  }


  const style =
    document.createElement("style");


  style.id =
    "uncle-mike-sticker-store-styles";


  style.textContent = `

    /* =====================================================
       HERO
       ===================================================== */

    .sticker-store-hero {
      padding:
        clamp(52px, 7vw, 82px)
        0;
    }

    .sticker-store-title {
      max-width:
        900px;

      margin:
        0;

      color:
        var(--paper);

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size:
        clamp(
          3.5rem,
          8vw,
          7rem
        );

      line-height:
        0.9;

      letter-spacing:
        -0.045em;
    }


    /* =====================================================
       PRICING
       ===================================================== */

    .sticker-store-pricing {
      display:
        flex;

      flex-wrap:
        wrap;

      gap:
        10px
        24px;

      margin-top:
        26px;

      color:
        var(--muted);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size:
        0.76rem;

      font-weight:
        900;

      letter-spacing:
        0.11em;

      text-transform:
        uppercase;
    }


    /* =====================================================
       COLLECTION
       ===================================================== */

    .sticker-collection {
      padding:
        clamp(48px, 7vw, 82px)
        0;

      border-top:
        1px solid
        rgba(234, 215, 173, 0.18);
    }

    .sticker-collection-heading {
      margin-bottom:
        clamp(26px, 4vw, 40px);
    }

    .sticker-collection-title {
      max-width:
        900px;

      margin:
        0;

      color:
        var(--paper);

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size:
        clamp(
          2.6rem,
          5.8vw,
          5rem
        );

      line-height:
        0.92;

      letter-spacing:
        -0.045em;

      text-transform:
        uppercase;
    }


    /* =====================================================
       GRID
       ===================================================== */

    .sticker-grid {
      display:
        grid;

      grid-template-columns:
        repeat(3, minmax(0, 1fr));

      gap:
        clamp(14px, 2vw, 24px);
    }


    /* =====================================================
       CARD
       ===================================================== */

    .sticker-card {
      min-width:
        0;

      overflow:
        hidden;

      border:
        1px solid
        rgba(234, 215, 173, 0.2);

      background:
        var(--surface);
    }

    .sticker-card-image {
      display:
        flex;

      align-items:
        center;

      justify-content:
        center;

      aspect-ratio:
        1 / 1;

      padding:
        clamp(8px, 1.5vw, 16px);

      background:
        #0d1014;

      overflow:
        hidden;
    }

    .sticker-card-image img {
      display:
        block;

      width:
        100%;

      height:
        100%;

      object-fit:
        contain;
    }


    /* =====================================================
       NUMBER + QUANTITY
       ===================================================== */

    .sticker-card-controls {
      display:
        flex;

      align-items:
        center;

      justify-content:
        space-between;

      gap:
        12px;

      padding:
        14px
        16px;
    }

    .sticker-number {
      color:
        var(--paper);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size:
        0.78rem;

      font-weight:
        900;

      letter-spacing:
        0.1em;
    }

    .sticker-quantity {
      display:
        grid;

      grid-template-columns:
        34px
        30px
        34px;

      align-items:
        center;

      border:
        1px solid
        rgba(234, 215, 173, 0.28);
    }

    .sticker-quantity-button {
      display:
        flex;

      align-items:
        center;

      justify-content:
        center;

      width:
        34px;

      height:
        34px;

      padding:
        0;

      border:
        0;

      background:
        transparent;

      color:
        var(--paper);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size:
        1.2rem;

      line-height:
        1;

      cursor:
        pointer;
    }

    .sticker-quantity-button:active {
      background:
        rgba(234, 215, 173, 0.12);
    }

    .sticker-quantity-value {
      text-align:
        center;

      color:
        var(--paper);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size:
        0.8rem;

      font-weight:
        900;
    }


    /* =====================================================
       FLASH PACK
       ===================================================== */

    .flash-pack-placeholder {
      display:
        flex;

      align-items:
        center;

      justify-content:
        space-between;

      gap:
        20px;

      padding:
        24px;

      border:
        1px solid
        rgba(234, 215, 173, 0.2);

      background:
        var(--surface);
    }

    .flash-pack-placeholder span {
      color:
        var(--paper);

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size:
        2rem;

      font-weight:
        700;
    }

    .flash-pack-placeholder strong {
      color:
        var(--muted);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size:
        0.72rem;

      letter-spacing:
        0.12em;

      text-transform:
        uppercase;
    }


    /* =====================================================
       ORDER BAR
       ===================================================== */

    .sticker-order-bar {
      position:
        fixed;

      z-index:
        900;

      right:
        18px;

      bottom:
        82px;

      left:
        18px;

      pointer-events:
        none;
    }

    .sticker-order-bar[hidden] {
      display:
        none;
    }

    .sticker-order-bar-inner {
      display:
        flex;

      align-items:
        center;

      justify-content:
        space-between;

      gap:
        18px;

      max-width:
        760px;

      margin:
        0 auto;

      padding:
        12px;

      border:
        1px solid
        rgba(234, 215, 173, 0.4);

      background:
        rgba(11, 11, 9, 0.96);

      box-shadow:
        0 16px 40px
        rgba(0, 0, 0, 0.45);

      pointer-events:
        auto;
    }

    .sticker-order-summary {
      display:
        flex;

      flex-direction:
        column;

      gap:
        3px;

      padding-left:
        6px;
    }

    .sticker-order-summary strong {
      color:
        var(--paper);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size:
        0.78rem;

      letter-spacing:
        0.06em;

      text-transform:
        uppercase;
    }

    .sticker-order-summary span {
      color:
        var(--muted);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size:
        0.74rem;

      font-weight:
        700;
    }

    .sticker-order-button {
      flex:
        0 0 auto;

      min-height:
        46px;

      padding:
        0
        22px;

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
        0.74rem;

      font-weight:
        900;

      letter-spacing:
        0.1em;

      text-transform:
        uppercase;

      cursor:
        pointer;
    }


    /* =====================================================
       TABLET
       ===================================================== */

    @media (max-width: 900px) {

      .sticker-grid {
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
      }

    }


    /* =====================================================
       MOBILE
       ===================================================== */

    @media (max-width: 600px) {

      .sticker-store-hero {
        padding:
          42px
          0
          46px;
      }

      .sticker-store-title {
        font-size:
          clamp(
            3.25rem,
            15vw,
            4.2rem
          );
      }

      .sticker-store-pricing {
        margin-top:
          20px;

        gap:
          7px
          18px;

        font-size:
          0.68rem;
      }

      .sticker-collection {
        padding:
          44px
          0;
      }

      .sticker-collection-heading {
        margin-bottom:
          24px;
      }

      .sticker-collection-title {
        font-size:
          clamp(
            2.25rem,
            10.5vw,
            3.1rem
          );
      }

      .sticker-grid {
        grid-template-columns:
          repeat(2, minmax(0, 1fr));

        gap:
          10px;
      }

      .sticker-card-image {
        padding:
          6px;
      }

      .sticker-card-controls {
        padding:
          10px;

        gap:
          8px;
      }

      .sticker-number {
        font-size:
          0.68rem;
      }

      .sticker-quantity {
        grid-template-columns:
          30px
          24px
          30px;
      }

      .sticker-quantity-button {
        width:
          30px;

        height:
          32px;

        font-size:
          1.05rem;
      }

      .sticker-quantity-value {
        font-size:
          0.72rem;
      }

      .flash-pack-placeholder {
        padding:
          18px;
      }

      .flash-pack-placeholder span {
        font-size:
          1.6rem;
      }

      .sticker-order-bar {
        right:
          10px;

        bottom:
          78px;

        left:
          10px;
      }

      .sticker-order-bar-inner {
        padding:
          9px;
      }

      .sticker-order-button {
        min-height:
          42px;

        padding:
          0
          18px;
      }

    }

  `;


  document.head.appendChild(style);
}



/* =========================================================
   INITIAL PAGE LOAD
   ========================================================= */

if (!window.UNCLE_MIKE_ROUTER_ACTIVE) {
  renderStickersPage();
}
