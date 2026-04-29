# CLAUDE.md

Static HTML/CSS/JS portfolio. No build system.

**Repo:** https://github.com/cowsjh/JeonghyeokSong  
**Live:** https://cowsjh.github.io/JeonghyeokSong (GitHub Pages, `main`)

---

## Rules

- **`git push` 전 반드시 확인.** 커밋 후 → "푸시할까요?" 묻기
- **신규 페이지 커밋 전 이미지 체크** (아래 참조)
- **신규 Works/Notes 추가 시 `/grammar-check` 으로 `main.md` 본문 검수** (커밋 전)

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

## 신규 Works/Notes 커밋 전 체크리스트

### 1. 문법 검수
`main.md` 본문을 `/grammar-check` 스킬로 검수. 수정 제안 반영 후 진행.

### 2. 이미지 체크

1. **누락** — `main.md` 내 `![](파일명)` + frontmatter `thumbnail:` 값이 폴더에 실제로 존재하는지 확인. 없으면 파일 추가 또는 참조 제거 후 커밋.
2. **잉여** — 폴더의 이미지 파일 중 `main.md`에서 참조되지 않는 것은 삭제 여부 사용자에게 확인.

> Gallery는 폴더 스캔 방식이므로 이 체크 불필요.
