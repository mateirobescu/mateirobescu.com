import { documentSharp } from "ionicons/icons";

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
  const header = document.querySelector(".header");
  const settingsButton = header.querySelector(".settings__btn");
  const settingsContainer = header.querySelector(".settings");
  const settingsPanel = header.querySelector(".settings-panel");
  const settingsIcon = header.querySelector(".settings__btn .navbar__icon");

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

const removeHash = function () {
  const navbars = document.querySelectorAll(".navbar");
  navbars.forEach((nav) =>
    nav.addEventListener("click", function (e) {
      const anchor = e.target.closest(".navbar__link");
      if (!anchor) return;

      e.preventDefault();

      const sectionId = anchor.getAttribute("href");
      const sectionToScroll = document.querySelector(
        sectionId == "#" ? "#home" : sectionId
      );

      if (sectionToScroll) {
        sectionToScroll.scrollIntoView({ behavior: "smooth" });
      }
    })
  );
};

const closeMobileNav = function () {
  const mobileNavPanel = document.querySelector(".mobile__nav__panel");
  const mobileNav = mobileNavPanel.querySelector(".navbar");
  const mobileNavBtn = document.querySelector(".mobile__nav__btn");

  mobileNav.addEventListener("click", function (e) {
    const anchor = e.target.closest(".navbar__link");
    if (!anchor) return;

    e.preventDefault();
    mobileNavBtn.click();
  });
};

const scrollSpyInit = function () {
  const allSections = document.querySelectorAll("section");
  const allLinks = document.querySelectorAll(".navbar__scroll");

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const sectionId = entry.target.getAttribute("id");

        allLinks.forEach((link) => {
          link.classList.remove("active");

          const linkHref = link.getAttribute("href").slice(1);
          if (linkHref == sectionId) link.classList.add("active");
        });
      });
    },
    {
      threshold: 0.5,
      rootMargin: `-${
        document.querySelector(".header").offsetHeight
      }px 0px 0px 0px`,
    }
  );

  allSections.forEach((sect) => sectionObserver.observe(sect));
};

export const initNavbar = function () {
  toggleSettingsPanel();
  toggleMobileNav();
  loadInitialTheme();
  setupThemeToggle();
  removeHash();
  closeMobileNav();
  scrollSpyInit();
};
