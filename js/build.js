function renderBuildPage() {
  const page =
    document.getElementById("page-content");

  if (!page) return;


  page.innerHTML = `

    <!-- =====================================================
         HERO
         ===================================================== -->

    <section class="page-section build-hero">

      <div class="wrap">

        <p class="eyebrow">
          Builds
        </p>

        <h1>
          Some Shit<br>
          Needs Saving.
        </h1>

        <p class="home-hero-copy">
          Old cars. Bad decisions.
          Somebody else's "good enough."
        </p>

      </div>

    </section>



    <!-- =====================================================
         RANCHERO — FIRST VISUAL
         ===================================================== -->

    <section
      class="page-section"
      style="padding-top:20px;"
    >

      <div class="wrap">

        <a
          class="project-card"
          href="./ranchero/"
          aria-label="View the 1965 Ford Ranchero build"
        >

          <div class="project-card-media">

            <img
              src="./ranchero/20260825_111600.jpeg"
              alt="1965 Ford Ranchero"
              loading="eager"
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
              Sixty years of old-car decisions.
              One problem at a time.
            </p>

            <span class="project-card-link">
              View Build →
            </span>

          </div>

        </a>

      </div>

    </section>



    <!-- =====================================================
         PATTERN BREAK
         ===================================================== -->

    <section class="page-section">

      <div class="wrap">

        <p class="eyebrow">
          The Process
        </p>

        <h2 class="section-title">
          Find What's Wrong.<br>
          Make It Right.
        </h2>

      </div>

    </section>



    <!-- =====================================================
         C10 — SECOND VISUAL
         ===================================================== -->

    <section
      class="page-section"
      style="padding-top:0;"
    >

      <div class="wrap">

        <a
          class="project-card"
          href="./C10/"
          aria-label="View the 1972 Chevy C10 build"
        >

          <div class="project-card-media">

            <img
              src="./C10/c10-hero.jpg"
              alt="1972 Chevrolet C10"
              loading="lazy"
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
              I had to make it stop trying to kill people.
            </p>

            <span class="project-card-link">
              View Build →
            </span>

          </div>

        </a>

      </div>

    </section>



    <!-- =====================================================
         TWO BUILDS — VISUAL REWARD
         ===================================================== -->

    <section class="page-section">

      <div class="wrap">

        <div class="section-heading">

          <p class="eyebrow">
            Different Problems
          </p>

          <h2 class="section-title">
            Same Rule.
          </h2>

        </div>


        <div class="project-gallery">

          <a
            href="./ranchero/"
            aria-label="View the Ranchero build"
          >
            <img
              src="./ranchero/20260825_110401.jpeg"
              alt="1965 Ford Ranchero"
              loading="lazy"
            >
          </a>

          <a
            href="./C10/"
            aria-label="View the C10 build"
          >
            <img
              src="./C10/c10-hero.jpg"
              alt="1972 Chevrolet C10"
              loading="lazy"
            >
          </a>

        </div>


        <div
          class="project-detail-card"
          style="margin-top:14px;"
        >

          <p>
            Don't cover up the problem.
            Don't build around it.
          </p>

          <p>
            <strong>
              Figure out what it actually needs
              and do the damn thing right.
            </strong>
          </p>

        </div>

      </div>

    </section>



    <!-- =====================================================
         CLOSE
         ===================================================== -->

    <section class="page-section">

      <div class="wrap">

        <p class="eyebrow">
          More Coming
        </p>

        <h2 class="section-title">
          I Don't Really<br>
          Do Finished.
        </h2>

        <p class="home-hero-copy">
          These are the stories worth following right now.
          <br><br>

          <strong>
            There will be more.
          </strong>
        </p>

      </div>

    </section>

  `;
}


/* =========================================================
   INITIAL PAGE LOAD
   ========================================================= */

if (!window.UNCLE_MIKE_ROUTER_ACTIVE) {
  renderBuildPage();
}
