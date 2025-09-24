import { documentOutline, tabletLandscape } from "ionicons/icons";

class Projects {
  #projectStacksContainer = document.querySelector(".projects-stacks");
  #stackBtns = Array.from(document.querySelectorAll(".stack")).filter(
    (btn) => btn.dataset.filter !== "all"
  );
  #allStacksBtn = document.querySelector(".stack-all");
  #projectCards = document.querySelectorAll(".card");

  #activeStacks = new Set();

  constructor() {}

  #initStateManager() {
    this.#projectStacksContainer.addEventListener(
      "click",
      this.#manageStates.bind(this)
    );
    [this.#allStacksBtn, ...this.#stackBtns].forEach((btn) =>
      btn.addEventListener("mouseleave", this.#disableJustClicked)
    );
  }

  #isActiveStack(stackBtn) {
    return stackBtn.classList.contains("active-stack");
  }

  #manageStates(event) {
    const target = event.target.closest(".stack");
    if (!target) return;
    event.preventDefault();

    if (target.dataset.filter === "all") {
      if (this.#isActiveStack(target)) return;

      this.#stackBtns.forEach((st) => st.classList.remove("active-stack"));
      target.classList.add("active-stack");
      target.classList.add("just-clicked-active");

      this.#activeStacks.clear();
      this.#activeStacks.add(target.dataset.filter);
    } else {
      if (this.#isActiveStack(target)) {
        target.classList.remove("active-stack");
        target.classList.add("just-clicked-unactive");
        this.#activeStacks.delete(target.dataset.filter);
      } else {
        target.classList.add("active-stack");
        this.#allStacksBtn.classList.remove("active-stack");
        target.classList.add("just-clicked-active");

        this.#activeStacks.add(target.dataset.filter);
        this.#activeStacks.delete(this.#allStacksBtn.dataset.filter);
      }
    }

    // If no options, choose all
    if (this.#activeStacks.size === 0) {
      this.#activeStacks.add(this.#allStacksBtn.dataset.filter);
      this.#allStacksBtn.classList.add("active-stack");
    }

    this.#filterProjects();
  }

  #disableJustClicked(event) {
    event.target.classList.remove("just-clicked-active");
    event.target.classList.remove("just-clicked-unactive");
  }

  #enableProject(proj) {
    proj.classList.remove("card--disabled");
  }

  #disableProject(proj) {
    proj.classList.add("card--disabled");
  }

  #filterProjects() {
    this.#projectCards.forEach((proj) => {
      if (this.#activeStacks.has("all")) {
        this.#enableProject(proj);
        return;
      }

      const projStacks = new Set(proj.dataset.stacks.split(";"));
      const activeArr = [...this.#activeStacks];

      if (activeArr.every((stack) => projStacks.has(stack))) {
        this.#enableProject(proj);
      } else this.#disableProject(proj);
    });
  }

  init() {
    if (this.#allStacksBtn) {
      this.#activeStacks.add(this.#allStacksBtn.dataset.filter);
    }
    this.#initStateManager();
  }
}

export default new Projects();
