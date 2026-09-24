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

const UNCLE_MIKE_SHIPPING =
  10;


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

  document.body.classList.remove(
    "uncle-cart-open",
    "uncle-cart-has-items"
  );


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


  document.body.classList.remove(
    "uncle-cart-open",
    "uncle-cart-has-items"
  );


  if (
    isUncleMikeOrderComplete()
  ) {

    renderUncleMikeOrderSuccess(
      page
    );

    return;

  }


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


    <section class="uncle-arcade-pitch">

      <div class="uncle-arcade-chaos">

        <div
          class="uncle-neon-star uncle-neon-star-one"
          aria-hidden="true"
        >
          ★
        </div>

        <div
          class="uncle-neon-star uncle-neon-star-two"
          aria-hidden="true"
        >
          ★
        </div>


        <div class="uncle-arcade-line uncle-arcade-line-one">
          THE
          <span class="uncle-neon-arcade">
            ARCADE
          </span>
          CHARGES
        </div>


        <div class="uncle-arcade-line uncle-arcade-line-two">

          <span class="uncle-neon-price">
            $2
          </span>

          <span class="uncle-random-sticker">
            FOR A RANDOM STICKER.
          </span>

        </div>


        <div class="uncle-you-pick">
          You get to pick this one.
        </div>


        <div class="uncle-cheap-sign">
          QUIT BEING CHEAP.
        </div>


        <div
          class="uncle-neon-arrow"
          aria-hidden="true"
        >
          ↓
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
          Checkout — Support My Habits →
        </button>

      </div>

    </section>


    <div
      class="uncle-cart-overlay"
      id="uncle-cart-overlay"
      hidden
    ></div>


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

        <div class="uncle-cart-totals">

          <div class="uncle-cart-total-row">

            <span>
              Subtotal
            </span>

            <strong id="uncle-cart-subtotal">
              $0.00
            </strong>

          </div>


          <div class="uncle-cart-total-row">

            <span>
              Shipping
            </span>

            <strong>
              $10.00
            </strong>

          </div>


          <div class="uncle-cart-total-row uncle-cart-tax-row">

            <span>
              Sales Tax
            </span>

            <strong>
              Calculated by Square
            </strong>

          </div>


          <div class="uncle-cart-total-row uncle-cart-grand-total">

            <span>
              Total Before Tax
            </span>

            <strong id="uncle-cart-before-tax">
              $10.00
            </strong>

          </div>

        </div>


        <p class="uncle-shipping-note">
          $10 flat-rate shipping · Contiguous U.S. only
        </p>


        <div
          class="uncle-checkout-error"
          id="uncle-checkout-error"
          hidden
        ></div>


        <button
          class="uncle-checkout-button"
          id="uncle-checkout-button"
          type="button"
          aria-label="Checkout and help me support single moms"
        >

