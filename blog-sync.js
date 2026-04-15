// blog-sync.js
// blog/<parent>/*.md 파일을 읽어 blog/data.js를 재생성합니다.
// 사용법: node blog-sync.js

const fs   = require('fs');
const path = require('path');

const blogDir  = path.join(__dirname, 'blog');
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

const mdFiles = collectMdFiles(blogDir).sort();

if (mdFiles.length === 0) {
  console.log('No .md files found.');
  process.exit(0);
}

const entries = mdFiles.map(filePath => {
  const slug    = path.relative(blogDir, filePath).replace(/\.md$/, '').replace(/\\/g, '/');
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
console.log(`✓ blog/data.js updated (${mdFiles.length} posts)`);
mdFiles.forEach(f => console.log(`  - ${path.relative(blogDir, f)}`));
