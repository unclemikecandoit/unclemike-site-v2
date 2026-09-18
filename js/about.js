function renderAboutPage() {
  const page = document.getElementById("page-content");

  if (!page) return;

  page.innerHTML = `

    <!-- =====================================================
         HERO — VISUAL IMMEDIATELY
         ===================================================== -->

    <section class="page-section about-hero">
      <div class="wrap">

        <div class="about-hero-grid">

          <div class="about-hero-photo">
            <img
              src="./IMG_6783.jpeg"
              alt="Uncle Mike"
              loading="eager"
            >
          </div>

          <div class="about-hero-copy">

            <p class="eyebrow">
              About Me
            </p>

            <h1>
              I Build.<br>
              I Fix.<br>
              I Design.<br>
              I Figure Shit Out.
            </h1>

            <p class="home-hero-copy">
              Apparently I have a hard time
              leaving possibilities alone.
            </p>

          </div>

        </div>

      </div>
    </section>



    <!-- =====================================================
         PATTERN RECOGNITION
         ===================================================== -->

    <section
      class="page-section"
      style="padding-top:20px;"
    >
      <div class="wrap">

        <div class="about-image-break">

          <img
            src="./IMG_6785.jpeg"
            alt="Mike"
            loading="eager"
          >

        </div>


        <div
          class="project-detail-card"
          style="margin-top:14px;"
        >

          <p class="eyebrow">
            Pattern Recognition
          </p>

          <h3>
            I See Things Differently.
          </h3>

          <p>
            I see patterns other people miss.
            I obsess over details.
            If I don't know how to do something,
            there's a pretty good chance I'm about
            to figure it out.
          </p>

          <p>
            <strong>
              Turns out being the autistic guy
              everybody underestimated has its advantages.
            </strong>
          </p>

        </div>

      </div>
    </section>



    <!-- =====================================================
         POSSIBILITY
         ===================================================== -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Different Medium. Same Brain.
        </p>

        <h2 class="section-title">
          I Create.<br>
          My Medium Is Possibility.
        </h2>

      </div>
    </section>



    <!-- =====================================================
         VISUAL BREAK
         ===================================================== -->

    <section
      class="page-section"
      style="padding-top:10px;"
    >
      <div class="wrap">

        <div class="about-image-break about-image-wide">

          <img
            src="./IMG_6787.jpeg"
            alt="Mike in motorcycle gear"
            loading="lazy"
          >

        </div>


        <div
          class="project-detail-card"
          style="margin-top:14px;"
        >

          <p>
            Cars. Art. Business. Parenting.
          </p>

          <p>
            <strong>
              Eventually I look at something and decide:
              “I can make that.”
            </strong>
          </p>

        </div>

      </div>
    </section>



    <!-- =====================================================
         THE TURN
         ===================================================== -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          The Part That Changed Everything
        </p>

        <h2 class="section-title">
          I Quit<br>
          Listening.
        </h2>


        <div
          class="project-detail-card"
          style="margin-top:24px;"
        >

          <p>
            I spent a lot of my life being told,
            directly or otherwise,
            what I couldn't do.
          </p>

          <p>
            <strong>
              So I quit listening.
            </strong>
          </p>

          <p>
            Now I build cool shit,
            solve hard problems
            and make good ideas better.
          </p>

        </div>

      </div>
    </section>



    <!-- =====================================================
         DAD — VISUAL FIRST
         ===================================================== -->

    <section class="page-section">
      <div class="wrap">

        <div class="about-image-break">

          <img
            src="./IMG_6783.jpeg"
            alt="Mike"
            loading="lazy"
          >

        </div>


        <div
          class="project-detail-card"
          style="margin-top:14px;"
        >

          <p class="eyebrow">
            Dad
          </p>

          <h3>
            The Dad I Never Had.
          </h3>

          <p>
            Building things matters.
            Building people matters more.
          </p>

          <p>
            <strong>
              Teach them how to think.
              Let them know they're capable.
              Show up.
            </strong>
          </p>

        </div>

      </div>
    </section>



    <!-- =====================================================
         LIFE
         ===================================================== -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          The Goal
        </p>

        <h2 class="section-title">
          Build A Life<br>
          Worth Living In.
        </h2>


        <div class="about-image-break about-image-wide">

          <img
            src="./IMG_6787.jpeg"
            alt="Mike"
            loading="lazy"
          >

        </div>

      </div>
    </section>



    <!-- =====================================================
         PERSONALITY
         ===================================================== -->

    <section class="page-section">
      <div class="wrap">

        <div class="about-image-break">

          <img
            src="./IMG_6624.jpeg"
            alt="Mike"
            loading="lazy"
          >

        </div>


        <div
          class="project-detail-card"
          style="margin-top:14px;"
        >

          <p class="eyebrow">
            Also
          </p>

          <h3>
            Don't Make It Weird.
          </h3>

          <p>
            I take the work seriously.
          </p>

          <p>
            Myself considerably less so.
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
          Uncle Mike Can Do It
        </p>

        <h2 class="section-title">
          It's Not Really<br>
          A Slogan Anymore.
        </h2>

        <p class="home-hero-copy">
          See what it could be.
          Figure out what it takes.
          <br><br>

          <strong>
            Make the damn thing real.
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
  renderAboutPage();
}
