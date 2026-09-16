function renderHomePage() {
  const page = document.getElementById("page-content");

  if (!page) return;

  const directionLabels = {
    make: "Let's Make It",
    build: "Builds",
    "figure-it-out": "Figure It Out"
  };

  const directionDescriptions = {
    make: "Design · Web · Brands · Merch",
    build: "Cars · Engines · Fabrication",
    "figure-it-out": "Consulting · Systems · Problems"
  };

  const capabilityCards = [
    {
      number: "01",
      title: "Make It.",
      copy:
        "Brand identity, graphic design, websites, merch and products. If the thing doesn't exist yet, that's not much of an obstacle."
    },

    {
      number: "02",
      title: "Build It.",
      copy:
        "Cars, engines, fabrication and mechanical work. Sometimes the solution lives on a screen. Sometimes it needs a welder."
    },

    {
      number: "03",
      title: "Figure It Out.",
      copy:
        "Consulting, systems analysis, process improvement, automation and diagnosis. Complicated problems don't need complicated solutions."
    }
  ];

  const featuredWork =
    UNCLE_MIKE_FEATURED.filter(
      project => project.id !== "systems"
    );

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
          Cars, brands, websites, systems, products and weird
          problems that don't come with instructions.
        </p>

        <p class="home-hero-punch">
          If it needs to be designed, built, fixed or figured out,
          that's what you pay <strong>ME</strong> for.
        </p>

      </div>
    </section>


    <!-- =====================================================
         WHAT I ACTUALLY DO
         ===================================================== -->

    <section class="page-section home-capabilities">
      <div class="wrap">

        <div class="section-heading">

          <p class="eyebrow">
            What I Actually Do
          </p>

          <h2 class="section-title">
            Design It.<br>
            Build It.<br>
            Make It Work Better.
          </h2>

          <p class="home-section-intro">
            Different medium. Same brain. I take an idea,
            a problem or something that isn't working the way
            it should and figure out what it needs to become.
          </p>

        </div>


        <div class="project-grid home-capability-grid">

          ${capabilityCards.map(card => `
            <article class="project-detail-card home-capability-card">

              <span class="direction-number">
                ${card.number}
              </span>

              <h3>
                ${card.title}
              </h3>

              <p>
                ${card.copy}
              </p>

            </article>
          `).join("")}

        </div>

      </div>
    </section>


    <!-- =====================================================
         SELECTED WORK
         ===================================================== -->

    <section class="page-section home-selected-work">
      <div class="wrap">

        <div class="section-heading">

          <p class="eyebrow">
            The Receipts
          </p>

          <h2 class="section-title">
            Different Problems.<br>
            Same Process.
          </h2>

          <p class="home-section-intro">
            The tools change. The objective doesn't:
            understand what needs to happen,
            figure out what's in the way,
            and make the damn thing work.
          </p>

        </div>


        <div class="project-grid">

          ${featuredWork.map(project => `
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

                <h3>
                  ${project.title}
                </h3>

                <p>
                  ${project.category}
                </p>

                <span class="project-card-link">
                  View Project →
                </span>

              </div>

            </a>
          `).join("")}

        </div>

      </div>
    </section>


    <!-- =====================================================
         CONSULTING / SYSTEMS
         ===================================================== -->

    <section class="page-section home-consulting">
      <div class="wrap">

        <div class="section-heading">

          <p class="eyebrow">
            Consulting · Systems · Process
          </p>

          <h2 class="section-title">
            You Know Something<br>
            Isn't Working.<br>
            You Just Can't See Why.
          </h2>

        </div>


        <div class="project-detail-card home-consulting-card">

          <p>
            Complicated systems hide their own problems.
            I work from the beginning of a process to the end,
            find the bottlenecks, waste and unnecessary complexity,
            then make the system easier to operate.
          </p>

          <p class="home-consulting-punch">
            <strong>
              I take complicated problems and provide
              simple solutions.
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
         PICK A DIRECTION
         ===================================================== -->

    <section class="page-section home-directions">
      <div class="wrap">

        <div class="section-heading">

          <p class="eyebrow">
            Keep Looking
          </p>

          <h2 class="section-title">
            Pick A Direction.
          </h2>

        </div>


        <nav
          class="direction-grid"
          aria-label="Explore Uncle Mike"
        >

          ${UNCLE_MIKE_AREAS.map(area => `
            <a
              class="direction-button"
              href="${area.path}"
              aria-label="${directionLabels[area.id] || area.title}"
            >

              <span class="direction-number">
                ${area.number}
              </span>


              <span class="direction-content">

                <strong class="direction-title">
                  ${directionLabels[area.id] || area.title}
                </strong>

                <span class="direction-description">
                  ${directionDescriptions[area.id] || area.description}
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
