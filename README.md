# Jeonghyeok Song — Portfolio

3D 아티스트 포트폴리오 사이트 (Game Art / Film VFX)

## 로컬 실행

빌드 없이 브라우저에서 바로 열거나 간단한 로컬 서버로 실행합니다.

```bash
# Python
python -m http.server 8080

# Node (설치된 경우)
npx serve .
```

## 작품 추가 방법

1. `works/<slug>.md` 파일 생성 — YAML frontmatter + 마크다운 본문

   ```yaml
   ---
   title: 프로젝트 제목
   category: Game Art
   thumbnail: ../assets/images/filename.jpg
   date: 2024.06
   tools: Houdini 21.0, Unreal Engine 5.6
   link: https://www.artstation.com/...
   ---

   마크다운으로 작성한 작품 설명...
   ```

2. `assets/images/` 에 썸네일 이미지 추가 (권장: 16:9, 1280×720 이상)

3. `index.html` 갤러리 섹션에 카드 추가

   ```html
   <a class="gallery-item" href="work.html?id=<slug>" data-title="제목" data-category="카테고리">
     <img src="assets/images/filename.jpg" alt="제목" loading="lazy">
     <div class="gallery-overlay">
       <span class="overlay-category">카테고리</span>
       <span class="overlay-title">제목</span>
     </div>
   </a>
   ```

## 배포

GitHub Pages — `main` 브랜치 루트에서 서빙.  
수정 후 커밋 & 푸시하면 자동 반영됩니다.
