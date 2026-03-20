'use strict';

// ─── Scroll Animations (Intersection Observer) ───────────────────────────────
(function initScrollAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('[data-animate], [data-animate-stagger]');

  // Immediately reveal if reduced-motion or no IntersectionObserver support
  if (prefersReduced || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();

// ─── Project Category Filter ─────────────────────────────────────────────────
(function initCategoryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');

      const filter = this.dataset.filter;

      // Select card groups using existing container classes
      const webCards    = document.querySelectorAll('.websites-container > .card');
      const reactCards  = document.querySelectorAll('.react-container .card');

      if (filter === 'all') {
        [...webCards, ...reactCards].forEach(c => c.classList.remove('hidden'));
      } else if (filter === 'web') {
        webCards.forEach(c => c.classList.remove('hidden'));
        reactCards.forEach(c => c.classList.add('hidden'));
      } else if (filter === 'react') {
        webCards.forEach(c => c.classList.add('hidden'));
        reactCards.forEach(c => c.classList.remove('hidden'));
      }
    });
  });
})();
