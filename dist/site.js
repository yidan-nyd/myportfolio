(() => {
  const nextPage = document.body.dataset.nextPage;
  const previousPage = document.body.dataset.previousPage;

  let hasScrolled = false;
  let isLeaving = false;
  let lastScrollY = window.scrollY;

  const leaveFor = (page) => {
    if (!page || isLeaving) return;
    isLeaving = true;
    document.body.classList.add("page-leaving");
    window.setTimeout(() => window.location.assign(page), 220);
  };

  const atTop = () => window.scrollY <= 2;
  const atBottom = () =>
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

  const checkPageEdge = () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const scrollingUp = currentScrollY < lastScrollY;

    if (currentScrollY > 24) hasScrolled = true;
    lastScrollY = currentScrollY;

    if (hasScrolled && scrollingDown && atBottom()) leaveFor(nextPage);
    if (scrollingUp && atTop()) leaveFor(previousPage);
  };

  window.addEventListener("scroll", checkPageEdge, { passive: true });

  window.addEventListener(
    "wheel",
    (event) => {
      if (event.deltaY > 12 && atBottom()) leaveFor(nextPage);
      if (event.deltaY < -12 && atTop()) leaveFor(previousPage);
    },
    { passive: true }
  );

  let touchStartY = 0;
  window.addEventListener(
    "touchstart",
    (event) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    },
    { passive: true }
  );
  window.addEventListener(
    "touchend",
    (event) => {
      const distance = (event.changedTouches[0]?.clientY ?? touchStartY) - touchStartY;
      if (distance < -45 && atBottom()) leaveFor(nextPage);
      if (distance > 45 && atTop()) leaveFor(previousPage);
    },
    { passive: true }
  );

  const languageButtons = [...document.querySelectorAll("[data-language]")];
  const localizableElements = [...document.querySelectorAll("[data-en][data-zh]")];
  const themeButton = document.querySelector("[data-theme-toggle]");

  const setLanguage = (language) => {
    const selected = language === "zh" ? "zh" : "en";
    document.documentElement.lang = selected === "zh" ? "zh-CN" : "en";

    localizableElements.forEach((element) => {
      element.textContent = element.dataset[selected];
    });

    languageButtons.forEach((button) => {
      const isActive = button.dataset.language === selected;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    try {
      window.localStorage.setItem("yidan-language", selected);
    } catch (_) {
      // Language still works when storage is unavailable.
    }
  };

  let savedLanguage = "en";
  try {
    savedLanguage = window.localStorage.getItem("yidan-language") || "en";
  } catch (_) {
    // Use English when storage is unavailable.
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
  setLanguage(savedLanguage);

  const setTheme = (theme) => {
    const selected = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = selected;
    if (themeButton) {
      const nextTheme = selected === "dark" ? "light" : "dark";
      themeButton.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
      themeButton.setAttribute("title", `Switch to ${nextTheme} theme`);
      themeButton.setAttribute("aria-pressed", String(selected === "light"));
    }
    try {
      window.localStorage.setItem("yidan-theme", selected);
    } catch (_) {
      // Theme still works when storage is unavailable.
    }
  };

  let savedTheme = "dark";
  try {
    savedTheme = window.localStorage.getItem("yidan-theme") || "dark";
  } catch (_) {
    // Use the default dark theme when storage is unavailable.
  }

  themeButton?.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
  });
  setTheme(savedTheme);
})();
