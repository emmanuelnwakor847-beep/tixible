(function () {
  'use strict';

  // ---- Nav scroll state ----
  var nav = document.getElementById('siteNav');
  function onScroll() {
    if (window.scrollY > 8) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- Desktop mega menu (click + keyboard) ----
  var productsTrigger = document.getElementById('productsTrigger');
  var productsLi = productsTrigger ? productsTrigger.closest('li') : null;

  function closeMega() {
    if (!productsLi) return;
    productsLi.classList.remove('open');
    productsTrigger.setAttribute('aria-expanded', 'false');
  }
  function toggleMega(e) {
    e.stopPropagation();
    var isOpen = productsLi.classList.toggle('open');
    productsTrigger.setAttribute('aria-expanded', String(isOpen));
  }
  if (productsTrigger) {
    productsTrigger.addEventListener('click', toggleMega);
    document.addEventListener('click', function (e) {
      if (productsLi && !productsLi.contains(e.target)) closeMega();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMega();
    });
  }

  // ---- Mobile menu ----
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  function setMenuOpen(open) {
    mobileMenu.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = !mobileMenu.classList.contains('open');
      setMenuOpen(open);
    });
  }
  mobileMenu && mobileMenu.querySelectorAll('a.btn, .mobile-sub a').forEach(function (a) {
    a.addEventListener('click', function () { setMenuOpen(false); });
  });

  var mobileProductsTrigger = document.getElementById('mobileProductsTrigger');
  var mobileProductsSub = document.getElementById('mobileProductsSub');
  if (mobileProductsTrigger) {
    mobileProductsTrigger.addEventListener('click', function (e) {
      e.preventDefault();
      var open = mobileProductsSub.classList.toggle('open');
      mobileProductsTrigger.setAttribute('aria-expanded', String(open));
    });
  }

  // Close mobile menu when resizing to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) setMenuOpen(false);
  });

  // ---- Smooth-scroll anchor close for mobile ----
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (mobileMenu && mobileMenu.classList.contains('open')) setMenuOpen(false);
    });
  });

  // ---- Scroll reveal ----
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- Contact form ----
  // No backend is wired up yet, so this opens a pre-filled email to the address
  // in the form's data-contact-email attribute. Swap in a real form endpoint
  // (e.g. Formspree, Web3Forms, or a Vercel serverless function) when ready.
  var form = document.getElementById('contactForm');
  var toast = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMsg');
  var toastTimer;
  function showToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3200);
  }
  function sanitize(value) {
    return String(value || '').trim().slice(0, 2000);
  }
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var data = new FormData(form);
      var fullName = sanitize(data.get('fullName'));
      var email = sanitize(data.get('email'));
      var company = sanitize(data.get('company'));
      var subject = sanitize(data.get('subject')) || 'Website inquiry';
      var message = sanitize(data.get('message'));
      var to = form.getAttribute('data-contact-email');

      var bodyLines = [
        'Name: ' + fullName,
        'Email: ' + email,
        company ? 'Company: ' + company : null,
        '',
        message,
      ].filter(function (line) { return line !== null; });

      var mailto =
        'mailto:' + encodeURIComponent(to) +
        '?subject=' + encodeURIComponent('[Tixible] ' + subject) +
        '&body=' + encodeURIComponent(bodyLines.join('\n'));

      window.location.href = mailto;
      showToast('Opening your email client to send this to Tixible...');
      form.reset();
    });
  }
})();
