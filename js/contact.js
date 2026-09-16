document.addEventListener("DOMContentLoaded", () => {

  const page = document.getElementById("page-content");

  if (!page) return;

  page.innerHTML = `

    <section class="page-section contact-hero">

      <div class="section-heading">

        <div class="eyebrow">
          Contact
        </div>

        <h1>
          Ready To Make It Happen?<br>
          Contact Me.
        </h1>

        <div class="home-hero-copy">

          <p>
            You've got the idea. Maybe you know exactly what you need.
            Maybe you don't.
          </p>

          <p>
            <strong>
              Tell me what you're trying to make, build, fix, or figure out.
              We'll start there.
            </strong>
          </p>

        </div>

      </div>

    </section>


    <section class="page-section">

      <div class="project-detail-card contact-card">

        <form
          id="contact-form"
          action="https://api.web3forms.com/submit"
          method="POST"
        >

          <input
            type="hidden"
            name="access_key"
            value="YOUR_WEB3FORMS_ACCESS_KEY"
          >

          <input
            type="hidden"
            name="subject"
            value="New Uncle Mike Can Do It Inquiry"
          >

          <input
            type="hidden"
            name="from_name"
            value="Uncle Mike Can Do It"
          >

          <input
            type="checkbox"
            name="botcheck"
            class="contact-botcheck"
            tabindex="-1"
            autocomplete="off"
          >


          <div class="contact-field">

            <label for="contact-name">
              Name
            </label>

            <input
              id="contact-name"
              type="text"
              name="name"
              autocomplete="name"
              required
            >

          </div>


          <div class="contact-field">

            <label for="contact-email">
              Email
            </label>

            <input
              id="contact-email"
              type="email"
              name="email"
              autocomplete="email"
              required
            >

          </div>


          <div class="contact-field">

            <label for="contact-project">
              What Are We Working On?
            </label>

            <input
              id="contact-project"
              type="text"
              name="project"
              placeholder="Car, brand, website, merch, weird problem..."
              required
            >

          </div>


          <div class="contact-field">

            <label for="contact-message">
              Tell Me About It
            </label>

            <textarea
              id="contact-message"
              name="message"
              rows="8"
              placeholder="What are you trying to make happen?"
              required
            ></textarea>

          </div>


          <button
            class="project-link contact-submit"
            type="submit"
          >
            Send It →
          </button>


          <div
            id="contact-status"
            class="contact-status"
            aria-live="polite"
          ></div>

        </form>

      </div>

    </section>

  `;


  const style = document.createElement("style");

  style.textContent = `

    .contact-hero .section-heading {
      max-width: 900px;
    }

    .contact-hero h1 {
      max-width: 900px;
    }

    .contact-hero .home-hero-copy {
      max-width: 760px;
      margin: 0;
    }

    .contact-card {
      max-width: 760px;
      margin: 0 auto;
    }

    #contact-form {
      display: grid;
      gap: 24px;
    }

    .contact-field {
      display: grid;
      gap: 9px;
    }

    .contact-field label {
      color: var(--paper);
      font-family: Georgia, "Times New Roman", serif;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .contact-field input,
    .contact-field textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid var(--muted);
      border-radius: 0;
      background: var(--surface-deep);
      color: var(--paper);
      font: inherit;
      font-size: 1rem;
      padding: 15px 16px;
      outline: none;
      transition:
        border-color 160ms ease,
        background 160ms ease;
    }

    .contact-field textarea {
      min-height: 190px;
      resize: vertical;
      line-height: 1.55;
    }

    .contact-field input::placeholder,
    .contact-field textarea::placeholder {
      color: var(--muted);
      opacity: 0.72;
    }

    .contact-field input:focus,
    .contact-field textarea:focus {
      border-color: var(--paper);
      background: var(--surface);
    }

    .contact-submit {
      appearance: none;
      cursor: pointer;
      justify-self: start;
      font: inherit;
    }

    .contact-submit:disabled {
      cursor: wait;
      opacity: 0.6;
    }

    .contact-status {
      min-height: 1.5em;
      color: var(--copy);
      line-height: 1.5;
    }

    .contact-status strong {
      color: var(--paper);
    }

    .contact-botcheck {
      display: none !important;
    }

    .contact-success {
      padding: 18px 0;
    }

    .contact-success h2 {
      margin-bottom: 12px;
    }


    @media (max-width: 600px) {

      .contact-hero h1 {
        font-size: clamp(3rem, 14vw, 4.5rem);
        line-height: 0.88;
        letter-spacing: -0.035em;
      }

      .contact-hero .home-hero-copy {
        font-size: 1rem;
        line-height: 1.55;
      }

      .contact-card {
        padding: 22px;
      }

      #contact-form {
        gap: 20px;
      }

      .contact-field input,
      .contact-field textarea {
        font-size: 16px;
      }

      .contact-submit {
        width: 100%;
        text-align: center;
      }

    }

  `;

  document.head.appendChild(style);


  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  const button = form.querySelector(".contact-submit");

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const accessKey = form.querySelector(
      'input[name="access_key"]'
    ).value;

    if (
      !accessKey ||
      accessKey === "YOUR_WEB3FORMS_ACCESS_KEY"
    ) {

      status.innerHTML = `
        <strong>Contact form isn't connected yet.</strong><br>
        Add the Web3Forms access key and we're live.
      `;

      return;

    }

    const originalButtonText = button.textContent;

    button.disabled = true;
    button.textContent = "Sending...";

    status.textContent = "";

    try {

      const formData = new FormData(form);

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: formData
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Submission failed.");
      }

      form.innerHTML = `

        <div class="contact-success">

          <div class="eyebrow">
            Message Sent
          </div>

          <h2>
            Got It.
          </h2>

          <p>
            I'll take it from here.
          </p>

        </div>

      `;

    } catch (error) {

      button.disabled = false;
      button.textContent = originalButtonText;

      status.innerHTML = `
        <strong>Well, that ain't right.</strong><br>
        Something went wrong sending your message. Try again.
      `;

    }

  });

});
