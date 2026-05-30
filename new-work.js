// new-work.js
// 사용법: node new-work.js "<title>" "<slug>" "<category>" "<tools>"
// 예시:   node new-work.js "My Project" "my-project" "Game Art" "Houdini, Unreal Engine"

const fs   = require('fs');
const path = require('path');

const [,, title, slug, category, tools] = process.argv;

if (!title || !slug || !category || !tools) {
  console.error('Usage: node new-work.js "<title>" "<slug>" "<category>" "<tools>"');
  process.exit(1);
}

const dir  = path.join(__dirname, 'works', slug);
const file = path.join(dir, 'main.md');

if (fs.existsSync(file)) {
  console.error(`이미 존재: ${file}`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });

const today = new Date();
const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}`;

fs.writeFileSync(file, `---
title:     ${title}
category:  ${category}
thumbnail: thumb.jpg
date:      ${dateStr}
tools:     ${tools}
featured:
order:
draft:     true
link:
---
`, 'utf8');

console.log(`✓ 생성 완료: works/${slug}/main.md`);
