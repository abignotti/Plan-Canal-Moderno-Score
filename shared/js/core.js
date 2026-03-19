/* =============================================================
   CORE.JS — SCORE Energy Drink Presentation Shared Utilities
   ============================================================= */

'use strict';

/* ---------------------------------------------------------------
   FORMAT NUMBER — Chilean locale (dots as thousand separators)
   --------------------------------------------------------------- */
function formatNumber(n, decimals = 0) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return Number(n).toLocaleString('es-CL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/* ---------------------------------------------------------------
   ANIMATE COUNTER — GSAP-powered number counter
   el: DOM element to update
   target: final numeric value
   duration: animation duration in seconds
   prefix: string to prepend (e.g. "$", "+")
   suffix: string to append (e.g. "M", "%")
   decimals: number of decimal places
   --------------------------------------------------------------- */
function animateCounter(el, target, duration = 1.5, prefix = '', suffix = '', decimals = 0) {
  if (!el || typeof gsap === 'undefined') return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = prefix + formatNumber(target, decimals) + suffix;
    return;
  }

  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: duration,
    ease: 'power2.out',
    onUpdate: function () {
      el.textContent = prefix + formatNumber(obj.val, decimals) + suffix;
    },
    onComplete: function () {
      el.textContent = prefix + formatNumber(target, decimals) + suffix;
    }
  });
}

/* ---------------------------------------------------------------
   INIT PROGRESS BAR — tracks scroll position
   --------------------------------------------------------------- */
function initProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;

  function updateBar() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
}

/* ---------------------------------------------------------------
   INIT SCROLL REVEAL — fade + translateY via GSAP
   Targets elements with [data-reveal] attribute
   --------------------------------------------------------------- */
function initScrollReveal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  document.querySelectorAll('[data-reveal]').forEach(el => {
    const delay = parseFloat(el.dataset.revealDelay || 0);
    const distance = parseFloat(el.dataset.revealDistance || 30);

    gsap.fromTo(el,
      { opacity: 0, y: distance },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

/* ---------------------------------------------------------------
   INIT NAV SECTION UPDATER
   Updates active section name in the fixed nav
   --------------------------------------------------------------- */
function initNavSectionUpdater(sections, navLabelEl) {
  if (!navLabelEl || typeof ScrollTrigger === 'undefined') return;

  sections.forEach(section => {
    const title = section.dataset.sectionTitle;
    if (!title) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => { navLabelEl.textContent = title; },
      onEnterBack: () => { navLabelEl.textContent = title; }
    });
  });
}

/* ---------------------------------------------------------------
   OBSERVE ONCE — IntersectionObserver helper
   Calls callback when element enters viewport, once
   --------------------------------------------------------------- */
function observeOnce(el, callback, threshold = 0.2) {
  if (!el || typeof IntersectionObserver === 'undefined') {
    if (callback) callback();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry);
        observer.unobserve(el);
      }
    });
  }, { threshold });

  observer.observe(el);
}

/* ---------------------------------------------------------------
   THROTTLE — performance helper for scroll/resize events
   --------------------------------------------------------------- */
function throttle(fn, wait = 16) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/* ---------------------------------------------------------------
   STAGGER CHILDREN — GSAP stagger animation for child elements
   --------------------------------------------------------------- */
function staggerReveal(parent, selector, options = {}) {
  if (!parent || typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = parent.querySelectorAll(selector);
  if (!els.length) return;

  const defaults = {
    y: 25,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power2.out',
    delay: 0
  };

  const cfg = { ...defaults, ...options };

  gsap.fromTo(els,
    { opacity: 0, y: cfg.y },
    {
      opacity: 1,
      y: 0,
      duration: cfg.duration,
      stagger: cfg.stagger,
      ease: cfg.ease,
      delay: cfg.delay
    }
  );
}

/* ---------------------------------------------------------------
   EXPOSE GLOBALS
   --------------------------------------------------------------- */
window.ScoreCore = {
  formatNumber,
  animateCounter,
  initProgressBar,
  initScrollReveal,
  initNavSectionUpdater,
  observeOnce,
  throttle,
  staggerReveal
};
