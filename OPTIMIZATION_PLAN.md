# Portfolio Optimization Plan

정적 HTML/CSS/JS 포트폴리오의 **페이지 로딩 속도**와 **섹션 이동 속도**를 개선하기 위한 단계별 실행 계획.

- **호스팅:** GitHub Pages (`main` 브랜치) — 빌드 시스템 없음, 캐시 헤더 제어 불가
- **현 상태 요약:** `works/` 431MB · `notes/` 133MB · 이미지 237장 평균 837KB · WebP 전무
- **체감 병목 1:** 탭 전환 시 카드 stagger 누적 (최대 ~960ms)
- **체감 병목 2:** 첫 페이지 로드시 12MB급 PNG 다수, `notes/data.js` 100KB 통째 로드

---

## 우선순위 매트릭스

| 우선순위 | 항목 | 예상 효과 | 작업량 | 리스크 |
|---|---|---|---|---|
| **P0** | 대용량 PNG → WebP 변환 | 첫 로드 대역폭 **70~85% 감소** | 中 | 낮음 (원본 백업 시) |
| **P0** | 대용량 GIF → MP4/WebM 전환 | 노트/Work 페이지 **10~50× 가벼움** | 中 | 중 (sync 스크립트 수정) |
| **P0** | 탭 stagger 간격 단축 (80→25ms) | 탭 전환 체감 **3~4× 빠름** | 小 | 낮음 |
| **P1** | `notes/data.js` 분할 (blog.html만) | blog.html 페이지 로드 단축 | 中 | 낮음 (index 검색 영향 없음) |
| **P1** | `<img>` aspect-ratio + 폰트 `display=swap` | CLS 제거, FCP 개선 | 小 | 낮음 |
| **P2** | LCP 이미지 `<link rel="preload">` | LCP **100~300ms** 단축 | 小 | 낮음 |
| **P2** | MathJax / highlight.js 조건부 로드 | blog.html 로드 단축 | 小 | 중 (검출 누락 시 수식 미렌더) |
| **P3** | Critical CSS 인라인 | FCP 개선 | 中 | 낮음 |
| **P3** | 탭 패널 fade transition | 인지 품질 향상 | 小 | 낮음 |

---

## P0 — 즉시 효과 큰 작업

### P0-1. PNG → WebP 일괄 변환

**대상:** `works/`, `notes/` 내 모든 `.png`, `.jpg`. 특히 1MB 이상 우선.
- 최우선: `works/tree-generator-hda/jh-render02-*.png` (8~12MB × 7장)
- `works/RugFattern/`, `works/desertbiom/`, `works/MushRoomHDA/` 등 2MB+ 파일

**방식:**
- `cwebp -q 85` (사진/렌더), `-q 90 -lossless` (UI/도표)
- RGBA(투명도 있는 PNG)는 알파 채널 유지 옵션
- 원본 PNG는 `backup/` 또는 별도 브랜치에 보관 (롤백용)

**참조 갱신 (자동화 필수):**
- 각 `works/<slug>/main.md`, `notes/**/main.md`의 `![](xxx.png)` → `![](xxx.webp)`
- frontmatter `thumbnail:` 필드
- `works-sync.js` / `blog-sync.js`가 자동 생성하는 카드 (sync 재실행으로 해결)
- `index.html`의 하드코드된 카드 이미지 경로 (sync 재실행)

**검증 체크리스트:**
- [ ] Featured 카드 12장 모두 표시
- [ ] 각 work 상세 페이지에서 본문 이미지 누락 없음
- [ ] Lightbox 동작 확인
- [ ] 라이트/다크 모드 모두 확인

**예상 절감:** `works/` 431MB → **80~120MB**

---

### P0-2. GIF → MP4/WebM 전환

**대상 (큰 순):**
- `notes/Game/DitherTemporalAA/*.gif` (49MB × 2 — **중복 파일 확인 필요**)
- `works/FE/*.gif` (35MB)
- `works/Snowrock/*.gif` (32MB)
- `works/desertbiom/`, `works/AncientRuinForest/`, `notes/Game/Pixel-Depth-Offset-(PDO)/` 등
- 합계 32개 GIF

