// editor.js — 로컬 웹사이트 에디터 서버 (무의존 Node)
// 실행: node editor.js  →  http://localhost:4000
// works/notes 글 생성·수정, 이미지 업로드, sync, git 커밋·푸시를 브라우저에서.

'use strict';

const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');
const { execFile, exec } = require('child_process');

const ROOT = __dirname;
const PORT = 4000;

const WORKS_DIR = path.join(ROOT, 'works');
const NOTES_DIR = path.join(ROOT, 'notes');

// Deploy/status only consider content — not editor tools or config files.
const CONTENT_PATHS = ['works/', 'notes/', 'index.html'];

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
  const noteSeries = new Set();

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
        const series = (meta.series || '').trim();
        if (series) noteSeries.add(series);
        notes.push({
          slug: `${parent.name}/${child.name}`,
          title: meta.title || child.name,
          category: parent.name,
          tags,
          series,
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
    noteSeries: [...noteSeries].sort(),
  };
}

// ─── 폴더 내 미디어 목록 ───
function listMedia(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => IMG_EXTS.has(path.extname(f).toLowerCase()))
    .sort();
}

// ─── 검수: main.md의 이미지 참조 추출 (<>로 감싼 공백 파일명 포함) ───
function extractImageRefs(text) {
  const refs = [];
  const re = /!\[[^\]]*\]\(\s*(<[^>]+>|[^)\s]+)/g;
  let m;
  while ((m = re.exec(text))) {
    let u = m[1];
    if (u.startsWith('<') && u.endsWith('>')) u = u.slice(1, -1);
    refs.push(u.trim());
  }
  return refs;
}

