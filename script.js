// ========================================
// FEL GROUP - INTERACTIVE JAVASCRIPT
// ========================================

// Navbar and mobile menu are initialized further down (consolidated implementation).

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      // Calculate offset dynamically based on navbar height so the section isn't hidden
      const navbar = document.getElementById('navbar');
      const navHeight = navbar ? navbar.offsetHeight : 80;
      const extraGap = 12; // extra spacing so content isn't flush to the navbar
      const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - extraGap;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// === SCROLL ANIMATIONS (Intersection Observer) ===
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Animate elements on scroll
document.querySelectorAll('.diff-card, .service-card, .flow-item, .team-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// === COUNTER ANIMATION ===
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + '+';
    }
  }, 16);
}

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      const target = parseInt(entry.target.dataset.count);
      const numberElement = entry.target.querySelector('.stat-number');
      animateCounter(numberElement, target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
  statsObserver.observe(stat);
});

// === ACTIVE NAV LINK ON SCROLL ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// === FORM HANDLING ===
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    
    // Here you would typically send the data to a server
    // For now, we'll just show a success message
    
    // Show success message
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>✓ Mensaje enviado</span>';
    submitBtn.style.background = '#10b981';
    
    // Reset form
    setTimeout(() => {
      contactForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
    }, 3000);
  });
}

// === PARALLAX EFFECT ON SCROLL ===
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const shapes = document.querySelectorAll('.shape');
  
  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 0.1;
    shape.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// === LAZY LOADING IMAGES ===
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// === SCROLL REVEAL ANIMATION ===
const revealElements = document.querySelectorAll('.section-header, .about-text, .about-visual');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  revealObserver.observe(el);
});

// === FLOATING ANIMATION FOR SHAPES ===
const shapes = document.querySelectorAll('.shape');
shapes.forEach((shape, index) => {
  const duration = 15 + (index * 5);
  shape.style.animationDuration = `${duration}s`;
});

// === PERFORMANCE: Reduce animations on low-end devices ===
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
  document.body.classList.add('reduced-motion');
}

// === ACCESSIBILITY: Skip to main content ===
const skipLink = document.createElement('a');
skipLink.href = '#main';
skipLink.className = 'skip-link';
skipLink.textContent = 'Saltar al contenido principal';
document.body.insertBefore(skipLink, document.body.firstChild);

const skipStyle = document.createElement('style');
skipStyle.textContent = `
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--yellow);
    color: var(--black);
    padding: 8px;
    text-decoration: none;
    font-weight: 700;
    z-index: 10000;
  }
  
  .skip-link:focus {
    top: 0;
  }
`;
document.head.appendChild(skipStyle);

// === CONSOLE EASTER EGG ===
console.log('%c¡Hola! 👋', 'font-size: 24px; font-weight: bold; color: #FFD700;');
console.log('%c¿Buscando talento? En FEL Group transformamos equipos.', 'font-size: 14px; color: #666;');
console.log('%cContacto: contacto@felgroup.cl', 'font-size: 12px; color: #999;');

// === INITIALIZATION ===
console.log('✓ FEL Group website initialized');

// ===== Menú móvil / tablet =====
const navToggle   = document.getElementById('navToggle');
const navMenu     = document.getElementById('navMenu');
const mobileMenu  = document.getElementById('mobileMenu');

function toggleMenu(open) {
  const willOpen = typeof open === 'boolean' ? open : !mobileMenu.classList.contains('active');
  mobileMenu.classList.toggle('active', willOpen);
  navMenu.classList.toggle('active', willOpen);       // útil en tablet
  navToggle.classList.toggle('active', willOpen);
  navToggle.setAttribute('aria-expanded', String(willOpen));
  mobileMenu.setAttribute('aria-hidden', String(!willOpen));
}

// Abrir/cerrar con el botón
navToggle?.addEventListener('click', () => toggleMenu());

// Cerrar cuando hago click en un enlace
mobileMenu?.addEventListener('click', (e) => {
  if (e.target.closest('a.nav-link')) toggleMenu(false);
});

// ===== Navbar “scrolled” =====
const navbar = document.getElementById('navbar');
function onScroll() {
  if (!navbar) return;
  const scrolled = window.scrollY > 10;
  navbar.classList.toggle('scrolled', scrolled);
}
onScroll();
window.addEventListener('scroll', onScroll);

// ===== Contadores del hero =====
function animateCounters() {
  const items = document.querySelectorAll('.hero .stat-item');
  const options = { threshold: 0.4 };
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count') || '0', 10);
      const num = el.querySelector('.stat-number');
      if (!num) return;

      let start = 0;
      const step = Math.max(1, Math.floor(target / 80)); // ~80 frames
      const tick = () => {
        start += step;
        if (start >= target) { start = target; }
        num.textContent = start.toLocaleString('es-CL');
        if (start < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, options);

  items.forEach(i => obs.observe(i));
}
animateCounters();

// === SIMPLE CAROUSEL FOR TEAM SECTION ===
function initTeamCarousels() {
  document.querySelectorAll('.team-carousel').forEach(carousel => {
    const track = carousel.querySelector('.team-track');
    const cards = Array.from(track.querySelectorAll('.team-card'));
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    if (!track || cards.length === 0) return;

    // create dots
    cards.forEach((card, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = i === 0 ? 'active' : '';
      btn.setAttribute('aria-label', `Ir al miembro ${i+1}`);
      btn.addEventListener('click', () => scrollToIndex(i));
      dotsContainer.appendChild(btn);
    });

    let current = 0;

    function updateDots() {
      Array.from(dotsContainer.children).forEach((d, idx) => d.classList.toggle('active', idx === current));
    }

    function scrollToIndex(i) {
      const card = cards[i];
      if (!card) return;
      const left = card.offsetLeft - track.offsetLeft;
      track.scrollTo({ left, behavior: 'smooth' });
      current = i;
      updateDots();
    }

    prev?.addEventListener('click', () => {
      current = Math.max(0, current - 1);
      scrollToIndex(current);
    });

    next?.addEventListener('click', () => {
      current = Math.min(cards.length - 1, current + 1);
      scrollToIndex(current);
    });

    // Update current based on scroll position (useful for user swipe)
    let scrollTimeout;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // find nearest card
        const left = track.scrollLeft;
        let nearest = 0; let minDiff = Infinity;
        cards.forEach((c, idx) => {
          const diff = Math.abs(c.offsetLeft - track.offsetLeft - left);
          if (diff < minDiff) { minDiff = diff; nearest = idx; }
        });
        current = nearest; updateDots();
      }, 100);
    });

    // Optional autoplay
    let autoplay = true;
    let autoplayTimer;
    function startAutoplay() {
      if (!autoplay) return;
      autoplayTimer = setInterval(() => {
        current = (current + 1) % cards.length;
        scrollToIndex(current);
      }, 4000);
    }
    function stopAutoplay() { clearInterval(autoplayTimer); }
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
  });
}

// initialize carousels after DOM ready
document.addEventListener('DOMContentLoaded', initTeamCarousels);