**방식:**
- `ffmpeg -i in.gif -c:v libx264 -crf 23 -movflags +faststart -pix_fmt yuv420p out.mp4`
- 동시에 WebM(VP9) 생성하여 `<video>` 안에서 source 폴백
- 자동재생: `<video autoplay loop muted playsinline>` (muted 필수, iOS 자동재생 정책)

**sync 스크립트 수정:**
- `blog-sync.js` 마크다운 → 렌더 시 `![](*.gif)` 패턴을 `<video>` 태그로 치환
- `works-sync.js`는 본문을 렌더하지 않으므로 영향 없음. 단 work.html 본문 마크다운 렌더링부에 동일 처리 추가
- 후방 호환을 위해 마크다운 원본은 `![](xxx.mp4)` 형식으로 변경 (또는 `.gif` 그대로 두고 sync 시점에 mp4로 치환)

**검증:**
- [ ] iOS Safari에서 자동재생 확인 (muted, playsinline 필수)
- [ ] 반복 재생 확인
- [ ] 모바일 데이터 절약 모드에서도 정상 동작

**예상 절감:** GIF 합계 **약 400MB → 30~50MB**

---

### P0-3. 탭 전환 stagger 간격 단축

**파일:** `script.js`

| 라인 | 현재 | 변경 |
|---|---|---|
| `script.js:24` | `i * 100` (초기 카드 stagger) | `i * 30` |
| `script.js:56` | `i * 80` (Works 탭 재진입) | `i * 25` |
| `script.js:111` | `i * 60` (Featured Works) | `i * 20` |
| `script.js:135` | `i * 40` (Featured Notes) | `i * 15` |

**원리:** 카드 12장 기준 마지막 카드 등장 시점이 **960ms → 300ms**. 부드러움은 유지되면서 빠른 응답성 확보.

**리스크:** 없음. 시각적 취향 문제이므로 푸시 전 라이브 미리보기로 1회 확인.

---

## P1 — 구조적 개선

### P1-1. `notes/data.js` 분할 (blog.html 전용 로드 경로 추가)

**현 구조:**
- `notes/data.js` (100KB)에 모든 노트 본문 인라인
- `index.html` — 검색을 위해 전체 본문 필요 (Body/All 스코프, `script.js:320`)
- `blog.html` — 단일 글 보려고 전체 본문 다운로드 (낭비)

**전략:**
- **`index.html`은 현행 유지** (검색 기능 보존 — Body/All 스코프는 인라인 본문 필수)
- **`blog.html`만 per-slug 페치로 전환:**
  - `notes/<parent>/<slug>/main.md`를 `fetch()` 후 클라이언트 파싱
  - 또는 `blog-sync.js`가 `notes/posts/<slug>.json` 개별 파일 생성
- 추가 최적화 (선택): `notes/data.js`에서 본문을 압축하거나 서치 인덱스만 빌드 (`title + tags + body 요약`)하여 분리

**구현 순서:**
1. `blog-sync.js`에 per-slug JSON 생성 로직 추가
2. `blog.html`의 `notes/data.js` 로드를 `fetch('notes/posts/' + id + '.json')`로 교체
3. 폴백: 실패 시 기존 `notes/data.js` 경로 유지 (안전망)

**리스크:** 낮음. index.html 검색은 그대로 동작.

---

### P1-2. 이미지 aspect-ratio + 폰트 display swap

**A. `<img>` 사이즈 명시 (CLS 제거)**

`style.css`에 추가:
```css
.post-thumb img,
.post-thumb-overlay img,
.gallery-grid img { aspect-ratio: 16 / 10; object-fit: cover; }
.note-card img { aspect-ratio: 4 / 3; object-fit: cover; }
```

또는 sync 스크립트가 카드 생성 시 실제 이미지 크기를 읽어 `width`/`height` 속성 주입 (정확하지만 복잡).

**우선 권장:** aspect-ratio CSS 방식 (구현 단순, 효과 동일).

**B. 폰트 `display=swap`**

`index.html:9`, `blog.html:9`, `work.html`:
```diff
- href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500&display=block">
+ href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500&display=swap">
```

**리스크:** 폰트 로드 전 시스템 폰트로 잠깐 보임 (FOUT). FCP·LCP 점수 개선 효과가 더 큼.

---

## P2 — 추가 단축

### P2-1. LCP 이미지 preload + script defer

**A. LCP preload (`index.html`)**

