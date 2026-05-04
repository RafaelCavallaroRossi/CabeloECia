document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll('#carousel img');
    if (slides.length) {
        let sIndex = 0;
        slides.forEach((s, i) => s.style.opacity = i === 0 ? '1' : '0');
        setInterval(() => {
            slides[sIndex].style.opacity = 0;
            sIndex = (sIndex + 1) % slides.length;
            requestAnimationFrame(() => slides[sIndex].style.opacity = 1);
        }, 4000);
    }
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const overlay = document.getElementById('overlay');
    const onMenuKeydown = (e) => { if (e.key === 'Escape') closeMenuFunc(); };
    function openMenu() {
        mobileMenu?.classList.remove('translate-x-full');
        mobileMenu?.classList.add('is-open');
        overlay?.classList.remove('hidden');
        menuBtn?.setAttribute('aria-expanded', 'true');
        mobileMenu?.setAttribute('aria-hidden', 'false');
        const firstLink = mobileMenu?.querySelector('nav a');
        firstLink?.focus();
        document.addEventListener('keydown', onMenuKeydown);
    }
    function closeMenuFunc() {
        mobileMenu?.classList.add('translate-x-full');
        mobileMenu?.classList.remove('is-open');
        overlay?.classList.add('hidden');
        menuBtn?.setAttribute('aria-expanded', 'false');
        mobileMenu?.setAttribute('aria-hidden', 'true');
        menuBtn?.focus();
        document.removeEventListener('keydown', onMenuKeydown);
    }
    menuBtn?.addEventListener('click', () => {
        const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
        if (expanded) closeMenuFunc(); else openMenu();
    });
    closeMenu?.addEventListener('click', closeMenuFunc);
    overlay?.addEventListener('click', closeMenuFunc);
    const serviceToggles = document.querySelectorAll('[data-service-toggle]');
    serviceToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const contentElement = document.getElementById(targetId);
            const card = toggle.closest('.service-card');
            const isOpen = card.classList.contains('open');
            
            // Close all other cards
            document.querySelectorAll('.service-card').forEach(c => {
                if (c !== card) {
                    c.classList.remove('open');
                    const otherToggle = c.querySelector('[data-service-toggle]');
                    if (otherToggle) {
                        otherToggle.classList.remove('open');
                        otherToggle.setAttribute('aria-expanded', 'false');
                    }
                    const otherContent = c.querySelector('.service-card__content');
                    if (otherContent) {
                        otherContent.style.maxHeight = null;
                        otherContent.setAttribute('aria-hidden', 'true');
                    }
                }
            });
            
            // Toggle current card
            if (!isOpen) {
                card.classList.add('open');
                contentElement.style.maxHeight = contentElement.scrollHeight + "px";
                contentElement.setAttribute('aria-hidden', 'false');
                toggle.classList.add('open');
                toggle.setAttribute('aria-expanded', 'true');
            } else {
                card.classList.remove('open');
                contentElement.style.maxHeight = null;
                contentElement.setAttribute('aria-hidden', 'true');
                toggle.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    const galleryImages = Array.from(document.querySelectorAll('.gallery-img'));
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.getElementById('closeLightbox');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    let currentIndex = 0;
    let prevActiveElement = null;
    let removeLightboxTrap = null;
    function trapFocus(container) {
        const focusable = container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return () => {};
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const handler = (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }
    if (galleryImages.length) {
        const showImage = () => { if (lightboxImg) lightboxImg.src = galleryImages[currentIndex].src; };
        const openModal = () => {
            if (!lightbox) return;
            prevActiveElement = document.activeElement;
            lightbox.classList.remove('hidden');
            lightbox.classList.add('flex');
            document.body.style.overflow = 'hidden';
            lightbox.setAttribute('aria-hidden', 'false');
            removeLightboxTrap = trapFocus(lightbox);
            closeLightbox?.focus();
        };
        const closeModal = () => {
            if (!lightbox) return;
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex');
            document.body.style.overflow = 'auto';
            lightbox.setAttribute('aria-hidden', 'true');
            if (removeLightboxTrap) removeLightboxTrap();
            if (prevActiveElement?.focus) prevActiveElement.focus();
        };
        const nextImage = () => { currentIndex = (currentIndex + 1) % galleryImages.length; showImage(); };
        const prevImage = () => { currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length; showImage(); };
        galleryImages.forEach((img, idx) => img.addEventListener('click', () => { currentIndex = idx; showImage(); openModal(); }));
        nextBtn?.addEventListener('click', nextImage);
        prevBtn?.addEventListener('click', prevImage);
        closeLightbox?.addEventListener('click', closeModal);
        lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeModal(); });
        document.addEventListener('keydown', (e) => {
            if (!lightbox || lightbox.classList.contains('hidden')) return;
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') closeModal();
        });
    }
    const revealElements = document.querySelectorAll('.fade-up');
    if (revealElements.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealElements.forEach(el => observer.observe(el));
    }
});
