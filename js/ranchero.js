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

        <div class="project-detail-grid">

          <div class="project-detail-card">
            <p class="eyebrow">The Project</p>

            <h2>
              The day it came home.
            </h2>

            <p>
              This page is where the Ranchero gets to actually live:
              the story, the work, the photos, the changes, and everything
              that happens as the project moves forward.
            </p>
          </div>


          <div class="project-detail-card">
            <p class="eyebrow">Status</p>

            <h2>
              Bringing it back.
            </h2>

            <p>
              Instead of dumping every Ranchero update onto the homepage,
              this page becomes the permanent home for the project.
            </p>
          </div>

        </div>

      </div>
    </section>


    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Project Media
        </p>

        <div class="project-gallery">

          <div class="project-media-placeholder">
            Ranchero photo
          </div>

          <div class="project-media-placeholder">
            Ranchero photo
          </div>

          <div class="project-media-placeholder">
            Ranchero video
          </div>

        </div>

      </div>
    </section>
  `;
}


renderRancheroPage();
