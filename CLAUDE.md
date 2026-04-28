# CLAUDE.md

Static HTML/CSS/JS portfolio. No build system — open `index.html` in browser.

**Repo:** https://github.com/cowsjh/JeonghyeokSong  
**Live:** https://cowsjh.github.io/JeonghyeokSong (GitHub Pages, `main`)

## Rules

- **Never `git push` without confirmation.** Commit locally → ask "푸시할까요?"

## Files

| File | Role |
|---|---|
| `index.html` | Landing page, Works 카드 그리드 + Notes + Gallery 탭 |
| `work.html` | Work 상세 페이지 (`?id=<slug>`) |
| `blog.html` | Blog 상세 페이지 (`?id=<slug>`) |
| `works/<slug>/main.md` | 각 work의 원본 소스 |
| `works/<slug>/<image>` | work 이미지 — `main.md`와 같은 폴더에 저장 |
| `works-sync.js` | `works/*/main.md` → `index.html` 카드 + `works/data.js` 동기화 |
| `notes/<parent>/<slug>/main.md` | 노트 포스트 |
| `notes/<parent>/<slug>/<image>` | 포스트 이미지 — `main.md`와 같은 폴더에 저장 |
| `notes/data.js` | 런타임 데이터 (`window.BLOG`) — `blog-sync.js`로 생성 |
| `blog-sync.js` | `notes/**/main.md` → `notes/data.js` 동기화 |
| `gallery/<category>/<image>` | 갤러리 이미지 — 카테고리별 서브폴더에 저장 |
| `gallery/data.js` | 런타임 데이터 (`window.GALLERY`) — `gallery-sync.js`로 생성 |
| `gallery-sync.js` | `gallery/**/*` → `gallery/data.js` 동기화 |

---

## Works

### 구조

```
works/<slug>/
  main.md
  thumb.jpg
  image-1.png
```

### Frontmatter

```yaml
title:     Project Title
category:  Game Art
thumbnail: thumb.jpg        ← 파일명만 (경로 자동 해석: works/<slug>/thumb.jpg)
date:      2024.06
tools:     Houdini 21.0, Unreal Engine 5.6
featured:  true
draft:     false
link:      https://www.artstation.com/...
```

- `thumbnail`: 파일명만 작성. sync 시 `works/<slug>/` 자동 prefix
- `featured: true` — Featured 탭에 노출. `false`이거나 항목 없으면 미노출
- `draft: true` — sync 시 제외 (게시 안 함). `false`이거나 항목 없으면 게시

### 동기화

Works 추가/삭제 후:
```
node works-sync.js
```
- `works/*/main.md` 전체를 읽어 `index.html`의 `.posts-grid`를 재생성
- `<!-- WORKS-SYNC-START -->` ~ `<!-- WORKS-SYNC-END -->` 마커 사이를 교체
- 날짜 내림차순 정렬

### Works 필터 태그 로직

`index.html` 카드의 `data-category`, `data-tools` 속성에서 동적으로 버튼 생성.

```
[ Game Art ] [ Film / VFX ]  |  [ Houdini ] [ Unreal Engine ]
      ↑ data-category                  ↑ data-tools
```

- `tools` 필드의 버전 번호는 자동 제거 (`Houdini 21.0` → `Houdini`)
- 단일 선택, 재클릭 시 해제
- 카테고리 OR 툴 매칭

---

## Notes

### 구조

```
notes/<parent>/<slug>/
  main.md             ← 슬러그: <parent>/<slug>
  image-1.png
  image-2.png
```

- `parent`: 폴더명으로 자동 결정 (`notes/Houdini/` → `Houdini`)
- 이미지는 `main.md`와 같은 폴더에 저장, 마크다운에서 파일명으로 참조

### Frontmatter

```yaml
title: Post Title
date:  2024-06-15
tags:  VEX, TIP, code
draft: false
```

- `tags`: 하위 태그 (parent 선택 시 나타나는 서브 필터)
- `draft: true` — sync 시 제외 (게시 안 함). `false`이거나 항목 없으면 게시

### 동기화

Notes 추가/삭제 후:
```
node blog-sync.js
```
- `notes/**/main.md` 전체를 재귀로 읽어 `notes/data.js`를 재생성
- `parent/slug/main` → `parent/slug` 슬러그로 자동 압축
- 새 parent 추가 시 `notes/<parent>/<slug>/` 폴더 생성 후 `main.md` 작성
- 백틱(`` ` ``)과 `${` 자동 이스케이프

### Blog 필터 태그 로직

```
[ 2024 ] [ 2023 ] [ 2022 ] [ 2021 ]  |  [ Houdini ]
─────────────────────────────────────────────────────
  (Houdini 클릭 시 슬라이드 인)
[ node ] [ TIP ] [ VEX ] [ Volume ] ...
```

- 연도: `date` 필드에서 자동 추출, 복수 선택 (OR)
- 상위 태그(`parent`): 클릭 시 하위 태그 서브바 열림, 단일 선택
- 하위 태그(`tags`): 복수 선택 (OR)
- 연도 + 하위 태그 조합 가능 (AND)
- 상위 태그 재클릭 → 서브바 닫힘 + 하위 태그 선택 전체 해제

### blog.html 태그 표시

- `parent` 태그: 진한 테두리, 흰 텍스트 (`.blog-post-tag--parent`)
- `tags` 하위 태그: 기본 muted 스타일
- 태그 pill 클릭 → `index.html?tag=<tagname>` 이동, Notes 탭 + 해당 태그 자동 선택

---

## Gallery

이미지 레퍼런스를 카테고리별로 보여주는 마소너리 그리드 섹션.

### 구조

```
gallery/
  <category>/
    image1.jpg
    image2.png
  data.js          ← gallery-sync.js가 생성 (직접 편집 금지)
```

### 동기화

이미지 추가/삭제 후:
```
node gallery-sync.js
```
- `gallery/<category>/` 서브폴더를 스캔하여 `gallery/data.js` 재생성
- 지원 확장자: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.avif`
- 카테고리 = 폴더명 (자동 추출)

### 기능

- 카테고리 필터 버튼 (단일 선택, 재클릭 해제)
- 이미지 클릭 → 전체화면 라이트박스
- 라이트박스: 좌우 화살표 키 / 버튼으로 이전·다음, ESC 닫기
