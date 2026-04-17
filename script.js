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

// ─── Tab switching ────────────────────────────────────
function activateTab(name, animate = false) {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === name);
  });
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === 'tab-' + name);
  });
  // URL에 탭 상태 기록 (뒤로가기 복원용)
  const p = new URLSearchParams(location.search);
  p.set('tab', name);
  if (name === 'works') ['parent', 'child', 'year', 'tag'].forEach(k => p.delete(k));
  history.replaceState(null, '', location.pathname + '?' + p.toString());
  // 탭 전환 시 카드 재애니메이션
  if (animate && name === 'notes' && typeof window._reanimateNotes === 'function') {
    window._reanimateNotes();
  }
  if (animate && name === 'gallery' && typeof window._reanimateGallery === 'function') {
    window._reanimateGallery();
  }
  if (animate && name === 'works') {
    document.querySelectorAll('.post-card').forEach((c, i) => {
      c.classList.remove('visible');
      setTimeout(() => c.classList.add('visible'), i * 100);
    });
  }
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab, true));
});

// nav links with data-tab
document.querySelectorAll('[data-tab]').forEach(link => {
  if (link.tagName !== 'A') return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    activateTab(link.dataset.tab, true);
    document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
  });
});

// hash on load (#works or #notes or #gallery) — or ?tab= / ?tag= / ?parent= from URL state
(function () {
  const params = new URLSearchParams(location.search);
  const tab  = params.get('tab');
  const hash = location.hash.replace('#', '');
  if      (tab === 'works' || tab === 'notes' || tab === 'gallery') activateTab(tab);
  else if (hash === 'works' || hash === 'notes' || hash === 'gallery') activateTab(hash);
  else if (params.get('tag') || params.get('parent')) activateTab('notes');
})();

// ─── 공유 유틸 ────────────────────────────────────────
function makeFilterBtn(label, onClick) {
  const btn = document.createElement('button');
  btn.className = 'filter-btn';
  btn.dataset.filter = label;
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  return btn;
}

// ─── Works: 플랫 필터 (category | tools) ─────────────
(function () {
  const filterBar = document.getElementById('works-filters');
  if (!filterBar) return;

  const postCards = [...document.querySelectorAll('.post-card')];
  const activeFilters = new Set();

  // 카테고리/툴 수집
  const categories = [...new Set(postCards.map(c => c.dataset.category).filter(Boolean))].sort();
  const toolSet    = new Set();
  postCards.forEach(c => {
    (c.dataset.tools || '').split(',').map(t => t.trim()).filter(Boolean).forEach(t => toolSet.add(t));
  });
  const tools = [...toolSet].sort();

  function applyFilter() {
    postCards.forEach(card => {
      if (!activeFilters.size) { card.style.display = ''; return; }
      const cardTools = (card.dataset.tools || '').split(',').map(t => t.trim());
      const match = [...activeFilters].some(f =>
        card.dataset.category === f || cardTools.includes(f)
      );
      card.style.display = match ? '' : 'none';
    });
  }

  function onBtnClick(label) {
    activeFilters.has(label) ? activeFilters.delete(label) : activeFilters.add(label);
    filterBar.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.toggle('active', activeFilters.has(b.dataset.filter));
    });
    applyFilter();
  }

  // 카테고리 버튼
  categories.forEach(cat => filterBar.appendChild(makeFilterBtn(cat, () => onBtnClick(cat))));

  // 구분선
  if (categories.length && tools.length) {
    const sep = document.createElement('span');
    sep.className = 'filter-sep';
    sep.textContent = '|';
    filterBar.appendChild(sep);
  }

  // 툴 버튼
  tools.forEach(tool => filterBar.appendChild(makeFilterBtn(tool, () => onBtnClick(tool))));
})();

