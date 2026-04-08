'use strict';

// ─── Nav scroll effect ────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── Gallery fade-in on scroll ────────────────────────
const items = document.querySelectorAll('.gallery-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const item = entry.target;
      const delay = item.dataset.delay || 0;
      setTimeout(() => item.classList.add('visible'), delay);
      observer.unobserve(item);
    }
  });
}, { threshold: 0.1 });

items.forEach((item, i) => {
  item.dataset.delay = i * 80;
  observer.observe(item);
});

// ─── Placeholder on image load error ─────────────────
items.forEach((item) => {
  const img = item.querySelector('img');
  if (!img) return;

  img.addEventListener('error', () => {
    img.classList.add('no-image');
    item.classList.add('placeholder-bg');
  });

  // If already broken (cached)
  if (img.complete && !img.naturalWidth) {
    img.classList.add('no-image');
    item.classList.add('placeholder-bg');
  }
});

