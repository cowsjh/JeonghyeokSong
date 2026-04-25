---
title: 페이지 참조
date: 2026-04-16
tags: 
---



## md 링크

### 상대 경로
```
./ 현재 폴더
../ 상위 폴더
```

```
a/b/README.md 일때
README.md 에서
./ = d/
../ = c/
```

-  뒤에 #h 를 붙이면 헤더로 이동 가능. 단 띄어쓰기는 `-` 로 대체
```
[참조](../../Houdini/camera-ndc/camera-ndc.md#활용-예시)
```
**출력 결과**

[참조](../../Houdini/camera-ndc/camera-ndc.md#활용-예시)

---

## 페이지 링크

### 기본 형식
```
[Google](https://google.com)
[Naver](https://naver.com "링크 설명")
구글 홈페이지: https://google.com
네이버 홈페이지: <https://naver.com>

```
**출력 결과**

[GOOGLE](https://google.com)
[NAVER](https://naver.com "링크 설명")
구글 홈페이지: https://google.com
네이버 홈페이지: <https://naver.com>

---

### [참조] 형식
```
[Google][GOOGLE]
[Naver][1]

---

[GOOGLE]: https://google.com
[1]:<https://naver.com>
```
**출력 결과**

[Google][GOOGLE]
[Naver][1]

[GOOGLE]: https://google.com
[1]:<https://naver.com>
