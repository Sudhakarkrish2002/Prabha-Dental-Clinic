// =============================================
// Prabha Dental Clinic — Main JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', () => {

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


  // ========== MOBILE MENU ==========
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileMenu.classList.add('active');
    menuOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('active');
    menuOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', closeMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
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
    if (!lightbox.classList.contains('active')) return;
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


  // ========== CONTACT FORM ==========
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
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

      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.remove('hidden');
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;

        setTimeout(() => {
          contactForm.style.display = 'block';
          formSuccess.classList.add('hidden');
          contactForm.reset();
        }, 5000);
      }, 1500);
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

});
