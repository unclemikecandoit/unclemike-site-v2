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

        <p class="eyebrow">
          Where It Started
        </p>

        <div class="project-gallery">

          <figure class="project-card">

            <div class="project-card-media">
              <img
                src="./20260825_111600.jpeg"
                alt="1965 Ford Ranchero"
              >
            </div>

            <figcaption class="project-card-body">

              <h3>
                Bringing It Back
              </h3>

              <p>
                1965 Ford Ranchero
              </p>

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

              <h3>
                The Day It Came Home
              </h3>

              <p>
                Where this one started
              </p>

            </figcaption>

          </figure>

        </div>

      </div>
    </section>


    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Build Journal
        </p>

        <h2>
          First Start.
        </h2>

        <div class="video-card ranchero-video-card">

          <div class="video-frame">

            <video
              controls
              playsinline
              preload="metadata"
              poster="./IMG_6569.jpeg"
            >

              <source
                src="./F9AC6E05-FA72-4201-BD5B-95C505A22D97.mp4"
                type="video/mp4"
              >

            </video>


            <div
              class="video-cover"
              role="button"
              tabindex="0"
              aria-label="Play Ranchero first start video"
            >

              <div class="video-play"></div>

              <div class="video-cover-content">

                <span class="video-cover-kicker">
                  Milestone
                </span>

                <span class="video-cover-title">
                  First Start.
                </span>

              </div>

            </div>

          </div>


          <div class="video-card-body">

            <p class="eyebrow">
              Ranchero
            </p>

            <h3>
              It Lives.
            </h3>

            <p>
              The moment the Ranchero came back to life.
            </p>

          </div>

        </div>

      </div>
    </section>


    <section class="page-section">
      <div class="wrap">

        <p class="eyebrow">
          Build Journal
        </p>

        <h2>
          Fix The Door.
        </h2>

        <div class="video-card ranchero-video-card">

          <div class="video-frame">

            <video
              controls
              playsinline
              preload="metadata"
              poster="./IMG_6570.jpeg"
            >

              <source
                src="./DFEBEA2B-3680-4F0D-9244-994217A7FDDB.mov"
                type="video/quicktime"
              >

            </video>


            <div
              class="video-cover"
              role="button"
              tabindex="0"
              aria-label="Play Ranchero door repair video"
            >

              <div class="video-play"></div>

              <div class="video-cover-content">

                <span class="video-cover-kicker">
                  One More Thing
                </span>

                <span class="video-cover-title">
                  Lemme Fix It Real Quick.
                </span>

              </div>

            </div>

          </div>


          <div class="video-card-body">

            <p class="eyebrow">
              Fix It
            </p>

            <h3>
              Door Alignment.
            </h3>

            <p>
              See something wrong. Figure out why. Make it work
              the way it should.
            </p>

          </div>

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
              This is the permanent home for the Ranchero.
              Every repair, first, failure, improvement and
              questionable decision gets added as the project moves forward.
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
              It doesn't have to be finished to be worth showing.
              The process is the project.
            </p>

          </div>

        </div>

      </div>
    </section>
  `;


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
}


renderRancheroPage();
