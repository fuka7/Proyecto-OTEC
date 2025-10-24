// Mobile Menu
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navbar = document.getElementById('navbar');

navToggle.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !isExpanded);
  mobileMenu.classList.toggle('active');
  mobileMenu.setAttribute('aria-hidden', isExpanded);
  document.body.style.overflow = isExpanded ? '' : 'hidden';
});

// Navbar Scroll
const handleScroll = () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleScroll);

// Animate on Scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
};

// Stats Counter Animation
const animateStats = () => {
  const stats = document.querySelectorAll('.stat-item');
  
  stats.forEach(stat => {
    const target = parseInt(stat.dataset.count);
    const numberEl = stat.querySelector('.stat-number');
    let current = 0;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const increment = Math.ceil(target / 50); // Adjust speed here
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            numberEl.textContent = target + '+';
            clearInterval(timer);
          } else {
            numberEl.textContent = current;
          }
        }, 30);
        observer.unobserve(stat);
      }
    }, { threshold: 0.5 });
    
    observer.observe(stat);
  });
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  animateOnScroll();
  animateStats();
  handleScroll();
});