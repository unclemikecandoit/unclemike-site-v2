/* =========================================================
   UNCLE MIKE — STICKERS
   Storefront + Cart + Square Checkout

   Product inventory lives in:
   /js/sticker-products.js
   ========================================================= */

const UNCLE_MIKE_CART_KEY =
  "uncleMikeCartV1";

const UNCLE_MIKE_CHECKOUT_URL =
  "https://uncle-mike-checkout.mgruttemeyer.workers.dev/checkout";


/* =========================================================
   CART STORAGE
   ========================================================= */

function getUncleMikeCart() {

  try {

    const saved =
      localStorage.getItem(
        UNCLE_MIKE_CART_KEY
      );

    if (!saved) {
      return {};
    }

    const parsed =
      JSON.parse(saved);

    return (
      parsed &&
      typeof parsed === "object"
    )
      ? parsed
      : {};

  } catch (error) {

    return {};

  }

}


function saveUncleMikeCart(cart) {

  try {

    localStorage.setItem(
      UNCLE_MIKE_CART_KEY,
      JSON.stringify(cart)
    );

  } catch (error) {}

}


function clearUncleMikeCart() {

  try {

    localStorage.removeItem(
      UNCLE_MIKE_CART_KEY
    );

  } catch (error) {}

}



/* =========================================================
   PRODUCT LOOKUP
   ========================================================= */

function getUncleMikeProducts() {

  const products = [];


  UNCLE_MIKE_STICKER_CATALOG
    .forEach(sticker => {

      products.push({

        key:
          `sticker:${sticker.number}`,

        type:
          "sticker",

        id:
          String(sticker.number),

        label:
          `#${String(sticker.number).padStart(2, "0")}`,

        image:
          sticker.image,

        price:
          Number(sticker.price) || 1.99

      });

    });


  UNCLE_MIKE_STICKER_PACKS
    .forEach(pack => {

      products.push({

        key:
          `pack:${pack.id}`,

        type:
          "pack",

        id:
          pack.id,

        label:
          `#${pack.id}`,

        image:
          pack.image,

        price:
          Number(pack.price) || 9.99

      });

    });


  return products;

}



/* =========================================================
   SUCCESS RETURN
   ========================================================= */

function isUncleMikeOrderComplete() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return (
    params.get("order") ===
    "complete"
  );

}


function renderUncleMikeOrderSuccess(page) {

  clearUncleMikeCart();


  page.innerHTML = `

    <section class="uncle-order-success">

      <div class="wrap">

        <p class="eyebrow">
          Order Confirmed
        </p>


        <h1>
          Thanks For Helping Me<br>
          Pay My Child Support.
        </h1>


        <div class="uncle-order-breakdown">

          <p class="uncle-order-breakdown-intro">
            A completely legitimate breakdown
            of your contribution:
          </p>


          <div class="uncle-order-breakdown-row">

            <strong>
              60%
            </strong>

            <span>
              Went to the state.
            </span>

          </div>


          <div class="uncle-order-breakdown-row">

            <strong>
              30%
            </strong>

            <span>
              Went to supplies.
            </span>

          </div>


          <div class="uncle-order-breakdown-row">

            <strong>
              10%
            </strong>

            <span>
              Went to Top Ramen and booger sugar.
            </span>

          </div>

        </div>


        <p class="uncle-order-confirmed">
          Your order is confirmed.
        </p>


        <a
          class="button uncle-order-back"
          href="/stickers/"
        >
          Back To Stickers →
        </a>

      </div>

    </section>

  `;


  injectStickerStoreStyles();

}



/* =========================================================
   PAGE
   ========================================================= */

