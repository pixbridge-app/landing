const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");
const tabRoot = document.querySelector("[data-tabs]");
const koBanner = document.querySelector("[data-ko-banner]");
const koBannerClose = document.querySelector("[data-ko-banner-close]");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      nav.classList.remove("open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (koBanner && document.body.dataset.pageLang === "en") {
  const browserLanguage = navigator.language || "";
  const languages = navigator.languages || [browserLanguage];
  const prefersKorean = languages.some((language) => language.toLowerCase().startsWith("ko"));
  const storageKey = "pixbridge-ko-banner-dismissed";
  let dismissed = false;

  try {
    dismissed = localStorage.getItem(storageKey) === "true";
  } catch (error) {
    dismissed = false;
  }

  if (prefersKorean && !dismissed) {
    koBanner.hidden = false;
  }

  if (koBannerClose) {
    koBannerClose.addEventListener("click", () => {
      koBanner.hidden = true;

      try {
        localStorage.setItem(storageKey, "true");
      } catch (error) {
        dismissed = true;
      }
    });
  }
}

if (tabRoot) {
  const buttons = tabRoot.querySelectorAll("[data-tab]");
  const panels = tabRoot.querySelectorAll("[data-panel]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      buttons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-selected", String(selected));
      });

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.panel === target);
      });
    });
  });
}
