const toggleSettingsPanel = function () {
  const settingsButton = document.querySelector(".settings__btn");
  const settingsContainer = document.querySelector(".settings");
  const settingsPanel = document.querySelector(".settings-panel");
  const settingsIcon = document.querySelector(".settings__btn .navbar__icon");

  if (!settingsButton || !settingsContainer || !settingsPanel) return;

  let pendingClose = false;
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  settingsContainer.addEventListener("transitionend", function (e) {
    if (e.propertyName !== "transform") return;
    if (pendingClose) {
      settingsPanel.classList.add("disabled");
      pendingClose = false;
    }
  });

  settingsButton.addEventListener("click", function () {
    const isHidden = settingsPanel.classList.contains("disabled");
    const panelWidth = settingsPanel.offsetWidth;

    if (isHidden) {
      settingsPanel.classList.remove("disabled");
      settingsButton.setAttribute("aria-expanded", "true");
      settingsContainer.style.transform = prefersReduced
        ? ""
        : `translateX(-${panelWidth}px)`;
    } else {
      settingsContainer.style.transform = "";
      settingsButton.setAttribute("aria-expanded", "false");
      if (prefersReduced) {
        settingsPanel.classList.add("disabled");
      } else {
        pendingClose = true;
      }
    }

    if (settingsIcon) settingsIcon.classList.toggle("rotate360");
  });
};

const toggleMobileNav = function () {
  const navbarPanelBtn = document.querySelector(".mobile__nav__btn");
  const navbarPanel = document.querySelector(".mobile__nav__panel");

  navbarPanelBtn.addEventListener("click", function (e) {
    const isOpen = navbarPanel.classList.contains("mobile-open");

    const parentDoc = document.documentElement.classList;
    isOpen ? parentDoc.remove("mobile-open") : parentDoc.add("mobile-open");

    navbarPanelBtn.setAttribute("aria-expanded", `${isOpen}`);
    navbarPanel.classList.toggle("mobile-open");
  });
};

export const initNavbar = function () {
  toggleSettingsPanel();
  toggleMobileNav();
};