function renderStickersPage() {

  const page =
    document.getElementById(
      "page-content"
    );

  if (!page) return;


  /* =======================================================
     SUCCESS SCREEN
     ======================================================= */

  if (
    isUncleMikeOrderComplete()
  ) {

    renderUncleMikeOrderSuccess(
      page
    );

    return;

  }


  /* =======================================================
     LOAD CATALOG
     ======================================================= */

  if (
    typeof UNCLE_MIKE_STICKER_CATALOG === "undefined" ||
    typeof UNCLE_MIKE_STICKER_COLLECTIONS === "undefined" ||
    typeof UNCLE_MIKE_STICKER_PACKS === "undefined"
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
     STORE
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
            10-Sticker Packs $9.99
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
                  data-product-key="sticker:${sticker.number}"
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


        <div class="flash-pack-grid">

          ${UNCLE_MIKE_STICKER_PACKS.map(pack => `

            <article
              class="flash-pack-card"
              data-product-key="pack:${pack.id}"
            >

              <div class="flash-pack-image">

                <img
                  src="${pack.image}"
                  alt="Sticker Pack ${pack.id}"
                  loading="lazy"
                >

              </div>


              <div class="flash-pack-controls">

                <div class="flash-pack-info">

                  <strong>
                    #${pack.id}
                  </strong>

                  <span>
                    ${pack.count} Stickers · $${pack.price.toFixed(2)}
                  </span>

                </div>


                <div
                  class="sticker-quantity"
                  aria-label="Quantity for sticker pack ${pack.id}"
                >

                  <button
                    class="sticker-quantity-button sticker-minus"
                    type="button"
                    aria-label="Remove one pack"
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
                    aria-label="Add one pack"
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


    <!-- CART BAR -->

    <section
      class="uncle-cart-bar"
      id="uncle-cart-bar"
      hidden
    >

      <div class="uncle-cart-bar-inner">

        <div class="uncle-cart-bar-summary">

          <strong id="uncle-cart-count">
            0 Items
          </strong>

          <span id="uncle-cart-total">
            $0.00
          </span>

        </div>


        <button
          class="uncle-cart-open-button"
          id="uncle-cart-open-button"
          type="button"
        >
          Support My Habits →
        </button>

      </div>

    </section>


    <!-- CART OVERLAY -->

    <div
      class="uncle-cart-overlay"
      id="uncle-cart-overlay"
      hidden
    ></div>


    <!-- CART DRAWER -->

    <aside
      class="uncle-cart-drawer"
      id="uncle-cart-drawer"
      aria-hidden="true"
    >

      <div class="uncle-cart-header">

        <div>

          <p class="eyebrow">
            Your Cart
          </p>

          <h2>
            Support<br>
            My Habits.
          </h2>

        </div>


        <button
          class="uncle-cart-close"
          id="uncle-cart-close"
          type="button"
          aria-label="Close cart"
        >
          ×
        </button>

      </div>


      <div
        class="uncle-cart-items"
        id="uncle-cart-items"
      ></div>


      <div class="uncle-cart-footer">

        <div class="uncle-cart-subtotal">

          <span>
            Subtotal
          </span>

          <strong id="uncle-cart-subtotal">
            $0.00
          </strong>

        </div>


        <div
          class="uncle-checkout-error"
          id="uncle-checkout-error"
          hidden
        ></div>


        <button
          class="uncle-checkout-button"
          id="uncle-checkout-button"
          type="button"
        >

          <span
            class="uncle-checkout-icon"
            aria-hidden="true"
          >
            ♀
          </span>

          <span>
            Checkout &amp; Help Me<br>
            Support Single Moms →
          </span>

        </button>

      </div>

    </aside>

  `;


  injectStickerStoreStyles();
  initializeUncleMikeCart();

}



/* =========================================================
   CART ENGINE
   ========================================================= */

function initializeUncleMikeCart() {

  const products =
    getUncleMikeProducts();

  const productMap =
    new Map(
      products.map(
        product => [
          product.key,
          product
        ]
      )
    );


  let cart =
    getUncleMikeCart();


  /* =======================================================
     REMOVE STALE PRODUCTS
     ======================================================= */

  Object.keys(cart)
    .forEach(key => {

      if (!productMap.has(key)) {

        delete cart[key];

        return;

      }


      const quantity =
        Number(cart[key]);


      if (
        !Number.isFinite(quantity) ||
        quantity <= 0
      ) {

        delete cart[key];

      }

    });


  saveUncleMikeCart(cart);


  /* =======================================================
     ELEMENTS
     ======================================================= */

  const productCards =
    document.querySelectorAll(
      "[data-product-key]"
    );

  const cartBar =
    document.getElementById(
      "uncle-cart-bar"
    );

  const cartCount =
    document.getElementById(
      "uncle-cart-count"
    );

  const cartTotal =
    document.getElementById(
      "uncle-cart-total"
    );

  const openButton =
    document.getElementById(
      "uncle-cart-open-button"
    );

  const overlay =
    document.getElementById(
      "uncle-cart-overlay"
    );

  const drawer =
    document.getElementById(
      "uncle-cart-drawer"
    );

  const closeButton =
    document.getElementById(
      "uncle-cart-close"
    );

  const cartItems =
    document.getElementById(
      "uncle-cart-items"
    );

  const subtotalElement =
    document.getElementById(
      "uncle-cart-subtotal"
    );

  const checkoutButton =
    document.getElementById(
      "uncle-checkout-button"
    );

  const checkoutError =
    document.getElementById(
      "uncle-checkout-error"
    );


  /* =======================================================
     QUANTITIES
     ======================================================= */

  function getQuantity(key) {

    return (
      Number(cart[key]) || 0
    );

  }


  function setQuantity(
    key,
    quantity
  ) {

    const cleanQuantity =
      Math.max(
        0,
        Math.floor(
          Number(quantity) || 0
        )
      );


    if (cleanQuantity === 0) {

      delete cart[key];

    } else {

      cart[key] =
        cleanQuantity;

    }


    saveUncleMikeCart(cart);
    renderCart();

  }


  function changeQuantity(
    key,
    amount
  ) {

    setQuantity(
      key,
      getQuantity(key) + amount
    );

  }


  /* =======================================================
     PRODUCT CONTROLS
     ======================================================= */

  productCards.forEach(card => {

    const key =
      card.dataset.productKey;

    const minus =
      card.querySelector(
        ".sticker-minus"
      );

    const plus =
      card.querySelector(
        ".sticker-plus"
      );


    if (minus) {

      minus.addEventListener(
        "click",
        () => {

          changeQuantity(
            key,
            -1
          );

        }
      );

    }


    if (plus) {

      plus.addEventListener(
        "click",
        () => {

          changeQuantity(
            key,
            1
          );

        }
      );

    }

  });


  /* =======================================================
     TOTALS
     ======================================================= */

  function getCartTotals() {

    let totalItems = 0;
    let subtotal = 0;


    Object.entries(cart)
      .forEach(
        ([key, quantity]) => {

          const product =
            productMap.get(key);

          if (!product) {
            return;
          }


          totalItems +=
            quantity;

          subtotal +=
            product.price *
            quantity;

        }
      );


    return {
      totalItems,
      subtotal
    };

  }


  /* =======================================================
     STORE QUANTITIES
     ======================================================= */

  function renderStoreQuantities() {

    productCards.forEach(card => {

      const key =
        card.dataset.productKey;

      const value =
        card.querySelector(
          ".sticker-quantity-value"
        );


      if (value) {

        value.textContent =
          getQuantity(key);

      }

    });

  }


  /* =======================================================
     CART ITEMS
     ======================================================= */

  function renderCartItems() {

    const selectedProducts =
      products.filter(
        product =>
          getQuantity(
            product.key
          ) > 0
      );


    if (!selectedProducts.length) {

      cartItems.innerHTML = `
        <div class="uncle-cart-empty">
          My habits remain unsupported.
        </div>
      `;

      return;

    }


    cartItems.innerHTML =
      selectedProducts
        .map(product => {

          const quantity =
            getQuantity(
              product.key
            );

          const lineTotal =
            product.price *
            quantity;


          return `

            <article
              class="uncle-cart-item"
              data-cart-product-key="${product.key}"
            >

              <div class="uncle-cart-item-image">

                <img
                  src="${product.image}"
                  alt="${product.label}"
                >

              </div>


              <div class="uncle-cart-item-info">

                <strong>
                  ${product.label}
                </strong>

                <span>
                  $${product.price.toFixed(2)}
                </span>

              </div>


              <div class="uncle-cart-item-actions">

                <div class="sticker-quantity">

                  <button
                    class="sticker-quantity-button cart-item-minus"
                    type="button"
                    aria-label="Remove one"
                  >
                    −
                  </button>

                  <span class="sticker-quantity-value">
                    ${quantity}
                  </span>

                  <button
                    class="sticker-quantity-button cart-item-plus"
                    type="button"
                    aria-label="Add one"
                  >
                    +
                  </button>

                </div>


                <span class="uncle-cart-line-total">
                  $${lineTotal.toFixed(2)}
                </span>

              </div>

            </article>

          `;

        })
        .join("");


    cartItems
      .querySelectorAll(
        "[data-cart-product-key]"
      )
      .forEach(item => {

        const key =
          item.dataset.cartProductKey;

        const minus =
          item.querySelector(
            ".cart-item-minus"
          );

        const plus =
          item.querySelector(
            ".cart-item-plus"
          );


        minus.addEventListener(
          "click",
          () => {

            changeQuantity(
              key,
              -1
            );

          }
        );


        plus.addEventListener(
          "click",
          () => {

            changeQuantity(
              key,
              1
            );

          }
        );

      });

  }


  /* =======================================================
     RENDER CART
     ======================================================= */

  function renderCart() {

    const {
      totalItems,
      subtotal
    } =
      getCartTotals();


    renderStoreQuantities();
    renderCartItems();


    cartCount.textContent =
      `${totalItems} ${
        totalItems === 1
          ? "Item"
          : "Items"
      }`;


    cartTotal.textContent =
      `$${subtotal.toFixed(2)}`;


    subtotalElement.textContent =
      `$${subtotal.toFixed(2)}`;


    cartBar.hidden =
      totalItems === 0;


    checkoutButton.disabled =
      totalItems === 0;

  }


  /* =======================================================
     DRAWER
     ======================================================= */

  function openCart() {

    overlay.hidden =
      false;

    drawer.classList.add(
      "is-open"
    );

    drawer.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "uncle-cart-open"
    );

  }


  function closeCart() {

    overlay.hidden =
      true;

    drawer.classList.remove(
      "is-open"
    );

    drawer.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "uncle-cart-open"
    );

  }


  openButton.addEventListener(
    "click",
    openCart
  );


  closeButton.addEventListener(
    "click",
    closeCart
  );


  overlay.addEventListener(
    "click",
    closeCart
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        drawer.classList.contains(
          "is-open"
        )
      ) {

        closeCart();

      }

    }
  );


  /* =======================================================
     LIVE SQUARE CHECKOUT
     ======================================================= */

  checkoutButton.addEventListener(
    "click",
    async () => {

      if (
        checkoutButton.disabled ||
        checkoutButton.classList.contains(
          "is-waiting"
        )
      ) {
        return;
      }


      const {
        totalItems
      } =
        getCartTotals();


      if (!totalItems) {
        return;
      }


      const originalHTML =
        checkoutButton.innerHTML;


      checkoutError.hidden =
        true;

      checkoutError.textContent =
        "";


      checkoutButton.classList.add(
        "is-waiting"
      );

      checkoutButton.disabled =
        true;


      checkoutButton.innerHTML = `
        <span>
          Getting Square Ready...
        </span>
      `;


      try {

        const response =
          await fetch(
            UNCLE_MIKE_CHECKOUT_URL,
            {

              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({
                  cart
                })

            }
          );


        let data = {};


        try {

          data =
            await response.json();

        } catch (error) {

          throw new Error(
            "Checkout returned an invalid response."
          );

        }


        if (
          !response.ok ||
          !data.ok ||
          !data.url
        ) {

          throw new Error(
            data.error ||
            "Square checkout could not be created."
          );

        }


        window.location.href =
          data.url;


      } catch (error) {

        console.error(
          "Uncle Mike checkout failed:",
          error
        );


        checkoutError.textContent =
          error?.message ||
          "Checkout couldn't start. Try again.";

        checkoutError.hidden =
          false;


        checkoutButton.innerHTML =
          originalHTML;

        checkoutButton.classList.remove(
          "is-waiting"
        );

        checkoutButton.disabled =
          false;

      }

    }
  );


  renderCart();

}