// ─── 검수: URL 생존 확인 (헤더만 받고 본문 버림, 리다이렉트 추적) ───
// state: 'ok'(살아있음) | 'blocked'(봇 차단 등 — 브라우저에선 정상일 수 있음) | 'bad'(죽음/도달불가)
function urlState(sc) {
  if (sc >= 200 && sc < 400) return 'ok';
  if ([401, 403, 405, 429].includes(sc)) return 'blocked';
  return 'bad';
}
function checkUrl(u, redirectsLeft = 3) {
  return new Promise(resolve => {
    let target;
    try { target = new URL(u); } catch { return resolve({ url: u, status: 0, state: 'bad' }); }
    if (target.protocol !== 'http:' && target.protocol !== 'https:')
      return resolve({ url: u, status: 0, state: 'bad' });
    const lib = target.protocol === 'https:' ? https : http;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,*/*',
    };
    const req = lib.get(u, { timeout: 8000, headers }, r => {
      const sc = r.statusCode;
      if ([301, 302, 303, 307, 308].includes(sc) && r.headers.location && redirectsLeft > 0) {
        r.destroy();
        let next; try { next = new URL(r.headers.location, u).href; } catch { return resolve({ url: u, status: sc, state: 'bad' }); }
        return resolve(checkUrl(next, redirectsLeft - 1));
      }
      r.destroy();
      resolve({ url: u, status: sc, state: urlState(sc) });
    });
    req.on('timeout', () => { req.destroy(); resolve({ url: u, status: 0, state: 'bad' }); });
    req.on('error',   () => resolve({ url: u, status: 0, state: 'bad' }));
  });
}

// ─── 검수: 현재 글의 이미지·frontmatter·동영상·링크 종합 검사 ───
async function reviewContent(type, content, dir) {
  const meta = parseFrontmatter(content);

  // 1) 이미지 누락·잉여
  const refs = extractImageRefs(content).filter(r => !/^(https?:|data:)/i.test(r));
  if (type === 'work' && meta.thumbnail && !meta.thumbnail.includes('/')) refs.push(meta.thumbnail);
  const refsSet = new Set(refs);
  const media   = listMedia(dir);
  const missing = [...refsSet].filter(r => !fs.existsSync(path.join(dir, r)));
  const orphan  = media.filter(f => !refsSet.has(f));

  // 2) frontmatter 필수 필드
  const required = type === 'work'
    ? ['title', 'category', 'thumbnail', 'date', 'tools']
    : ['title', 'date', 'tags'];
  const fmMissing = required.filter(k => !meta[k] || !String(meta[k]).trim());
  const fmNotes = [];
  if (meta.draft === 'true') fmNotes.push('draft: true — excluded from sync, not published to the site');

  // 3) 동영상 50MB 초과
  const videos = media.filter(f => /\.(mp4|webm|mov)$/i.test(f)).map(f => {
    const mb = fs.statSync(path.join(dir, f)).size / (1024 * 1024);
    return { name: f, sizeMB: Math.round(mb * 10) / 10, ok: mb <= 50 };
  });

  // 4) 링크 생존
  const urls = new Set();
  if (meta.link && /^https?:/i.test(meta.link)) urls.add(meta.link.trim());
  for (const m of content.matchAll(/https?:\/\/[^\s)<>"'\]]+/g)) urls.add(m[0].replace(/[.,]+$/, ''));
  const links = await Promise.all([...urls].map(u => checkUrl(u)));

  return {
    images: { missing, orphan },
    frontmatter: { missing: fmMissing, notes: fmNotes },
    videos,
    links,
  };
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

    // POST /api/create  { type, title, slug, category, tools|tags, series }
    if (req.method === 'POST' && p === '/api/create') {
      const b = JSON.parse((await readBody(req)).toString('utf8'));
      let r, slug;
      if (b.type === 'work') {
        slug = b.slug;
        r = await run('node', ['new-work.js', b.title, b.slug, b.category, b.tools || '']);
      } else {
        slug = `${b.category}/${b.slug}`;
        r = await run('node', ['new-note.js', b.title, b.category, b.slug, b.tags || '', b.series || '']);
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

    // GET /api/review?type=&slug=
    if (req.method === 'GET' && p === '/api/review') {
      const type = url.searchParams.get('type');
      const slug = url.searchParams.get('slug');
      const rp = resolvePaths(type, slug);
      if (!rp || !fs.existsSync(rp.md)) return sendJson(res, 404, { error: 'not found' });
      const report = await reviewContent(type, fs.readFileSync(rp.md, 'utf8'), rp.dir);
      return sendJson(res, 200, report);
    }

    // POST /api/delete?type=&slug=&name=  (잉여 파일 삭제)
    if (req.method === 'POST' && p === '/api/delete') {
      const type = url.searchParams.get('type');
      const slug = url.searchParams.get('slug');
      const name = path.basename(url.searchParams.get('name') || '');
      const rp = resolvePaths(type, slug);
      if (!rp || !name) return sendJson(res, 400, { error: 'bad request' });
      const target = path.join(rp.dir, name);
      if (fs.existsSync(target)) fs.unlinkSync(target);
      return sendJson(res, 200, { ok: true });
    }

    // POST /api/delete-page?type=&slug=  (글 폴더 통째 삭제 + sync)
    if (req.method === 'POST' && p === '/api/delete-page') {
      const type = url.searchParams.get('type');
      const slug = url.searchParams.get('slug');
      const rp = resolvePaths(type, slug);
      if (!rp || !fs.existsSync(rp.dir)) return sendJson(res, 404, { error: 'not found' });
      fs.rmSync(rp.dir, { recursive: true, force: true });
      const script = type === 'work' ? 'works-sync.js' : 'blog-sync.js';
      const r = await run('node', [script]);
      return sendJson(res, 200, { ok: true, output: (r.stdout + r.stderr).trim() });
    }

    // POST /api/compress?type=&slug=&name=  (mp4 → 1080p h264 재인코딩, 원본 덮어쓰기)
    if (req.method === 'POST' && p === '/api/compress') {
      const type = url.searchParams.get('type');
      const slug = url.searchParams.get('slug');
      const name = path.basename(url.searchParams.get('name') || '');
      const rp = resolvePaths(type, slug);
      if (!rp || !name) return sendJson(res, 400, { error: 'bad request' });
      const input = path.join(rp.dir, name);
      if (!fs.existsSync(input)) return sendJson(res, 404, { error: 'file not found' });
      const tmp = path.join(rp.dir, '__compress_' + Date.now() + '.mp4');
      const before = fs.statSync(input).size;
      const r = await run('ffmpeg', [
        '-y', '-i', input,
        '-vf', 'scale=-2:min(1080\\,ih)',          // 1080p로 다운스케일(업스케일 안 함)
        '-c:v', 'libx264', '-crf', '23', '-preset', 'medium', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart',
        tmp,
      ], { maxBuffer: 1024 * 1024 * 20 });
      if (!r.ok || !fs.existsSync(tmp)) {
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        const msg = /ENOENT/.test(r.stderr) ? 'ffmpeg not found (check PATH)' : 'ffmpeg compression failed';
        return sendJson(res, 500, { error: msg, output: (r.stderr || r.stdout || '').slice(-1500) });
      }
      fs.copyFileSync(tmp, input);   // 원본 덮어쓰기
      fs.unlinkSync(tmp);
      const after = fs.statSync(input).size;
      const mb = b => Math.round(b / 1048576 * 10) / 10;
      return sendJson(res, 200, { ok: true, beforeMB: mb(before), afterMB: mb(after) });
    }

    // POST /api/open-vscode?type=&slug=
    if (req.method === 'POST' && p === '/api/open-vscode') {
      const type = url.searchParams.get('type');
      const slug = url.searchParams.get('slug');
      const paths = resolvePaths(type, slug);
      if (!paths) return sendJson(res, 400, { error: 'invalid slug' });
      const ps1 = path.join(require('os').tmpdir(), 'vscode_focus.ps1');
      // SetWindowPos(TOPMOST → NOTOPMOST) forces the window to the top of the
      // z-order regardless of Windows' foreground-lock — more reliable than
      // SetForegroundWindow alone. Retry briefly in case VS Code is still
      // spawning its window (cold start).
      fs.writeFileSync(ps1, `
Add-Type @"
using System; using System.Runtime.InteropServices;
public class W {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr after, int x, int y, int cx, int cy, uint flags);
}
"@
$TOPMOST = New-Object IntPtr(-1)
$NOTOPMOST = New-Object IntPtr(-2)
$FLAGS = [uint32](0x0040 -bor 0x0002 -bor 0x0001)  # SHOWWINDOW | NOMOVE | NOSIZE
for ($i = 0; $i -lt 20; $i++) {
  $p = Get-Process -Name 'Code' -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
  if ($p) {
    $h = $p.MainWindowHandle
    if ([W]::IsIconic($h)) { [void][W]::ShowWindow($h, 9) }   # restore if minimized
    [void][W]::SetWindowPos($h, $TOPMOST, 0, 0, 0, 0, $FLAGS)
    [void][W]::SetWindowPos($h, $NOTOPMOST, 0, 0, 0, 0, $FLAGS)
    [void][W]::SetForegroundWindow($h)
    break
  }
  Start-Sleep -Milliseconds 250
}
`);
      exec(`code "${paths.md}"`, () => {
        setTimeout(() => {
          exec(`powershell -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "${ps1}"`);
        }, 400);
      });
      return sendJson(res, 200, { ok: true });
    }

    // GET /api/status
    if (req.method === 'GET' && p === '/api/status') {
      const st = await run('git', ['status', '--porcelain', '--', ...CONTENT_PATHS]);
      const changed = st.stdout.split('\n').filter(l => l.trim()).length;
      return sendJson(res, 200, {
        changed,
        detail: st.stdout.trim(),
      });
    }

    // POST /api/publish  { message }
    // Only stages content paths — not editor tools or config files touched outside the editor.
    if (req.method === 'POST' && p === '/api/publish') {
      const b = JSON.parse((await readBody(req)).toString('utf8'));
      const msg = (b.message || '').trim() || 'update content';
      const add = await run('git', ['add', '--', ...CONTENT_PATHS]);
      if (!add.ok) return sendJson(res, 500, { error: 'git add 실패', output: add.stderr });
      const commit = await run('git', ['commit', '-m', msg]);
      const push = await run('git', ['push']);
      const output = ['$ git add ' + CONTENT_PATHS.join(' '), add.stdout,
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
