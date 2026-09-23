function renderHomePage() {
  const page = document.getElementById("page-content");

  if (!page) return;

  const featuredWork =
    UNCLE_MIKE_FEATURED.filter(project => project.id !== "systems");

  const receiptLabels = {
    c10: {
      eyebrow: "Build",
      category: "Mechanical · Fabrication · Problem Solving"
    },

    "crooked-gate": {
      eyebrow: "Make",
      category: "Brand · Graphic Design · Web · E-Commerce · Retail"
    },

    "hawk-rods": {
      eyebrow: "Design",
      category: "Identity · Illustration · Iteration"
    }
  };

  const directions = [
    {
      number: "01",
      title: "Make",
      description: "Brand · Web · Graphics · Merch",
      path: "./make/"
    },

    {
      number: "02",
      title: "Build",
      description: "Cars · Engines · Fabrication",
      path: "./build/"
    },

    {
      number: "03",
      title: "Figure It Out",
      description: "Consulting · Systems · Process",
      path: "./figure-it-out/"
    }
  ];

  page.innerHTML = `

    <!-- =====================================================
         HERO
         ===================================================== -->

    <section class="home-hero">
      <div class="wrap home-hero-inner">

        <img
          class="home-logo"
          src="./B9AEDA13-4CAE-4E5F-8631-0932FD665538.png"
          alt="Uncle Mike Can Do It"
        >

        <h1 class="home-statement">
          I Make Ideas Real.
        </h1>

        <p class="home-hero-copy">
          Cars. Brands. Websites. Systems. Products.
          Problems that don't come with instructions.
        </p>

        <p class="home-hero-punch">
          <strong>
            Design it. Build it. Fix it. Figure it out.
          </strong>
        </p>

      </div>
    </section>



    <!-- =====================================================
         STICKERS
         ===================================================== -->

    <section class="page-section home-stickers">
      <div class="wrap">

        <a
          class="home-sticker-feature"
          href="./stickers/"
          aria-label="Shop Uncle Mike stickers"
        >

          <div class="home-sticker-flash">

            <div class="home-sticker-shot">
              <img
                src="./2D06CF4C-261D-4133-B64B-116872A1C0CE.png"
                alt="JR. Enemy of the State sticker"
              >
            </div>

            <div class="home-sticker-shot">
              <img
                src="./800448F2-6C0A-4009-BFEE-44762F9757AB.png"
                alt="Not Today Satan sticker"
              >
            </div>

            <div class="home-sticker-shot">
              <img
                src="./68BD59D5-32D0-4D26-B01D-9BA075EA7F80.png"
                alt="This Again sticker"
              >
            </div>

          </div>


          <div class="home-sticker-copy">

            <p class="eyebrow">
              Stickers
            </p>

            <h2 class="section-title">
              Stick<br>
              Something.
            </h2>

            <span class="project-card-link">
              Shop All Stickers →
            </span>

          </div>

        </a>

      </div>
    </section>



    <!-- =====================================================
         SELECTED WORK
         ===================================================== -->

    <section class="page-section home-selected-work">
      <div class="wrap">

        <div class="section-heading">

          <p class="eyebrow">
            Selected Work
          </p>

          <h2 class="section-title">
            Different Problems.<br>
            Same Brain.
          </h2>

        </div>


        <div class="project-grid">

          ${featuredWork.map(project => {
            const labels =
              receiptLabels[project.id] || {
                eyebrow: "Project",
                category: project.category
              };

            return `
              <a
                class="project-card"
                href="${project.path}"
                aria-label="View ${project.title}"
              >

                <div class="project-card-media">

                  <img
                    src="${project.image}"
                    alt="${project.title}"
                    loading="lazy"
                  >

                </div>


                <div class="project-card-body">

                  <p class="eyebrow">
                    ${labels.eyebrow}
                  </p>

                  <h3>
                    ${project.title}
                  </h3>

                  <p>
                    ${labels.category}
                  </p>

                  <span class="project-card-link">
                    View Project →
                  </span>

                </div>

              </a>
            `;
          }).join("")}

        </div>

      </div>
    </section>



    <!-- =====================================================
         WHAT I DO
         ===================================================== -->

    <section class="page-section home-directions">
      <div class="wrap">

        <div class="section-heading">

          <p class="eyebrow">
            What I Do
          </p>

          <h2 class="section-title">
            Three Ways<br>
            I Work.
          </h2>

        </div>


        <nav
          class="direction-grid"
          aria-label="What Uncle Mike Does"
        >

          ${directions.map(direction => `
            <a
              class="direction-button"
              href="${direction.path}"
            >

              <span class="direction-number">
                ${direction.number}
              </span>


              <span class="direction-content">

                <strong class="direction-title">
                  ${direction.title}
                </strong>

                <span class="direction-description">
                  ${direction.description}
                </span>

              </span>


              <span
                class="direction-arrow"
                aria-hidden="true"
              >
                →
              </span>

            </a>
          `).join("")}

        </nav>

      </div>
    </section>



    <!-- =====================================================
         CONSULTING
         ===================================================== -->

    <section class="page-section home-consulting">
      <div class="wrap">

        <div class="section-heading">

          <p class="eyebrow">
            Consulting · Systems · Process
          </p>

          <h2 class="section-title">
            You Can't Fix<br>
            What You Can't See.
          </h2>

        </div>


        <div class="project-detail-card home-consulting-card">

          <p>
            Complicated systems hide their own problems.
            I follow the process from beginning to end,
            identify bottlenecks, waste and unnecessary complexity,
            and find practical ways to make the system work better.
          </p>

          <p class="home-consulting-punch">
            <strong>
              Complicated problem.<br>
              Clear solution.
            </strong>
          </p>

          <a
            class="project-card-link"
            href="./figure-it-out/"
          >
            See How I Figure It Out →
          </a>

        </div>

      </div>
    </section>



    <!-- =====================================================
         FINAL DIRECTION
         ===================================================== -->

    <section class="page-section home-directions">
      <div class="wrap">

        <div class="section-heading">

          <p class="eyebrow">
            Explore
          </p>

          <h2 class="section-title">
            See What<br>
            I Can Do.
          </h2>

        </div>


        <nav
          class="direction-grid"
          aria-label="Explore Uncle Mike"
        >

          ${directions.map(direction => `
            <a
              class="direction-button"
              href="${direction.path}"
            >

              <span class="direction-number">
                ${direction.number}
              </span>


              <span class="direction-content">

                <strong class="direction-title">
                  ${direction.title}
                </strong>

                <span class="direction-description">
                  ${direction.description}
                </span>

              </span>


              <span
                class="direction-arrow"
                aria-hidden="true"
              >
                →
              </span>

            </a>
          `).join("")}

        </nav>

      </div>
    </section>

  `;


  injectHomeStickerStyles();
}



