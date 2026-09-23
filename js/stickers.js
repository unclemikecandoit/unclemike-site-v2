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

     Order here = order on the storefront.
     Keep collections together.
     ======================================================= */

  const stickerGroups = [

    /* -----------------------------------------------------
       AUTISM / AUTOMOTIVE
       ----------------------------------------------------- */

    {
      id: "autism",
      eyebrow: "Autism Collection",
      title: "Different Fuels Progress.",
      description:
        "Automotive culture, rebuilt for a different kind of wiring.",

      stickers: [

        {
          id: "powered-autism-high-octane",
          name: "Powered By Autism",
          subtitle: "High Octane Minds",
          image:
            "../53FBB857-6589-4B6B-AB15-511094D09D9D.png"
        },

        {
          id: "powered-autism-different-fuels",
          name: "Powered By Autism",
          subtitle: "Different Fuels Progress",
          image:
            "../powered_by_autism_cutout.png"
        },

        {
          id: "autism-mental-lubrication",
          name: "Autism",
          subtitle: "Mental Lubrication Keeps Things Moving",
          image:
            "../autism_sticker_cutout.png"
        },

        {
          id: "autism-spark",
          name: "Autism",
          subtitle: "Spark A Brighter Tomorrow",
          image:
            "../autism_spark_cutout.png"
        },

        {
          id: "autism-racing-division",
          name: "Autism",
          subtitle: "Champions Think Different",
          image:
            "../autism_champions_cutout.png"
        },

        {
          id: "autism-cams",
          name: "Autism Cams",
          subtitle: "More Ideas Per Rev",
          image:
            "../autism_cams_cutout.png"
        },

        {
          id: "autism-look-further",
          name: "Autism",
          subtitle: "Look Further",
          image:
            "../14FF8ADB-DFA3-48BC-B0CE-83C2BBA50ADD.png"
        },

        {
          id: "powered-autism",
          name: "Powered By Autism",
          subtitle: "",
          image:
            "../FD5E3664-835E-41C7-AC69-006356BAA991.png"
        },

        {
          id: "autism-fueling-ideas",
          name: "Autism",
          subtitle: "Fueling Ideas",
          image:
            "../C3562F6C-48D5-4DA6-A7B2-CB8F89A5AC99.png"
        },

        {
          id: "autism-high-performance-minds",
          name: "Autism",
          subtitle: "High Performance Minds",
          image:
            "../CC263FC1-3A39-449F-997F-9FCCEE620C01.png"
        },

        {
          id: "autism-h",
          name: "Autism",
          subtitle: "",
          image:
            "../ED07CB72-68C8-41A9-B713-29C0F9A1E6B6.png"
        },

        {
          id: "autism-fueled-differently",
          name: "Autism",
          subtitle: "Fueled Differently",
          image:
            "../7C481E72-DD74-418F-8852-5DB20A64C752.png"
        },

        {
          id: "powered-autism-exceptional-performance",
          name: "Powered By Autism",
          subtitle: "Exceptional Performance Always",
          image:
            "../73665BA7-29B3-4596-AA3E-18256B3378EF.png"
        }

      ]
    },


    /* -----------------------------------------------------
       DARK HUMOR / HORROR
       ----------------------------------------------------- */

    {
      id: "dark-humor",
      eyebrow: "Dark Humor",
      title: "Poor Decisions. Great Stickers.",
      description:
        "A collection for toolboxes, shop cabinets, coolers and questionable judgment.",

      stickers: [

        {
          id: "try-me",
          name: "Try Me",
          subtitle: "",
          image:
            "../377B33A1-8F06-4B25-91F4-F2ED9B401CFE.png"
        },

        {
          id: "persuader",
          name: "The Persuader",
          subtitle: "",
          image:
            "../3246F0CD-1F4C-4C9B-88A1-986EEB60C397.png"
        },

        {
          id: "catch-me-never",
          name: "Catch Me Never",
          subtitle: "STIHL Single",
          image:
            "../0547ED23-02FD-4A8B-B163-76675EECB51C.png"
        },

        {
          id: "plan-b",
          name: "Plan B",
          subtitle: "",
          image:
            "../E49DC6DB-EA61-4ADE-97D9-AFDF3E238F78.png"
        },

        {
          id: "fah-q",
          name: "FAH-Q",
          subtitle: "",
          image:
            "../DE7935CB-F093-4900-9CCA-1FA60E648B29.png"
        },

        {
          id: "lol-k",
          name: "LOL,K",
          subtitle: "",
          image:
            "../B3D5BE20-E846-432C-A803-BEF686BBBAEF.png"
        },

        {
          id: "nope",
          name: "Nope.",
          subtitle: "",
          image:
            "../AFA5E466-A470-444B-B73B-5BB66FD4F047.png"
        },

        {
          id: "walk-it-off",
          name: "Walk It Off",
          subtitle: "",
          image:
            "../9CE55BC3-4DC7-43DA-957B-9B978289148D.png"
        },

        {
          id: "well-fuck",
          name: "Well Fuck",
          subtitle: "",
          image:
            "../IMG_7328.jpeg"
        }

      ]
    },


    /* -----------------------------------------------------
       OTHER / ORIGINALS
       ----------------------------------------------------- */

    {
      id: "originals",
      eyebrow: "Uncle Mike Originals",
      title: "Stick Something.",
      description:
        "Because leaving perfectly good surfaces alone is boring.",

      stickers: [

        {
          id: "jr-enemy-state",
          name: "JR. Enemy of the State",
          subtitle: "",
          image:
            "../2D06CF4C-261D-4133-B64B-116872A1C0CE.png"
        },

        {
          id: "not-today-satan",
          name: "Not Today Satan",
          subtitle: "",
          image:
            "../800448F2-6C0A-4009-BFEE-44762F9757AB.png"
        },

        {
          id: "this-again",
          name: "This Again?",
          subtitle: "",
          image:
            "../68BD59D5-32D0-4D26-B01D-9BA075EA7F80.png"
        }

      ]
    }

  ];


  /* =======================================================
     PAGE
     ======================================================= */

  page.innerHTML = `

    <!-- ===================================================
         HERO
         =================================================== -->

    <section class="page-section sticker-store-hero">

      <div class="wrap">

        <p class="eyebrow">
          Uncle Mike Stickers
        </p>

        <h1 class="sticker-store-title">
          Buy Stickers!
        </h1>

        <p class="sticker-store-intro">
          Original designs for toolboxes, cars,
          coolers, laptops, shop cabinets and
          whatever else needs more personality.
        </p>

      </div>

    </section>


    <!-- ===================================================
         COLLECTIONS
         =================================================== -->

    ${stickerGroups.map(group => `

      <section
        class="sticker-collection"
        id="${group.id}"
      >

        <div class="wrap">

          <div class="sticker-collection-heading">

            <p class="eyebrow">
              ${group.eyebrow}
            </p>

            <h2 class="sticker-collection-title">
              ${group.title}
            </h2>

            <p class="sticker-collection-description">
              ${group.description}
            </p>

          </div>


          <div class="sticker-grid">

            ${group.stickers.map(sticker => `

              <article
                class="sticker-card"
                data-sticker-id="${sticker.id}"
              >

                <div class="sticker-card-image">

                  <img
                    src="${sticker.image}"
                    alt="${sticker.name}"
                    loading="lazy"
                  >

                </div>


                <div class="sticker-card-body">

                  <div class="sticker-card-copy">

                    <h3>
                      ${sticker.name}
                    </h3>

                    ${
                      sticker.subtitle
                        ? `
                          <p>
                            ${sticker.subtitle}
                          </p>
                        `
                        : ""
                    }

                  </div>


                  <div class="sticker-card-purchase">

                    <span class="sticker-price">
                      Coming Soon
                    </span>

                  </div>

                </div>

              </article>

            `).join("")}

          </div>

        </div>

      </section>

    `).join("")}


    <!-- ===================================================
         STORE STATUS
         =================================================== -->

    <section class="sticker-store-status">

      <div class="wrap">

        <div class="project-detail-card sticker-status-card">

          <p class="eyebrow">
            Shop Update
          </p>

          <h2 class="sticker-status-title">
            Store Checkout<br>
            Coming Next.
          </h2>

          <p>
            The designs are here. Online ordering
            is being wired up now.
          </p>

          <p>
            In the meantime, message me on Instagram
            and we can get your order done.
          </p>

          <a
            class="site-contact-button sticker-instagram-button"
            href="https://www.instagram.com/unclemikecandoit/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Message Me On Instagram →
          </a>

        </div>

      </div>

    </section>

  `;


  injectStickerStoreStyles();
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
        clamp(58px, 7vw, 90px)
        0
        clamp(58px, 7vw, 90px);
    }

    .sticker-store-title {
      max-width:
        900px;

      margin:
        0
        0
        22px;

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

    .sticker-store-intro {
      max-width:
        660px;

      margin:
        0;

      color:
        var(--copy);

      font-size:
        clamp(
          1rem,
          2vw,
          1.18rem
        );

      line-height:
        1.55;
    }


    /* =====================================================
       COLLECTION
       ===================================================== */

    .sticker-collection {
      padding:
        clamp(56px, 7vw, 88px)
        0;

      border-top:
        1px solid
        rgba(234, 215, 173, 0.18);
    }

    .sticker-collection-heading {
      max-width:
        720px;

      margin-bottom:
        clamp(30px, 4vw, 46px);
    }

    .sticker-collection-title {
      max-width:
        720px;

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
          2.5rem,
          5.5vw,
          4.8rem
        );

      line-height:
        0.94;

      letter-spacing:
        -0.04em;
    }

    .sticker-collection-description {
      max-width:
        620px;

      margin:
        18px
        0
        0;

      color:
        var(--copy);

      font-size:
        1rem;

      line-height:
        1.55;
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
        clamp(18px, 2.4vw, 30px);
    }


    /* =====================================================
       CARD
       ===================================================== */

    .sticker-card {
      display:
        flex;

      flex-direction:
        column;

      min-width:
        0;

      border:
        1px solid
        rgba(234, 215, 173, 0.2);

      background:
        var(--surface);

      overflow:
        hidden;
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
        clamp(12px, 2vw, 22px);

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
       CARD COPY
       ===================================================== */

    .sticker-card-body {
      display:
        flex;

      flex-direction:
        column;

      flex:
        1;

      justify-content:
        space-between;

      gap:
        24px;

      padding:
        clamp(18px, 2.2vw, 26px);
    }

    .sticker-card-copy h3 {
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
          1.35rem,
          2.4vw,
          1.8rem
        );

      line-height:
        1;

      letter-spacing:
        -0.025em;
    }

    .sticker-card-copy p {
      margin:
        10px
        0
        0;

      color:
        var(--muted);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size:
        0.78rem;

      font-weight:
        700;

      line-height:
        1.4;

      letter-spacing:
        0.07em;

      text-transform:
        uppercase;
    }


    /* =====================================================
       PURCHASE
       ===================================================== */

    .sticker-card-purchase {
      padding-top:
        18px;

      border-top:
        1px solid
        rgba(234, 215, 173, 0.14);
    }

    .sticker-price {
      color:
        var(--muted);

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      font-size:
        0.74rem;

      font-weight:
        900;

      letter-spacing:
        0.14em;

      text-transform:
        uppercase;
    }


    /* =====================================================
       STATUS
       ===================================================== */

    .sticker-store-status {
      padding:
        clamp(56px, 7vw, 88px)
        0;

      border-top:
        1px solid
        rgba(234, 215, 173, 0.18);
    }

    .sticker-status-card p {
      max-width:
        620px;
    }

    .sticker-status-title {
      margin:
        0
        0
        22px;

      color:
        var(--paper);

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size:
        clamp(
          2.3rem,
          5vw,
          4.3rem
        );

      line-height:
        0.94;

      letter-spacing:
        -0.04em;
    }

    .sticker-instagram-button {
      margin-top:
        12px;
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
          44px
          0
          50px;
      }

      .sticker-store-title {
        margin-bottom:
          18px;

        font-size:
          clamp(
            3.25rem,
            15vw,
            4.2rem
          );

        line-height:
          0.9;
      }

      .sticker-store-intro {
        font-size:
          1rem;

        line-height:
          1.5;
      }

      .sticker-collection {
        padding:
          48px
          0;
      }

      .sticker-collection-heading {
        margin-bottom:
          28px;
      }

      .sticker-collection-title {
        font-size:
          clamp(
            2.35rem,
            11vw,
            3.15rem
          );

        line-height:
          0.92;
      }

      .sticker-collection-description {
        margin-top:
          14px;

        font-size:
          0.95rem;
      }

      .sticker-grid {
        grid-template-columns:
          repeat(2, minmax(0, 1fr));

        gap:
          10px;
      }

      .sticker-card-image {
        padding:
          7px;
      }

      .sticker-card-body {
        gap:
          16px;

        padding:
          14px;
      }

      .sticker-card-copy h3 {
        font-size:
          1.08rem;
      }

      .sticker-card-copy p {
        margin-top:
          7px;

        font-size:
          0.63rem;

        letter-spacing:
          0.05em;
      }

      .sticker-card-purchase {
        padding-top:
          12px;
      }

      .sticker-price {
        font-size:
          0.64rem;
      }

      .sticker-store-status {
        padding:
          48px
          0;
      }

      .sticker-status-title {
        font-size:
          clamp(
            2.15rem,
            10vw,
            3rem
          );
      }

      .sticker-instagram-button {
        box-sizing:
          border-box;

        width:
          100%;

        text-align:
          center;
      }

    }

  `;


  document.head.appendChild(
    style
  );
}



/* =========================================================
   INITIAL PAGE LOAD
   ========================================================= */

if (!window.UNCLE_MIKE_ROUTER_ACTIVE) {
  renderStickersPage();
}
