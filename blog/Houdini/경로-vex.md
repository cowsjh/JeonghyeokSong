---
title: 경로 vex
date: 2022-09-02
tags: VEX, TIP
---

```
python
v@Cd = point('op:../color1',"Cd",7);
```

vex에서 경로를 바로 써주는 방법

```python
string srcpath = chs('srcpath');
string destpath = chs('destpath');
s@path = relativepath(srcpath, destpath);
```

srcpath 부터 destpath의 상대 경로를 알아냄.

```python
s@fullpath = opfullpath(s@path);
```

상대경로의 절대경로를 알아냄
