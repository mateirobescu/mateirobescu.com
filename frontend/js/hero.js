import { scanOutline } from "ionicons/icons";

class Hero {
  #scrollDownArrow = document.querySelector(".scroll-down");
  #hero = document.querySelector(".hero");

  constructor() {}

  #initScrollArrow() {
    if (!this.#scrollDownArrow || !this.#hero) return;

    const observer = new IntersectionObserver((entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          this.#scrollDownArrow.classList.add("disabled");
          observer.disconnect();
        }
      })
    );
    observer.observe(this.#hero);
  }

  init() {
    this.#initScrollArrow();
  }
}

export default new Hero();
