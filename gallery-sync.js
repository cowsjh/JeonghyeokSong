'use strict';
const fs   = require('fs');
const path = require('path');

const GALLERY_DIR  = path.join(__dirname, 'gallery');
const OUTPUT_FILE  = path.join(GALLERY_DIR, 'data.js');
const IMG_EXTS     = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

const items = [];

const categories = fs.readdirSync(GALLERY_DIR, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => e.name)
  .sort();

categories.forEach(cat => {
  const catDir = path.join(GALLERY_DIR, cat);
  const files  = fs.readdirSync(catDir)
    .filter(f => IMG_EXTS.has(path.extname(f).toLowerCase()))
    .sort();

  files.forEach(file => {
    items.push({
      src:      `gallery/${cat}/${file}`,
      category: cat,
      title:    '',
    });
  });
});

const json = JSON.stringify(items, null, 2);
const out  = [
  '// Auto-synced from gallery/**/* — do not edit directly.',
  '// Add images to gallery/<category>/ folders, then run: node gallery-sync.js',
  `window.GALLERY = ${json};`,
  '',
].join('\n');

fs.writeFileSync(OUTPUT_FILE, out, 'utf8');
console.log(`gallery/data.js updated — ${items.length} image(s) across [${categories.join(', ')}]`);
