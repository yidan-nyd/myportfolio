(() => {
  const nextPage = document.body.dataset.nextPage;
  if (!nextPage) return;

  let hasScrolled = false;
  let isLeaving = false;
  let lastScrollY = window.scrollY;

  const checkBottom = () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const pageBottom = currentScrollY + window.innerHeight;
    const atBottom = pageBottom >= document.documentElement.scrollHeight - 2;

    if (currentScrollY > 24) hasScrolled = true;
    lastScrollY = currentScrollY;

    if (hasScrolled && scrollingDown && atBottom && !isLeaving) {
      isLeaving = true;
      document.body.classList.add("page-leaving");
      window.setTimeout(() => window.location.assign(nextPage), 220);
    }
  };

  window.addEventListener("scroll", checkBottom, { passive: true });
})();
