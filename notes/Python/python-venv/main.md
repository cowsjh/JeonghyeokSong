---
title: Python 가상 환경 venv
date: 2026-08-08
tags: 
order: 
featured: false
draft: false
---

# Python 가상 환경 venv

## venv

```bash
python3 -m venv .venv
source .venv/bin/activate
## 이부분에서 라이브러리 설치
pip freeze > requirements.txt
deactivate
```
- 각 프로젝트는 철저히 정해진 서로 다른 버전의 파이선, 라이브러리 위에서 작동 된다.
- system 상에서 라이브러리가 중복된 상태로 설치 되어 있다면 정상적으로 돌아가기 힘들다.
- 로봇에 연결된 노트북 커널에서는 가상환경을 확인 하는 습관을 가진다.
- 즉, 검증 공간에서만 사용 한다.
- requirements.txt 에 버전을 명시해 두고 협업, 관리 한다.

---

가상환경 안에서 만든 스크립트를 배포용 실행파일로 만드는 법은 [파이선 스크립트(.py) exe 변환](../파이선 스크림트(.py) exe 파일 만들기/main.md) 참고.
