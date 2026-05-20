'use strict';

function buildTOC() {
  const headings = Array.from(document.querySelectorAll('.md-body h1, .md-body h2, .md-body h3'));
  if (headings.length < 1) return;

  // ─── Assign IDs ──────────────────────────────────
  headings.forEach((h, i) => {
    if (!h.id) {
      const slug = h.textContent.trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-') || `section-${i}`;
      h.id = slug;
    }
  });

  // ─── Build DOM ───────────────────────────────────
  const toc = document.createElement('nav');
  toc.className = 'toc-sidebar';
  toc.setAttribute('aria-label', 'Table of contents');

  const label = document.createElement('div');
  label.className = 'toc-label';
  label.textContent = 'Contents';
  toc.appendChild(label);

  const links = [];
  const groupMap = new Map(); // id → .toc-group (for active state)
  let currentGroup = null;
  let currentH3Container = null;

  headings.forEach(h => {
    if (h.tagName === 'H1' || h.tagName === 'H2') {
      currentGroup = document.createElement('div');
      currentGroup.className = 'toc-group';

      const a = document.createElement('a');
      a.className = h.tagName === 'H1' ? 'toc-link toc-link--h1' : 'toc-link toc-link--h2';
      a.href = `#${h.id}`;
      a.textContent = h.textContent.trim();
      a.title = h.textContent.trim();
      currentGroup.appendChild(a);
      links.push(a);
      groupMap.set(h.id, currentGroup);

      currentH3Container = document.createElement('div');
      currentH3Container.className = 'toc-group-h3';
      currentGroup.appendChild(currentH3Container);

      toc.appendChild(currentGroup);

    } else if (h.tagName === 'H3') {
      if (!currentH3Container) {
        currentGroup = document.createElement('div');
        currentGroup.className = 'toc-group';
        currentH3Container = document.createElement('div');
        currentH3Container.className = 'toc-group-h3';
        currentGroup.appendChild(currentH3Container);
        toc.appendChild(currentGroup);
      }
      const a = document.createElement('a');
      a.className = 'toc-link toc-link--h3';
      a.href = `#${h.id}`;
      a.textContent = h.textContent.trim();
      a.title = h.textContent.trim();
      currentH3Container.appendChild(a);
      links.push(a);
      groupMap.set(h.id, currentGroup);
    }
  });

  document.body.appendChild(toc);
  requestAnimationFrame(() => toc.classList.add('visible'));

  // ─── Dynamic top positioning ──────────────────────
  const mdBody = document.querySelector('.md-body');
  function updateTocTop() {
    if (!mdBody) return;
    const bodyTop = mdBody.getBoundingClientRect().top;
    const centerTop = window.innerHeight / 2 - toc.offsetHeight / 2;
    toc.style.top = Math.max(centerTop, bodyTop) + 'px';
  }
  updateTocTop();
  window.addEventListener('scroll', updateTocTop, { passive: true });
  window.addEventListener('resize', updateTocTop, { passive: true });

  // ─── Smooth scroll ────────────────────────────────
  toc.addEventListener('click', e => {
    const link = e.target.closest('.toc-link');
    if (!link) return;
    e.preventDefault();
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ─── Active state via IntersectionObserver ────────
  const linkMap = Object.fromEntries(links.map(a => [a.getAttribute('href').slice(1), a]));
  let activeId = null;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (activeId) {
          linkMap[activeId]?.classList.remove('active');
          groupMap.get(activeId)?.classList.remove('has-active');
        }
        activeId = entry.target.id;
        linkMap[activeId]?.classList.add('active');
        groupMap.get(activeId)?.classList.add('has-active');
      }
    });
  }, { rootMargin: '-8% 0px -80% 0px', threshold: 0 });

  headings.forEach(h => observer.observe(h));
}
