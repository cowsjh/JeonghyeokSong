# CLAUDE.md

Static HTML/CSS/JS portfolio. No build system — open `index.html` in browser.

**Repo:** https://github.com/cowsjh/JeonghyeokSong  
**Live:** https://cowsjh.github.io/JeonghyeokSong (GitHub Pages, `main`)

## Rules

- **Never `git push` without confirmation.** Commit locally → ask "푸시할까요?"

## Files

| File | Role |
|---|---|
| `index.html` | Landing page, Works 카드 그리드 + Notes 탭 |
| `work.html` | Work 상세 페이지 (`?id=<slug>`) |
| `blog.html` | Blog 상세 페이지 (`?id=<slug>`) |
| `works/<slug>.md` | 각 work의 원본 소스 |
| `works-sync.js` | `works/*.md` → `index.html` 포스트 카드 동기화 스크립트 |
| `blog/<parent>/<slug>.md` | 각 blog 포스트의 원본 소스 (상위 태그별 폴더) |
| `blog/data.js` | 런타임 데이터 (`window.BLOG`) — `blog-sync.js`로 생성 |
| `blog-sync.js` | `blog/**/*.md` → `blog/data.js` 동기화 스크립트 |
| `assets/images/` | 이미지 (Git LFS) |

---

## Works

### Frontmatter

```yaml
title:     Project Title
category:  Game Art
thumbnail: assets/images/slug/thumb.jpg
date:      2024.06
tools:     Houdini 21.0, Unreal Engine 5.6
link:      https://www.artstation.com/...
```

### 동기화

Works 추가/삭제 후:
```
node works-sync.js
```
- `works/*.md` 전체를 읽어 `index.html`의 `.posts-grid`를 재생성
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

## Blog (Notes)

### Frontmatter

```yaml
title: Post Title
date:  2024-06-15
tags:  VEX, TIP, code
```

- `parent`: **폴더명으로 자동 결정** — `blog/Houdini/` 폴더 → `Houdini` 상위 태그 (frontmatter 불필요)
- `tags`: 하위 태그 (parent 선택 시 나타나는 서브 필터)

### 동기화

Blog 추가/삭제 후:
```
node blog-sync.js
```
- `blog/**/*.md` 전체를 재귀로 읽어 `blog/data.js`를 재생성
- 새 상위 태그 추가 시 `blog/<parent>/` 폴더를 만들고 그 안에 `.md` 작성
- 백틱(`` ` ``)과 `${` 자동 이스케이프

### Blog 필터 태그 로직

`blog/data.js`의 frontmatter에서 동적으로 버튼 생성.

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
- 새로운 `parent` 값 추가 시 필터 버튼 자동 생성

### Blog 포스트에서 태그 클릭

`blog.html`의 태그 pill 클릭 → `index.html?tag=<tagname>` 이동
- Notes 탭 자동 활성화
- 해당 태그 자동 선택 (상위/하위 태그 모두 지원)
- portfolio 섹션으로 자동 스크롤

### blog.html 태그 표시

- `parent` 태그: 진한 테두리, 흰 텍스트 (`.blog-post-tag--parent`)
- `tags` 하위 태그: 기본 muted 스타일
- 사이에 세로 구분선으로 시각적 분리
