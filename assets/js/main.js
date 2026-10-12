/**
 * Rohit Garg – Executive Personal Branding Website
 * Vanilla JavaScript Core Engine (main.js)
 * Strict Requirement: Vanilla JS only, no layout calculation, no frameworks.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initHeroSlider();
  initScrollReveal();
  initGalleryFilter();
  initLightbox();
  initContactForms();
  initBackToTop();
  highlightActiveNav();
});

/**
 * 1. Sticky Header Scroll-State
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. Hero Slider with Controls & Autoplay
 */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider-section');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dots = slider.querySelectorAll('.slider-dot');
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 6500; // 6.5s per slide

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    currentSlide = index;
  };

  const nextSlide = () => {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  };

  const prevSlide = () => {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  };

  const startAutoplay = () => {
    stopAutoplay();
    slideInterval = setInterval(nextSlide, slideDuration);
  };

  const stopAutoplay = () => {
    if (slideInterval) clearInterval(slideInterval);
  };

  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAutoplay();
    });
  });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Keyboard navigation
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
      startAutoplay();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      startAutoplay();
    }
  });

  // Touch swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) nextSlide();
      else prevSlide();
      startAutoplay();
    }
  }, { passive: true });

  startAutoplay();
}

/**
 * 3. Subtle Scroll Reveal Animations
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-fade-up');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach((el) => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    elements.forEach((el) => el.classList.add('revealed'));
  }
}

/**
 * 4. Gallery Category Filtering
 */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
        }
      });
    });
  });
}

/**
 * 5. Lightbox Modal
 */
function initLightbox() {
  const lightboxModal = document.getElementById('lightboxModal');
  if (!lightboxModal) return;

  const lightboxImg = lightboxModal.querySelector('.lightbox-image');
  const lightboxCaption = lightboxModal.querySelector('.lightbox-caption');
  const closeBtn = lightboxModal.querySelector('.lightbox-close-btn');
  const clickableItems = document.querySelectorAll('[data-lightbox="true"]');

  clickableItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const img = item.querySelector('img') || item;
      const src = item.getAttribute('data-full-img') || img.getAttribute('src');
      const caption = item.getAttribute('data-caption') || img.getAttribute('alt') || '';

      if (lightboxImg) lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.textContent = caption;

      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    });
  });

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/**
 * 6. Contact and Enquiry Form Validation & Feedback
 */
function initContactForms() {
  const forms = document.querySelectorAll('.validated-contact-form');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="fullName"]');
      const emailInput = form.querySelector('[name="email"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const messageInput = form.querySelector('[name="message"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const alertBox = form.querySelector('.form-status-alert');

      let isValid = true;
      let errorMsg = '';

      // Required fields validation
      if (nameInput && !nameInput.value.trim()) {
        isValid = false;
        errorMsg = 'Please enter your full name.';
        nameInput.focus();
      } else if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        isValid = false;
        errorMsg = 'Please enter a valid email address.';
        emailInput.focus();
      } else if (messageInput && messageInput.value.trim().length < 10) {
        isValid = false;
        errorMsg = 'Please provide a message with at least 10 characters.';
        messageInput.focus();
      }

      if (!isValid) {
        if (alertBox) {
          alertBox.className = 'form-status-alert alert-danger';
          alertBox.textContent = errorMsg;
          alertBox.style.display = 'block';
        }
        return;
      }

      // Submission simulation with loading state
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Transmitting Enquiry...';
      }

      if (alertBox) alertBox.style.display = 'none';

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }

        if (alertBox) {
          alertBox.className = 'form-status-alert alert-success';
          alertBox.innerHTML = `<strong>Thank you, ${nameInput ? nameInput.value.trim() : 'Guest'}.</strong> Your enquiry has been registered successfully. Our executive office will review your message and connect with you promptly.`;
          alertBox.style.display = 'block';
        }

        form.reset();
      }, 1200);
    });
  });
}

/**
 * 7. Back to Top Button
 */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 8. Active Nav Item Highlighting
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.site-header .nav-link, .mobile-nav-canvas .nav-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Check if path matches
    if (
      (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('index.html') || currentPath === '')) ||
      (href !== 'index.html' && currentPath.endsWith(href))
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
