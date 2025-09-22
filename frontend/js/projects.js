import { documentOutline, tabletLandscape } from "ionicons/icons";

const filterProjectsInit = function () {
  const projectStacksContainer = document.querySelector(".projects-stacks");
  const stacksBtns = document.querySelectorAll(".stack");
  const allStacksBtn = document.querySelector(".stack-all");
  const projectsContainer = document.querySelector(".projects__container");
  const porjectCards = document.querySelectorAll(".card");

  const activeStacks = new Set([allStacksBtn.dataset.filter]);

  projectStacksContainer.addEventListener("click", function (e) {
    const target = e.target.closest(".stack");
    if (!target) return;
    e.preventDefault();

    if (target.classList.contains("active-stack")) {
      if (target.dataset.filter === "all") return;
      else {
        target.classList.remove("active-stack");
        target.classList.add("just-clicked-unactive");
        activeStacks.delete(target.dataset.filter);
      }
    } else if (target.dataset.filter === "all") {
      stacksBtns.forEach((st) => st.classList.remove("active-stack"));
      allStacksBtn.classList.add("active-stack");
      allStacksBtn.classList.add("just-clicked-active");

      activeStacks.clear();
      activeStacks.add(target.dataset.filter);
    } else {
      target.classList.add("active-stack");
      allStacksBtn.classList.remove("active-stack");
      target.classList.add("just-clicked-active");

      activeStacks.add(target.dataset.filter);
      activeStacks.delete(allStacksBtn.dataset.filter);
    }

    if (activeStacks.size === 0) {
      activeStacks.add(allStacksBtn.dataset.filter);
      allStacksBtn.classList.add("active-stack");
    }

    target.addEventListener("mouseleave", () => {
      target.classList.remove("just-clicked-active");
      target.classList.remove("just-clicked-unactive");
    });

    // FILTERING PROJECTS
    const enableProj = function (proj) {
      proj.classList.remove("card--disabled");
    };

    const disableProj = function (proj) {
      proj.classList.add("card--disabled");
    };

    porjectCards.forEach((proj) => {
      if (activeStacks.has("all")) {
        enableProj(proj);
        return;
      }

      console.log(proj);

      const projStacks = new Set(proj.dataset.stacks.split(";"));
      const activeArr = [...activeStacks];
      console.log(activeArr, projStacks);

      console.log(activeArr.every((stack) => projStacks.has(stack)));

      if (activeArr.every((stack) => projStacks.has(stack))) {
        enableProj(proj);
      } else disableProj(proj);
    });
  });
};

export const initProjects = function () {
  filterProjectsInit();
};
