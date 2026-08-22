---
title: Git Basic
date: 2026-08-08
tags: bash, basic
order: 
featured: false
draft: false
---

# Git Basic

**디렉 토리** *-add->* **스테이징** *-commit->* **로컬 저장소(.git)** *-push->* **원격 저장소(repo)**


**알면 좋은 커밋 메세지**

| 접두어       | 의미                      |
| --------- | ----------------------- |
| `Feat:`   | 새 기능 추가                 |
| `Fix:`    | 버그 수정                   |
| `Test:`   | 테스트 추가/수정               |
| `Design:` | 설계 변경                   |
| `Style:`  | 코드 스타일(포맷팅 등, 로직 변경 없음) |
| `Docs:`   | 문서 수정                   |



### 기초
```bash
git clone 주소 #최초 1회

git status
git diff
git add .
git commint -m ""
git push
git pull

git log
```

### 브랜치
```bash
git branch # 로컬 브랜치 목록
git branch -a # 로컬 + 원격 브랜치 전부
git branch -v # 마지막 커밋과 함께 보기

git branch 브랜치이름 # 새 브랜치 생성
git switch 브랜치
git switch -c 브랜치 #생성 + 이동

git branch -d 브랜치 #병합돤 브랜치 삭제
git branch -D 브랜치 #   강제 삭제

git push origin 브랜치 # 브랜치 push
git push -u origin 브랜치 # push + 업스트림 연결
git log --oneline --gragh # 브랜치 시각화

```
### 수정
```bash
git restore 파일 # 디렉터리 수정을 버린다.
git restore --staged 파일 # 스테이징에서 뺀다
git revert 커밋ID #반대 변경을 새커밋으로 추가
```


### 커밋 메세지

| 접두어       | 의미                      |
| --------- | ----------------------- |
| `Feat:`   | 새 기능 추가                 |
| `Fix:`    | 버그 수정                   |
| `Test:`   | 테스트 추가/수정               |
| `Design:` | 설계 변경                   |
| `Style:`  | 코드 스타일(포맷팅 등, 로직 변경 없음) |
| `Docs:`   | 문서 수정                   |

---

git 명령어는 linux 기본 명령어 셸 환경 위에서 실행된다.
