/* ================================================================
   COASTA SEA MARINE SERVICES — INTERACTION SCRIPT
   Handles: scroll reveal, sticky header, parallax, counters, mobile nav
   ================================================================ */

(function () {
  'use strict';

  // ======================== HERO ENTRANCE ANIMATION ========================
  // Hero elements are in-viewport on load — trigger them with a staggered delay
  function triggerHeroAnimations() {
    const heroRevealEls = document.querySelectorAll(
      '.hero .reveal-fade, .hero .reveal-slide'
    );
    heroRevealEls.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('visible');
      }, 100 + i * 140);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', triggerHeroAnimations);
  } else {
    triggerHeroAnimations();
  }

  // ======================== STICKY HEADER ========================
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const y = window.scrollY;
    if (y > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = y;
  }

  // ======================== MOBILE NAV ========================
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');

  function toggleMobileNav() {
    const isOpen = hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileNav() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMobileNav);

  // Close mobile nav on link click
  document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  // Close mobile nav on ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileNav();
  });

  // ======================== SCROLL REVEAL (IntersectionObserver) ========================
  const revealElements = document.querySelectorAll(
    '.reveal-fade, .reveal-slide, .reveal-zoom, .reveal-card'
  );

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ======================== PARALLAX HERO ========================
  const heroImg = document.getElementById('hero-parallax-img');
  let ticking = false;

  function handleParallax() {
    if (!heroImg) return;
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
    if (scrollY < heroHeight) {
      // Subtle parallax: image moves at 30% of scroll speed
      heroImg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px) scale(1.08)';
    }
  }

  // ======================== COUNTER ANIMATION ========================
  const numberFigures = document.querySelectorAll('.number-figure[data-target]');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    numberFigures.forEach(function (el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 2000; // ms
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(update);
    });
  }

  const numbersSection = document.getElementById('numbers-strip');
  if (numbersSection) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    counterObserver.observe(numbersSection);
  }

  // ======================== ACTIVE NAV HIGHLIGHT ========================
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= 100) current = section.getAttribute('id');
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ======================== COMBINED SCROLL HANDLER ========================
  function onScroll() {
    handleHeaderScroll();
    updateActiveNav();
    if (!ticking) {
      requestAnimationFrame(function () {
        handleParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ======================== SMOOTH ANCHOR SCROLLING ========================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerOffset = 72; // header height
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - headerOffset,
          behavior: 'smooth'
        });
      }
    });
  });

  // ======================== CONTACT FORM ========================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = document.getElementById('contact-submit-btn');
      const originalText = submitBtn.textContent;

      // Simple validation
      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const message = document.getElementById('contact-message');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        // Highlight empty required fields
        [name, email, message].forEach(function (field) {
          if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            setTimeout(function () {
              field.style.borderColor = '';
            }, 2000);
          }
        });
        return;
      }

      // Simulate submission
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.textContent = 'Enquiry Sent ✓';
        submitBtn.style.backgroundColor = '#059669';
        submitBtn.style.borderColor = '#059669';

        setTimeout(function () {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.borderColor = '';
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }

  // ======================== FOOTER YEAR ========================
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ======================== INITIAL STATE ========================
  // Trigger header check on load
  handleHeaderScroll();

  // Set initial parallax
  if (heroImg) {
    heroImg.style.transform = 'scale(1.08)';
  }
})();
