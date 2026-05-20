# Performance Checklist

이 사이트(정적 HTML/CSS/JS + GitHub Pages, 빌드 시스템 없음)에 새 기능을 추가하거나 기존 기능을 수정해 **커밋하기 직전** 점검하는 체크리스트.

## 발동 조건 (트리거)

다음 변경이 커밋에 포함되면 **자동으로 이 체크리스트 실행**:

- `script.js`, `theme.js`, `toc.js` 등 클라이언트 JS 수정
- `style.css` 수정 (특히 transition / animation / display)
- `index.html`, `blog.html`, `work.html` 구조 변경
- `*-sync.js` 스크립트 수정
- `works/<slug>/` 또는 `notes/**/<slug>/` 신규 추가 (미디어 동반)
- 외부 CDN 스크립트/스타일 추가

해당하지 않는 단순 문서/오타 수정은 스킵.

---

## 1. 페이지 로딩 (Loading)

### 이미지 / 비디오
- [ ] **새로 추가하는 이미지가 1MB 이상인가?** → WebP 변환 검토 (`cwebp -q 85`)
- [ ] **새로 추가하는 GIF가 5MB 이상인가?** → WebM(VP9) 또는 MP4 변환 (`ffmpeg -c:v libvpx-vp9 -crf 38 -b:v 0`)
- [ ] **`<img>`에 `loading="lazy"`?** (썸네일 첫 화면 제외)
- [ ] **`<video>`에 `autoplay muted loop playsinline`?** + src 끝에 `#t=0.001`
- [ ] **알파 채널 필요한가?** 불필요한 RGBA PNG는 RGB로 인코딩

### 스크립트 / 스타일
- [ ] **새 CDN 스크립트를 head에 추가했나?** → 정말 모든 페이지에 필요한지 / 조건부 로드 가능한지 검토 (예: blog.html의 MathJax/highlight.js는 본문에 패턴이 있을 때만 로드)
- [ ] **새 `<script>` 태그에 `defer` 또는 `async`?** (parser-blocking 피하기)
- [ ] **`@import` CSS 사용 금지** — 직렬 로드 유발

### Preload / Preconnect
- [ ] **LCP 이미지가 바뀌었나?** → `index.html`의 `<link rel="preload" as="image">` 경로 갱신
- [ ] **새 폰트 추가 시:** `<link rel="preconnect">` + `display=swap` 확인

### Critical Path
- [ ] **`<head>`에 신규 동기 스크립트 추가 시:** 정말 critical인지 (theme 같은 FOUC 방지 목적은 OK)
- [ ] **외부 자원 호스트가 늘었나?** → preconnect 추가 검토

---

## 2. 섹션 / 탭 이동 (Interaction)

### Stagger / Animation
- [ ] **새 카드/리스트 stagger 추가 시:** 한 카드당 지연 **25ms 이하** 권장 (현재 기준)
- [ ] **stagger 누적이 500ms 넘지 않는가?** (카드 개수 × 지연 < 500ms)
- [ ] **`display: none` ↔ `block` 전환에 opacity 트랜지션 동반?** (탭 패널은 이미 적용됨)

### Interaction Cost
- [ ] **`scroll`, `resize`, `mousemove` 이벤트에 `{ passive: true }`?**
- [ ] **무거운 작업이 메인 스레드 차단?** → `requestAnimationFrame` 또는 task 쪼개기
- [ ] **DOM 일괄 갱신 시 reflow 트리거 속성 회피?** (top/left/width/height → transform/opacity)

### URL / 라우팅
- [ ] **탭/필터 상태가 URL에 반영되는가?** (`history.replaceState` 사용)
- [ ] **뒤로가기 동작 깨지지 않는가?**

---

## 3. CLS (Layout Shift)

- [ ] **새 `<img>`, `<video>`, `<iframe>`에 명시적 크기 또는 `aspect-ratio`?**
- [ ] **동적 콘텐츠가 들어갈 자리:** 미리 공간 확보 (`min-height` / 스켈레톤)
- [ ] **로딩 텍스트("Loading...")가 즉시 표시?** → 300ms 지연 fade-in으로 깜빡임 방지

---

## 4. blog.html / work.html 본문 추가 시

마크다운 본문에 새 요소를 추가하는 경우:

- [ ] **이미지 누락 없나?** — `main.md`의 `![](xxx)` 참조 파일이 실제로 존재하는지
- [ ] **이미지 잉여 없나?** — 폴더 내 미참조 파일 (삭제 또는 참조 추가)
- [ ] **GIF 참조라면** 변환 권장 (위 1번 항목)
- [ ] **`<video>` 자동 변환은 `.mp4`, `.webm`, `.mov` 확장자 대상** — 다른 확장자는 수동 HTML 필요
- [ ] **수식(`$...$`) 또는 코드블록(```)이 처음 등장하는 노트?** → 자동 감지 작동 확인 (`needsMath`, `needsHljs`)

---

## 5. data.js / sync 산출물

- [ ] **`works/*/main.md` 변경 → `node works-sync.js`**
- [ ] **`notes/**/main.md` 변경 → `node blog-sync.js`**
- [ ] **`REVIEW_NEEDED: <slug>` 출력 시:** Works 검수 자동 실행 (CLAUDE.md 참조)
- [ ] **sync 결과물(`notes/data.js`, `works/data.js`, `index.html` 카드)을 같은 커밋에 포함**

---

## 6. 측정 (선택)

큰 변경 후에는 Lighthouse로 비교:
- **LCP** (< 2.0s 목표)
- **INP** (< 200ms)
- **CLS** (< 0.1)
- **Total Transfer Size** (첫 페이지 < 5MB 목표)

DevTools Performance 탭으로:
- 탭 전환 → 마지막 카드 visible 시점
- script.js evaluation 시간

---

## 7. 빠른 참조 — 흔한 함정

| 증상 | 원인 | 해결 |
|---|---|---|
| 페이지 깜빡임 | "Loading..." 즉시 표시 후 사라짐 | 300ms 지연 fade-in 적용 |
| 비디오 로드 직후 점프 | aspect-ratio 미설정 | `.md-body video { aspect-ratio: 16/9 }` |
| 비디오 자동재생 안 됨 | `muted` 누락 | `autoplay muted loop playsinline` 4개 모두 필요 |
| iOS에서 풀스크린 강제 | `playsinline` 누락 | 위와 동일 |
| LCP 늦음 | preload 누락 또는 큰 이미지 | preload 추가 또는 이미지 압축 |
| 한 글자씩 폰트 깜빡임 | 폰트 swap 직후 reflow | `font-display: swap` 유지, layout shift는 감수 (FCP 우선) |
| 검색 결과 누락 | `notes/data.js` 미갱신 | `node blog-sync.js` |
| 새 노트가 안 보임 | draft: true 또는 sync 누락 | frontmatter 확인 + sync 실행 |

---

## 적용 흐름 권장

1. 코드 변경 완료
2. **이 체크리스트 훑기** (해당 섹션만)
3. `node works-sync.js` / `node blog-sync.js` 필요 시 실행
4. 로컬 미리보기로 변경 페이지 확인 (탭 전환, 모바일, 라이트/다크)
5. 커밋
