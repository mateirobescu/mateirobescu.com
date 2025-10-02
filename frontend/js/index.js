import Navbar from "./navbar";
import ThemeManager from "./themeManager";
import Projects from "./projects";
import Hero from "./hero";
import Form from "./contact";

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
  Form.init();
};

init();
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.location.reload();
  });
}