// ─── Notes: load blog/data.js and render cards ────────
(function () {
  const grid         = document.getElementById('notes-grid');
  const filterBar    = document.getElementById('notes-filters');
  const subFilterBar = document.getElementById('notes-subfilters');
  const modeBar      = document.getElementById('notes-mode-bar');
  if (!grid) return;

  let tagMode   = 'OR'; // 'OR' | 'AND'
  let seriesMap = {};

  function parseFrontmatter(text) {
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!m) return { title: '', date: '', tags: [] };
    const meta = {};
    m[1].split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx > 0) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    });
    return {
      title:  meta.title  || '',
      date:   meta.date   || '',
      tags:   meta.tags   ? meta.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [],
      series: meta.series || '',
    };
  }

  function buildCards(entries, filters, page = 0, animate = true) {
    const { years, children, parent: filterParent } = filters;
    grid.innerHTML = '';

    const filtered = entries.filter(({ date, parent, tags }) => {
      if (filterParent && !parent.includes(filterParent)) return false;
      if (years.size > 0 && !years.has(date.slice(0, 4))) return false;
      if (children.size > 0) {
        const match = tagMode === 'AND'
          ? [...children].every(t => tags.includes(t))
          : tags.some(t => children.has(t));
        if (!match) return false;
      }
      return true;
    });

    const PAGE_SIZE = 24;
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages - 1);
    const pageEntries = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

    let i = 0;
    pageEntries.forEach(({ slug, title, date, tags, series }) => {
      const tagPills = tags.map(t => `<span class="note-tag">${t}</span>`).join('');
      const seriesBadge = series
        ? (() => {
            const slugs = seriesMap[series] || [];
            const part  = slugs.indexOf(slug) + 1;
            const total = slugs.length;
            return `<span class="note-series-badge">&#9679; ${series} ${part} / ${total}</span>`;
          })()
        : '';
      const card = document.createElement('a');
      card.className = 'note-card';
      card.href = `blog.html?id=${slug}`;
      card.dataset.tags = tags.join(',');
      card.innerHTML = `
        ${tags.length ? `<div class="note-tags">${tagPills}</div>` : ''}
        ${seriesBadge}
        <h3 class="note-title">${title}</h3>
        ${date ? `<span class="note-date">${date.replace(/-/g, '.')}</span>` : ''}
      `;
      card.dataset.delay = i * 40;
      grid.appendChild(card);
      i++;
    });

    // 페이지네이션
    if (totalPages > 1) {
      const pager = document.createElement('div');
      pager.className = 'notes-pager';

      const prev = document.createElement('button');
      prev.className = 'notes-pager-btn';
      prev.textContent = '←';
      prev.disabled = safePage === 0;
      prev.addEventListener('click', () => buildCards(entries, filters, safePage - 1));

      const info = document.createElement('span');
      info.className = 'notes-pager-info';
      info.textContent = `${safePage + 1} / ${totalPages}`;

      const next = document.createElement('button');
      next.className = 'notes-pager-btn';
      next.textContent = '→';
      next.disabled = safePage === totalPages - 1;
      next.addEventListener('click', () => buildCards(entries, filters, safePage + 1));

      pager.append(prev, info, next);
      grid.appendChild(pager);
    }

    // fade-in (유저 액션일 때만, 복원/새로고침은 즉시 표시)
    if (animate) {
      const noteObserver = new IntersectionObserver((obs) => {
        obs.forEach(e => {
          if (e.isIntersecting) {
            const c = e.target;
            setTimeout(() => c.classList.add('visible'), Number(c.dataset.delay) || 0);
            noteObserver.unobserve(c);
          }
        });
      }, { threshold: 0.05 });
      grid.querySelectorAll('.note-card').forEach(c => noteObserver.observe(c));
    } else {
      grid.querySelectorAll('.note-card').forEach(c => c.classList.add('visible'));
    }
  }

  const makeBtn = makeFilterBtn;

  function buildFilters(entries, opts = {}) {
    const initTag      = opts.initTag      || null;
    const initParent   = opts.initParent   || null;
    const initChildren = opts.initChildren || [];
    const initYears    = opts.initYears    || [];

    // 상위 태그 목록 (entries에서 동적 수집)
    const allParents = [...new Set(entries.flatMap(e => e.parent))].sort();
    const isInitialParent = allParents.includes(initTag);

    // 상태 초기화 (URL 복원 우선, 없으면 initTag fallback)
    const activeYears    = new Set(initYears);
    let activeParent     = initParent || (initTag ? (isInitialParent ? initTag : null) : null);
    const activeChildren = initChildren.length
      ? new Set(initChildren)
      : (initTag && !isInitialParent ? new Set([initTag]) : new Set());

    // 연도 추출 (내림차순)
    const years = [...new Set(
      entries.map(e => e.date.slice(0, 4)).filter(y => /^\d{4}$/.test(y))
    )].sort().reverse();

    // 기본 바: 연도 버튼 | 구분선 | 상위 태그 버튼들 (동적)
    filterBar.innerHTML = '';
    years.forEach(year => {
      filterBar.appendChild(makeBtn(year, () => {
        activeYears.has(year) ? activeYears.delete(year) : activeYears.add(year);
        refresh();
      }));
    });
    // 구분선
    if (years.length && allParents.length) {
      const sep = document.createElement('span');
      sep.className = 'filter-sep';
      sep.textContent = '|';
      filterBar.appendChild(sep);
    }
    allParents.forEach(parent => {
      filterBar.appendChild(makeBtn(parent, () => {
        if (activeParent === parent) {
          activeParent = null;
          activeChildren.clear();
          subFilterBar.classList.remove('open');
        } else {
          activeParent = parent;
          activeChildren.clear();
          updateSubBar();
          subFilterBar.classList.add('open');
        }
        refresh();
      }));
    });

    // 서브 바: activeParent에 속한 하위 태그만 수집 (빈도순)
    function updateSubBar() {
      const tagCount = {};
      entries
        .filter(e => !activeParent || e.parent.includes(activeParent))
        .forEach(({ tags }) => tags.forEach(t => {
          tagCount[t] = (tagCount[t] || 0) + 1;
        }));
      subFilterBar.innerHTML = '';
      Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .forEach(([tag]) => {
          subFilterBar.appendChild(makeBtn(tag, () => {
            activeChildren.has(tag) ? activeChildren.delete(tag) : activeChildren.add(tag);
            refresh();
          }));
        });
    }

    updateSubBar();

    // OR / AND 모드 토글 버튼
    if (modeBar) {
      modeBar.innerHTML = '';
      const modeBtn = document.createElement('button');
      modeBtn.className = 'tag-mode-btn';
      modeBtn.textContent = tagMode;
      modeBtn.addEventListener('click', () => {
        tagMode = tagMode === 'OR' ? 'AND' : 'OR';
        modeBtn.textContent = tagMode;
        modeBtn.classList.toggle('active', tagMode === 'AND');
        refresh();
      });
      modeBtn.classList.toggle('active', tagMode === 'AND');
      modeBar.appendChild(modeBtn);
    }

    // 초기 상태가 있으면 서브 바 열고 버튼 active 상태 적용 (애니메이션 없이)
    if (activeParent || activeChildren.size || activeYears.size) {
      if (activeParent || activeChildren.size) {
        subFilterBar.classList.add('no-transition', 'open');
        subFilterBar.getBoundingClientRect(); // force reflow → open 상태 확정
        subFilterBar.classList.remove('no-transition');
      }
      refresh(false);
    }

    function refresh(animate = true) {
      filterBar.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active',
          activeYears.has(b.dataset.filter) || b.dataset.filter === activeParent
        );
      });
      subFilterBar.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', activeChildren.has(b.dataset.filter));
      });
      buildCards(entries, { years: activeYears, children: activeChildren, parent: activeParent }, 0, animate);

      // 현재 필터 상태를 URL에 기록 (뒤로가기 복원용)
      const p = new URLSearchParams();
      p.set('tab', 'notes');
      if (activeParent) p.set('parent', activeParent);
      if (activeChildren.size) p.set('child', [...activeChildren].join(','));
      if (activeYears.size)    p.set('year',  [...activeYears].join(','));
      history.replaceState(null, '', location.pathname + '?' + p.toString());
      sessionStorage.setItem('notesFilterState', '?' + p.toString());
    }
  }

  const script = document.createElement('script');
  script.src = 'notes/data.js';
  script.onload = () => {
    if (!window.BLOG) { grid.innerHTML = ''; return; }

    const entries = Object.entries(window.BLOG).map(([slug, raw]) => {
      const { title, date, tags, series } = parseFrontmatter(raw);
      const parent = [slug.split('/')[0]]; // 폴더명 = 상위 태그
      return { slug, title, date, parent, tags, series };
    }).sort((a, b) => b.date.localeCompare(a.date));

    // 시리즈 맵 빌드 (slug 알파벳순)
    entries.forEach(e => {
      if (!e.series) return;
      if (!seriesMap[e.series]) seriesMap[e.series] = [];
      seriesMap[e.series].push(e.slug);
    });
    Object.values(seriesMap).forEach(slugs => slugs.sort());

    const params    = new URLSearchParams(location.search);
    const urlTag    = params.get('tag')    ? params.get('tag').toLowerCase()    : null;
    const urlParent = params.get('parent') || null;
    const urlChild  = params.get('child')  ? params.get('child').split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [];
    const urlYear   = params.get('year')   ? params.get('year').split(',').map(s => s.trim()).filter(Boolean)  : [];

    const hasState = urlTag || urlParent || urlChild.length || urlYear.length;

    buildFilters(entries, { initTag: urlTag, initParent: urlParent, initChildren: urlChild, initYears: urlYear });
    if (!hasState) buildCards(entries, { years: new Set(), children: new Set(), parent: null }, 0, false);

    if (hasState) {
      setTimeout(() => {
        document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };
  script.onerror = () => { grid.innerHTML = ''; };
  document.head.appendChild(script);

  // 탭 전환 시 카드 재애니메이션 (activateTab에서 호출)
  window._reanimateNotes = function () {
    let i = 0;
    grid.querySelectorAll('.note-card').forEach(c => {
      c.classList.remove('visible');
      const delay = i++ * 40;
      setTimeout(() => c.classList.add('visible'), delay);
    });
  };
})();

// ─── Gallery ──────────────────────────────────────────
(function () {
  const grid      = document.getElementById('gallery-grid');
  const filterBar = document.getElementById('gallery-filters');
  if (!grid) return;

  let allItems     = [];
  let filtered     = [];
  let activeCategory = null;

  function renderItems(items, animate = true) {
    grid.innerHTML = '';
    if (!items.length) {
      grid.innerHTML = '<p class="notes-loading">이미지가 없습니다.</p>';
      return;
    }
    const els = items.map((item, i) => {
      const el  = document.createElement('div');
      el.className    = 'gallery-item';
      el.dataset.index = String(i);
      const img = document.createElement('img');
      img.src     = item.src;
      img.alt     = item.title || item.category;
      img.loading = 'lazy';
      el.appendChild(img);
      el.addEventListener('click', () => openLightbox(i));
      grid.appendChild(el);
      return el;
    });

    if (animate) {
      // rAF 후 실제 x 좌표로 열 판별 (CSS columns 불균등 분배 대응)
      // getBoundingClientRect는 transform(-12px) 포함이므로 +12 보정
      requestAnimationFrame(() => {
        const gridLeft = grid.getBoundingClientRect().left;
        const colCount = parseInt(getComputedStyle(grid).columnCount) || 4;
        const colW     = grid.getBoundingClientRect().width / colCount;
        const byCol    = {};
        const colOf    = new Map();
        els.forEach(el => {
          const col = Math.max(0, Math.min(colCount - 1,
            Math.floor((el.getBoundingClientRect().left - gridLeft + 12) / colW)));
          colOf.set(el, col);
          (byCol[col] = byCol[col] || []).push(el);
        });
        els.forEach(el => {
          const col = colOf.get(el);
          const row = byCol[col].indexOf(el);
          setTimeout(() => el.classList.add('visible'), (col + row) * 55);
        });
      });
    } else {
      els.forEach(el => el.classList.add('visible'));
    }
  }

  function applyFilter(animate = true) {
    filtered = activeCategory
      ? allItems.filter(it => it.category === activeCategory)
      : allItems;
    renderItems(filtered, animate);
  }

  function buildFilters(items) {
    const cats = [...new Set(items.map(it => it.category).filter(Boolean))].sort();
    filterBar.innerHTML = '';
    cats.forEach(cat => {
      filterBar.appendChild(makeFilterBtn(cat, () => {
        activeCategory = activeCategory === cat ? null : cat;
        filterBar.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.filter === activeCategory);
        });
        applyFilter();
      }));
    });
  }

  const script = document.createElement('script');
  script.src = 'gallery/data.js';
  script.onload = () => {
    if (!window.GALLERY || !window.GALLERY.length) { grid.innerHTML = ''; return; }
    allItems = window.GALLERY;
    buildFilters(allItems);
    applyFilter(false);
  };
  script.onerror = () => { grid.innerHTML = ''; };
  document.head.appendChild(script);

  window._reanimateGallery = function () {
    renderItems(filtered, true);
  };

  // ─── Lightbox ───────────────────────────────────────
  const lb         = document.getElementById('lightbox');
  const lbImg      = lb.querySelector('.lightbox-img');
  const lbCaption  = lb.querySelector('.lightbox-caption');
  const lbClose    = lb.querySelector('.lightbox-close');
  const lbPrev     = lb.querySelector('.lightbox-prev');
  const lbNext     = lb.querySelector('.lightbox-next');
  const lbBackdrop = lb.querySelector('.lightbox-backdrop');
  let   lbIndex    = 0;

  function openLightbox(idx) {
    lbIndex = idx;
    showLbImage();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showLbImage() {
    const item = filtered[lbIndex];
    if (!item) return;
    lbImg.classList.add('loading');
    lbImg.onload = () => lbImg.classList.remove('loading');
    lbImg.src = item.src;
    lbImg.alt = item.title || item.category;
    lbCaption.textContent = item.title || '';
    lbPrev.style.visibility = lbIndex > 0 ? '' : 'hidden';
    lbNext.style.visibility = lbIndex < filtered.length - 1 ? '' : 'hidden';
  }

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => { if (lbIndex > 0) { lbIndex--; showLbImage(); } });
  lbNext.addEventListener('click', () => { if (lbIndex < filtered.length - 1) { lbIndex++; showLbImage(); } });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft'  && lbIndex > 0)                  { lbIndex--; showLbImage(); }
    if (e.key === 'ArrowRight' && lbIndex < filtered.length - 1) { lbIndex++; showLbImage(); }
  });
})();

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
