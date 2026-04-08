'use strict';

// ─── Nav scroll effect ────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── Post card fade-in on scroll ─────────────────────
const cards = document.querySelectorAll('.post-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const delay = card.dataset.delay || 0;
      setTimeout(() => card.classList.add('visible'), delay);
      observer.unobserve(card);
    }
  });
}, { threshold: 0.1 });

cards.forEach((card, i) => {
  card.dataset.delay = i * 100;
  observer.observe(card);
});

// ─── Placeholder on image load error ─────────────────
cards.forEach((card) => {
  const thumb = card.querySelector('.post-thumb');
  const img = thumb ? thumb.querySelector('img') : null;
  if (!img) return;

  const setPlaceholder = () => {
    thumb.classList.add('placeholder');
    thumb.dataset.title = img.alt;
  };

  img.addEventListener('error', setPlaceholder);

  if (img.complete && !img.naturalWidth) setPlaceholder();
});
