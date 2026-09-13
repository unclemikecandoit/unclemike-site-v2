(() => {
  const page = document.getElementById("page-content");

  if (!page) return;

  page.innerHTML = `

    <!-- =====================================================
         HERO
         ===================================================== -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Figure It Out
        </p>

        <h1>
          There's Your<br>
          Problem.
        </h1>

        <p class="home-hero-copy">
          <strong>
            Diagnosis. Systems. Pattern Recognition.
          </strong>
          <br>
          Problems that don't come with instructions.
        </p>

      </div>
    </section>


    <!-- =====================================================
         THE ACTUAL SKILL
         ===================================================== -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          The Actual Skill
        </p>

        <h2>
          Find The Thing<br>
          That's Actually Wrong.
        </h2>

        <div
          class="project-detail-card"
          style="margin-top:42px;"
        >

          <p>
            Replacing parts is easy.
          </p>

          <p>
            Knowing which part matters is harder.
          </p>

          <p>
            Electrical. Mechanical. Fabrication.
            Machines. Cars. Systems I've never seen before.
            The medium changes.
          </p>

          <p>
            The process doesn't.
          </p>

        </div>

      </div>
    </section>


    <!-- =====================================================
         PROCESS
         ===================================================== -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          How I Work
        </p>

        <h2>
          Look. Question.<br>
          Test. Know.
        </h2>

        <div class="project-detail-grid">

          <article class="project-detail-card">

            <p class="eyebrow">
              01 · Look
            </p>

            <h3>
              What's Actually Happening?
            </h3>

            <p>
              Start with what the thing is doing,
              not what somebody already decided
              must be wrong with it.
            </p>

          </article>


          <article class="project-detail-card">

            <p class="eyebrow">
              02 · Question
            </p>

            <h3>
              What Doesn't Fit?
            </h3>

            <p>
              The weird detail usually matters.
              Assumptions get expensive when nobody
              bothers checking them.
            </p>

          </article>


          <article class="project-detail-card">

            <p class="eyebrow">
              03 · Test
            </p>

            <h3>
              Prove It.
            </h3>

            <p>
              Follow the system.
              Isolate variables.
              Test the theory before turning it
              into another problem.
            </p>

          </article>


          <article class="project-detail-card">

            <p class="eyebrow">
              04 · Know
            </p>

            <h3>
              Then Fix It.
            </h3>

            <p>
              Once the problem makes sense,
              the repair usually gets a whole
              lot less mysterious.
            </p>

          </article>

        </div>

      </div>
    </section>


    <!-- =====================================================
         REAL PROBLEMS
         ===================================================== -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          In The Wild
        </p>

        <h2>
          Different Machines.<br>
          Same Brain.
        </h2>

        <div class="project-grid">


          <article class="project-card project-card-static">

            <div class="project-card-body">

              <p class="eyebrow">
                Automotive
              </p>

              <h3>
                The Super Duty.
              </h3>

              <p>
                Electrical diagnosis and repair
                on my own problem child.
              </p>

            </div>

          </article>


          <article class="project-card project-card-static">

            <div class="project-card-body">

              <p class="eyebrow">
                Heavy Equipment
              </p>

              <h3>
                Caterpillar Genset.
              </h3>

              <p>
                AC power, load testing and figuring
                out what the machine is actually telling you.
              </p>

            </div>

          </article>


          <article class="project-card project-card-static">

            <div class="project-card-body">

              <p class="eyebrow">
                Railroad
              </p>

              <h3>
                Locomotive Systems.
              </h3>

              <p>
                Big machines don't make the logic
                any different. They just make
                the parts heavier.
              </p>

            </div>

          </article>


        </div>

      </div>
    </section>


    <!-- =====================================================
         CLOSE
         ===================================================== -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          The Point
        </p>

        <h2>
          I Don't Need To<br>
          Know The Answer.
        </h2>

        <p
          style="
            max-width:760px;
            margin:0;
            color:#d6c49e;
            font-size:clamp(1.15rem, 3vw, 1.6rem);
            line-height:1.55;
          "
        >
          I need enough information to
          <strong style="color:var(--paper-2);">
            figure it out.
          </strong>
        </p>

      </div>
    </section>

  `;
})();
