document.addEventListener('DOMContentLoaded', initPage);

function initPage() {
  initCarousel();
  initMobileMenu();
  initServiceCards();
  initGallery();
  initScrollReveal();
}

function initCarousel() {
  const slides = Array.from(document.querySelectorAll('.hero__slide'));
  if (!slides.length) {
    return;
  }

  let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  if (activeIndex < 0) {
    activeIndex = 0;
    slides[0].classList.add('is-active');
  }

  setInterval(() => {
    slides[activeIndex].classList.remove('is-active');
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.add('is-active');
  }, 4000);
}

function initMobileMenu() {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const closeButton = document.querySelector('[data-menu-close]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const overlay = document.querySelector('[data-menu-overlay]');

  if (!menuButton || !mobileMenu || !overlay) {
    return;
  }

  function setMenuState(isOpen) {
    mobileMenu.classList.toggle('is-open', isOpen);
    overlay.classList.toggle('is-visible', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const firstLink = mobileMenu.querySelector('a');
      firstLink?.focus();
      document.addEventListener('keydown', onEscape);
    } else {
      document.body.style.overflow = '';
      menuButton.focus();
      document.removeEventListener('keydown', onEscape);
    }
  }

  function onEscape(event) {
    if (event.key === 'Escape') {
      setMenuState(false);
    }
  }

  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    setMenuState(!expanded);
  });

  closeButton?.addEventListener('click', () => setMenuState(false));
  overlay.addEventListener('click', () => setMenuState(false));
  mobileMenu.addEventListener('click', (event) => {
    if (event.target.matches('.mobile-menu__link')) {
      setMenuState(false);
    }
  });
}

function initServiceCards() {
  const toggles = Array.from(document.querySelectorAll('[data-service-toggle]'));
  if (!toggles.length) {
    return;
  }

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const contentId = toggle.dataset.target;
      const content = document.getElementById(contentId);
      const card = toggle.closest('.service-card');
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';

      collapseAllServiceCards();

      if (!isOpen && card && content) {
        card.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
}

function collapseAllServiceCards() {
  const cards = Array.from(document.querySelectorAll('.service-card'));

  cards.forEach((card) => {
    const toggle = card.querySelector('[data-service-toggle]');
    const content = card.querySelector('.service-card__content');

    card.classList.remove('is-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    }
    if (content) {
      content.setAttribute('aria-hidden', 'true');
      content.style.maxHeight = '';
    }
  });
}

function initGallery() {
  const galleryButtons = Array.from(document.querySelectorAll('[data-gallery-index]'));
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = document.querySelector('.lightbox__image');
  const closeButton = document.querySelector('[data-lightbox-close]');
  const prevButton = document.querySelector('[data-lightbox-prev]');
  const nextButton = document.querySelector('[data-lightbox-next]');
  const galleryImages = galleryButtons.map((button) => button.querySelector('img'));

  if (!lightbox || !lightboxImage || !galleryButtons.length) {
    return;
  }

  let currentIndex = 0;
  let previousActiveElement = null;
  let removeFocusTrap = null;

  function setLightboxState(isOpen) {
    lightbox.classList.toggle('is-open', isOpen);
    lightbox.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
      previousActiveElement = document.activeElement;
      removeFocusTrap = createFocusTrap(lightbox);
      closeButton?.focus();
    } else {
      removeFocusTrap?.();
      previousActiveElement?.focus();
    }
  }

  function showGalleryImage(index) {
    currentIndex = index;
    const image = galleryImages[index];

    if (!image) {
      return;
    }

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt || 'Visualização em destaque';
  }

  function openLightbox(index) {
    showGalleryImage(index);
    setLightboxState(true);
  }

  function closeLightbox() {
    setLightboxState(false);
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    showGalleryImage(currentIndex);
  }

  function showPreviousImage() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    showGalleryImage(currentIndex);
  }

  galleryButtons.forEach((button) => {
    const index = Number(button.dataset.galleryIndex);
    button.addEventListener('click', () => openLightbox(index));
  });

  closeButton?.addEventListener('click', closeLightbox);
  prevButton?.addEventListener('click', showPreviousImage);
  nextButton?.addEventListener('click', showNextImage);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key === 'ArrowRight') {
      showNextImage();
    }

    if (event.key === 'ArrowLeft') {
      showPreviousImage();
    }
  });
}

function createFocusTrap(container) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea',
    'input',
    'select',
    '[tabindex]:not([tabindex="-1"])',
  ];

  const focusableElements = Array.from(container.querySelectorAll(focusableSelectors.join(', ')));
  if (!focusableElements.length) {
    return () => {};
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function trapFocus(event) {
    if (event.key !== 'Tab') {
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  document.addEventListener('keydown', trapFocus);
  return () => document.removeEventListener('keydown', trapFocus);
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((element) => observer.observe(element));
}
