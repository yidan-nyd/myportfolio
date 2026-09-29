(() => {
  const elements = [...document.querySelectorAll('.robin-section, .robin-index')];
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    elements.forEach((element) => observer.observe(element));
  }

  const lightbox = document.querySelector('.image-lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxItems = [...document.querySelectorAll('[data-lightbox]')];
  const lightboxCount = lightbox?.querySelector('.lightbox-count');
  let currentImage = 0;
  const showImage = (index) => {
    if (!lightboxImage || !lightboxItems.length) return;
    currentImage = (index + lightboxItems.length) % lightboxItems.length;
    lightboxImage.src = lightboxItems[currentImage].dataset.lightbox;
    if (lightboxCount) lightboxCount.textContent = `${currentImage + 1} / ${lightboxItems.length}`;
  };
  const closeLightbox = () => {
    lightbox?.classList.remove('is-open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  lightboxItems.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (!lightbox || !lightboxImage) return;
      showImage(index);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', () => showImage(currentImage - 1));
  lightbox?.querySelector('.lightbox-next')?.addEventListener('click', () => showImage(currentImage + 1));
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
    if (lightbox?.classList.contains('is-open') && event.key === 'ArrowLeft') showImage(currentImage - 1);
    if (lightbox?.classList.contains('is-open') && event.key === 'ArrowRight') showImage(currentImage + 1);
  });
})();
