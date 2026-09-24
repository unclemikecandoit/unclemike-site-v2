/* =========================================================
   UNCLE MIKE CAN DO IT
   SQUARE CHECKOUT WORKER

   File:
   /worker/worker.js

   Required Cloudflare runtime variables:
   SQUARE_ACCESS_TOKEN
   SQUARE_LOCATION_ID

   Endpoint:
   POST /checkout
   ========================================================= */


/* =========================================================
   CONFIG
   ========================================================= */

const SITE_ORIGIN =
  "https://unclemikecandoit.com";

const SUCCESS_URL =
  "https://unclemikecandoit.com/stickers/?order=complete";

const SQUARE_API_VERSION =
  "2026-01-22";

const SHIPPING_FEE =
  1000; // $10.00


/* =========================================================
   SERVER-SIDE PRODUCT CATALOG

   IMPORTANT:
   Prices live here too.

   Browser prices are DISPLAY ONLY.
   Checkout trusts this catalog, not the browser.
   ========================================================= */

const PRODUCTS = {

  /* INDIVIDUAL STICKERS */

  "sticker:1": {
    name: "Sticker #01",
    price: 199
  },

  "sticker:2": {
    name: "Sticker #02",
    price: 199
  },

  "sticker:3": {
    name: "Sticker #03",
    price: 199
  },

  "sticker:4": {
    name: "Sticker #04",
    price: 199
  },

  "sticker:5": {
    name: "Sticker #05",
    price: 199
  },

  "sticker:6": {
    name: "Sticker #06",
    price: 199
  },

  "sticker:7": {
    name: "Sticker #07",
    price: 199
  },

  "sticker:8": {
    name: "Sticker #08",
    price: 199
  },

  "sticker:9": {
    name: "Sticker #09",
    price: 199
  },

  "sticker:10": {
    name: "Sticker #10",
    price: 199
  },

  "sticker:11": {
    name: "Sticker #11",
    price: 199
  },

  "sticker:12": {
    name: "Sticker #12",
    price: 199
  },

  "sticker:13": {
    name: "Sticker #13",
    price: 199
  },

  "sticker:14": {
    name: "Sticker #14",
    price: 199
  },

  "sticker:15": {
    name: "Sticker #15",
    price: 199
  },

  "sticker:16": {
    name: "Sticker #16",
    price: 199
  },

  "sticker:17": {
    name: "Sticker #17",
    price: 199
  },

  "sticker:18": {
    name: "Sticker #18",
    price: 199
  },

  "sticker:19": {
    name: "Sticker #19",
    price: 199
  },

  "sticker:20": {
    name: "Sticker #20",
    price: 199
  },

  "sticker:21": {
    name: "Sticker #21",
    price: 199
  },

  "sticker:22": {
    name: "Sticker #22",
    price: 199
  },

  "sticker:23": {
    name: "Sticker #23",
    price: 199
  },

  "sticker:24": {
    name: "Sticker #24",
    price: 199
  },

  "sticker:25": {
    name: "Sticker #25",
    price: 199
  },


  /* FLASH PACKS */

  "pack:P01": {
    name: "Sticker Pack P01",
    price: 999
  }

};


/* =========================================================
   CORS
   ========================================================= */

function corsHeaders(request) {

  const origin =
    request.headers.get("Origin") || "";

  const allowedOrigins = [
    "https://unclemikecandoit.com",
    "https://www.unclemikecandoit.com"
  ];

  const allowOrigin =
    allowedOrigins.includes(origin)
      ? origin
      : SITE_ORIGIN;

  return {
    "Access-Control-Allow-Origin":
      allowOrigin,

    "Access-Control-Allow-Methods":
      "POST, OPTIONS",

    "Access-Control-Allow-Headers":
      "Content-Type",

    "Vary":
      "Origin"
  };

}


/* =========================================================
   JSON RESPONSE
   ========================================================= */

function jsonResponse(
  request,
  body,
  status = 200
) {

  return new Response(
    JSON.stringify(body),
    {
      status,

      headers: {
        "Content-Type":
          "application/json",

        ...corsHeaders(request)
      }
    }
  );

}


/* =========================================================
   VALIDATE CART + BUY 5 GET 1 FREE

   RULE:
   Every 6 individual stickers = 1 free.

   6 singles  = pay for 5
   12 singles = pay for 10
   18 singles = pay for 15

   Flash packs do NOT qualify.
   ========================================================= */

