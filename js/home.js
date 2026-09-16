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
         RECEIPTS
         VISUALS COME FIRST
         ===================================================== -->

    <section class="page-section home-selected-work">
      <div class="wrap">

        <div class="section-heading">

          <p class="eyebrow">
            The Receipts
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
                    See It →
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
         SHORT. FAST. CLICKABLE.
         ===================================================== -->

    <section class="page-section home-directions">
      <div class="wrap">

        <div class="section-heading">

          <p class="eyebrow">
            What I Do
          </p>

          <h2 class="section-title">
            Pick Your<br>
            Problem.
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
         CONSULTING PATTERN BREAK
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
            I follow the process, find the bottlenecks,
            waste and unnecessary complexity, and make
            the system easier to operate.
          </p>

          <p class="home-consulting-punch">
            <strong>
              Complicated problem.<br>
              Simple solution.
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
            Keep Going
          </p>

          <h2 class="section-title">
            What Are You<br>
            Here For?
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
}


renderHomePage();
