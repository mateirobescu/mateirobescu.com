import Navbar from "./navbar";
import ThemeManager from "./themeManager";
import { initHero } from "./hero";
import { initProjects } from "./projects";
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
  Navbar.init();
  ThemeManager.init();
  initHero();
  initProjects();
  AOS.init();
};

init();
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.location.reload();
  });
}
