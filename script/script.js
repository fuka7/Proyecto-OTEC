// ========================================
// FEL GROUP - JAVASCRIPT UNIFICADO
// ========================================

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {

  // === ELEMENTOS DEL DOM ===
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const contactForm = document.getElementById('contactForm');

  // === NAVBAR SCROLL ===
  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  handleScroll(); // Ejecutar al cargar
  window.addEventListener('scroll', handleScroll);

  // === MOBILE MENU TOGGLE ===
  function toggleMenu(open) {
    const willOpen = typeof open === 'boolean' ? open : !mobileMenu.classList.contains('active');
    
    mobileMenu?.classList.toggle('active', willOpen);
    navMenu?.classList.toggle('active', willOpen);
    navToggle?.classList.toggle('active', willOpen);
    
    navToggle?.setAttribute('aria-expanded', String(willOpen));
    mobileMenu?.setAttribute('aria-hidden', String(!willOpen));
    
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = willOpen ? 'hidden' : '';
  }

  // Abrir/cerrar con el botón
  navToggle?.addEventListener('click', () => toggleMenu());

  // Cerrar cuando hago click en un enlace
  mobileMenu?.addEventListener('click', (e) => {
    if (e.target.closest('a.nav-link')) {
      toggleMenu(false);
    }
  });

  // Cerrar menú con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
      toggleMenu(false);
    }
  });

  // === SMOOTH SCROLL ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        // Calcular offset dinámicamente basado en altura del navbar
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const extraGap = 20;
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - extraGap;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Cerrar menú móvil si está abierto
        if (mobileMenu?.classList.contains('active')) {
          toggleMenu(false);
        }
      }
    });
  });

  // === INTERSECTION OBSERVER PARA ANIMACIONES ===
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('animated');
      }
    });
  }, observerOptions);

  // Animar elementos al hacer scroll
  const animateElements = document.querySelectorAll('.animate-on-scroll, .diff-card, .service-card, .flow-item, .team-card');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // === ANIMACIÓN DE CONTADORES ===
  function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString('es-CL') + '+';
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString('es-CL') + '+';
      }
    }, 16);
  }

  // Observer para contadores
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = parseInt(entry.target.dataset.count);
        const numberElement = entry.target.querySelector('.stat-number');
        
        if (numberElement && !isNaN(target)) {
          // Empezar desde 0
          numberElement.textContent = '0';
          animateCounter(numberElement, target);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
  });

  // === ACTIVE NAV LINK ON SCROLL ===
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
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Obtener datos del formulario
      const formData = new FormData(contactForm);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      
      // Mostrar estado de carga
      submitBtn.innerHTML = '<span>Enviando...</span>';
      submitBtn.disabled = true;
      
      // Aquí conectarías con tu backend
      // fetch('/api/contacto', { method: 'POST', body: JSON.stringify(data) })
      
      // Simular envío
      setTimeout(() => {
        // Mensaje de éxito
        submitBtn.innerHTML = '<span>✓ Mensaje enviado</span>';
        submitBtn.style.background = '#10b981';
        
        // Reset después de 3 segundos
        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1000);
    });
  }

  // === PARALLAX EFFECT EN SHAPES ===
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
          const speed = (index + 1) * 0.1;
          shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        ticking = false;
      });
      ticking = true;
    }
  });

  // === LAZY LOADING DE IMÁGENES ===
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

  // === SCROLL REVEAL PARA SECCIONES ===
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

  // === ANIMACIONES DE SHAPES ===
  const shapes = document.querySelectorAll('.shape');
  shapes.forEach((shape, index) => {
    const duration = 15 + (index * 5);
    shape.style.animationDuration = `${duration}s`;
  });

  // === PERFORMANCE: Reducir animaciones en dispositivos lentos ===
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.body.classList.add('reduced-motion');
    // Desactivar animaciones costosas
    shapes.forEach(shape => {
      shape.style.animation = 'none';
    });
  }

  // === TEAM CAROUSEL (si existe) ===
  function initTeamCarousels() {
    document.querySelectorAll('.team-carousel').forEach(carousel => {
      const track = carousel.querySelector('.team-track');
      const cards = Array.from(track?.querySelectorAll('.team-card') || []);
      const prev = carousel.querySelector('.carousel-prev');
      const next = carousel.querySelector('.carousel-next');
      const dotsContainer = carousel.querySelector('.carousel-dots');

      if (!track || cards.length === 0) return;

      let current = 0;

      // Crear dots
      if (dotsContainer) {
        cards.forEach((card, i) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = i === 0 ? 'active' : '';
          btn.setAttribute('aria-label', `Ir al miembro ${i + 1}`);
          btn.addEventListener('click', () => {
            scrollToIndex(i);
            // Reiniciar autoplay tras interacción manual
            stopAutoplay();
            startAutoplay();
          });
          dotsContainer.appendChild(btn);
        });
      }

      function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.children || [];
        Array.from(dots).forEach((d, idx) => {
          d.classList.toggle('active', idx === current);
        });
      }

      function updateButtons() {
        if (prev) {
          prev.disabled = current === 0;
          prev.style.opacity = current === 0 ? '0.3' : '1';
        }
        if (next) {
          next.disabled = current >= cards.length - 1;
          next.style.opacity = current >= cards.length - 1 ? '0.3' : '1';
        }
      }

      function scrollToIndex(i) {
        if (i < 0 || i >= cards.length) return;
        const card = cards[i];
        if (!card) return;
        
        // Calcular posición precisa
        const left = card.offsetLeft - track.offsetLeft;
        track.scrollTo({ left, behavior: 'smooth' });
        
        current = i;
        updateDots();
        updateButtons();
      }

      // Botones prev/next (reinician autoplay tras interacción)
      prev?.addEventListener('click', () => {
        if (current > 0) {
          scrollToIndex(current - 1);
          stopAutoplay();
          startAutoplay();
        }
      });

      next?.addEventListener('click', () => {
        if (current < cards.length - 1) {
          scrollToIndex(current + 1);
          stopAutoplay();
          startAutoplay();
        }
      });

      // Actualizar current basado en scroll position
      let scrollTimeout;
      track.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const left = track.scrollLeft;
          let nearest = 0;
          let minDiff = Infinity;
          cards.forEach((c, idx) => {
            const diff = Math.abs(c.offsetLeft - track.offsetLeft - left);
            if (diff < minDiff) {
              minDiff = diff;
              nearest = idx;
            }
          });
          if (nearest !== current) {
            current = nearest;
            updateDots();
            updateButtons();
          }
        }, 150);
      });

      // Touch/Drag support
      let isDown = false;
      let startX;
      let scrollLeft;

      track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.style.cursor = 'grabbing';
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });

      track.addEventListener('mouseleave', () => {
        isDown = false;
        track.style.cursor = 'grab';
      });

      track.addEventListener('mouseup', () => {
        isDown = false;
        track.style.cursor = 'grab';
      });

      track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2;
        track.scrollLeft = scrollLeft - walk;
      });

      // Keyboard navigation (reinicia autoplay tras interacción)
      carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && current > 0) {
          e.preventDefault();
          scrollToIndex(current - 1);
          stopAutoplay();
          startAutoplay();
        } else if (e.key === 'ArrowRight' && current < cards.length - 1) {
          e.preventDefault();
          scrollToIndex(current + 1);
          stopAutoplay();
          startAutoplay();
        }
      });

      // Autoplay opcional (desactivado por defecto)
      let autoplayTimer;
      function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
          if (current < cards.length - 1) {
            scrollToIndex(current + 1);
          } else {
            scrollToIndex(0);
          }
        }, 5000);
      }
      function stopAutoplay() {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      }
      
      // Pausar autoplay al entrar y reanudar al salir
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', () => {
        startAutoplay();
      });

      // Inicializar
      updateButtons();
      track.style.cursor = 'grab';
      // Asegurar que el carousel sea focusable para accesibilidad/teclado
      carousel.tabIndex = 0;

      // Iniciar autoplay por defecto
      startAutoplay();
    });
  }

  initTeamCarousels();

  // === ACCESSIBILITY: Skip link ===
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
      background: var(--yellow-primary);
      color: var(--black);
      padding: 8px 16px;
      text-decoration: none;
      font-weight: 700;
      z-index: 10000;
      border-radius: 0 0 4px 0;
    }
    .skip-link:focus {
      top: 0;
    }
  `;
  document.head.appendChild(skipStyle);

  // === CONSOLE MESSAGES ===
  console.log('%c¡Hola! 👋', 'font-size: 24px; font-weight: bold; color: #FFD700;');
  console.log('%c¿Buscando talento? En FEL Group transformamos equipos.', 'font-size: 14px; color: #666;');
  console.log('%cContacto: contacto@felgroup.cl', 'font-size: 12px; color: #999;');
  console.log('%c✓ FEL Group website initialized', 'color: #10b981; font-weight: bold;');

});

// === ERROR HANDLING ===
window.addEventListener('error', (e) => {
  console.error('Error detectado:', e.message);
});