/* =========================================================
   STICKER FEATURE STYLES
   ========================================================= */

function injectHomeStickerStyles() {
  if (
    document.getElementById(
      "uncle-mike-home-sticker-styles"
    )
  ) {
    return;
  }


  const style =
    document.createElement("style");


  style.id =
    "uncle-mike-home-sticker-styles";


  style.textContent = `

    .home-stickers {
      overflow: hidden;
    }

    .home-sticker-feature {
      display: block;
      color: inherit;
      text-decoration: none;
    }

    .home-sticker-flash {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 42px;
    }

    .home-sticker-shot {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
      background: #ffffff;
      overflow: hidden;
    }

    .home-sticker-shot img {
      display: block;
      width: 100%;
      height: 100%;
      max-height: 440px;
      object-fit: contain;
    }

    .home-sticker-copy {
      max-width: 760px;
    }

    .home-sticker-copy .project-card-link {
      display: inline-block;
      margin-top: 12px;
    }


    @media (max-width: 600px) {

      .home-stickers {
        padding-top: 48px;
      }

      .home-sticker-flash {
        grid-template-columns: 1fr;
        gap: 8px;
        margin-bottom: 32px;
      }

      .home-sticker-shot {
        width: 100%;
        max-height: 68svh;
      }

      .home-sticker-shot img {
        width: 100%;
        height: auto;
        max-height: 68svh;
        object-fit: contain;
      }

    }

  `;


  document.head.appendChild(style);
}



/* =========================================================
   INITIAL PAGE LOAD
   ========================================================= */

if (!window.UNCLE_MIKE_ROUTER_ACTIVE) {
  renderHomePage();
}
