function renderBuildPage() {
  const page = document.getElementById("page-content");

  if (!page) return;

  page.innerHTML = `
    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Build
        </p>

        <h1>
          Cars. Engines. Fabrication.
        </h1>

        <p class="home-hero-copy">
          Mechanical work, custom projects, repairs, fabrication,
          electrical work and anything else that gets solved
          with tools in your hands.
        </p>

      </div>
    </section>


    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Projects
        </p>

        <div class="project-grid">

          <article class="project-card">
            <div class="project-card-media"></div>

            <div class="project-card-body">
              <h3>1965 Ford Ranchero</h3>
              <p>Bringing it back</p>
            </div>
          </article>


          <article class="project-card">
            <div class="project-card-media"></div>

            <div class="project-card-body">
              <h3>1975 Chevy K10</h3>
              <p>Small-block Chevy · TH400 · 4.10 gears · 6" lift</p>
            </div>
          </article>


          <article class="project-card">
            <div class="project-card-media"></div>

            <div class="project-card-body">
              <h3>Automotive Electrical</h3>
              <p>Wiring diagnosis & repair</p>
            </div>
          </article>


          <article class="project-card">
            <div class="project-card-media"></div>

            <div class="project-card-body">
              <h3>Learning the Trade</h3>
              <p>Teaching my son how to wrench</p>
            </div>
          </article>

        </div>

      </div>
    </section>
  `;
}


renderBuildPage();
