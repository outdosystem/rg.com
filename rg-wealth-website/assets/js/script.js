/**
 * RG Wealth - Faayda Aapka
 * Premium Financial Services & Stock Market Training
 * Vanilla JavaScript Core Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Sticky Header & Scroll Effects
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTopBtn');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Back to Top button click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 2. Mobile Navbar Auto-Collapse on Link Click
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  if (navbarCollapse) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      });
    });
  }

  // 3. Dynamic Footer Copyright Year
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 4. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 5. Animated Number Counters (Verified Facts Only: 18+ Years, 2015 Est, 100+ Students)
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-counter-target'), 10);
          const suffix = entry.target.getAttribute('data-counter-suffix') || '';
          const prefix = entry.target.getAttribute('data-counter-prefix') || '';
          const duration = 1800; // ms
          const startTimestamp = performance.now();

          const step = (now) => {
            const elapsed = now - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOutProgress * target);

            entry.target.textContent = `${prefix}${currentVal}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              entry.target.textContent = `${prefix}${target}${suffix}`;
            }
          };

          requestAnimationFrame(step);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // 6. Interactive Contact Form Validation & Submission Feedback
  const contactForm = document.getElementById('rgContactForm');
  if (contactForm) {
    const formStatus = document.getElementById('contactFormStatus');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    const validatePhone = (phone) => {
      // Indian mobile: 10 digits, starts with 6, 7, 8, or 9
      const cleaned = phone.replace(/[\s\-()]/g, '');
      return /^[6-9]\d{9}$/.test(cleaned);
    };

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Name
      const nameInput = document.getElementById('contactName');
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        showFieldError(nameInput, 'Please enter your full name (at least 2 letters).');
        isValid = false;
      } else {
        clearFieldError(nameInput);
      }

      // Phone
      const phoneInput = document.getElementById('contactPhone');
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      if (!validatePhone(phoneVal)) {
        showFieldError(phoneInput, 'Please enter a valid 10-digit Indian mobile number (e.g. 9814449789).');
        isValid = false;
      } else {
        clearFieldError(phoneInput);
      }

      // Email
      const emailInput = document.getElementById('contactEmail');
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!validateEmail(emailVal)) {
        showFieldError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearFieldError(emailInput);
      }

      // Service
      const serviceInput = document.getElementById('contactService');
      if (serviceInput && (!serviceInput.value || serviceInput.value === '')) {
        showFieldError(serviceInput, 'Please select the service you are interested in.');
        isValid = false;
      } else if (serviceInput) {
        clearFieldError(serviceInput);
      }

      // Message
      const messageInput = document.getElementById('contactMessage');
      const msgVal = messageInput ? messageInput.value.trim() : '';
      if (!msgVal || msgVal.length < 6) {
        showFieldError(messageInput, 'Please write a brief message or question (at least 6 characters).');
        isValid = false;
      } else {
        clearFieldError(messageInput);
      }

      if (!isValid) {
        if (formStatus) {
          formStatus.className = 'form-status-alert alert alert-danger show';
          formStatus.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i> Please correct the highlighted fields above.';
        }
        return;
      }

      // Simulate sending with loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Submitting Enquiry...';
      }

      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="bi bi-send-check-fill me-2"></i> Submit Enquiry';
        }

        if (formStatus) {
          formStatus.className = 'form-status-alert alert alert-success show';
          formStatus.innerHTML = `
            <strong><i class="bi bi-check-circle-fill me-2"></i> Thank you, ${escapeHtml(nameVal)}!</strong>
            <p class="mb-1 mt-1">Your consultation enquiry has been recorded successfully. Our team at Bathinda will connect with you via ${phoneVal} shortly.</p>
            <small class="text-muted"><i class="bi bi-info-circle me-1"></i> (Client-side validation passed. Connect with your CRM or email service for production delivery.)</small>
          `;
        }
      }, 900);
    });
  }

  // 7. Course Inquiry Form Validation
  const courseForm = document.getElementById('courseInquiryForm');
  if (courseForm) {
    const courseStatus = document.getElementById('courseFormStatus');
    const courseSubmitBtn = courseForm.querySelector('button[type="submit"]');

    courseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('courseStudentName');
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        showFieldError(nameInput, 'Please enter your full name.');
        isValid = false;
      } else {
        clearFieldError(nameInput);
      }

      const phoneInput = document.getElementById('courseStudentPhone');
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const phoneCleaned = phoneVal.replace(/[\s\-()]/g, '');
      if (!/^[6-9]\d{9}$/.test(phoneCleaned)) {
        showFieldError(phoneInput, 'Please enter a valid 10-digit Indian phone number.');
        isValid = false;
      } else {
        clearFieldError(phoneInput);
      }

      const courseSelect = document.getElementById('courseSelect');
      if (courseSelect && !courseSelect.value) {
        showFieldError(courseSelect, 'Please select the course of interest.');
        isValid = false;
      } else if (courseSelect) {
        clearFieldError(courseSelect);
      }

      if (!isValid) return;

      if (courseSubmitBtn) {
        courseSubmitBtn.disabled = true;
        courseSubmitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Submitting...';
      }

      setTimeout(() => {
        courseForm.reset();
        if (courseSubmitBtn) {
          courseSubmitBtn.disabled = false;
          courseSubmitBtn.innerHTML = '<i class="bi bi-mortarboard-fill me-2"></i> Enquire About Courses';
        }

        if (courseStatus) {
          courseStatus.className = 'form-status-alert alert alert-success show';
          courseStatus.innerHTML = `
            <strong><i class="bi bi-check-circle-fill me-2"></i> Registration Received!</strong>
            <p class="mb-0 mt-1">Thank you ${escapeHtml(nameVal)}. Our training coordinators for the <strong>RG Wealth Stock Market Training Institute</strong> will reach out to schedule your offline orientation session in Bathinda.</p>
          `;
        }
      }, 850);
    });
  }

  // 8. Gallery Lightbox Functionality
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModalEl = document.getElementById('galleryLightboxModal');
  
  if (galleryCards.length > 0 && lightboxModalEl) {
    const lightboxModal = new bootstrap.Modal(lightboxModalEl);
    const lightboxImg = document.getElementById('lightboxModalImg');
    const lightboxCaption = document.getElementById('lightboxModalCaption');
    const prevBtn = document.getElementById('lightboxPrevBtn');
    const nextBtn = document.getElementById('lightboxNextBtn');

    let currentIndex = 0;
    const galleryItems = Array.from(galleryCards).map(card => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.gallery-caption');
      return {
        src: img ? img.src : '',
        alt: img ? img.alt : '',
        caption: caption ? caption.textContent.trim() : (img ? img.alt : '')
      };
    });

    const updateLightbox = (index) => {
      if (index < 0) index = galleryItems.length - 1;
      if (index >= galleryItems.length) index = 0;
      currentIndex = index;

      const item = galleryItems[currentIndex];
      if (lightboxImg) {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
      }
      if (lightboxCaption) {
        lightboxCaption.textContent = item.caption;
      }
    };

    galleryCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        updateLightbox(index);
        lightboxModal.show();
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => updateLightbox(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => updateLightbox(currentIndex + 1));
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightboxModalEl.classList.contains('show')) return;
      if (e.key === 'ArrowLeft') updateLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') updateLightbox(currentIndex + 1);
    });
  }

  // 9. Interactive SIP / Wealth Planning Estimator
  const sipCalculatorForm = document.getElementById('sipCalculatorForm');
  if (sipCalculatorForm) {
    const monthlyAmtInput = document.getElementById('sipMonthlyAmt');
    const returnRateInput = document.getElementById('sipReturnRate');
    const timeYearsInput = document.getElementById('sipTimeYears');
    const investedResult = document.getElementById('sipInvestedResult');
    const returnsResult = document.getElementById('sipReturnsResult');
    const totalResult = document.getElementById('sipTotalResult');

    const calculateSIP = () => {
      const P = parseFloat(monthlyAmtInput.value) || 5000;
      const annualRate = parseFloat(returnRateInput.value) || 12;
      const t = parseFloat(timeYearsInput.value) || 5;

      const n = t * 12; // Total months
      const i = (annualRate / 100) / 12; // Monthly interest rate

      // SIP Formula: M = P * [((1 + i)^n - 1) / i] * (1 + i)
      const totalWealth = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const totalInvested = P * n;
      const estimatedReturns = totalWealth - totalInvested;

      const formatINR = (val) => {
        return '₹ ' + Math.round(val).toLocaleString('en-IN');
      };

      if (investedResult) investedResult.textContent = formatINR(totalInvested);
      if (returnsResult) returnsResult.textContent = formatINR(estimatedReturns);
      if (totalResult) totalResult.textContent = formatINR(totalWealth);
    };

    if (monthlyAmtInput && returnRateInput && timeYearsInput) {
      monthlyAmtInput.addEventListener('input', calculateSIP);
      returnRateInput.addEventListener('input', calculateSIP);
      timeYearsInput.addEventListener('input', calculateSIP);
      calculateSIP();
    }
  }

  // Helper Functions for Validation
  function showFieldError(input, message) {
    if (!input) return;
    input.classList.add('is-invalid');
    const parent = input.parentElement;
    let feedback = parent.querySelector('.invalid-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      parent.appendChild(feedback);
    }
    feedback.textContent = message;
  }

  function clearFieldError(input) {
    if (!input) return;
    input.classList.remove('is-invalid');
  }

  function escapeHtml(string) {
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return String(string).replace(/[&<>"']/g, s => entityMap[s]);
  }
});
