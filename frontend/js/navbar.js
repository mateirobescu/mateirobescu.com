import { documentSharp, enter } from "ionicons/icons";
import ThemeManager from "./themeManager";

/**
 * Checks if the browser prefers reduced motion
 *
 * @returns {boolean} - true if the browser prefers reduce motion, else false
 */
const prefersReduced = function () {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
};

// Scroll lock util
const ScrollLock = (() => {
  let y = 0;
  return {
    lock() {
      y = window.scrollY || document.documentElement.scrollTop;
      document.body.style.position = "fixed";
      document.body.style.top = `-${y}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    },
    unlock() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    },
  };
})();

class Navbar {
  // Mobile Navigation
  #mobileNavPanel = document.querySelector(".mobile__nav__panel");
  #mobileNav = document.querySelector(".mobile__nav__panel > .navbar");
  #mobileNavBtn = document.querySelector(".mobile__nav__btn");
  #mobileNavIsOpen = false;

  //THEMES
  #themeToggleBtns = document.querySelectorAll(".settings-theme__btn");

  #nav = document.querySelector(".header > .navbar");
  #header = document.querySelector(".header");

  #footerNav = document.querySelector(".footer__navbar");

  // SCROLL
  #scrollingTo;

  #allSections = document.querySelectorAll("section");
  #allLinks = document.querySelectorAll(".navbar__scroll");
  #scrollSpyLinks = document.querySelectorAll(".scrollspy");

  #initMobileNav() {
    if (!this.#mobileNavPanel || !this.#mobileNavBtn) return;

    this.#mobileNavBtn.addEventListener(
      "click",
      this.#handleMobileNavState.bind(this)
    );
    this.#mobileNavPanel.addEventListener(
      "transitionend",
      this.#disableAfterTransition.bind(this)
    );
  }

  #handleMobileNavState(event) {
    this.#mobileNavIsOpen = !this.#mobileNavIsOpen;

    // Mirror state on the root for layout/body scroll locking via CSS
    const parentDoc = document.documentElement.classList;
    const body = document.body.classList;
    parentDoc.toggle("mobile-open");
    body.toggle("mobile-open");

    this.#mobileNavBtn.setAttribute(
      "aria-expanded",
      `${this.#mobileNavIsOpen}`
    );
    this.#mobileNavPanel.classList.toggle("mobile-open");

    // Enabling mobileNavPanel functions
    if (this.#mobileNavIsOpen) {
      this.#mobileNavPanel.classList.remove("disabled");
      ScrollLock.lock();
    } else ScrollLock.unlock();

    // If reduce motion is preferred disable imediately, otherwise the panel will be disabled later on, after the transition ends
    if (prefersReduced() && !this.#mobileNavIsOpen)
      this.#mobileNavPanel.classList.add("disabled");

    this.#changeMobileNavBtnIcon();
  }

  #disableAfterTransition(event) {
    if (event.propertyName !== "transform") return;

    if (!this.#mobileNavIsOpen) this.#mobileNavPanel.classList.add("disabled");
  }

  #changeMobileNavBtnIcon() {
    const icon = this.#mobileNavBtn.querySelector("ion-icon");
    if (!icon) return;

    icon.setAttribute(
      "name",
      this.#mobileNavIsOpen ? "close-outline" : "menu-outline"
    );
    icon.classList.toggle("is-open");
  }

  #initThemeToggle() {
    this.#themeToggleBtns.forEach((btn) =>
      btn.addEventListener("click", function () {
        ThemeManager.switchTheme();
      })
    );
  }

  // Closing the mobileNav when clicking an anchor
  #initCloseMobileNav() {
    this.#mobileNavPanel.addEventListener(
      "click",
      this.#CloseMobileNavOnAnchor.bind(this)
    );
  }

  #CloseMobileNavOnAnchor(event) {
    const anchor = event.target.closest(".navbar__scroll");
    if (!anchor) return;

    event.preventDefault();
    this.#mobileNavBtn.click();
  }

  #initScrollToSection() {
    const navbars = [
      this.#header,
      this.#mobileNavPanel,
      this.#footerNav,
    ].forEach((navbar) =>
      navbar.addEventListener("click", this.#scrollToSection.bind(this))
    );
  }

  #scrollToSection(event) {
    const anchor = event.target.closest(".navbar__scroll");
    if (!anchor) return;
    event.preventDefault();

    const sectionId = anchor.getAttribute("href");
    const sectionToScroll = document.querySelector(
      sectionId === "#" ? "#home" : sectionId
    );

    if (sectionToScroll) {
      this.#scrollingTo = sectionId.slice(1);
      this.#setActiveAnchor(this.#scrollingTo);
      sectionToScroll.scrollIntoView({ behavior: "smooth" });
    }
  }

  #initScrollSpy() {
    const sectionObserver = new IntersectionObserver(
      this.#setActiveSection.bind(this),
      {
        threshold: 0.5,
        rootMargin: `-${
          document.querySelector(".header").offsetHeight
        }px 0px 0px 0px`,
      }
    );

    this.#allSections.forEach((sect) => sectionObserver.observe(sect));
  }

  #setActiveAnchor(sectionId) {
    this.#scrollSpyLinks.forEach((link) => {
      link.classList.remove("active");

      const linkHref = link.getAttribute("href").slice(1);
      if (linkHref === sectionId) link.classList.add("active");
    });
  }

  #setActiveSection(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const sectionId = entry.target.getAttribute("id");
      if (this.#scrollingTo) {
        if (this.#scrollingTo === sectionId) this.#scrollingTo = null;
        return;
      }

      this.#setActiveAnchor(sectionId);
    });
  }

  init() {
    this.#scrollingTo = null;
    this.#initMobileNav();
    this.#initThemeToggle();
    this.#initCloseMobileNav();
    this.#initScrollToSection();
    this.#initScrollSpy();
  }
}

export default new Navbar();
