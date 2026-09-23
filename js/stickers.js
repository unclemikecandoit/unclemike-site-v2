/* =========================================================
   UNCLE MIKE — STICKERS
   Storefront
   ========================================================= */

function renderStickersPage() {
  const page =
    document.getElementById("page-content");

  if (!page) return;


  /* =======================================================
     STICKER CATALOG
     ======================================================= */

  const stickerGroups = [

    /* -----------------------------------------------------
       GFY COLLECTION
       ----------------------------------------------------- */

    {
      id: "gfy",
      title: "GFY Collection",

      stickers: [

        {
          id: "jr-enemy-state",
          image:
            "../2D06CF4C-261D-4133-B64B-116872A1C0CE.png"
        },

        {
          id: "not-today-satan",
          image:
            "../800448F2-6C0A-4009-BFEE-44762F9757AB.png"
        },

        {
          id: "this-again",
          image:
            "../68BD59D5-32D0-4D26-B01D-9BA075EA7F80.png"
        },

        {
          id: "try-me",
          image:
            "../377B33A1-8F06-4B25-91F4-F2ED9B401CFE.png"
        },

        {
          id: "persuader",
          image:
            "../3246F0CD-1F4C-4C9B-88A1-986EEB60C397.png"
        },

        {
          id: "catch-me-never",
          image:
            "../0547ED23-02FD-4A8B-B163-76675EECB51C.png"
        },

        {
          id: "plan-b",
          image:
            "../E49DC6DB-EA61-4ADE-97D9-AFDF3E238F78.png"
        },

        {
          id: "fah-q",
          image:
            "../DE7935CB-F093-4900-9CCA-1FA60E648B29.png"
        },

        {
          id: "lol-k",
          image:
            "../B3D5BE20-E846-432C-A803-BEF686BBBAEF.png"
        },

        {
          id: "nope",
          image:
            "../AFA5E466-A470-444B-B73B-5BB66FD4F047.png"
        },

        {
          id: "walk-it-off",
          image:
            "../9CE55BC3-4DC7-43DA-957B-9B978289148D.png"
        },

        {
          id: "well-fuck",
          image:
            "../IMG_7328.jpeg"
        }

      ]
    },


    /* -----------------------------------------------------
       MY BRAIN IS BETTER THAN YOURS
       ----------------------------------------------------- */

    {
      id: "my-brain-is-better-than-yours",
      title: "My Brain Is Better Than Yours",

      stickers: [

        {
          id: "powered-autism-high-octane",
          image:
            "../53FBB857-6589-4B6B-AB15-511094D09D9D.png"
        },

        {
          id: "powered-autism-different-fuels",
          image:
            "../powered_by_autism_cutout.png"
        },

        {
          id: "autism-mental-lubrication",
          image:
            "../autism_sticker_cutout.png"
        },

        {
          id: "autism-spark",
          image:
            "../autism_spark_cutout.png"
        },

        {
          id: "autism-racing-division",
          image:
            "../autism_champions_cutout.png"
        },

        {
          id: "autism-cams",
          image:
            "../autism_cams_cutout.png"
        },

        {
          id: "autism-look-further",
          image:
            "../14FF8ADB-DFA3-48BC-B0CE-83C2BBA50ADD.png"
        },

        {
          id: "powered-autism",
          image:
            "../FD5E3664-835E-41C7-AC69-006356BAA991.png"
        },

        {
          id: "autism-fueling-ideas",
          image:
            "../C3562F6C-48D5-4DA6-A7B2-CB8F89A5AC99.png"
        },

        {
          id: "autism-high-performance-minds",
          image:
            "../CC263FC1-3A39-449F-997F-9FCCEE620C01.png"
        },

        {
          id: "autism-h",
          image:
            "../ED07CB72-68C8-41A9-B713-29C0F9A1E6B6.png"
        },

        {
          id: "autism-fueled-differently",
          image:
            "../7C481E72-DD74-418F-8852-5DB20A64C752.png"
        },

        {
          id: "powered-autism-exceptional-performance",
          image:
            "../73665BA7-29B3-4596-AA3E-18256B3378EF.png"
        }

      ]
    }

  ];


  /* =======================================================
     NUMBER THE STICKERS
     ======================================================= */

  let stickerNumber = 0;

  stickerGroups.forEach(group => {
    group.stickers.forEach(sticker => {
      stickerNumber += 1;
      sticker.number = stickerNumber;
    });
  });


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
          <span>Stickers $1.99 Each</span>
          <span>Flash Packs $5.99</span>
        </div>

      </div>

    </section>


    ${stickerGroups.map(group => `

      <section
        class="sticker-collection"
        id="${group.id}"
      >

        <div class="wrap">

          <div class="sticker-collection-heading">

            <h2 class="sticker-collection-title">
              ${group.title}
            </h2>

          </div>


          <div class="sticker-grid">

            ${group.stickers.map(sticker => `

              <article
                class="sticker-card"
                data-sticker-id="${sticker.id}"
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

    `).join("")}


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
  initializeStickerOrdering(stickerGroups);
}



/* =========================================================
   ORDERING
   ========================================================= */

function initializeStickerOrdering(stickerGroups) {

  const quantities = {};

  const cards =
    document.querySelectorAll(".sticker-card");

  const orderBar =
    document.getElementById("sticker-order-bar");

  const orderCount =
    document.getElementById("sticker-order-count");

  const orderTotal =
    document.getElementById("sticker-order-total");

  const orderButton =
    document.getElementById("sticker-order-button");


  cards.forEach(card => {

    const id =
      card.dataset.stickerId;

    quantities[id] = 0;

    const minus =
      card.querySelector(".sticker-minus");

    const plus =
      card.querySelector(".sticker-plus");

    const value =
      card.querySelector(".sticker-quantity-value");


    plus.addEventListener("click", () => {

      quantities[id] += 1;

      value.textContent =
        quantities[id];

      updateStickerOrder();

    });


    minus.addEventListener("click", () => {

      if (quantities[id] === 0) {
        return;
      }

      quantities[id] -= 1;

      value.textContent =
        quantities[id];

      updateStickerOrder();

    });

  });


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


  orderButton.addEventListener("click", () => {

    const selected = [];


    stickerGroups.forEach(group => {

      group.stickers.forEach(sticker => {

        const quantity =
          quantities[sticker.id] || 0;


        if (quantity > 0) {

          selected.push(
            `#${String(sticker.number).padStart(2, "0")} × ${quantity}`
          );

        }

      });

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


    try {

      navigator.clipboard.writeText(orderText);

    } catch (error) {

      /* Clipboard support varies by browser. */

    }


    window.open(
      "https://www.instagram.com/unclemikecandoit/",
      "_blank",
      "noopener,noreferrer"
    );

  });

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
       COLLECTIONS
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
       STICKER
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
       FLASH PACKS
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
