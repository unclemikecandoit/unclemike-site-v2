function renderHomePage() {
  const page = document.getElementById("page-content");

  if (!page) return;

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


    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Pick A Direction
        </p>

        <div class="category-grid">
          ${UNCLE_MIKE_AREAS.map(area => `
            <a class="category-card" href="${area.path}">

              <span class="category-number">
                ${area.number}
              </span>

              <h3>${area.title}</h3>

              <p>${area.description}</p>

            </a>
          `).join("")}
        </div>

      </div>
    </section>


    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Selected Work
        </p>

        <div class="project-grid">
          ${UNCLE_MIKE_FEATURED.map(project => `
            <article class="project-card">

              <div class="project-card-media">
                ${
                  project.image
                    ? `<img src="${project.image}" alt="${project.title}">`
                    : ""
                }
              </div>

              <div class="project-card-body">

                <h3>${project.title}</h3>

                <p>${project.category}</p>

              </div>

            </article>
          `).join("")}
        </div>

      </div>
    </section>
  `;
}


renderHomePage();
