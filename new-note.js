// new-note.js
// 사용법: node new-note.js "<title>" "<category>" "<slug>" "<tags>"
// 예시:   node new-note.js "Shaping Functions" "ComputerGraphics" "shapingFunctions" "code"

const fs   = require('fs');
const path = require('path');

const [,, title, category, slug, tags] = process.argv;

if (!title || !category || !slug || !tags) {
  console.error('Usage: node new-note.js "<title>" "<category>" "<slug>" "<tags>"');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const dir   = path.join(__dirname, 'notes', category, slug);
const file  = path.join(dir, 'main.md');

if (fs.existsSync(file)) {
  console.error(`이미 존재: ${file}`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(file, `---
title:    ${title}
date:     ${today}
tags:     ${tags}
featured: false
draft:    true
---
`, 'utf8');

console.log(`✓ 생성 완료: notes/${category}/${slug}/main.md`);
