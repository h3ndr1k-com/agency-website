import './style.css'
import './layout.css'

document.addEventListener('DOMContentLoaded', () => {
  // Navbar Scrolled State
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Scroll Reveal Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add the reveal class and observe elements
  const revealElements = document.querySelectorAll('.section-header, .glass-card, .hero-title, .hero-desc, .hero-actions');
  revealElements.forEach((el, index) => {
    el.classList.add('reveal');

    // Add staggered delay for grid items if they are siblings (rough approximation)
    if (el.classList.contains('glass-card')) {
      el.style.transitionDelay = `${(index % 3) * 0.15}s`;
    }

    observer.observe(el);
  });
});
