function renderMakePage() {
  const page =
    document.getElementById("page-content");

  if (!page) return;

  page.innerHTML = `

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Make
        </p>

        <h1>
          Make Something.
        </h1>

        <p class="home-hero-copy">
          <strong>
            Brands. Websites. Graphics. Merch.
          </strong>
          <br>
          If it doesn't exist yet,
          that's usually the interesting part.
        </p>

      </div>
    </section>


    <!-- CROOKED GATE -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Featured Project
        </p>

        <h2>
          Crooked Gate Seasonings.
        </h2>

        <a
          class="project-card"
          href="./crooked-gate/"
          aria-label="View the Crooked Gate Seasonings case study"
        >

          <div class="project-card-body">

            <p class="eyebrow">
              Brand · Web Design · E-Commerce
            </p>

            <h3>
              From Seasonings To A Storefront.
            </h3>

            <p>
              Product presentation, brand structure,
              recipes, responsive web design,
              cart functionality, shipping logic
              and Square checkout.
            </p>

            <span class="project-card-link">
              View Case Study →
            </span>

          </div>

        </a>


        <div style="margin-top:18px;">

          <a
            class="project-card-link"
            href="https://crookedgate.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Live Site →
          </a>

        </div>

      </div>
    </section>


    <!-- DESIGN WORK -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Design Work
        </p>

        <h2>
          Ideas With Somewhere To Go.
        </h2>

        <div class="project-grid">


          <article
            class="project-card project-card-static"
          >
            <div class="project-card-body">

              <p class="eyebrow">
                Apparel · Identity
              </p>

              <h3>
                Hard Luck Made Me.
              </h3>

              <p>
                A badge that became more than
                one design.
              </p>

            </div>
          </article>


          <article
            class="project-card project-card-static"
          >
            <div class="project-card-body">

              <p class="eyebrow">
                Apparel · Graphic Design
              </p>

              <h3>
                Pattern Recognition.
              </h3>

              <p>
                Because apparently noticing everything
                needed merchandise.
              </p>

            </div>
          </article>


          <article
            class="project-card project-card-static"
          >
            <div class="project-card-body">

              <p class="eyebrow">
                Apparel · Graphic Design
              </p>

              <h3>
                Hyperfixation.
              </h3>

              <p>
                One idea.
                Entirely too much commitment.
              </p>

            </div>
          </article>


          <article
            class="project-card project-card-static"
          >
            <div class="project-card-body">

              <p class="eyebrow">
                Apparel · Graphic Design
              </p>

              <h3>
                Prove What?
              </h3>

              <p>
                Some designs are a statement.
                Some are a response.
              </p>

            </div>
          </article>


          <article
            class="project-card project-card-static"
          >
            <div class="project-card-body">

              <p class="eyebrow">
                Apparel · Railroad
              </p>

              <h3>
                Machinists.
              </h3>

              <p>
                Pistol whipping locomotives
                since somebody had to fix them.
              </p>

            </div>
          </article>


          <article
            class="project-card project-card-static"
          >
            <div class="project-card-body">

              <p class="eyebrow">
                Logo · Automotive
              </p>

              <h3>
                Hawk Rods Engines.
              </h3>

              <p>
                Old-school engine shop identity
                built around a 1970s decal feel.
              </p>

            </div>
          </article>


        </div>

      </div>
    </section>


    <!-- PHILOSOPHY -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          The Process
        </p>

        <h2>
          See It. Make It Real.
        </h2>

        <p class="home-hero-copy">

          A lot of this starts the same way:

          <br><br>

          <strong>
            “I have an idea.”
          </strong>

          <br>

          Cool.

          <br>

          Now let's figure out
          what the hell it actually is.

        </p>

      </div>
    </section>

  `;
}


renderMakePage();