Featured 탭 첫 번째 work 카드 이미지가 사실상 LCP. `<head>`에 추가:
```html
<link rel="preload" as="image" href="works/RockCliffGen/image.png" fetchpriority="high">
```

> P0-1 적용 후에는 `.webp` 경로로 갱신. featured 첫 카드가 바뀌면 같이 갱신 필요 — sync 스크립트가 첫 featured를 추출해 자동 주입하도록 확장하는 것이 이상적.

**B. Script `defer`**

`script.js`, `theme.js`는 이미 `</body>` 직전이므로 `defer` 추가 효과 작음. 단 명시적으로 추가하면 파서가 더 일찍 다음 자원 fetch 가능:
```diff
- <script src="script.js"></script>
- <script src="theme.js"></script>
+ <script src="script.js" defer></script>
+ <script src="theme.js" defer></script>
```

`</body>` 직전이 아닌 `<head>`로 옮기고 `defer` 부여하는 것도 검토 가치 있음 (HTML 파싱과 병렬 다운로드).

---

### P2-2. MathJax / highlight.js 조건부 로드 (`blog.html`)

**현재:** 모든 노트 페이지에서 MathJax (수십 KB) + highlight.js + marked CDN 로드 — 수식/코드 없는 글에서도.

**전략:**
1. marked는 항상 필요 (마크다운 본문 렌더)
2. MathJax: 본문에 `$...$` 또는 `\\(...\\)` 또는 `$$...$$` 검출 시에만 동적 삽입
3. highlight.js: ` ```lang ` 코드블록 검출 시에만 동적 삽입

```js
// 본문 파싱 후
if (/\\$\\$|(?:^|[^\\\\])\\$[^$\\n]+\\$/.test(rawMarkdown)) {
  loadScript('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js', true);
}
if (/^```/m.test(rawMarkdown)) {
  loadScript('https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js');
}
```

**리스크:** regex가 누락하면 수식이 안 보임. 보수적 패턴 + 기존 노트 전수 grep 검증 필요.

---

## P3 — 인지 품질

### P3-1. Critical CSS 인라인

**전략:** `<head>`에 위치한 첫 화면용 CSS(레이아웃, nav, hero 영역, Featured 그리드)만 인라인. 나머지는 `<link rel="stylesheet">`로 비동기 로드.

**구현:** 수동 분리 후 `index.html <head>`에 `<style>` 블록. style.css는 그대로 유지하되 두 번 로드 안 되도록 중복 제거.

**효과:** FCP 단축. 단 36KB CSS 전체가 critical에 가까워 분리 비율이 낮으면 효과 미미. **선택적 적용**.

---

### P3-2. 탭 패널 fade transition

`style.css:352`:
```css
.tab-panel {
  display: none;
  opacity: 0;
  transition: opacity 0.18s ease;
}
.tab-panel.active {
  display: block;
  opacity: 1;
}
```

stagger와 결합하면 자연스러운 전환감. P0-3 적용 후 시각 검토.

---

## 실행 순서 권장

1. **P0-3** (탭 stagger) — 5분, 즉시 체감 변화
2. **P1-2** (폰트 swap, aspect-ratio) — 10분, 코드 변경 최소
3. **P2-1** (preload, defer) — 10분
4. **P0-1** (PNG → WebP) — 1~2시간, 일괄 스크립트
5. **P0-2** (GIF → MP4) — 1~2시간, sync 스크립트 확장 포함
6. **P1-1** (data.js 분할) — 30분
7. **P2-2** (조건부 스크립트 로드) — 30분
8. **P3** (선택)

각 단계 완료 후 라이브 푸시 전 로컬 미리보기로 다음 항목 확인:
- [ ] Featured / Works / Notes 탭 전환
- [ ] work 상세 페이지 (대표 1개 + GIF 포함 1개)
- [ ] blog 상세 페이지 (수식 있는 글 + 코드블록 있는 글 각 1개)
- [ ] 모바일 뷰 (DevTools 시뮬레이션)
- [ ] 라이트/다크 모드

## 측정

작업 전/후 다음 지표를 Chrome DevTools Lighthouse로 기록:
- LCP, INP, CLS
- 첫 페이지 전체 다운로드 용량
- script.js 실행 시간
- 탭 전환 → 마지막 카드 등장까지 시간 (Performance 탭)
