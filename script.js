// =============================================
// Prabha Dental Clinic — Main JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ========== MOBILE MENU (init first so later errors cannot break it) ==========
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && menuClose && mobileMenu) {
    const menuBackdrop = document.getElementById('mobile-menu-backdrop');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu-link, .mobile-menu-cta');

    function openMenu() {
      mobileMenu.classList.add('active');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('menu-open');
    }

    function closeMenu() {
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('menu-open');
    }

    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (mobileMenu.classList.contains('active')) closeMenu();
      else openMenu();
    });

    menuClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
    });

    if (menuBackdrop) {
      menuBackdrop.addEventListener('click', closeMenu);
    }

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) closeMenu();
    });
  }

  // ========== PRELOADER ==========
  const preloader = document.getElementById('preloader');
  // Add a slight delay to ensure smooth transition even if load is instant
  setTimeout(() => {
    preloader.classList.add('hidden');
    // Remove from DOM after fade out to prevent blocking interactions
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 600);
  }, 500);


  // ========== ANNOUNCEMENT BAR ==========
  const announcementBar = document.getElementById('announcement-bar');
  const closeAnnouncementBtn = document.getElementById('close-announcement');
  
  if (closeAnnouncementBtn && announcementBar) {
    closeAnnouncementBtn.addEventListener('click', () => {
      announcementBar.style.display = 'none';
    });
  }


  // ========== NAVBAR SCROLL EFFECT ==========
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('fixed', 'top-0', 'scrolled');
    } else {
      navbar.classList.remove('fixed', 'top-0', 'scrolled');
    }
  }

  // Active nav link highlight based on scroll position
  function highlightActiveNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    highlightActiveNav();
  });

  handleNavbarScroll();
  highlightActiveNav();


  // ========== HERO PARALLAX ==========
  const heroBg = document.getElementById('hero-bg');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Only animate if hero is visible
    if (scrollY < window.innerHeight && heroBg) {
      heroBg.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
    }
  });


  // ========== SCROLL REVEAL ANIMATIONS ==========
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: stop observing once revealed
        // revealObserver.unobserve(entry.target); 
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Safety: if the user lands directly on a section (hash navigation) or scrolls
  // quickly, ensure any in-viewport reveal elements are visible immediately.
  const isInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };
  revealElements.forEach(el => {
    if (isInViewport(el)) el.classList.add('active');
  });


  // ========== COUNTER ANIMATION ==========
  const counters = document.querySelectorAll('.counter-value');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const start = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const current = Math.round(eased * target);

        if (target >= 1000) {
          counter.textContent = current.toLocaleString() + '+';
        } else if (target >= 10) {
           counter.textContent = current + '+';
        } else {
           counter.textContent = current;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }
      requestAnimationFrame(updateCounter);
    });
  }


  // ========== GALLERY LIGHTBOX WITH NAVIGATION ==========
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const btnClose = document.getElementById('lightbox-close-btn');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');
  
  let currentImageIndex = 0;
  const totalImages = galleryItems.length;

  function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = galleryItems[currentImageIndex];
    const img = item.querySelector('img');
    const caption = item.getAttribute('data-caption');
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption || '';
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${totalImages}`;
  }

  function prevImage(e) {
    if(e) e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    updateLightboxContent();
  }

  function nextImage(e) {
    if(e) e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % totalImages;
    updateLightboxContent();
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnPrev) btnPrev.addEventListener('click', prevImage);
  if (btnNext) btnNext.addEventListener('click', nextImage);
  
  // Close on clicking outside image
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });


  // ========== TESTIMONIAL CAROUSEL ==========
  const track = document.getElementById('testimonial-track');
  if (track) {
    const slides = track.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('testimonial-dots');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentSlide = 0;
    let autoPlayInterval;

    if (dotsContainer) {
    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.testimonial-dot');

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
      goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    startAutoPlay();

    // Pause on hover
    const carouselContainer = track.closest('.overflow-hidden');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
      carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
        resetAutoPlay();
      }
    }, { passive: true });
    }
  }


  // ========== CONTACT FORM — EmailJS + WhatsApp + LocalStorage ==========
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  // ── EmailJS Config ──
  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

  // ── WhatsApp number ──
  const CLINIC_WHATSAPP = '916381333937'; // Clinic number ✅

  if (typeof emailjs !== 'undefined') emailjs.init(EMAILJS_PUBLIC_KEY);

  // ── Save submission to localStorage ──
  function saveSubmission(data) {
    const submissions = JSON.parse(localStorage.getItem('pdc_submissions') || '[]');
    submissions.unshift({
      id      : Date.now(),
      name    : data.name,
      phone   : data.phone,
      email   : data.email,
      service : data.service,
      message : data.message,
      date    : new Date().toISOString(),
      read    : false,
    });
    localStorage.setItem('pdc_submissions', JSON.stringify(submissions));
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Collect form values
      const name        = document.getElementById('name').value.trim();
      const phone       = document.getElementById('phone').value.trim();
      const email       = document.getElementById('email').value.trim();
      const serviceEl   = document.getElementById('service-input');
      const serviceName = serviceEl.value || 'Not specified';
      const message     = document.getElementById('message').value.trim();

      // ── Save to localStorage for admin dashboard ──
      saveSubmission({ name, phone, email, service: serviceName, message });

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalContent = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending...
      `;
      submitBtn.disabled = true;

      // ── 1. Send Email via EmailJS (auto — no customer action needed) ──
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name : name,
          phone     : phone,
          email     : email || 'Not provided',
          service   : serviceName,
          message   : message || 'No message',
          reply_to  : email || 'dentalclinic.prabha@gmail.com',
        });
      } catch (err) {
        console.warn('EmailJS error:', err);
        // Even if email fails, still redirect to WhatsApp
      }

      // ── 2. Also open WhatsApp with pre-filled message ──
      const lines = [
        '*----------------------------------*',
        '*  New Appointment Request  *',
        '*  Prabha Dental Clinic  *',
        '*----------------------------------*',
        '',
        '*Name    :* ' + name,
        '*Phone   :* ' + phone,
        email   ? '*Email   :* ' + email   : '',
        '*Service :* ' + serviceName,
        message ? '*Message :* ' + message : '',
        '',
        '*----------------------------------*',
        '_Sent via Prabha Dental Clinic website_',
      ].filter(line => line !== '').join('\n');

      const encodedMsg  = encodeURIComponent(lines);
      const whatsappURL = `https://wa.me/${CLINIC_WHATSAPP}?text=${encodedMsg}`;
      window.open(whatsappURL, '_blank');

      // ── 3. Show success state ──
      contactForm.style.display = 'none';
      formSuccess.classList.remove('hidden');
      submitBtn.innerHTML = originalContent;
      submitBtn.disabled  = false;

      // Reset after 5 seconds
      setTimeout(() => {
        contactForm.style.display = 'block';
        formSuccess.classList.add('hidden');
        contactForm.reset();
      }, 5000);
    });
  }


  // ========== SMOOTH SCROLL FOR ALL ANCHOR LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      // Skip if just "#"
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ========== CUSTOM DROPDOWN ==========
  const serviceTrigger = document.getElementById('dd-service-trigger');
  const serviceMenu    = document.getElementById('dd-service-menu');
  const serviceLabel   = document.getElementById('dd-service-label');
  const serviceInput   = document.getElementById('service-input');

  if (serviceTrigger && serviceMenu) {
    serviceTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      serviceMenu.classList.toggle('open');
      serviceTrigger.classList.toggle('open');
    });

    serviceMenu.querySelectorAll('.dropdown-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const val = opt.dataset.value;
        serviceInput.value = val;
        serviceLabel.textContent = val;
        serviceLabel.classList.remove('text-white/50');
        serviceLabel.classList.add('text-white/90');
        
        serviceMenu.querySelectorAll('.dropdown-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        
        serviceMenu.classList.remove('open');
        serviceTrigger.classList.remove('open');
      });
    });

    document.addEventListener('click', () => {
      serviceMenu.classList.remove('open');
      serviceTrigger.classList.remove('open');
    });
  }


  // ========== BACK TO TOP BUTTON ==========
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // ========== CUSTOM SERVICE DROPDOWN ==========
  const csTrigger   = document.getElementById('cs-trigger');
  const csDropdown  = document.getElementById('cs-dropdown');
  const csDisplay   = document.getElementById('cs-display');
  const csInput     = document.getElementById('service-select');
  const csOptions   = csDropdown ? csDropdown.querySelectorAll('.cs-option') : [];

  function openCS() {
    csTrigger.classList.add('open');
    csDropdown.classList.add('open');
    csTrigger.setAttribute('aria-expanded', 'true');
  }

  function closeCS() {
    csTrigger.classList.remove('open');
    csDropdown.classList.remove('open');
    csTrigger.setAttribute('aria-expanded', 'false');
  }

  function selectCSOption(option) {
    const value = option.getAttribute('data-value');
    const label = option.querySelector('.cs-option-text').textContent;

    // Update hidden input
    csInput.value = value;

    // Update trigger display
    csDisplay.textContent = label;
    csTrigger.classList.add('has-value');

    // Mark selected
    csOptions.forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');

    closeCS();
  }

  if (csTrigger && csDropdown) {
    // Toggle on click
    csTrigger.addEventListener('click', () => {
      csTrigger.classList.contains('open') ? closeCS() : openCS();
    });

    // Option click
    csOptions.forEach(option => {
      option.addEventListener('click', () => selectCSOption(option));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!csTrigger.closest('#cs-wrapper').contains(e.target)) {
        closeCS();
      }
    });

    // Keyboard: Enter/Space to open, Escape to close, ArrowDown/Up to navigate
    csTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        csTrigger.classList.contains('open') ? closeCS() : openCS();
      } else if (e.key === 'Escape') {
        closeCS();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!csTrigger.classList.contains('open')) openCS();
        csOptions[0] && csOptions[0].focus();
      }
    });

    csOptions.forEach((option, idx) => {
      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectCSOption(option); }
        else if (e.key === 'Escape') { closeCS(); csTrigger.focus(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); csOptions[idx + 1] && csOptions[idx + 1].focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); idx > 0 ? csOptions[idx - 1].focus() : csTrigger.focus(); }
      });
    });
  }

  // Also reset custom dropdown when form is reset
  const contactFormEl = document.getElementById('contact-form');
  if (contactFormEl) {
    contactFormEl.addEventListener('reset', () => {
      if (csDisplay) csDisplay.textContent = 'Select Service';
      if (csTrigger) csTrigger.classList.remove('has-value');
      if (csInput)   csInput.value = '';
      csOptions.forEach(o => o.classList.remove('selected'));
    });
  }

});


