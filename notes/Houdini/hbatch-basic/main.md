---
title: hbatch Basic
date: 2022-10-12
tags: code
---

$HPS/bin/당신이나 하세요

기본값(C:/Program Files/Side Effects Software/Houdini 18.5.421/bin)

경로에 있는 hcmd.exe 또는

Command Line Tool 에서 배치파일을 실행 시킬 수 있음

```powershell
Y:

Y:\>cd Y:\FX_TEAM\Test\SJH\RND\SJHRND\fx\dev\scenes\

Y:\FX_TEAM\Test\SJH\RND\SJHRND\fx\dev\scenes>hbatch hbatch_test_scene.hip
```

후디니 파일경로로 열어 주는 코드

이 툴 안에서는 Hscript를 문법으로 사용하며

[https://www.sidefx.com/docs/houdini18.5/commands/index.html](https://www.sidefx.com/docs/houdini18.5/commands/index.html)

자세한 펑션은 여기 참조

툴안에서는 파이선을 사용할 수 있으며 파이선 파일을 실행 시키는 방법이 편리함.

```powershell
python batch_deadline_test.py
python '경로/' + batch_deadline_test.py
## 같은 실행이다
```

파이선 파일을 실행 시키는 코드

경로없이 이때 파이선 파일이름만 써준다면 hip파일과 같은 디렉토리에 존재해야 한다.

경로를 같이 적어주면 다른 경로에서 받아올 수 있다.
