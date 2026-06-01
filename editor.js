// editor.js — 로컬 웹사이트 에디터 서버 (무의존 Node)
// 실행: node editor.js  →  http://localhost:4000
// works/notes 글 생성·수정, 이미지 업로드, sync, git 커밋·푸시를 브라우저에서.

'use strict';

const http = require('http');
const fs   = require('fs');
const path = require('path');
const { execFile, exec } = require('child_process');

const ROOT = __dirname;
const PORT = 4000;

const WORKS_DIR = path.join(ROOT, 'works');
const NOTES_DIR = path.join(ROOT, 'notes');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md':   'text/plain; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
  '.avif': 'image/avif',
  '.svg':  'image/svg+xml',
  '.mp4':  'video/mp4',
};
const IMG_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.svg', '.mp4']);

// ─── frontmatter 파싱 (works-sync.js와 동일 방식) ───
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

// slug에 .. 같은 경로 탈출이 없는지 검증
function safeSlug(slug) {
  return typeof slug === 'string' && slug.length > 0 &&
    !slug.split(/[\\/]/).some(p => p === '..' || p === '');
}

// type+slug → { dir, md }
function resolvePaths(type, slug) {
  if (!safeSlug(slug)) return null;
  const base = type === 'work' ? WORKS_DIR : NOTES_DIR;
  const dir  = path.join(base, slug);
  return { dir, md: path.join(dir, 'main.md') };
}

// ─── /api/list ───
function buildList() {
  const works = [];
  const workCategories = new Set();

  if (fs.existsSync(WORKS_DIR)) {
    for (const e of fs.readdirSync(WORKS_DIR, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const md = path.join(WORKS_DIR, e.name, 'main.md');
      if (!fs.existsSync(md)) continue;
      const meta = parseFrontmatter(fs.readFileSync(md, 'utf8'));
      const tools = (meta.tools || '').split(',').map(t => t.trim()).filter(Boolean);
      works.push({ slug: e.name, title: meta.title || e.name, category: meta.category || '', tools, draft: meta.draft === 'true' });
      if (meta.category) workCategories.add(meta.category);
    }
  }

  const notes = [];
  const noteCategories = new Set();

  if (fs.existsSync(NOTES_DIR)) {
    for (const parent of fs.readdirSync(NOTES_DIR, { withFileTypes: true })) {
      if (!parent.isDirectory()) continue;
      const parentDir = path.join(NOTES_DIR, parent.name);
      noteCategories.add(parent.name);
      for (const child of fs.readdirSync(parentDir, { withFileTypes: true })) {
        if (!child.isDirectory()) continue;
        const md = path.join(parentDir, child.name, 'main.md');
        if (!fs.existsSync(md)) continue;
        const meta = parseFrontmatter(fs.readFileSync(md, 'utf8'));
        const tags = (meta.tags || '').split(',').map(t => t.trim()).filter(Boolean);
        notes.push({
          slug: `${parent.name}/${child.name}`,
          title: meta.title || child.name,
          category: parent.name,
          tags,
          draft: meta.draft === 'true',
        });
      }
    }
  }

  works.sort((a, b) => a.title.localeCompare(b.title));
  notes.sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    works, notes,
    workCategories: [...workCategories].sort(),
    noteCategories: [...noteCategories].sort(),
  };
}

// ─── 폴더 내 미디어 목록 ───
function listMedia(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => IMG_EXTS.has(path.extname(f).toLowerCase()))
    .sort();
}

// ─── child_process 헬퍼 (Promise) ───
function run(cmd, args, opts = {}) {
  return new Promise(resolve => {
    execFile(cmd, args, { cwd: ROOT, ...opts }, (err, stdout, stderr) => {
      resolve({ ok: !err, code: err ? (err.code ?? 1) : 0, stdout: stdout || '', stderr: stderr || '' });
    });
  });
}

// ─── 응답 헬퍼 ───
function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// ─── 정적 파일 서빙 (웹사이트 루트 전체 — 미리보기 이미지 포함) ───
function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath.split('?')[0]);
  if (rel === '/') rel = '/editor.html';
  const filePath = path.join(ROOT, rel);
  // 루트 밖 접근 차단
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

