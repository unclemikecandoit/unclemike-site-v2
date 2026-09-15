function renderBuildPage() {
  const page =
    document.getElementById("page-content");

  if (!page) return;


  page.innerHTML = `

    <!-- =====================================================
         BUILDS HERO
         ===================================================== -->

    <section class="page-section build-hero">

      <div class="wrap">

        <p class="eyebrow">
          Builds
        </p>

        <h1>
          Some Shit Needs Saving.
        </h1>

        <p class="home-hero-copy">
          Old cars. Bad decisions. Broken shit.
          Somebody else's "good enough."
          <br><br>
          <strong>
            That's usually where I come in.
          </strong>
        </p>

      </div>

    </section>



    <!-- =====================================================
         BUILD JOURNALS
         ===================================================== -->

    <section class="page-section">

      <div class="wrap">

        <div class="section-heading">

          <p class="eyebrow">
            Build Journals
          </p>

          <h2 class="section-title">
            Pick Your Problem.
          </h2>

        </div>


        <div class="project-grid">


          <!-- =================================================
               1965 FORD RANCHERO
               ================================================= -->

          <a
            class="project-card"
            href="./ranchero/"
            aria-label="View the 1965 Ford Ranchero build"
          >

            <div class="project-card-media">

              <img
                src="./ranchero/20260825_111600.jpeg"
                alt="1965 Ford Ranchero"
              >

            </div>


            <div class="project-card-body">

              <p class="eyebrow">
                1965 Ford Ranchero
              </p>

              <h3>
                Bringing It Back.
              </h3>

              <p>
                Sixty years of old-car decisions,
                one problem at a time.
              </p>

              <span class="project-card-link">
                View Build →
              </span>

            </div>

          </a>



          <!-- =================================================
               1972 CHEVY C10
               ================================================= -->

          <a
            class="project-card"
            href="./C10/"
            aria-label="View the 1972 Chevy C10 build"
          >

            <div class="project-card-media">

              <img
                src="./C10/c10-hero.jpg"
                alt="1972 Chevrolet C10"
              >

            </div>


            <div class="project-card-body">

              <p class="eyebrow">
                1972 Chevy C10
              </p>

              <h3>
                Unfucking This Death Trap.
              </h3>

              <p>
                Somebody already built it.
                I had to make it stop trying
                to kill people.
              </p>

              <span class="project-card-link">
                View Build →
              </span>

            </div>

          </a>


        </div>

      </div>

    </section>



    <!-- =====================================================
         KEEP GOING
         ===================================================== -->

    <section class="page-section">

      <div class="wrap">

        <div class="project-detail-card">

          <p class="eyebrow">
            More Coming
          </p>

          <h2>
            I Don't Really Do Finished.
          </h2>

          <p>
            These are the builds with stories worth
            following right now.
            <br><br>
            There will be more.
            There is always more.
          </p>

        </div>

      </div>

    </section>

  `;
}


renderBuildPage();