/* =========================================================
   STYLES
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
      max-width: 900px;
      margin: 0;
      color: var(--paper);

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size:
        clamp(3.5rem, 8vw, 7rem);

      line-height: 0.9;
      letter-spacing: -0.045em;
    }


    /* =====================================================
       PRICING
       ===================================================== */

    .sticker-store-pricing {
      display: flex;
      flex-wrap: wrap;

      gap:
        10px
        24px;

      margin-top: 26px;

      color: var(--muted);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.76rem;
      font-weight: 900;
      letter-spacing: 0.11em;
      text-transform: uppercase;
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
      max-width: 900px;
      margin: 0;

      color: var(--paper);

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size:
        clamp(2.6rem, 5.8vw, 5rem);

      line-height: 0.92;
      letter-spacing: -0.045em;
      text-transform: uppercase;
    }


    /* =====================================================
       STICKER GRID
       ===================================================== */

    .sticker-grid {
      display: grid;

      grid-template-columns:
        repeat(3, minmax(0, 1fr));

      gap:
        clamp(14px, 2vw, 24px);
    }

    .sticker-card {
      min-width: 0;
      overflow: hidden;

      border:
        1px solid
        rgba(234, 215, 173, 0.2);

      background:
        var(--surface);
    }

    .sticker-card-image {
      display: flex;
      align-items: center;
      justify-content: center;

      aspect-ratio: 1 / 1;

      padding:
        clamp(8px, 1.5vw, 16px);

      background: #0d1014;
      overflow: hidden;
    }

    .sticker-card-image img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }


    /* =====================================================
       PRODUCT CONTROLS
       ===================================================== */

    .sticker-card-controls,
    .flash-pack-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;

      padding:
        14px
        16px;
    }

    .sticker-number {
      color: var(--paper);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.78rem;
      font-weight: 900;
      letter-spacing: 0.1em;
    }

    .sticker-quantity {
      display: grid;

      grid-template-columns:
        34px
        30px
        34px;

      align-items: center;

      flex:
        0 0 auto;

      border:
        1px solid
        rgba(234, 215, 173, 0.28);
    }

    .sticker-quantity-button {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 34px;
      height: 34px;
      padding: 0;
      border: 0;

      background: transparent;
      color: var(--paper);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 1.2rem;
      line-height: 1;
      cursor: pointer;
    }

    .sticker-quantity-button:active {
      background:
        rgba(234, 215, 173, 0.12);
    }

    .sticker-quantity-value {
      text-align: center;
      color: var(--paper);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.8rem;
      font-weight: 900;
    }


    /* =====================================================
       FLASH PACKS
       ===================================================== */

    .flash-pack-grid {
      display: grid;

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

      gap:
        clamp(14px, 2vw, 24px);
    }

    .flash-pack-card {
      min-width: 0;
      overflow: hidden;

      border:
        1px solid
        rgba(234, 215, 173, 0.2);

      background:
        var(--surface);
    }

    .flash-pack-image {
      background: #0d1014;
      overflow: hidden;
    }

    .flash-pack-image img {
      display: block;
      width: 100%;
      height: auto;
    }

    .flash-pack-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .flash-pack-info strong {
      color: var(--paper);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.82rem;
      font-weight: 900;
      letter-spacing: 0.1em;
    }

    .flash-pack-info span {
      color: var(--muted);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }


    /* =====================================================
       CART BAR
       ===================================================== */

    .uncle-cart-bar {
      position: fixed;
      z-index: 900;

      right: 18px;
      bottom: 82px;
      left: 18px;

      pointer-events: none;
    }

    .uncle-cart-bar[hidden] {
      display: none;
    }

    .uncle-cart-bar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 18px;

      max-width: 760px;
      margin: 0 auto;
      padding: 12px;

      border:
        1px solid
        rgba(234, 215, 173, 0.4);

      background:
        rgba(11, 11, 9, 0.97);

      box-shadow:
        0 16px 40px
        rgba(0, 0, 0, 0.45);

      pointer-events: auto;
    }

    .uncle-cart-bar-summary {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding-left: 6px;
    }

    .uncle-cart-bar-summary strong {
      color: var(--paper);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.78rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .uncle-cart-bar-summary span {
      color: var(--muted);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.74rem;
      font-weight: 700;
    }

    .uncle-cart-open-button {
      min-height: 46px;

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

      font-size: 0.72rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
    }


    /* =====================================================
       OVERLAY
       ===================================================== */

    .uncle-cart-overlay {
      position: fixed;
      z-index: 1090;
      inset: 0;

      background:
        rgba(0, 0, 0, 0.7);

      backdrop-filter:
        blur(4px);
    }

    .uncle-cart-overlay[hidden] {
      display: none;
    }


    /* =====================================================
       CART DRAWER
       ===================================================== */

    .uncle-cart-drawer {
      position: fixed;
      z-index: 1100;

      top: 0;
      right: 0;

      width:
        min(460px, 100%);

      height:
        100dvh;

      display: grid;

      grid-template-rows:
        auto
        1fr
        auto;

      background:
        var(--ink);

      border-left:
        1px solid
        rgba(234, 215, 173, 0.25);

      box-shadow:
        -20px 0 60px
        rgba(0, 0, 0, 0.45);

      transform:
        translateX(105%);

      transition:
        transform 220ms ease;

      visibility:
        hidden;
    }

    .uncle-cart-drawer.is-open {
      transform:
        translateX(0);

      visibility:
        visible;
    }

    .uncle-cart-open {
      overflow: hidden;
    }


    /* =====================================================
       CART HEADER
       ===================================================== */

    .uncle-cart-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      gap: 20px;

      padding:
        28px
        24px;

      border-bottom:
        1px solid
        rgba(234, 215, 173, 0.18);
    }

    .uncle-cart-header h2 {
      margin:
        4px
        0
        0;

      color:
        var(--paper);

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size:
        clamp(2.8rem, 9vw, 4.4rem);

      line-height: 0.82;
      letter-spacing: -0.045em;
      text-transform: uppercase;
    }

    .uncle-cart-close {
      width: 42px;
      height: 42px;
      padding: 0;

      border:
        1px solid
        rgba(234, 215, 173, 0.28);

      background:
        transparent;

      color:
        var(--paper);

      font-size: 1.7rem;
      line-height: 1;
      cursor: pointer;
    }


    /* =====================================================
       CART ITEMS
       ===================================================== */

    .uncle-cart-items {
      overflow-y: auto;

      padding:
        8px
        24px;
    }

    .uncle-cart-empty {
      padding:
        34px
        0;

      color:
        var(--muted);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .uncle-cart-item {
      display: grid;

      grid-template-columns:
        72px
        minmax(0, 1fr);

      gap: 14px;

      padding:
        16px
        0;

      border-bottom:
        1px solid
        rgba(234, 215, 173, 0.14);
    }

    .uncle-cart-item-image {
      grid-row:
        1 / span 2;

      width: 72px;
      height: 72px;

      display: flex;
      align-items: center;
      justify-content: center;

      overflow: hidden;
      background: #0d1014;
    }

    .uncle-cart-item-image img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .uncle-cart-item-info {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;
    }

    .uncle-cart-item-info strong {
      color: var(--paper);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.82rem;
      font-weight: 900;
      letter-spacing: 0.08em;
    }

    .uncle-cart-item-info span {
      color: var(--muted);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.74rem;
      font-weight: 700;
    }

    .uncle-cart-item-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;
    }

    .uncle-cart-line-total {
      color: var(--paper);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.76rem;
      font-weight: 900;
    }


    /* =====================================================
       CART FOOTER
       ===================================================== */

    .uncle-cart-footer {
      padding:
        20px
        24px
        calc(
          20px +
          env(safe-area-inset-bottom)
        );

      border-top:
        1px solid
        rgba(234, 215, 173, 0.18);

      background:
        var(--ink);
    }

    .uncle-cart-subtotal {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 20px;

      margin-bottom: 16px;

      color:
        var(--paper);
    }

    .uncle-cart-subtotal span {
      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.72rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .uncle-cart-subtotal strong {
      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size: 1.5rem;
    }


    /* =====================================================
       CHECKOUT
       ===================================================== */

    .uncle-checkout-error {
      margin:
        0
        0
        14px;

      padding:
        12px
        14px;

      border:
        1px solid
        rgba(234, 215, 173, 0.3);

      color:
        var(--paper);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.72rem;
      font-weight: 800;
      line-height: 1.45;
    }

    .uncle-checkout-error[hidden] {
      display: none;
    }

    .uncle-checkout-button {
      width: 100%;
      min-height: 68px;

      display: flex;
      align-items: center;
      justify-content: center;

      gap: 14px;

      padding:
        10px
        18px;

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

      font-size: 0.76rem;
      font-weight: 900;
      line-height: 1.35;
      letter-spacing: 0.07em;
      text-align: left;
      text-transform: uppercase;

      cursor: pointer;
    }

    .uncle-checkout-icon {
      display: flex;
      align-items: center;
      justify-content: center;

      flex:
        0 0 auto;

      width: 34px;
      height: 44px;

      color:
        var(--ink);

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size: 2rem;
      font-weight: 700;

      transform:
        rotate(-10deg);
    }

    .uncle-checkout-button:disabled {
      opacity: 0.4;
      cursor: default;
    }

    .uncle-checkout-button.is-waiting {
      cursor: wait;
    }


    /* =====================================================
       ORDER SUCCESS
       ===================================================== */

    .uncle-order-success {
      min-height:
        calc(100svh - 100px);

      display: flex;
      align-items: center;

      padding:
        clamp(70px, 10vw, 130px)
        0;
    }

    .uncle-order-success h1 {
      max-width: 1000px;

      margin:
        10px
        0
        42px;

      color:
        var(--paper);

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size:
        clamp(3.2rem, 8vw, 7rem);

      line-height: 0.88;
      letter-spacing: -0.05em;
      text-transform: uppercase;
    }

    .uncle-order-breakdown {
      max-width: 720px;

      margin-bottom: 34px;

      border-top:
        1px solid
        rgba(234, 215, 173, 0.28);
    }

    .uncle-order-breakdown-intro {
      margin:
        0;

      padding:
        22px
        0;

      color:
        var(--muted);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.72rem;
      font-weight: 900;
      line-height: 1.5;
      letter-spacing: 0.1em;
      text-transform: uppercase;

      border-bottom:
        1px solid
        rgba(234, 215, 173, 0.18);
    }

    .uncle-order-breakdown-row {
      display: grid;

      grid-template-columns:
        100px
        minmax(0, 1fr);

      align-items: center;

      gap: 22px;

      padding:
        20px
        0;

      border-bottom:
        1px solid
        rgba(234, 215, 173, 0.18);
    }

    .uncle-order-breakdown-row strong {
      color:
        var(--paper);

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size:
        2rem;
    }

    .uncle-order-breakdown-row span {
      color:
        var(--copy);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.84rem;
      font-weight: 800;
      line-height: 1.45;
    }

    .uncle-order-confirmed {
      margin:
        0
        0
        24px;

      color:
        var(--paper);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.76rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .uncle-order-back {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      min-height: 48px;

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

      font-size: 0.72rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-decoration: none;
      text-transform: uppercase;
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
          clamp(3.25rem, 15vw, 4.2rem);
      }

      .sticker-store-pricing {
        margin-top: 20px;

        gap:
          7px
          18px;

        font-size: 0.68rem;
      }

      .sticker-collection {
        padding:
          44px
          0;
      }

      .sticker-collection-heading {
        margin-bottom: 24px;
      }

      .sticker-collection-title {
        font-size:
          clamp(2.25rem, 10.5vw, 3.1rem);
      }

      .sticker-grid {
        grid-template-columns:
          repeat(2, minmax(0, 1fr));

        gap: 10px;
      }

      .sticker-card-image {
        padding: 6px;
      }

      .sticker-card-controls,
      .flash-pack-controls {
        padding: 10px;
        gap: 8px;
      }

      .sticker-number {
        font-size: 0.68rem;
      }

      .sticker-quantity {
        grid-template-columns:
          30px
          24px
          30px;
      }

      .sticker-quantity-button {
        width: 30px;
        height: 32px;
        font-size: 1.05rem;
      }

      .sticker-quantity-value {
        font-size: 0.72rem;
      }

      .flash-pack-grid {
        grid-template-columns:
          1fr;
      }

      .flash-pack-info strong {
        font-size: 0.76rem;
      }

      .flash-pack-info span {
        font-size: 0.62rem;
      }


      /* CART */

      .uncle-cart-bar {
        right: 10px;
        bottom: 78px;
        left: 10px;
      }

      .uncle-cart-bar-inner {
        padding: 9px;
      }

      .uncle-cart-open-button {
        min-height: 42px;

        padding:
          0
          14px;

        font-size: 0.64rem;
      }

      .uncle-cart-drawer {
        width: 100%;
      }

      .uncle-cart-header {
        padding:
          22px
          18px;
      }

      .uncle-cart-items {
        padding:
          6px
          18px;
      }

      .uncle-cart-footer {
        padding:
          18px
          18px
          calc(
            18px +
            env(safe-area-inset-bottom)
          );
      }

      .uncle-checkout-button {
        min-height: 64px;
        font-size: 0.7rem;
      }


      /* SUCCESS */

      .uncle-order-success {
        align-items:
          flex-start;

        padding:
          58px
          0
          80px;
      }

      .uncle-order-success h1 {
        margin-bottom: 34px;

        font-size:
          clamp(3rem, 14vw, 4.5rem);
      }

      .uncle-order-breakdown-row {
        grid-template-columns:
          72px
          minmax(0, 1fr);

        gap: 16px;
      }

      .uncle-order-breakdown-row strong {
        font-size: 1.65rem;
      }

    }


    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    @media (
      prefers-reduced-motion:
      reduce
    ) {

      .uncle-cart-drawer {
        transition: none;
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