// ─── 라우터 ───
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;

  try {
    // GET /api/list
    if (req.method === 'GET' && p === '/api/list') {
      return sendJson(res, 200, buildList());
    }

    // GET /api/file?type=&slug=
    if (req.method === 'GET' && p === '/api/file') {
      const type = url.searchParams.get('type');
      const slug = url.searchParams.get('slug');
      const rp = resolvePaths(type, slug);
      if (!rp || !fs.existsSync(rp.md)) return sendJson(res, 404, { error: 'not found' });
      return sendJson(res, 200, {
        content: fs.readFileSync(rp.md, 'utf8'),
        media: listMedia(rp.dir),
      });
    }

    // POST /api/save  { type, slug, content }
    if (req.method === 'POST' && p === '/api/save') {
      const body = JSON.parse((await readBody(req)).toString('utf8'));
      const rp = resolvePaths(body.type, body.slug);
      if (!rp) return sendJson(res, 400, { error: 'bad slug' });
      fs.mkdirSync(rp.dir, { recursive: true });
      fs.writeFileSync(rp.md, body.content, 'utf8');
      const script = body.type === 'work' ? 'works-sync.js' : 'blog-sync.js';
      const r = await run('node', [script]);
      return sendJson(res, 200, { ok: r.ok, output: (r.stdout + r.stderr).trim() });
    }

    // POST /api/create  { type, title, slug, category, tools|tags }
    if (req.method === 'POST' && p === '/api/create') {
      const b = JSON.parse((await readBody(req)).toString('utf8'));
      let r, slug;
      if (b.type === 'work') {
        slug = b.slug;
        r = await run('node', ['new-work.js', b.title, b.slug, b.category, b.tools || '']);
      } else {
        slug = `${b.category}/${b.slug}`;
        r = await run('node', ['new-note.js', b.title, b.category, b.slug, b.tags || '']);
      }
      if (!r.ok) return sendJson(res, 400, { error: (r.stdout + r.stderr).trim() });
      return sendJson(res, 200, { ok: true, slug, output: (r.stdout + r.stderr).trim() });
    }

    // POST /api/upload?type=&slug=&name=   (body: 파일 raw 바이트)
    if (req.method === 'POST' && p === '/api/upload') {
      const type = url.searchParams.get('type');
      const slug = url.searchParams.get('slug');
      const name = path.basename(url.searchParams.get('name') || '');
      const rp = resolvePaths(type, slug);
      if (!rp || !name) return sendJson(res, 400, { error: 'bad request' });
      fs.mkdirSync(rp.dir, { recursive: true });
      const data = await readBody(req);
      fs.writeFileSync(path.join(rp.dir, name), data);
      return sendJson(res, 200, { ok: true, name });
    }

    // GET /api/status
    if (req.method === 'GET' && p === '/api/status') {
      const st = await run('git', ['status', '--porcelain']);
      const ahead = await run('git', ['rev-list', '--count', '@{upstream}..HEAD']);
      const changed = st.stdout.split('\n').filter(l => l.trim()).length;
      return sendJson(res, 200, {
        changed,
        unpushed: ahead.ok ? parseInt(ahead.stdout.trim(), 10) || 0 : null,
        detail: st.stdout.trim(),
      });
    }

    // POST /api/publish  { message }
    if (req.method === 'POST' && p === '/api/publish') {
      const b = JSON.parse((await readBody(req)).toString('utf8'));
      const msg = (b.message || '').trim() || 'update content';
      const add = await run('git', ['add', '-A']);
      if (!add.ok) return sendJson(res, 500, { error: 'git add 실패', output: add.stderr });
      const commit = await run('git', ['commit', '-m', msg]);
      // "nothing to commit"이면 push만 시도
      const push = await run('git', ['push']);
      const output = ['$ git add -A', add.stdout,
        '$ git commit', commit.stdout, commit.stderr,
        '$ git push', push.stdout, push.stderr].filter(s => s && s.trim()).join('\n');
      return sendJson(res, 200, { ok: push.ok, output: output.trim() });
    }

    // 그 외 → 정적 파일
    if (req.method === 'GET') return serveStatic(req, res, p);

    res.writeHead(405); res.end('Method not allowed');
  } catch (err) {
    sendJson(res, 500, { error: String(err && err.message || err) });
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`✏️  Website Editor → ${url}`);
  console.log('   (이 창을 닫거나 Ctrl+C 로 종료)');
  // 서버가 준비된 시점에 기본 브라우저 자동 오픈
  const open = process.platform === 'win32' ? `start "" "${url}"`
             : process.platform === 'darwin' ? `open "${url}"`
             : `xdg-open "${url}"`;
  exec(open);
});
