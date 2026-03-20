/* app.js — Nikola Markovic Portfolio
   Vanilla JS: nav scroll + active highlighting, IntersectionObserver
   reveal, mobile menu, archive toggle, back-to-top, smooth scroll
*/

'use strict';

/* ── Global audio controls (called from onclick attributes) ───── */
function playAudio() {
  var audio = document.getElementById('bgAudio');
  var playBtn  = document.getElementById('musicPlay');
  var pauseBtn = document.getElementById('musicPause');
  if (!audio) return;
  audio.play();
  if (playBtn)  { playBtn.style.display  = 'none';   playBtn.classList.remove('is-playing'); }
  if (pauseBtn) { pauseBtn.style.display = '';        pauseBtn.classList.add('is-playing'); }
}
function pauseAudio() {
  var audio = document.getElementById('bgAudio');
  var playBtn  = document.getElementById('musicPlay');
  var pauseBtn = document.getElementById('musicPause');
  if (!audio) return;
  audio.pause();
  if (pauseBtn) { pauseBtn.style.display = 'none';   pauseBtn.classList.remove('is-playing'); }
  if (playBtn)  { playBtn.style.display  = '';       playBtn.classList.remove('is-playing'); }
}

(function () {

  /* ── Helpers ────────────────────────────────────────────────── */
  const qs  = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  /* ── 0. Theme toggle ────────────────────────────────────────── */
  const htmlEl      = document.documentElement;
  const themeToggle = qs('#themeToggle');
  const SUN_SVG  = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  const MOON_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function applyTheme(theme) {
    htmlEl.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' ? SUN_SVG : MOON_SVG;
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }
  applyTheme(htmlEl.dataset.theme || 'dark');
  themeToggle && themeToggle.addEventListener('click', () => {
    applyTheme(htmlEl.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  /* ── DOM refs ───────────────────────────────────────────────── */
  const header     = qs('.site-header');
  const burger     = qs('#navBurger');
  const navMenu    = qs('#navMenu');
  const navLinks   = qsa('.nav__link');
  const sections   = qsa('section[id]');
  const reveals    = qsa('.reveal');
  const backToTop  = qs('#backToTop');
  const archiveBtn = qs('#archiveToggle');
  const archiveGrid= qs('#archiveGrid');

  /* ── 1. Sticky header + scroll class ───────────────────────── */
  function onScroll () {
    const scrolled = window.scrollY > 30;
    header.classList.toggle('scrolled', scrolled);
    backToTop && backToTop.toggleAttribute('hidden', window.scrollY < 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 2. Active nav link (IntersectionObserver) ──────────────── */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ── 3. Scroll-reveal ───────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  reveals.forEach((el) => revealObserver.observe(el));

  /* ── 4. Mobile burger menu ──────────────────────────────────── */
  burger && burger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on nav link click
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      burger && burger.classList.remove('open');
      burger && burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      burger && burger.classList.remove('open');
      burger && burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ── 5. Archive toggle ──────────────────────────────────────── */
  if (archiveBtn && archiveGrid) {
    archiveBtn.addEventListener('click', () => {
      const isOpen = archiveGrid.hasAttribute('hidden');
      if (isOpen) {
        archiveGrid.removeAttribute('hidden');
        archiveGrid.setAttribute('aria-hidden', 'false');
        archiveBtn.setAttribute('aria-expanded', 'true');
        archiveBtn.textContent = '';
        archiveBtn.innerHTML =
          'Hide experiments &amp; demos ' +
          '<svg class="archive-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
        // trigger reveals inside archive
        qsa('.reveal', archiveGrid).forEach((el) => revealObserver.observe(el));
      } else {
        archiveGrid.setAttribute('hidden', '');
        archiveGrid.setAttribute('aria-hidden', 'true');
        archiveBtn.setAttribute('aria-expanded', 'false');
        archiveBtn.innerHTML =
          'Show experiments &amp; demos ' +
          '<svg class="archive-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
      }
    });
  }

  /* ── 6. Smooth scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      // Back-to-top: always scroll to absolute 0
      if (href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h'), 10) || 68;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ── 7. Hero canvas — particle network ─────────────────────── */
  (function () {
    const canvas = qs('#heroCanvas');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx  = canvas.getContext('2d');
    const hero = canvas.closest('.hero');
    let W, H, mouse = { x: -9999, y: -9999 }, particles = [], raf;

    const COUNT     = 90;
    const CONNECT_D = 140;
    const MOUSE_R   = 130;

    function accent() {
      return htmlEl.dataset.theme === 'light' ? [37, 99, 235] : [79, 156, 249];
    }
    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }
    function Particle() {
      this.x      = Math.random() * W;
      this.y      = Math.random() * H;
      this.vx     = (Math.random() - 0.5) * 0.5;
      this.vy     = (Math.random() - 0.5) * 0.5;
      this.r      = Math.random() * 1.5 + 0.4;
      this.alpha  = Math.random() * 0.5 + 0.2;
      this.pulse  = Math.random() * Math.PI * 2;
    }
    Particle.prototype.update = function (t) {
      this.pulse += 0.018;
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d  = Math.hypot(dx, dy);
      if (d < MOUSE_R && d > 0) {
        const f = (MOUSE_R - d) / MOUSE_R;
        this.vx += (dx / d) * f * 0.55;
        this.vy += (dy / d) * f * 0.55;
      }
      this.vx *= 0.972; this.vy *= 0.972;
      const spd = Math.hypot(this.vx, this.vy);
      if (spd > 1.8) { this.vx = (this.vx / spd) * 1.8; this.vy = (this.vy / spd) * 1.8; }
      this.x += this.vx; this.y += this.vy;
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    };
    function init() {
      particles = [];
      for (let i = 0; i < COUNT; i++) particles.push(new Particle());
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      const c = accent();
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        a.update(t);
        const r = a.r + Math.sin(a.pulse) * 0.3;
        ctx.beginPath();
        ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a.alpha + Math.sin(a.pulse) * 0.08})`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < CONNECT_D) {
            const op = (1 - d / CONNECT_D) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${op})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); init(); draw(0); });
    resize(); init(); draw(0);
  }());

})();
