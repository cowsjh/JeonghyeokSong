// works-sync.js
// works/<slug>/<slug>.md 파일을 읽어 index.html 카드와 works/data.js를 재생성합니다.
// 사용법: node works-sync.js

const fs   = require('fs');
const path = require('path');

const worksDir  = path.join(__dirname, 'works');
const indexFile = path.join(__dirname, 'index.html');
const dataFile  = path.join(worksDir, 'data.js');

const START_MARKER = '<!-- WORKS-SYNC-START -->';
const END_MARKER   = '<!-- WORKS-SYNC-END -->';

// frontmatter 파싱
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const meta = {};
  m[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx > 0) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  });
  return meta;
}

// 툴 이름에서 버전 번호 제거 ("Houdini 21.0" → "Houdini")
function stripVersion(tool) {
  return tool.replace(/\s+\d[\d.]*$/, '').trim();
}

// works/<slug>/ 서브폴더 탐색
const slugs = fs.readdirSync(worksDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

if (slugs.length === 0) {
  console.log('No subdirectories found in works/');
  process.exit(0);
}

// 파싱 + 날짜순 정렬 (최신순)
const works = slugs
  .map(slug => {
    const mdPath = path.join(worksDir, slug, `${slug}.md`);
    if (!fs.existsSync(mdPath)) return null;
    const content = fs.readFileSync(mdPath, 'utf8');
    const meta    = parseFrontmatter(content);
    return { slug, content, ...meta };
  })
  .filter(w => w && w.title && w.thumbnail)
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

// ─── index.html 카드 생성 ───────────────────────
function generateCard(work) {
  const tools = [...new Set((work.tools || '')
    .split(',')
    .map(t => stripVersion(t.trim()))
    .filter(Boolean))];

  const featured = work.featured === 'true';
  const desc = (work.description || '').trim();
  return [
    `        <a class="post-card" href="work.html?id=${work.slug}" data-category="${work.category || ''}" data-tools="${tools.join(',')}" data-date="${work.date || ''}" data-featured="${featured}"${desc ? ` data-desc="${desc}"` : ''}>`,
    `          <div class="post-thumb">`,
    `            <img src="${work.thumbnail}" alt="${work.title}" loading="lazy">`,
    `          </div>`,
    `          <div class="post-info">`,
    `            <span class="post-category">${work.category || ''}</span>`,
    `            <h3 class="post-title">${work.title}</h3>`,
    work.date ? `            <span class="post-date">${work.date}</span>` : '',
    `          </div>`,
    `        </a>`,
  ].filter(Boolean).join('\n');
}

const cardsHtml = works.map(generateCard).join('\n\n');

let html = fs.readFileSync(indexFile, 'utf8');
const startIdx = html.indexOf(START_MARKER);
const endIdx   = html.indexOf(END_MARKER);

if (startIdx === -1 || endIdx === -1) {
  console.error('Error: WORKS-SYNC markers not found in index.html');
  process.exit(1);
}

html =
  html.slice(0, startIdx + START_MARKER.length) +
  '\n' + cardsHtml + '\n' +
  html.slice(endIdx);

fs.writeFileSync(indexFile, html, 'utf8');

// ─── works/data.js 생성 ─────────────────────────
const entries = works.map(({ slug, content }) => {
  const escaped = content.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  return `  '${slug}': \`${escaped}\``;
});

const output = [
  '// Auto-synced from works/<slug>/<slug>.md — do not edit directly.',
  '// Edit the corresponding .md file, then run: node works-sync.js',
  'window.WORKS = {',
  entries.join(',\n\n'),
  '};',
  '',
].join('\n');

fs.writeFileSync(dataFile, output, 'utf8');

console.log(`✓ index.html updated (${works.length} works)`);
console.log(`✓ works/data.js updated`);
works.forEach(w => {
  const tools = (w.tools || '').split(',').map(t => stripVersion(t.trim())).filter(Boolean);
  console.log(`  - ${w.slug} [${w.category}] [${tools.join(', ')}]`);
});
