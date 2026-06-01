# CLAUDE.md

Static HTML/CSS/JS portfolio. No build system.

**Repo:** https://github.com/cowsjh/JeonghyeokSong  
**Live:** https://cowsjh.github.io/JeonghyeokSong (GitHub Pages, `main`)

---

## Rules

- **`git push` 전 반드시 확인.** 커밋 후 → "푸시할까요?" 묻기
- **`works-sync.js` / `blog-sync.js` 실행 직후 → 변경된 work/note 폴더 이미지 검수(누락·잉여) 자동 실행** (아래 "이미지 검수" 참조)
- **`node works-sync.js` 실행 후 `REVIEW_NEEDED: <slug>` 출력 시 → Works 검수(포트폴리오·문법) 자동 실행** (아래 참조)
- **Notes 커밋 직전 → Notes 검수 자동 실행** (아래 참조)
- **코드/구조/미디어 변경 커밋 직전 → `OPTIMIZATION_PLAN.md` 체크리스트 자동 실행** (트리거 조건은 해당 파일 상단 참조)
- **신규 work/note 추가 시 폴더 전체를 스테이징.** `git add works/<slug>/` 또는 `git add notes/<parent>/<slug>/` — 이미지 누락 방지
- **새 Note 생성 요청 시 → 제목·카테고리·슬러그·태그를 순서대로 물어본 후 `node new-note.js` 실행** (아래 참조)
- **새 Work 생성 요청 시 → 제목·슬러그·카테고리·툴을 순서대로 물어본 후 `node new-work.js` 실행** (아래 참조)
- **새 Work/Note 생성 시 카테고리·태그는 기존 값을 선택지로 제시** — `works/data.js`·`notes/data.js`(sync 집계본)에서 집계, 개별 `main.md` 전수 스캔 금지. `featured`·`order`·`link`는 빈칸으로 생성(질문하지 않음) — 작성 완료 후 수동 입력
- **"배포 확인되면 알려줘" 요청 시 → 백그라운드 폴링 실행, 사용자에게 확인하지 않음**
  - 명령: `until curl -s <검증 URL> | grep -q <키워드>; do sleep 15; done`
  - 검증 키워드는 방금 푸시한 변경사항 중 고유한 문자열 사용

---

## Sync 명령

| 변경 대상 | 실행 |
|---|---|
| `works/*/main.md` | `node works-sync.js` |
| `notes/**/main.md` | `node blog-sync.js` |

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
order:     1             # 선택. Featured 탭 정렬용(오름차순, 동일 order는 날짜순). 일반 Works 리스트는 항상 날짜순
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
title:    Post Title
date:     2024-06-15
tags:     VEX, TIP, code   # 하위 필터 태그
order:    1               # 선택. Featured(Recent) 정렬용(오름차순, 동일 order는 날짜순). 일반 Notes 리스트는 항상 날짜순
featured: false            # 레거시. order로 대체됨
draft:    false            # true → sync 제외
```

---

## 이미지 검수 (sync 직후 자동 실행)

`works-sync.js` 또는 `blog-sync.js` 실행 직후, 이번 sync로 변경된 work/note의 `main.md`에 대해 자동 실행:

- **누락** — `main.md`의 `![](파일명)` + (works의 경우 frontmatter `thumbnail:`) 값이 폴더에 실제로 존재하는지 확인. 없으면 파일 추가 또는 참조 제거.
- **잉여** — 폴더의 이미지 중 `main.md`에서 참조되지 않는 것 → 묻지 말고 자동 삭제 후 다음으로 진행.

---

## Works 검수 (자동 트리거)

`node works-sync.js` 결과에 `REVIEW_NEEDED: <slug>` 가 포함되면, 해당 slug에 대해 순서대로 자동 실행:

### 1. 이미지 체크
- **누락** — `main.md`의 `![](파일명)` + frontmatter `thumbnail:` 값이 폴더에 실제로 존재하는지 확인. 없으면 파일 추가 또는 참조 제거.
- **잉여** — 폴더의 이미지 중 `main.md`에서 참조되지 않는 것 → 묻지 말고 자동 삭제 후 다음으로 진행.

### 2. 포트폴리오 검수
`main.md` 본문을 읽고 포트폴리오 관점에서 검토: 프로젝트 설명의 명확성, 어필 포인트, 구조, 빠진 정보 등. 구체적인 제안 제시 후 사용자 확인 → 반영.

### 3. 문법 검수
`/grammar-check` 스킬로 문법·맞춤법·흐름 검수. 수정 제안 반영 후 커밋 진행.

---

## Notes 검수 (커밋 직전 자동 실행)

Notes 관련 커밋 전, 해당 note의 `main.md`에 대해 순서대로 자동 실행:

### 1. 이미지 체크
- **누락** — `main.md`의 `![](파일명)` 값이 폴더에 실제로 존재하는지 확인.
- **잉여** — 폴더의 이미지 중 `main.md`에서 참조되지 않는 것 → 묻지 말고 자동 삭제 후 다음으로 진행.

### 2. 문법 검수
`/grammar-check` 스킬로 문법·맞춤법·흐름 검수. 수정 제안 반영 후 커밋 진행.

---

## 새 Note 생성 (자동 트리거)

사용자가 새 note 페이지 생성을 요청하면 아래 순서대로 진행:

### 1. 정보 수집 (순서대로 질문)
1. **제목** (title)
2. **카테고리** — `notes/data.js`의 키(`Category/slug`)에서 카테고리를 집계해 선택지로 제시(예: `Game`, `Houdini`, `ComputerGraphics`, `Math`, `Markdown`, `Python`) + 새 카테고리 직접 입력 가능
3. **슬러그** (폴더명, 기본값: 제목을 camelCase로 변환)
4. **태그** — `notes/data.js`의 `tags:` 값을 집계해 선택지로 제시(다중 선택) + 새 태그 직접 입력 가능

### 2. 스크립트 실행
```
node new-note.js "<title>" "<category>" "<slug>" "<tags>"
```

- `draft: true` 고정 (작성 완료 후 수동으로 `false` 변경)
- `featured`·`order`는 빈칸으로 생성
- 날짜는 오늘 날짜 자동 입력
- 이미 존재하는 경로면 에러 출력 후 중단

---

## 새 Work 생성 (자동 트리거)

사용자가 새 work 페이지 생성을 요청하면 아래 순서대로 진행:

### 1. 정보 수집 (순서대로 질문)
1. **제목** (title)
2. **슬러그** (폴더명, 기본값: 제목을 kebab-case로 변환)
3. **카테고리** — `works/data.js`의 `category:` 값을 집계해 선택지로 제시(예: `Game Art`, `Tool`) + 새 카테고리 직접 입력 가능
4. **툴** (쉼표 구분, 예: `Houdini, Unreal Engine`)

### 2. 스크립트 실행
```
node new-work.js "<title>" "<slug>" "<category>" "<tools>"
```

- `draft: true` 고정, `thumbnail: thumb.jpg` 플레이스홀더 삽입
- `featured`·`order`·`link`는 빈칸으로 생성
- 날짜는 오늘 날짜 YYYY.MM 형식 자동 입력
- 이미 존재하는 경로면 에러 출력 후 중단
