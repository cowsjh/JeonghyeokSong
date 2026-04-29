# CLAUDE.md

Static HTML/CSS/JS portfolio. No build system.

**Repo:** https://github.com/cowsjh/JeonghyeokSong  
**Live:** https://cowsjh.github.io/JeonghyeokSong (GitHub Pages, `main`)

---

## Rules

- **`git push` 전 반드시 확인.** 커밋 후 → "푸시할까요?" 묻기
- **`node works-sync.js` 실행 후 `REVIEW_NEEDED: <slug>` 출력 시 → Works 검수 자동 실행** (아래 참조)
- **Notes 커밋 직전 → Notes 검수 자동 실행** (아래 참조)

---

## Sync 명령

| 변경 대상 | 실행 |
|---|---|
| `works/*/main.md` | `node works-sync.js` |
| `notes/**/main.md` | `node blog-sync.js` |
| `gallery/<category>/` | `node gallery-sync.js` |

> `data.js` / `index.html` 카드는 직접 편집 금지 — sync 스크립트가 생성

---

## Works

```
works/<slug>/main.md  +  이미지들
```

**Frontmatter 필수 필드:**

```yaml
title:     Project Title
category:  Game Art
thumbnail: thumb.jpg      # 파일명만 — works/<slug>/ 자동 prefix
date:      2024.06
tools:     Houdini 21.0, Unreal Engine 5.6
featured:  false          # true → Featured 탭 노출
draft:     false          # true → sync 제외
link:      https://...
```

---

## Notes

```
notes/<parent>/<slug>/main.md  +  이미지들
```

- `parent` = 폴더명 자동 추출
- 이미지는 `main.md`와 동일 폴더, 마크다운에서 파일명으로 참조

**Frontmatter 필수 필드:**

```yaml
title: Post Title
date:  2024-06-15
tags:  VEX, TIP, code   # 하위 필터 태그
draft: false             # true → sync 제외
```

---

## Gallery

```
gallery/<category>/image.jpg  →  node gallery-sync.js
```

지원 확장자: `.jpg` `.jpeg` `.png` `.webp` `.gif` `.avif`

---

## Works 검수 (자동 트리거)

`node works-sync.js` 결과에 `REVIEW_NEEDED: <slug>` 가 포함되면, 해당 slug에 대해 순서대로 자동 실행:

### 1. 이미지 체크
- **누락** — `main.md`의 `![](파일명)` + frontmatter `thumbnail:` 값이 폴더에 실제로 존재하는지 확인. 없으면 파일 추가 또는 참조 제거.
- **잉여** — 폴더의 이미지 중 `main.md`에서 참조되지 않는 것 → 삭제 여부 사용자에게 확인.

### 2. 포트폴리오 검수
`main.md` 본문을 읽고 포트폴리오 관점에서 검토: 프로젝트 설명의 명확성, 어필 포인트, 구조, 빠진 정보 등. 구체적인 제안 제시 후 사용자 확인 → 반영.

### 3. 문법 검수
`/grammar-check` 스킬로 문법·맞춤법·흐름 검수. 수정 제안 반영 후 커밋 진행.

---

## Notes 검수 (커밋 직전 자동 실행)

Notes 관련 커밋 전, 해당 note의 `main.md`에 대해 순서대로 자동 실행:

### 1. 이미지 체크
- **누락** — `main.md`의 `![](파일명)` 값이 폴더에 실제로 존재하는지 확인.
- **잉여** — 폴더의 이미지 중 `main.md`에서 참조되지 않는 것 → 삭제 여부 사용자에게 확인.

### 2. 문법 검수
`/grammar-check` 스킬로 문법·맞춤법·흐름 검수. 수정 제안 반영 후 커밋 진행.

> Gallery는 폴더 스캔 방식이므로 이미지 체크 불필요.
