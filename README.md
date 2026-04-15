# Jeonghyeok Song — Portfolio

## 작품 추가 방법

1. `works/<slug>/` 폴더 생성 후 MD 파일과 이미지 추가

   ```yaml
   ---
   title: 프로젝트 제목
   category: Game Art
   thumbnail: works/<slug>/thumb.jpg
   date: 2024.06
   tools: Houdini 21.0, Unreal Engine 5.6
   link: https://www.artstation.com/...
   ---

   마크다운으로 작성한 작품 설명...
   ```

2. 동기화 실행

   ```
   node works-sync.js
   ```

## 블로그 포스트 추가 방법

1. `blog/<slug>.md` 파일 생성

2. 동기화 실행

   ```
   node blog-sync.js
   ```
