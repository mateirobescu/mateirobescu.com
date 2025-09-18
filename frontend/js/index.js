import { initNavbar } from "./navbar";
import { initHero } from "./hero";
import AOS from "aos";
import "aos/dist/aos.css";

const resetScroll = function () {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search
  );
  window.scrollTo(0, 0);
};

const init = function () {
  resetScroll();
  initNavbar();
  initHero();
  AOS.init();
};

init();
