// blog-sync.js
// blog/<parent>/*.md 파일을 읽어 notes/data.js를 재생성합니다.
// 사용법: node blog-sync.js

const fs   = require('fs');
const path = require('path');

const blogDir  = path.join(__dirname, 'notes');
const dataFile = path.join(blogDir, 'data.js');

// 서브디렉터리 안의 .md 파일을 재귀로 수집
function collectMdFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMdFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

// 플랫 구조(notes/<parent>/<slug>.md)를 서브폴더 구조로 이동
function migrateFlatFiles(dir) {
  for (const parent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!parent.isDirectory()) continue;
    const parentDir = path.join(dir, parent.name);
    for (const entry of fs.readdirSync(parentDir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      const slug = entry.name.replace(/\.md$/, '');
      const targetDir = path.join(parentDir, slug);
      const targetFile = path.join(targetDir, 'main.md');
      fs.mkdirSync(targetDir, { recursive: true });
      fs.renameSync(path.join(parentDir, entry.name), targetFile);
      console.log(`  → 이동: ${parent.name}/${entry.name} → ${parent.name}/${slug}/main.md`);
    }
  }
}

migrateFlatFiles(blogDir);

const mdFiles = collectMdFiles(blogDir).sort();

if (mdFiles.length === 0) {
  console.log('No .md files found.');
  process.exit(0);
}

const entries = mdFiles.map(filePath => {
  let slug = path.relative(blogDir, filePath).replace(/\.md$/, '').replace(/\\/g, '/');
  // Collapse "parent/slug/slug" or "parent/slug/main" → "parent/slug"
  const parts = slug.split('/');
  const last = parts[parts.length - 1];
  if (parts.length >= 2 && (last === parts[parts.length - 2] || last === 'main')) {
    slug = parts.slice(0, -1).join('/');
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const escaped = content.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  return `  '${slug}': \`${escaped}\``;
});

const output = [
  '// Auto-synced from blog/**/*.md — do not edit directly.',
  '// Edit the corresponding .md file, then run: node blog-sync.js',
  'window.BLOG = {',
  entries.join(',\n\n'),
  '};',
  '',
].join('\n');

fs.writeFileSync(dataFile, output, 'utf8');
console.log(`✓ notes/data.js updated (${mdFiles.length} posts)`);
mdFiles.forEach(f => console.log(`  - ${path.relative(blogDir, f)}`));
