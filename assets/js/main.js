document.addEventListener('DOMContentLoaded', function () {

  // --- Generic modal open/close (offerings + portfolio) ---
  var openers = document.querySelectorAll('[data-modal-target]');
  var modals = document.querySelectorAll('.modal-overlay');

  function closeAllModals() {
    modals.forEach(function (m) { m.classList.remove('open'); });
    document.body.style.overflow = '';
  }

  openers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('data-modal-target');
      var target = document.getElementById(targetId);
      if (!target) return;
      closeAllModals();
      target.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  modals.forEach(function (modal) {
    var closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeAllModals);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeAllModals();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllModals();
      closeLightbox();
      closeMobileNav();
    }
  });

  // --- Mobile hamburger nav ---
  var navToggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  function closeMobileNav() {
    if (!navToggle || !mobileNav) return;
    mobileNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // --- Photography lightbox (nested inside the photography modal) ---
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  var lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  document.querySelectorAll('.gallery figure').forEach(function (fig) {
    fig.addEventListener('click', function () {
      var img = fig.querySelector('img');
      if (!img || !lightbox || !lightboxImg) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    });
  });

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('open');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // --- Side nav scroll spy ---
  var navLinks = document.querySelectorAll('.side-nav a');
  var spySections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) spySections.push({ id: id, el: section, link: link });
  });

  if (spySections.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var match = spySections.find(function (s) { return s.el === entry.target; });
        if (!match) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          match.link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    spySections.forEach(function (s) { observer.observe(s.el); });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