function buildSquareLineItems(cart) {

  if (
    !cart ||
    typeof cart !== "object" ||
    Array.isArray(cart)
  ) {

    throw new Error(
      "Invalid cart."
    );

  }


  const validCartItems = [];

  let totalSingleStickers = 0;


  /* =====================================================
     VALIDATE CART
     ===================================================== */

  for (
    const [key, rawQuantity]
    of Object.entries(cart)
  ) {

    const product =
      PRODUCTS[key];


    /* Ignore unknown products */

    if (!product) {
      continue;
    }


    const quantity =
      Number(rawQuantity);


    if (
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      quantity > 50
    ) {
      continue;
    }


    validCartItems.push({
      key,
      product,
      quantity
    });


    /* Count individual stickers only */

    if (
      key.startsWith("sticker:")
    ) {

      totalSingleStickers +=
        quantity;

    }

  }


  if (!validCartItems.length) {

    throw new Error(
      "Your cart is empty."
    );

  }


  /* =====================================================
     CALCULATE FREE STICKERS
     ===================================================== */

  let freeStickersRemaining =
    Math.floor(
      totalSingleStickers / 6
    );


  /* =====================================================
     BUILD SQUARE LINE ITEMS
     ===================================================== */

  const lineItems = [];


  for (
    const item
    of validCartItems
  ) {

    const {
      key,
      product,
      quantity
    } = item;


    /* ===================================================
       FLASH PACKS / NON-SINGLE PRODUCTS
       =================================================== */

    if (
      !key.startsWith("sticker:")
    ) {

      lineItems.push({

        name:
          product.name,

        quantity:
          String(quantity),

        base_price_money: {
          amount:
            product.price,

          currency:
            "USD"
        }

      });


      continue;

    }


    /* ===================================================
       INDIVIDUAL STICKERS
       =================================================== */

    const freeQuantity =
      Math.min(
        quantity,
        freeStickersRemaining
      );


    const paidQuantity =
      quantity -
      freeQuantity;


    freeStickersRemaining -=
      freeQuantity;


    /* Paid stickers */

    if (
      paidQuantity > 0
    ) {

      lineItems.push({

        name:
          product.name,

        quantity:
          String(paidQuantity),

        base_price_money: {
          amount:
            product.price,

          currency:
            "USD"
        }

      });

    }


    /* Free stickers */

    if (
      freeQuantity > 0
    ) {

      lineItems.push({

        name:
          `${product.name} — BUY 5 GET 1 FREE`,

        quantity:
          String(freeQuantity),

        base_price_money: {
          amount:
            0,

          currency:
            "USD"
        }

      });

    }

  }


  return lineItems;

}


/* =========================================================
   CREATE SQUARE PAYMENT LINK
   ========================================================= */

async function createSquareCheckout(
  env,
  lineItems
) {

  if (!env.SQUARE_ACCESS_TOKEN) {

    throw new Error(
      "Square access token is not configured."
    );

  }


  if (!env.SQUARE_LOCATION_ID) {

    throw new Error(
      "Square location ID is not configured."
    );

  }


  const idempotencyKey =
    crypto.randomUUID();


  const squareBody = {

    idempotency_key:
      idempotencyKey,


    order: {

      location_id:
        env.SQUARE_LOCATION_ID,

      line_items:
        lineItems,

      pricing_options: {
        auto_apply_taxes:
          true
      }

    },


    checkout_options: {

      redirect_url:
        SUCCESS_URL,

      ask_for_shipping_address:
        true,

      allow_tipping:
        false,

      shipping_fee: {

        name:
          "Flat Rate Shipping",

        charge: {

          amount:
            SHIPPING_FEE,

          currency:
            "USD"
        }

      }

    }

  };


  const squareResponse =
    await fetch(
      "https://connect.squareup.com/v2/online-checkout/payment-links",
      {

        method:
          "POST",

        headers: {

          "Authorization":
            `Bearer ${env.SQUARE_ACCESS_TOKEN}`,

          "Square-Version":
            SQUARE_API_VERSION,

          "Content-Type":
            "application/json"

        },

        body:
          JSON.stringify(squareBody)

      }
    );


  const squareData =
    await squareResponse.json();


  if (!squareResponse.ok) {

    console.error(
      "Square checkout error:",
      JSON.stringify(squareData)
    );


    const squareMessage =
      squareData?.errors?.[0]?.detail ||
      squareData?.errors?.[0]?.code ||
      "Square could not create checkout.";


    throw new Error(
      squareMessage
    );

  }


  const paymentLink =
    squareData?.payment_link?.url;


  if (!paymentLink) {

    console.error(
      "Square response missing payment link:",
      JSON.stringify(squareData)
    );


    throw new Error(
      "Square did not return a checkout URL."
    );

  }


  return paymentLink;

}


/* =========================================================
   REQUEST HANDLER
   ========================================================= */

export default {

  async fetch(
    request,
    env
  ) {

    const url =
      new URL(
        request.url
      );


    /* =====================================================
       CORS PREFLIGHT
       ===================================================== */

    if (
      request.method === "OPTIONS"
    ) {

      return new Response(
        null,
        {
          status: 204,

          headers:
            corsHeaders(request)
        }
      );

    }


    /* =====================================================
       HEALTH CHECK
       ===================================================== */

    if (
      request.method === "GET" &&
      url.pathname === "/"
    ) {

      return jsonResponse(
        request,
        {
          ok: true,

          service:
            "Uncle Mike Checkout"
        }
      );

    }


    /* =====================================================
       CHECKOUT
       ===================================================== */

    if (
      request.method === "POST" &&
      url.pathname === "/checkout"
    ) {

      try {

        const body =
          await request.json();


        const lineItems =
          buildSquareLineItems(
            body.cart
          );


        const checkoutUrl =
          await createSquareCheckout(
            env,
            lineItems
          );


        return jsonResponse(
          request,
          {
            ok: true,

            url:
              checkoutUrl
          }
        );


      } catch (error) {

        console.error(
          "Checkout failed:",
          error
        );


        return jsonResponse(
          request,
          {
            ok: false,

            error:
              error?.message ||
              "Checkout failed."
          },
          400
        );

      }

    }


    /* =====================================================
       NOT FOUND
       ===================================================== */

    return jsonResponse(
      request,
      {
        ok: false,

        error:
          "Not found."
      },
      404
    );

  }

};
