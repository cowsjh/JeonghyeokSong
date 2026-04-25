---
title: Session Module
date: 2022-06-22
tags: HOM
---
https://www.sidefx.com/docs/houdini/hom/hou/session.html

파이선에서 후디니의 세션에 접근해 파일내에서 데이터를 저장 하거나. 가져와 사용할 수 있다.

이렇게 되면 만트라 매니저 처럼 각 hip파일 마다 생기게 되는 불필요한 데이터의 축적을 막을 수 있다.

```python
>>> hou.setSessionModuleSource('a = ["a","b","c"]')
```

hou.setSessionModuleSource 펑션을 이용해 hou.session module에 접근 하여 코드를 작성 할 수 있다.

이는 Reload를 눌러줘야만 적용이 된다. 하지만 Reload를 눌러주지 않는 다고 그값이 변하지 않은것은 아니다. 겉으로만 이전 데이터가 남아있을 뿐, 내부적으로 이미 적용 되어 있는 셈이다. 이것은 아래의 코드로 확인할 수 있다.

```python
>>> hou.setSessionModuleSource('a = ["a","b","c"]')
>>> hou.sessionMouleSource()
'a = ["a","b","c"]'
```

hou.sessionModuleSource()를 이용해서 모듈의 소스코드를 문자열 타입으로 받아올 수 있다.

다음은 변수를 가져오는 방법이다. 이로써 Reload 를 클릭 과 데이터는 무관하다고 볼 수 있다.

```python
>>> hou.setSessionModuleSource('a = ["a","b","c"]')
>>> hou.sessionMouleSource()
'a = ["a","b","c"]'
>>> hou.session.a[2]
'c'
```

hou.session모듈을 이용해 a라는 변수값을 가져왔다.

이외에도 hou.appendSessionModuleSource()를 이용해 모듈 전체를 바꾸지 않고 코드를 추가 할 수있다.