// ==========================================
// DYNAMIC TESTIMONIALS SYSTEM
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const TM_STORAGE_KEY = 'PRABHA_TESTIMONIALS_DB';
  const tmGrid = document.getElementById('testimonials-grid');
  
  if (!tmGrid) return;

  // Save the original static HTML testimonials to fall back to if database is empty
  const defaultHtml = tmGrid.innerHTML;

  function updateTestimonials() {
    const data = localStorage.getItem(TM_STORAGE_KEY);
    if (!data) {
      tmGrid.innerHTML = defaultHtml;
      return;
    }

    const tms = JSON.parse(data);
    if (tms.length === 0) {
      tmGrid.innerHTML = defaultHtml;
      return;
    }

    // We have custom testimonials! Replace the grid contents.
    tmGrid.innerHTML = '';

    const colors = [
      { bg: 'bg-teal/10', text: 'text-teal' },
      { bg: 'bg-gold/10', text: 'text-gold-dark' },
      { bg: 'bg-green-500/10', text: 'text-green-600' },
      { bg: 'bg-purple-500/10', text: 'text-purple-600' },
      { bg: 'bg-blue-500/10', text: 'text-blue-600' }
    ];

    tms.forEach((t, i) => {
      // Generate Initials (e.g. Ramya Krishnan -> RK)
      const initials = t.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
      
      // Pick a deterministic color based on index
      const color = colors[i % colors.length];

      // Generate Stars SVG
      const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`;
      const dimStarSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0 opacity-35" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`;
      const starsHtml = starSvg.repeat(t.rating) + dimStarSvg.repeat(5 - t.rating);

      const delay = (i * 0.1).toFixed(1);

      const card = document.createElement('div');
      card.className = `glass-card-light p-6 md:p-8 relative flex flex-col h-full`;
      card.style.transitionDelay = `${delay}s`;
      
      card.innerHTML = `
        <span class="absolute top-4 right-6 text-6xl text-teal/10 font-serif leading-none">&ldquo;</span>
        <div class="flex gap-1 text-gold text-sm mb-4">
          ${starsHtml}
        </div>
        <p class="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">"${t.message}"</p>
        <div class="flex items-center gap-4 mt-auto">
          <div class="w-10 h-10 rounded-full ${color.bg} flex items-center justify-center ${color.text} font-bold text-sm">${initials}</div>
          <div>
            <p class="font-semibold text-dark text-sm">${t.name}</p>
            <p class="text-gray-400 text-xs">${t.service}</p>
          </div>
        </div>
      `;
      
      tmGrid.appendChild(card);
    });
  }

  // Initial load
  updateTestimonials();

  // Listen for storage events (if admin dashboard changes the database in another tab)
  window.addEventListener('storage', (e) => {
    if (e.key === TM_STORAGE_KEY) {
      updateTestimonials();
    }
  });
});
