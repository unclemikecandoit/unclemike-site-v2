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
          1972 Chevy C10 · Build Journal
        </p>

        <h1>
          Unfucking This<br>
          Death Trap.
        </h1>

        <p class="home-hero-copy">
          Somebody had already “built” this truck.
          <br><br>
          <strong>
            I had to make it stop trying to kill people.
          </strong>
        </p>


        <!-- HERO TEASER -->
        <div
          style="
            margin-top:32px;
            height:clamp(220px, 38vh, 380px);
            overflow:hidden;
            border:1px solid var(--line);
          "
        >
          <img
            src="./c10-hero.jpg"
            alt="1972 Chevrolet C10 project"
            loading="eager"
            style="
              display:block;
              width:100%;
              height:100%;
              object-fit:cover;
              object-position:center center;
            "
          >
        </div>


        <!-- SCROLL CUE -->
        <div
          style="
            margin-top:18px;
            text-align:center;
            padding:18px 10px 4px;
          "
        >
          <p
            class="eyebrow"
            style="
              margin-bottom:8px;
            "
          >
            This Thing Was A Mess
          </p>

          <a
            href="#first-fix"
            style="
              display:inline-block;
              color:var(--paper);
              text-decoration:none;
              font-weight:700;
              letter-spacing:.08em;
              text-transform:uppercase;
            "
          >
            Keep Scrolling — Watch Me Work ↓
          </a>
        </div>

      </div>
    </section>



    <!-- =====================================================
         FIRST DISCOVERY
         ===================================================== -->

    <section
      class="page-section"
      id="first-fix"
      style="padding-top:24px;"
    >
      <div class="wrap">

        <p class="eyebrow">
          01 · Previous Work
        </p>

        <h2 class="section-title">
          Well, That's Not<br>
          Supposed To Be Loose.
        </h2>


        <div
          class="video-card"
          style="margin-top:24px;"
        >

          <div class="video-frame">

            <video
              controls
              playsinline
              preload="metadata"
              poster="./IMG_6580.jpeg"
            >

              <source
                src="./6FAA4497-552D-438B-A255-4C53B8629ABA.mov"
                type="video/quicktime"
              >

              Your browser does not support the video tag.

            </video>


            <div
              class="video-cover"
              role="button"
              tabindex="0"
              aria-label="Play loose rear hardware video"
            >

              <div class="video-play"></div>

              <div class="video-cover-content">

                <span class="video-cover-kicker">
                  Previous Work
                </span>

                <span class="video-cover-title">
                  Well, That's Not Supposed To Be Loose.
                </span>

              </div>

            </div>

          </div>


          <div class="video-card-body">

            <p class="eyebrow">
              Rear Suspension
            </p>

            <h3>
              Loose Hardware.
            </h3>

            <p>
              Probably worth checking everything else.
            </p>

          </div>

        </div>

      </div>
    </section>



    <!-- =====================================================
         PATTERN BREAK
         ===================================================== -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          And There It Is
        </p>

        <h2 class="section-title">
          If That's Wrong,<br>
          What Else Is Wrong?
        </h2>

      </div>
    </section>



    <!-- =====================================================
         SUSPENSION
         ===================================================== -->

    <section
      class="page-section"
      style="padding-top:24px;"
    >
      <div class="wrap">

        <p class="eyebrow">
          02 · Suspension
        </p>

        <h2 class="section-title">
          When Lowering It<br>
          Goes Wrong.
        </h2>


        <div
          class="project-detail-card"
          style="margin-top:24px;"
        >

          <p>
            Frame hitting axle.
          </p>

          <p>
            <strong>
              Airbags fixed the clearance
              without murdering the owner's budget.
            </strong>
          </p>

          <h3
            style="
              margin-top:24px;
              margin-bottom:0;
            "
          >
            The mounts didn't exist.<br>
            So I made them.
          </h3>

        </div>


        <div
          class="video-card"
          style="margin-top:18px;"
        >

          <div class="video-frame">

            <video
              controls
              playsinline
              preload="metadata"
              poster="./IMG_6582.jpeg"
            >

              <source
                src="./F57027A3-DC86-49DF-9AB3-D7DE21FB56DE.mp4"
                type="video/mp4"
              >

              Your browser does not support the video tag.

            </video>


            <div
              class="video-cover"
              role="button"
              tabindex="0"
              aria-label="Play airbag fabrication video"
            >

              <div class="video-play"></div>

              <div class="video-cover-content">

                <span class="video-cover-kicker">
                  Fabrication · Suspension
                </span>

                <span class="video-cover-title">
                  Make What You Need.
                </span>

              </div>

            </div>

          </div>


          <div class="video-card-body">

            <p class="eyebrow">
              Fabrication
            </p>

            <h3>
              Make What You Need.
            </h3>

          </div>

        </div>

      </div>
    </section>



    <!-- =====================================================
         KEEP GOING
         ===================================================== -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Naturally
        </p>

        <h2 class="section-title">
          Cool.<br>
          Keep Finding Shit.
        </h2>

      </div>
    </section>



    <!-- =====================================================
         EVERYTHING ELSE
         ===================================================== -->

    <section
      class="page-section"
      style="padding-top:24px;"
    >
      <div class="wrap">

        <p class="eyebrow">
          03 · Mechanical · Fuel · Electrical
        </p>

        <h2 class="section-title">
          Unfucking<br>
          Everything Else.
        </h2>


        <div
          class="project-detail-grid"
          style="margin-top:28px; margin-bottom:24px;"
        >

          <div class="project-detail-card">
            <p class="eyebrow">Vacuum</p>
            <h3>Find The Leaks.</h3>
          </div>

          <div class="project-detail-card">
            <p class="eyebrow">Ignition</p>
            <h3>Set The Timing.</h3>
          </div>

          <div class="project-detail-card">
            <p class="eyebrow">Fuel</p>
            <h3>Rebuild The Carb.</h3>
          </div>

          <div class="project-detail-card">
            <p class="eyebrow">Fuel</p>
            <h3>Add A Filter.</h3>
          </div>

          <div class="project-detail-card">
            <p class="eyebrow">Transmission</p>
            <h3>Vacuum Modulator.</h3>
          </div>

          <div class="project-detail-card">
            <p class="eyebrow">Electrical</p>
            <h3>Fix The Wiring.</h3>
          </div>

        </div>


        <div class="video-card">

          <div class="video-frame">

            <video
              controls
              playsinline
              preload="metadata"
              poster="./c10-wrapping-it-up-poster.jpg"
            >

              <source
                src="./EFC4A87E-6D7D-4991-A328-A0D33D922905.mp4"
                type="video/mp4"
              >

              Your browser does not support the video tag.

            </video>


            <div
              class="video-cover"
              role="button"
              tabindex="0"
              aria-label="Play wrapping it up video"
            >

              <div class="video-play"></div>

              <div class="video-cover-content">

                <span class="video-cover-kicker">
                  Mechanical · Fuel · Electrical
                </span>

                <span class="video-cover-title">
                  One Problem At A Time.
                </span>

              </div>

            </div>

          </div>


          <div class="video-card-body">

            <p class="eyebrow">
              The Process
            </p>

            <h3>
              Find It.<br>
              Understand It.<br>
              Fix It.
            </h3>

          </div>

        </div>

      </div>
    </section>



    <!-- =====================================================
         RESULT
         ===================================================== -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          The Result
        </p>

        <h2 class="section-title">
          Considerably Less<br>
          Death-Trappy.
        </h2>


        <div
          class="project-detail-card"
          style="margin-top:24px;"
        >

          <p>
            Fix the dangerous shit.
            Correct the bad decisions.
            Respect the owner's budget.
          </p>

          <h3
            style="
              margin-top:24px;
              margin-bottom:0;
            "
          >
            Safer.<br>
            More useful.<br>
            Better than I found it.
          </h3>

        </div>

      </div>
    </section>



    <!-- =====================================================
         PERSONALITY
         ===================================================== -->

    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Meanwhile
        </p>

        <h2 class="section-title">
          Mike Being Mike.
        </h2>


        <div
          class="video-card"
          style="margin-top:24px;"
        >

          <div class="video-frame">

            <video
              controls
              playsinline
              preload="metadata"
              poster="./IMG_6583.jpeg"
            >

              <source
                src="./33A137D3-CE2C-453C-8F71-F90FE92DEC15.mp4"
                type="video/mp4"
              >

              Your browser does not support the video tag.

            </video>


            <div
              class="video-cover video-cover-minimal"
              role="button"
              tabindex="0"
              aria-label="Play Mike being Mike video"
            >

              <div class="video-play"></div>

              <div class="video-cover-content">

                <span class="video-cover-kicker">
                  Mike Being Mike
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>

  `;


  /* =====================================================
     VIDEO COVER SYSTEM
     ===================================================== */

  document.querySelectorAll(".video-frame").forEach((frame) => {
    const video = frame.querySelector("video");
    const cover = frame.querySelector(".video-cover");

    if (!video || !cover) return;


    function playVideo() {
      cover.classList.add("is-hidden");

      video.play().catch(() => {
        cover.classList.remove("is-hidden");
      });
    }


    cover.addEventListener("click", playVideo);


    cover.addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        playVideo();
      }
    });


    video.addEventListener("play", () => {
      cover.classList.add("is-hidden");
    });


    video.addEventListener("ended", () => {
      video.currentTime = 0;
      cover.classList.remove("is-hidden");
    });
  });
})();
