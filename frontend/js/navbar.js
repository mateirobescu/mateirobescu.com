/**
 * Toggle the settings panel.
 *
 * Slides the settings container left by the panel width to reveal the panel.
 * Honors reduced-motion preference by skipping transition-dependent hiding.
 * Updates `aria-expanded` and rotates the button icon to reflect state.
 *
 * @returns {void}
 */
const toggleSettingsPanel = function () {
  const settingsButton = document.querySelector(".settings__btn");
  const settingsContainer = document.querySelector(".settings");
  const settingsPanel = document.querySelector(".settings-panel");
  const settingsIcon = document.querySelector(".settings__btn .navbar__icon");

  // Bail if required elements are missing
  if (!settingsButton || !settingsContainer || !settingsPanel) return;

  // Defer applying `disabled` until the slide-out transition completes
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
      // Open: reveal panel and slide container left by panel width
      settingsPanel.classList.remove("disabled");
      settingsButton.setAttribute("aria-expanded", "true");
      settingsContainer.style.transform = `translateX(-${panelWidth}px)`;
    } else {
      // Close: reset transform; hide after transition unless reduced-motion
      settingsContainer.style.transform = "";
      settingsButton.setAttribute("aria-expanded", "false");
      if (prefersReduced) {
        settingsPanel.classList.add("disabled");
      } else {
        pendingClose = true;
      }
    }

    // Rotate the gear icon to reflect open/close state
    if (settingsIcon) settingsIcon.classList.toggle("rotate180");
  });
};

/**
 * Toggle the mobile navigation overlay panel.
 *
 * Toggles the `.mobile-open` class on the root and panel, updates
 * `aria-expanded`, and swaps the hamburger/close icon. Defers applying
 * the `disabled` class until the close transition ends unless the
 * user prefers reduced motion.
 *
 * @returns {void}
 */
const toggleMobileNav = function () {
  const navbarPanelBtn = document.querySelector(".mobile__nav__btn");
  const navbarPanel = document.querySelector(".mobile__nav__panel");
  if (!navbarPanelBtn || !navbarPanel) return;

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  let pendingClose = false;

  navbarPanelBtn.addEventListener("click", function (e) {
    const isOpen = navbarPanel.classList.contains("mobile-open");

    // Mirror state on the root for layout/body scroll locking via CSS
    const parentDoc = document.documentElement.classList;
    isOpen ? parentDoc.remove("mobile-open") : parentDoc.add("mobile-open");

    navbarPanelBtn.setAttribute("aria-expanded", `${!isOpen}`);
    navbarPanel.classList.toggle("mobile-open");
    pendingClose = prefersReduced ? pendingClose : isOpen;

    if (!isOpen) navbarPanel.classList.remove("disabled");
    if (prefersReduced && isOpen) navbarPanel.classList.add("disabled");

    // Swap hamburger/close icon
    const icon = navbarPanelBtn.querySelector("ion-icon");
    if (icon) {
      icon.setAttribute("name", isOpen ? "menu-outline" : "close-outline");
      icon.classList.toggle("is-open", !isOpen);
    }
  });

  navbarPanel.addEventListener("transitionend", function (e) {
    if (e.propertyName !== "transform") return;
    if (pendingClose) {
      navbarPanel.classList.add("disabled");
      pendingClose = false;
    }
  });
};

const applyTheme = function (theme) {
  const htmlDOC = document.documentElement;
  htmlDOC.setAttribute("data-theme", theme);

  localStorage.setItem("data-theme", theme);

  const logoImg = document.querySelector(".logo__img");
  const nextSrc =
    theme === "dark" ? logoImg.dataset.srcDark : logoImg.dataset.srcLight;
  logoImg.src = nextSrc;
};

const loadInitialTheme = function () {
  let preferedTheme = localStorage.getItem("data-theme");

  if (!preferedTheme)
    preferedTheme = matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  applyTheme(preferedTheme);
};

const setupThemeToggle = function () {
  const themeBtns = document.querySelectorAll(".settings-theme__btn");
  const htmlDOC = document.documentElement;

  themeBtns.forEach((btn) =>
    btn.addEventListener("click", function () {
      const currTheme = htmlDOC.getAttribute("data-theme");
      const switchTheme = currTheme === "dark" ? "light" : "dark";
      applyTheme(switchTheme);
    })
  );
};

export const initNavbar = function () {
  toggleSettingsPanel();
  toggleMobileNav();
  loadInitialTheme();
  setupThemeToggle();
};
