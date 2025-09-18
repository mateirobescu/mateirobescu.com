import { scanOutline } from "ionicons/icons";

const initScrollArrow = function () {
  const scrollDownArow = document.querySelector(".scroll-down");
  const hero = document.querySelector(".hero");

  const oberver = new IntersectionObserver((entries) =>
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        scrollDownArow.classList.add("disabled");
        oberver.disconnect();
      }
    })
  );

  oberver.observe(hero);
};

export const initHero = function () {
  initScrollArrow();
};
