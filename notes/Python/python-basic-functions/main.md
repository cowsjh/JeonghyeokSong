---
title: Python 기초 펑션
date: 2022-02-28
tags: function
---
https://www.sidefx.com/docs/houdini/hom/hou/index.html

```python
.setInput()
.setDisplayFlag(0) = off
.setRenderFlag(1) = on
.name() -> 이름을 string으로 받아냄
.layoutChildren() -> 레이아웃 정리

.eval()
open()
.writelines()
.close()
.glob(pattern, ignoer_case=False) = 해당 노드의 자식노드들을 튜플로 모두 불러옴( 패턴 매칭을 이용해서
원하는 결과를 도출 할 수 있다.)
.replace("find", "replaceswitch") = "find"를 찾아서 "replaceswitch"로 바꾼다.

for in 
----

노드 관련 ( = 타입은 hou.Objnode/Sopnode/... )

.createNode()
	- createNode('노드', node name = '노드 이름') 
.pwd() -> 현재 코드가 작동 되고 있는 장소(노드)
.node("경로") -> "경로" 노드 불러옴
.children() -> 해당 노드 안에 들어 있는 노드들을 리스트함
.inputs() -> 해당 노드의 인풋 노드들을 튜플로 불러옴
.setNextInput() -> merge같은 경우 순서대로 인풋을 정할 수 있음
.layoutChildren() -> 노드 레이아웃 정리
.moveToGoodPosiotion() -> 노드가 겹치지 않음
	:moveToGoodPosition(move_inputs=False) -> 인풋 노드는 움직이지 않음 ( 추측 )

----

파라미터 관련 명령어

.parms() -> 속해 있는 파라미터들을 list함
.parmInFolder(['폴더 이름']) -> '폴더 이름' 안에 있는 파라미터들을 list함
parm.deleteAllkeyframes() -> 파라미터에 걸려있는 키프레임을 전부 지운다.
.parm("파라미터 이름").set(X) -> "파라미터 이름"d 의 값을 X 로 set함
.setParms({'파라미터a' : 'a값', '파라미터b' : 'b값'}) -> 복수의 파라미터들을 동시에 설정
.isDisabled() -> 사용 불가 상태면 1 가능 상태면 0
.multiParmInstances() -> 멀티파라미터에서 생성된 파라미터들의 이름을 list함
.revertToDefaults() -> 해당 parm를 기본값으로 변경

.parm("이름").eval() -> "이름"parm의 값 불러옴
.evalParm("이름") -> "이름"parm의 값 불러옴 

---

지오메트리 

.inputGeometry(Index) -> Index의 인풋으로 들어오는 geo를 불러옴
.geometry() -> 하위 노드의 geo
.points() -> geo의 포인트정보를 불러옴
.pointAttribs() -> 해당 geo 포인트의 attrib들을 불러냄
.number() -> geo 넘버를 불러옴
.position() -> 위치값을 불러옴(벡터값으로)
.pos.x/y/z() -> x/y/z값을 불러냄 .position() 보다 좀 더 자세한 자릿수 까지 불러옴
.attribValue("어트리뷰트이름") -> "어트리뷰트이름" 의 값을 가져온다

-----

어트리뷰트

.addAttrib(hou.attribType.Point, 'pscale', 0.2) -> geo attrib추가 방법
.findPointAttrib()
.attribValue(attrib) -> 해당 geo의 어트리뷰트 값 불러옴

range(숫자) -> 숫자를 0부터 끝까지 리스트로 풀어 버린다.ex/ range(3) > [0,1,2]

import os
os.path.isdir("경로") -> "경로"와 같다면 1 아니면 0
os.listdir("경로") -> "경로"에 있는 파일 이름을 리스트화함

import json
```

```python
## 스트링 쪼개는 방법
path = "texture/glass/roughness/"
pathsplit = path.splite(glass)
print(pathsplit)
print(pathsplit[1])

=> ['texture/', 'roughness/']
=>/roughness/
## 중간의 동일한 스트링을 빼주고 각자 다른 개채로 이용 가능 하다.
```

`editor = hou.ui.paneTabOfType(hou.paneTabType.NetworkEditor)`

`editor.nodeShapes()`

→ shape보는법
