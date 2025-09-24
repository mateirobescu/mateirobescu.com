import Navbar from "./navbar";
import ThemeManager from "./themeManager";
import Projects from "./projects";
import Hero from "./hero";
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
  Projects.init();
  Hero.init();
  AOS.init();
};

init();
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.location.reload();
  });
}
