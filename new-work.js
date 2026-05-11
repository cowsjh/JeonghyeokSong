// new-work.js
// 사용법: node new-work.js "<title>" "<slug>" "<category>" "<tools>" "<featured>" "<link>"
// 예시:   node new-work.js "My Project" "my-project" "Game Art" "Houdini, Unreal Engine" "false" ""

const fs   = require('fs');
const path = require('path');

const [,, title, slug, category, tools, featured, link] = process.argv;

if (!title || !slug || !category || !tools || !featured) {
  console.error('Usage: node new-work.js "<title>" "<slug>" "<category>" "<tools>" "<featured>" "<link>"');
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

const linkLine = link ? `link:      ${link}` : `link:      `;

fs.writeFileSync(file, `---
title:     ${title}
category:  ${category}
thumbnail: thumb.jpg
date:      ${dateStr}
tools:     ${tools}
featured:  ${featured}
draft:     true
${linkLine}
---
`, 'utf8');

console.log(`✓ 생성 완료: works/${slug}/main.md`);
