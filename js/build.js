function renderBuildPage() {
  const page = document.getElementById("page-content");

  if (!page) return;


  page.innerHTML = `

    <!-- =====================================================
         BUILD HERO
         ===================================================== -->

    <section class="page-section build-hero">

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



    <!-- =====================================================
         FEATURED BUILDS
         ===================================================== -->

    <section class="page-section">

      <div class="wrap">

        <p class="eyebrow">
          Build Journals
        </p>

        <h2>
          The Ones With Stories.
        </h2>


        <div class="project-grid">


          <!-- ===============================================
               1965 FORD RANCHERO
               =============================================== -->

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
                First start, repairs, figuring out sixty years
                of other people's decisions and putting an old
                car back together one problem at a time.
              </p>

              <span class="project-card-link">
                View Build →
              </span>

            </div>

          </a>



          <!-- ===============================================
               1972 CHEVY C10
               =============================================== -->

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
                Loose suspension hardware, a bad lowering job,
                custom airbag mounts, mechanical problems,
                wiring problems and a truck that needed to
                become considerably less dangerous.
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
         OTHER BUILDS
         ===================================================== -->

    <section class="page-section">

      <div class="wrap">

        <p class="eyebrow">
          From The Garage
        </p>

        <h2>
          Built. Fixed. Figured Out.
        </h2>


        <div class="project-grid">


          <!-- ===============================================
               1975 CHEVY K10
               =============================================== -->

          <article class="project-card project-card-static">

            <div class="project-card-body">

              <p class="eyebrow">
                1975 Chevy K10
              </p>

              <h3>
                Big Truck. Simple Formula.
              </h3>

              <p>
                Small-block Chevy · TH400 · 4.10 gears ·
                6-inch lift · custom toolbox fitted around
                the roll bar.
              </p>

            </div>

          </article>



          <!-- ===============================================
               SUPER DUTY
               =============================================== -->

          <article class="project-card project-card-static">

            <div class="project-card-body">

              <p class="eyebrow">
                Ford Super Duty
              </p>

              <h3>
                My POS Super Duty.
              </h3>

              <p>
                Because apparently owning something means
                eventually having to figure out why the
                electrical system decided to become a problem.
              </p>

            </div>

          </article>



          <!-- ===============================================
               EMD LOCOMOTIVE
               =============================================== -->

          <article class="project-card project-card-static">

            <div class="project-card-body">

              <p class="eyebrow">
                Heavy Diesel
              </p>

              <h3>
                EMD Locomotive Engine.
              </h3>

              <p>
                Railroad power on an entirely different scale.
              </p>

            </div>

          </article>



          <!-- ===============================================
               LEARNING THE TRADE
               =============================================== -->

          <article class="project-card project-card-static">

            <div class="project-card-body">

              <p class="eyebrow">
                Learning The Trade
              </p>

              <h3>
                Teaching My Son To Wrench.
              </h3>

              <p>
                The useful kind of education.
              </p>

            </div>

          </article>


        </div>

      </div>

    </section>

  `;
}


renderBuildPage();
