class ThemeManager {
  #htmlDOC = document.documentElement;
  #logos = document.querySelectorAll(".logo__img");
  #preferedTheme;

  #applyTheme() {
    this.#htmlDOC.setAttribute("data-theme", this.#preferedTheme);
    localStorage.setItem("data-theme", this.#preferedTheme);

    // Logos handling
    this.#logos.forEach(
      (logo) =>
        (logo.src =
          this.#preferedTheme === "dark"
            ? logo.dataset.srcDark
            : logo.dataset.srcLight)
    );
  }

  #getPreferedTheme() {
    this.#preferedTheme = localStorage.getItem("data-theme");
    if (!this.#preferedTheme)
      this.#preferedTheme = matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  }

  switchTheme() {
    this.#preferedTheme = this.#preferedTheme === "dark" ? "light" : "dark";
    this.#applyTheme();
  }

  init() {
    this.#getPreferedTheme();
    this.#applyTheme();
  }

  constructor() {}
}

export default new ThemeManager();
