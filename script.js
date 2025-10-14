class ChangeTheme {
  selectors = {
    body: document.querySelector("body"),
    lightThemeButton: document.querySelector("[data-js-light-theme-button]"),
    darkThemeButton: document.querySelector("[data-js-dark-theme-button]"),
  };

  constructor() {
    this.bindEvents();
    this.loadTheme();
  }

  darkTheme = () => {
    this.selectors.body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
  };

  lightTheme = () => {
    this.selectors.body.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
  };

  loadTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (!savedTheme) return;

    if (savedTheme === "dark") {
      this.darkTheme();
    } else {
      this.lightTheme();
    }
  }

  bindEvents() {
    this.selectors.darkThemeButton.addEventListener("click", this.darkTheme);
    this.selectors.lightThemeButton.addEventListener("click", this.lightTheme);
  }
}

new ChangeTheme();
