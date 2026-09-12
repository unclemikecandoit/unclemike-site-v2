function renderRancheroPage() {
  const page = document.getElementById("page-content");

  if (!page) return;

  page.innerHTML = `
    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Build · Project
        </p>

        <h1>
          1965 Ford Ranchero
        </h1>

        <p class="home-hero-copy">
          Bringing it back.
        </p>

      </div>
    </section>


    <section class="page-section">
      <div class="wrap">

        <div class="project-gallery">

          <figure class="project-card">
            <div class="project-card-media">
              <img
                src="./20260825_111600.jpeg"
                alt="1965 Ford Ranchero"
              >
            </div>

            <figcaption class="project-card-body">
              <h3>Bringing It Back</h3>
              <p>1965 Ford Ranchero</p>
            </figcaption>
          </figure>


          <figure class="project-card">
            <div class="project-card-media">
              <img
                src="./20260825_110401.jpeg"
                alt="1965 Ford Ranchero when it came home"
              >
            </div>

            <figcaption class="project-card-body">
              <h3>The Day It Came Home</h3>
              <p>Where this one started</p>
            </figcaption>
          </figure>

        </div>

      </div>
    </section>


    <section class="page-section">
      <div class="wrap">

        <div class="project-detail-grid">

          <div class="project-detail-card">

            <p class="eyebrow">
              The Project
            </p>

            <h2>
              Not Finished.
            </h2>

            <p>
              This is the permanent home for the Ranchero project.
              New work, photos, changes and updates get added here
              without turning the main site into one enormous page.
            </p>

          </div>


          <div class="project-detail-card">

            <p class="eyebrow">
              Status
            </p>

            <h2>
              Bringing It Back.
            </h2>

            <p>
              The project changes. This page changes with it.
              The rest of the site doesn't have to.
            </p>

          </div>

        </div>

      </div>
    </section>
  `;
}


renderRancheroPage();
