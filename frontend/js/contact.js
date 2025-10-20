function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

class Form {
  #submitBtn = document.querySelector(".submit__btn");
  #form = document.querySelector(".contact__form");
  #translations = document.querySelector(".btn-translations").dataset;
  #reCapthcaInput = document.querySelector(".reCaptcha");

  #inputs = [];

  //STATES
  #STATES = {
    READY_TO_SEND: 0,
    SENDING: 1,
    SENT: 2,
    FAILED: 3,
  };

  #BTN_STATES = {
    0: {
      html: `<span>${this.#translations.send}</span>`,
      disabled: false,
      timeout: 0,
      classToAdd: "",
      classToRemove: "deactivated",
    },
    1: {
      html: `<div class="sk-chase">
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
          </div>`,
      disabled: true,
      timeout: 0,
      classToAdd: "deactivated",
      classToRemove: "",
    },
    2: {
      html: `<ion-icon name="checkmark-outline"></ion-icon><span>${
        this.#translations.sent
      }</span>`,
      disabled: true,
      timeout: 5000,
      classToAdd: "deactivated",
      classToRemove: "",
    },
    3: {
      html: `<ion-icon name="close-outline"></ion-icon><span>${
        this.#translations.failed
      }</span>`,
      disabled: true,
      timeout: 2000,
      classToAdd: "deactivated",
      classToRemove: "",
    },
  };

  #STATE;

  #initSubmitBtn() {
    this.#form.addEventListener("submit", this.#sumbitForm.bind(this));
  }

  async #sumbitForm(event) {
    event.preventDefault();

    const csrfToken = getCookie("csrftoken");
    const url = this.#form.dataset.url;

    this.#STATE = this.#STATES.SENDING;
    this.#applySumbitState();

    try {
      await this.#refreshReCaptcha();
      const formData = new FormData(this.#form);

      if (!this.#validateAllInput()) {
        this.#STATE = this.#STATES.FAILED;
        this.#applySumbitState();
        return;
      }

      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });
      if (response.ok) this.#STATE = this.#STATES.SENT;
      else this.#STATE = this.#STATES.FAILED;
    } catch (err) {
      this.#STATE = this.#STATES.FAILED;
    }

    this.#applySumbitState();
  }

  async #refreshReCaptcha() {
    return new Promise((resolve, reject) =>
      grecaptcha.ready(() => {
        grecaptcha
          .execute("6LcYw-wrAAAAAMrZFIx6iK81Qr0y8jw5KUvU95vi", {
            action: "contact",
          })
          .then((token) => {
            this.#reCapthcaInput.setAttribute("value", token);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      })
    );
  }

  #applySumbitState() {
    const stateData = this.#BTN_STATES[this.#STATE];

    this.#submitBtn.innerHTML = stateData.html;
    this.#submitBtn.disabled = stateData.disabled;

    if (stateData.timeout !== 0)
      setTimeout(this.#reactivateSubmit.bind(this), stateData.timeout);

    if (stateData.classToAdd)
      this.#submitBtn.classList.add(stateData.classToAdd);
    if (stateData.classToRemove)
      this.#submitBtn.classList.remove(stateData.classToRemove);
  }

  #reactivateSubmit() {
    this.#STATE = this.#STATES.READY_TO_SEND;
    this.#applySumbitState();
  }

  #initInputs() {
    const htmlInputs = document.querySelectorAll(".form__input");
    const htmlErorrs = document.querySelectorAll(".error-message");

    for (let i = 0; i < htmlInputs.length; i++) {
      const currInput = htmlInputs[i];
      const currError = htmlErorrs[i];
      let type;
      if (currInput instanceof HTMLTextAreaElement) type = "text";
      else type = currInput.type;

      this.#inputs.push(
        new Input(currInput, currError, type, !currInput.required)
      );
    }
  }

  #validateAllInput() {
    return this.#inputs.every((input) => input.validateInput());
  }

  init() {
    this.#form.setAttribute("novalidate", "true");
    this.#STATE = this.#STATES.READY_TO_SEND;

    this.#initSubmitBtn();
    this.#initInputs();
  }
}

export default new Form();

class Input {
  #htmlElement;
  #errorElement;
  #type;
  #blank;

  #TYPES = {
    text: 0,
    email: 1,
  };
  #VALIDATORS = {
    0: this.#textValidation.bind(this),
    1: this.#emailValidation.bind(this),
  };

  constructor(htmlElement, errorElement, type, blank = false) {
    this.#htmlElement = htmlElement;
    this.#errorElement = errorElement;
    this.#type = this.#TYPES[type];
    this.#blank = blank;

    this.#htmlElement.addEventListener("blur", this.#validateOnBlur.bind(this));
  }

  #validateOnBlur(event) {
    event.preventDefault();

    if (this.validateInput()) this.#hideError();
    else this.#showError();
  }

  validateInput() {
    if (this.#blank) return true;

    return this.#VALIDATORS[this.#type]();
  }

  #textValidation() {
    return this.#htmlElement.value;
  }

  #emailValidation() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(this.#htmlElement.value);
  }

  #showError() {
    this.#htmlElement.classList.add("error");
    this.#errorElement.classList.add("active");
  }
  #hideError() {
    this.#htmlElement.classList.remove("error");
    this.#errorElement.classList.remove("active");
  }
}
