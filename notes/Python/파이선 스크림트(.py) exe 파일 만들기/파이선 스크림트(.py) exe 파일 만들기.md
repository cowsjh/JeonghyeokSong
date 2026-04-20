---
title: 파이선 스크립트(.py) exe 변환
date: 2026-04-20
tags: 
---

```
pip install pyinstaller
```

```
python -m PyInstaller --onefile --noconsole 스크립트.py
```
--onefile : 하나의 파일로 만들기
--noconsole : 콘솔창 안뜨고 실행 