<img
            class="uncle-checkout-art"
            id="uncle-checkout-art"
            src="/stickers/checkout-dancer-1.png"
            alt=""
          >

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

  const beforeTaxElement =
    document.getElementById(
      "uncle-cart-before-tax"
    );

  const checkoutButton =
    document.getElementById(
      "uncle-checkout-button"
    );

  const checkoutError =
    document.getElementById(
      "uncle-checkout-error"
    );


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


    const beforeTax =
      subtotal +
      UNCLE_MIKE_SHIPPING;


    return {
      totalItems,
      subtotal,
      beforeTax
    };

  }


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


  function renderCart() {

    const {
      totalItems,
      subtotal,
      beforeTax
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


    beforeTaxElement.textContent =
      `$${beforeTax.toFixed(2)}`;


    cartBar.hidden =
      totalItems === 0;


    checkoutButton.disabled =
      totalItems === 0;


    document.body.classList.toggle(
      "uncle-cart-has-items",
      totalItems > 0
    );


    if (
      totalItems === 0 &&
      drawer.classList.contains(
        "is-open"
      )
    ) {

      closeCart();

    }

  }


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
     STOP-MOTION STRIPPER
     ======================================================= */

  const uncleCheckoutFrames = [
    "/stickers/checkout-dancer-1.png",
    "/stickers/checkout-dancer-2.png",
    "/stickers/checkout-dancer-3.png",
    "/stickers/checkout-dancer-4.png",
    "/stickers/checkout-dancer-5.png"
  ];


  uncleCheckoutFrames.forEach(src => {

    const image = new Image();

    image.src = src;

  });


  let uncleCheckoutDanceTimer = null;


  function getCheckoutArt() {

    return document.getElementById(
      "uncle-checkout-art"
    );

  }


  function showCheckoutFrame(index) {

    const art = getCheckoutArt();

    if (!art) {
      return;
    }

    art.src = uncleCheckoutFrames[index];

  }


  function runCheckoutDance() {

    if (
      checkoutButton.classList.contains(
        "is-waiting"
      )
    ) {
      return;
    }


    const sequence = [
      1,
      2,
      3,
      4,
      0
    ];

    let step = 0;


    function advanceFrame() {

      if (
        step >= sequence.length ||
        checkoutButton.classList.contains(
          "is-waiting"
        )
      ) {

        showCheckoutFrame(0);

        return;

      }


      showCheckoutFrame(
        sequence[step]
      );

      step += 1;


      window.setTimeout(
        advanceFrame,
        125
      );

    }


    advanceFrame();

  }


  function scheduleCheckoutDance() {

    window.clearTimeout(
      uncleCheckoutDanceTimer
    );


    uncleCheckoutDanceTimer =
      window.setTimeout(
        function danceLoop() {

          runCheckoutDance();


          uncleCheckoutDanceTimer =
            window.setTimeout(
              danceLoop,
              2625
            );

        },
        2000
      );

  }


  showCheckoutFrame(0);

  scheduleCheckoutDance();

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


      window.clearTimeout(
        uncleCheckoutDanceTimer
      );


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
        <span class="uncle-checkout-loading">
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


        showCheckoutFrame(0);

        scheduleCheckoutDance();

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
       SHOP RADIO + CART COORDINATION
       ===================================================== */

    #shop-radio {
      transition:
        bottom 180ms ease,
        opacity 140ms ease,
        visibility 140ms ease;
    }

    body.uncle-cart-has-items:not(.uncle-cart-open)
    #shop-radio {
      bottom: 148px;
    }

    body.uncle-cart-open
    #shop-radio {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
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
       CART FOOTER / TOTALS
       ===================================================== */

    .uncle-cart-footer {
      padding:
        18px
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

    .uncle-cart-totals {
      margin-bottom: 10px;
    }

    .uncle-cart-total-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 20px;

      padding:
        6px
        0;

      color:
        var(--paper);
    }

    .uncle-cart-total-row span {
      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.68rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .uncle-cart-total-row strong {
      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.76rem;
      font-weight: 900;
    }

    .uncle-cart-tax-row {
      color:
        var(--muted);
    }

    .uncle-cart-tax-row strong {
      font-size: 0.66rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .uncle-cart-grand-total {
      margin-top: 8px;

      padding-top: 14px;

      border-top:
        1px solid
        rgba(234, 215, 173, 0.18);
    }

    .uncle-cart-grand-total span {
      font-size: 0.72rem;
    }

    .uncle-cart-grand-total strong {
      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size: 1.5rem;
    }

    .uncle-shipping-note {
      margin:
        0
        0
        16px;

      color:
        var(--muted);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size: 0.61rem;
      font-weight: 800;
      line-height: 1.4;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }


    /* =====================================================
       CHECKOUT ERROR
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


    /* =====================================================
       EXACT APPROVED CHECKOUT ART
       ===================================================== */

    .uncle-checkout-button {
      position: relative;
      isolation: isolate;

      display: block;

      width: 100%;

      padding: 0;
      border: 0;

      background: transparent;

      cursor: pointer;

      overflow: visible;

      border-radius: 12px;

      animation:
        uncleClubPulse
        1.35s
        ease-in-out
        infinite;
    }

    .uncle-checkout-button::before {
      content: "";

      position: absolute;
      z-index: -1;

      inset: 4px;

      border-radius: 14px;

      opacity: 0.75;

      background:
        linear-gradient(
          90deg,
          rgba(255, 35, 105, 0.9),
          rgba(255, 170, 45, 0.88),
          rgba(255, 35, 115, 0.9),
          rgba(255, 185, 55, 0.88),
          rgba(255, 35, 105, 0.9)
        );

      background-size:
        300% 100%;

      filter:
        blur(14px);

      animation:
        uncleClubSweep
        2.2s
        linear
        infinite;
    }

    .uncle-checkout-art {
      position: relative;
      z-index: 2;

      display: block;

      width: 100%;
      height: auto;

      border-radius: 10px;

      pointer-events: none;

      user-select: none;
      -webkit-user-select: none;
    }

    .uncle-checkout-loading {
      position: relative;
      z-index: 2;

      display: flex;
      align-items: center;
      justify-content: center;

      width: 100%;
      min-height: 82px;

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
    }


    @keyframes uncleClubPulse {

      0%,
      100% {
        filter:
          brightness(0.98)
          saturate(0.98);

        box-shadow:
          0 0 8px
          rgba(255, 50, 110, 0.22),
          0 0 16px
          rgba(255, 175, 55, 0.15);
      }

      30% {
        filter:
          brightness(1.04)
          saturate(1.08);

        box-shadow:
          0 0 16px
          rgba(255, 40, 110, 0.42),
          0 0 28px
          rgba(255, 40, 110, 0.2);
      }

      60% {
        filter:
          brightness(1.08)
          saturate(1.15);

        box-shadow:
          0 0 20px
          rgba(255, 175, 50, 0.5),
          0 0 36px
          rgba(255, 45, 110, 0.24);
      }

      82% {
        filter:
          brightness(1.03)
          saturate(1.06);

        box-shadow:
          0 0 16px
          rgba(255, 45, 115, 0.4),
          0 0 28px
          rgba(255, 175, 55, 0.18);
      }

    }


    @keyframes uncleClubSweep {

      0% {
        background-position:
          0% 50%;
      }

      100% {
        background-position:
          300% 50%;
      }

    }


    .uncle-checkout-button:active {
      transform:
        scale(0.985);
    }

    .uncle-checkout-button:disabled {
      opacity: 0.45;
      cursor: default;

      animation: none;
    }

    .uncle-checkout-button:disabled::before {
      display: none;
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
      margin: 0;

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
          12px;

        font-size: 0.61rem;
        line-height: 1.2;
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
          15px
          18px
          calc(
            16px +
            env(safe-area-inset-bottom)
          );
      }

      .uncle-cart-total-row {
        padding:
          4px
          0;
      }

      .uncle-cart-grand-total {
        margin-top: 6px;
        padding-top: 11px;
      }

      .uncle-cart-grand-total strong {
        font-size: 1.35rem;
      }

      .uncle-shipping-note {
        margin-bottom: 12px;
        font-size: 0.56rem;
      }


      /* Keep exact button artwork intact on mobile */

      .uncle-checkout-button {
        width: 100%;
      }

      .uncle-checkout-art {
        width: 100%;
        height: auto;
      }


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


    @media (min-width: 601px) {

      body.uncle-cart-has-items:not(.uncle-cart-open)
      #shop-radio {
        bottom: 152px;
      }

    }


    @media (
      prefers-reduced-motion:
      reduce
    ) {

      .uncle-cart-drawer,
      #shop-radio,
      .uncle-checkout-button,
      .uncle-checkout-button::before {
        transition: none;
        animation: none;
      }

    }

    /* =====================================================
       ARCADE PITCH
       ===================================================== */

    .uncle-arcade-pitch {
      position: relative;
      overflow: hidden;

      padding:
        clamp(70px, 10vw, 130px)
        20px
        clamp(85px, 11vw, 145px);

      border-top:
        1px solid
        rgba(234, 215, 173, 0.18);

      border-bottom:
        1px solid
        rgba(234, 215, 173, 0.18);

      background:
        radial-gradient(
          circle at 18% 30%,
          rgba(0, 238, 255, 0.12),
          transparent 24rem
        ),
        radial-gradient(
          circle at 82% 65%,
          rgba(255, 0, 153, 0.14),
          transparent 25rem
        ),
        radial-gradient(
          circle at 52% 110%,
          rgba(255, 170, 0, 0.09),
          transparent 25rem
        ),
        #090908;
    }


    .uncle-arcade-pitch::before {
      content: "";

      position: absolute;
      inset: 0;

      pointer-events: none;

      opacity: 0.18;

      background-image:
        linear-gradient(
          rgba(255,255,255,0.035) 1px,
          transparent 1px
        ),
        linear-gradient(
          90deg,
          rgba(255,255,255,0.025) 1px,
          transparent 1px
        );

      background-size:
        38px 38px;
    }


    .uncle-arcade-chaos {
      position: relative;
      z-index: 1;

      width:
        min(1050px, 100%);

      margin:
        0 auto;

      text-align:
        center;
    }


    .uncle-arcade-line {
      position: relative;

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-weight: 1000;
      text-transform: uppercase;

      line-height: 0.92;
    }


    .uncle-arcade-line-one {
      color: #f4e7c7;

      font-size:
        clamp(
          2.3rem,
          6.7vw,
          6.4rem
        );

      letter-spacing:
        -0.055em;

      transform:
        rotate(-1deg);
    }


    /* -------------------------
       ARCADE NEON
       ------------------------- */

    .uncle-neon-arcade {
      display: inline-block;

      margin:
        0 0.08em;

      color:
        #77f9ff;

      font-family:
        "Trebuchet MS",
        Arial,
        sans-serif;

      font-style:
        italic;

      letter-spacing:
        -0.06em;

      text-shadow:
        0 0 3px #ffffff,
        0 0 7px #65f8ff,
        0 0 14px #00eaff,
        0 0 28px #00bfff,
        0 0 48px rgba(0,191,255,0.75);

      animation:
        uncleArcadeFlicker
        5s
        infinite;
    }


    /* -------------------------
       $2
       ------------------------- */

    .uncle-arcade-line-two {
      display: flex;

      justify-content:
        center;

      align-items:
        center;

      flex-wrap:
        wrap;

      gap:
        12px
        clamp(16px, 3vw, 38px);

      margin-top:
        clamp(20px, 4vw, 40px);
    }


    .uncle-neon-price {
      display:
        inline-block;

      color:
        #ffd84d;

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size:
        clamp(
          5.2rem,
          15vw,
          12rem
        );

      font-style:
        italic;

      line-height:
        0.72;

      transform:
        rotate(-6deg);

      text-shadow:
        0 0 4px #fff6b0,
        0 0 10px #ffd84d,
        0 0 20px #ffad00,
        0 0 42px rgba(255,140,0,0.9),
        5px 8px 0 rgba(0,0,0,0.7);
    }


    /* -------------------------
       RANDOM STICKER
       ------------------------- */

    .uncle-random-sticker {
      display:
        inline-block;

      padding:
        12px 18px;

      color:
        #0b0b09;

      background:
        #f5eee0;

      box-shadow:
        7px 8px 0 #ff3f9f;

      font-family:
        "Arial Black",
        Arial,
        sans-serif;

      font-size:
        clamp(
          1.35rem,
          4.2vw,
          3.6rem
        );

      letter-spacing:
        -0.045em;

      transform:
        rotate(2deg);
    }


    /* -------------------------
       HANDWRITTEN BREAK
       ------------------------- */

    .uncle-you-pick {
      position:
        relative;

      width:
        max-content;

      max-width:
        90%;

      margin:
        clamp(55px, 8vw, 90px)
        auto
        clamp(35px, 5vw, 55px);

      color:
        #ff76bd;

      font-family:
        "Comic Sans MS",
        "Bradley Hand",
        cursive;

      font-size:
        clamp(
          1.8rem,
          5vw,
          4.3rem
        );

      font-weight:
        700;

      line-height:
        1;

      transform:
        rotate(-3deg);

      text-shadow:
        0 0 6px #ff3f9f,
        0 0 14px rgba(255,63,159,0.9),
        0 0 30px rgba(255,0,128,0.55);
    }


    .uncle-you-pick::after {
      content: "";

      position:
        absolute;

      left:
        4%;

      right:
        -3%;

      bottom:
        -14px;

      height:
        5px;

      border-radius:
        50%;

      background:
        #ff76bd;

      box-shadow:
        0 0 8px #ff3f9f,
        0 0 20px #ff0088;

      transform:
        rotate(1deg);
    }


    /* -------------------------
       QUIT BEING CHEAP
       ------------------------- */

    .uncle-cheap-sign {
      display:
        inline-block;

      position:
        relative;

      padding:
        0.17em
        0.28em
        0.13em;

      color:
        #ff4fa7;

      border:
        4px solid
        #ff4fa7;

      border-radius:
        10px;

      font-family:
        "Arial Black",
        Impact,
        sans-serif;

      font-size:
        clamp(
          2.6rem,
          9vw,
          8rem
        );

      font-weight:
        1000;

      letter-spacing:
        -0.055em;

      line-height:
        0.88;

      transform:
        rotate(1deg);

      text-shadow:
        0 0 3px #ffffff,
        0 0 7px #ff75ba,
        0 0 15px #ff1493,
        0 0 35px #ff006f,
        0 0 60px rgba(255,0,100,0.75);

      box-shadow:
        inset 0 0 8px rgba(255,255,255,0.35),
        0 0 7px #ff4fa7,
        0 0 20px #ff0077,
        0 0 48px rgba(255,0,119,0.65);

      animation:
        uncleCheapBuzz
        3.7s
        infinite;
    }


    /* -------------------------
       STARS + ARROW
       ------------------------- */

    .uncle-neon-star {
      position:
        absolute;

      color:
        #72ff72;

      font-family:
        Arial,
        sans-serif;

      text-shadow:
        0 0 6px #72ff72,
        0 0 15px #00ff55,
        0 0 30px #00dd44;

      pointer-events:
        none;
    }


    .uncle-neon-star-one {
      top:
        -25px;

      left:
        2%;

      font-size:
        clamp(2rem, 5vw, 4rem);

      transform:
        rotate(-18deg);
    }


    .uncle-neon-star-two {
      right:
        1%;

      top:
        38%;

      color:
        #a77cff;

      font-size:
        clamp(1.8rem, 4vw, 3.5rem);

      transform:
        rotate(17deg);

      text-shadow:
        0 0 6px #a77cff,
        0 0 16px #7c42ff,
        0 0 30px #642cff;
    }


    .uncle-neon-arrow {
      margin-top:
        35px;

      color:
        #72ff72;

      font-family:
        Arial,
        sans-serif;

      font-size:
        clamp(3rem, 7vw, 6rem);

      font-weight:
        900;

      line-height:
        1;

      text-shadow:
        0 0 5px #72ff72,
        0 0 15px #00ff66,
        0 0 30px rgba(0,255,102,0.8);

      animation:
        uncleArrowBounce
        1.15s
        ease-in-out
        infinite;
    }


    /* -------------------------
       NEON MOVEMENT
       ------------------------- */

    @keyframes uncleArcadeFlicker {

      0%,
      18%,
      22%,
      24%,
      53%,
      55%,
      100% {
        opacity: 1;
      }

      20%,
      23%,
      54% {
        opacity: 0.55;
      }

    }


    @keyframes uncleCheapBuzz {

      0%,
      92%,
      94%,
      96%,
      100% {
        opacity: 1;
      }

      93%,
      95% {
        opacity: 0.62;
      }

    }


    @keyframes uncleArrowBounce {

      0%,
      100% {
        transform:
          translateY(0);
      }

      50% {
        transform:
          translateY(12px);
      }

    }


    @media (
      prefers-reduced-motion:
      reduce
    ) {

      .uncle-neon-arcade,
      .uncle-cheap-sign,
      .uncle-neon-arrow {
        animation:
          none;
      }

    }


    @media (
      max-width:
      600px
    ) {

      .uncle-arcade-line-two {
        flex-direction:
          column;

        gap:
          30px;
      }


      .uncle-random-sticker {
        max-width:
          92%;

        box-shadow:
          5px
          6px
          0
          #ff3f9f;
      }


      .uncle-cheap-sign {
        border-width:
          3px;
      }


      .uncle-neon-star-two {
        top:
          45%;
      }

    }

    /* =====================================================
       ARCADE PITCH — RUBBER BAND PASS
       ===================================================== */

    .uncle-arcade-pitch {
      padding:
        clamp(38px, 5vw, 64px)
        20px
        clamp(42px, 5.5vw, 70px);
    }


    .uncle-arcade-line-one {
      line-height: 0.84;
    }


    .uncle-arcade-line-two {
      gap:
        8px
        clamp(14px, 2vw, 28px);

      margin-top:
        clamp(10px, 2vw, 20px);
    }


    .uncle-neon-price {
      font-size:
        clamp(4.5rem, 12vw, 9rem);

      /* SHARP CORE + OUTER GLOW */
      -webkit-text-stroke:
        1px
        #ffe87c;

      text-shadow:
        0 0 2px #fff,
        0 0 5px #ffd84d,
        0 0 13px rgba(255, 184, 0, 0.9),
        0 0 30px rgba(255, 140, 0, 0.55);
    }


    .uncle-neon-arcade {
      -webkit-text-stroke:
        1px
        #b9fcff;

      text-shadow:
        0 0 2px #fff,
        0 0 5px #6ffaff,
        0 0 13px rgba(0, 234, 255, 0.85),
        0 0 28px rgba(0, 191, 255, 0.55);
    }


    .uncle-random-sticker {
      padding:
        8px
        14px;

      box-shadow:
        5px
        5px
        0
        #ff3f9f;
    }


    .uncle-you-pick {
      margin:
        clamp(28px, 4vw, 44px)
        auto
        clamp(24px, 3vw, 36px);

      -webkit-text-stroke:
        0.5px
        #ff9dce;

      text-shadow:
        0 0 2px #ffb0d7,
        0 0 6px #ff3f9f,
        0 0 16px rgba(255, 0, 128, 0.65);
    }


    .uncle-cheap-sign {
      padding:
        0.12em
        0.22em
        0.1em;

      border-width:
        3px;

      -webkit-text-stroke:
        1px
        #ff86c2;

      text-shadow:
        0 0 2px #fff,
        0 0 5px #ff65b2,
        0 0 13px rgba(255, 20, 147, 0.9),
        0 0 30px rgba(255, 0, 100, 0.55);

      box-shadow:
        inset 0 0 4px rgba(255,255,255,0.25),
        0 0 5px #ff4fa7,
        0 0 14px rgba(255, 0, 119, 0.85),
        0 0 32px rgba(255, 0, 119, 0.45);
    }


    .uncle-neon-arrow {
      margin-top:
        18px;

      font-size:
        clamp(2.4rem, 5vw, 4rem);

      -webkit-text-stroke:
        1px
        #a0ffa0;

      text-shadow:
        0 0 2px #fff,
        0 0 5px #72ff72,
        0 0 14px rgba(0, 255, 102, 0.7);
    }


    .uncle-neon-star {
      text-shadow:
        0 0 2px currentColor,
        0 0 6px currentColor,
        0 0 15px currentColor;
    }


    @media (max-width: 600px) {

      .uncle-arcade-pitch {
        padding:
          34px
          14px
          42px;
      }


      .uncle-arcade-line-two {
        gap: 16px;
      }


      .uncle-you-pick {
        margin:
          26px
          auto
          24px;
      }


      .uncle-neon-arrow {
        margin-top: 14px;
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
