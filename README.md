# Jeonghyeok Song — Portfolio

## 작품 추가 방법

1. `works/<slug>.md` 파일 생성

   ```yaml
   ---
   title: 프로젝트 제목
   category: Game Art
   thumbnail: assets/images/filename.jpg
   date: 2024.06
   tools: Houdini 21.0, Unreal Engine 5.6
   link: https://www.artstation.com/...
   ---

   마크다운으로 작성한 작품 설명...
   ```

2. `assets/images/` 에 썸네일 이미지 추가

3. Claude에게 동기화 요청 — `works/data.js` 및 `index.html` 카드 추가, 커밋·푸시까지 처리
