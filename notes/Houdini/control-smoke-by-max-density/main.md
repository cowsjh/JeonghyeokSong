---
title: Control Smoke by Max Density
date: 2023-04-05
tags: Volume, node, DOP
---

[https://www.youtube.com/watch?v=Wm4uGBcuh5g](https://www.youtube.com/watch?v=Wm4uGBcuh5g)

[http://127.0.0.1:45025/nodes/dop/gasreduce](http://127.0.0.1:45025/nodes/dop/gasreduce)

gasreduce 노드로 source field 의 max값

Dest Option : density / ( 이름 )

density filed에 저장이 된다. geometry 의 detail 같은 느낌

max(dopfield("/obj/ground_destruction_rnd/smoke/pyrosolver2/dopnet1","pyro","density","Options",0,"max"), dopfield("/obj/ground_destruction_rnd/smoke/pyrosolver2/dopnet1","pyro","density","Options",0,"maxmax") )

새로운 데이터 필드를 만들고, max를 불러 온다

이때 계산되는 순서가 다르기 때문에 maxmax는 한프레임 낮은 값을 가져오며 서로 다른 값들을 max(a,b) 펑션으로 지속적인 max값을 찾아준다.
