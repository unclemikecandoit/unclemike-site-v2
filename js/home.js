function renderHomePage() {
  const page = document.getElementById("page-content");

  if (!page) return;

  const directionLabels = {
    make: "Let's Make It",
    build: "Builds",
    "figure-it-out": "Figure It Out"
  };

  const directionDescriptions = {
    make: "Design · Merch · Brands",
    build: "Cars · Engines · Fabrication",
    "figure-it-out": "Diagnosis · Problems · Weird Shit"
  };

  page.innerHTML = `
    <section class="home-hero">
      <div class="wrap home-hero-inner">

        <img
          class="home-logo"
          src="./5DC2AA26-E6DE-4633-9476-78BF6FE3118C.png"
          alt="Uncle Mike Can Do It"
        >

        <p class="eyebrow">
          Built · Fixed · Designed · Figured Out
        </p>

        <p class="home-hero-copy">
          Cars, engines, design, merch, branding, repairs,
          weird problems and the ideas that somehow become real
          because I decide I can make them.
        </p>

      </div>
    </section>


    <section class="page-section home-directions">
      <div class="wrap">

        <div class="section-heading">
          <p class="eyebrow">
            Where To?
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


    <section class="page-section">
      <div class="wrap">

        <div class="section-heading">
          <p class="eyebrow">
            A Few Things I've Done
          </p>

          <h2 class="section-title">
            Selected Work.
          </h2>
        </div>

        <div class="project-grid">
          ${UNCLE_MIKE_FEATURED.map(project => `
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

                <h3>${project.title}</h3>

                <p>${project.category}</p>

                <span class="project-card-link">
                  View Project →
                </span>

              </div>

            </a>
          `).join("")}
        </div>

      </div>
    </section>
  `;
}


renderHomePage();
