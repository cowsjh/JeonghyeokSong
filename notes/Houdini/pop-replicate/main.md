---
title: POP_Replicate
date: 2021-06-17
tags: DOP, Particle, node
---

impulse rate : 프레임당 파티클 생성 수

Birth Rate : 초당 파티클 생성 수

파티클을 생성하는 포인트는 랜덤으로 지정 되는듯 하다.

 Seed는 어느 점의 파티클이 생성되는 위치를 정한다.

attribute를 지정해주면 원하는 포인트에서 모두 파티클을 복사 해줄 수 있다. ( 1 = on, 0 = off )

Radial Velocity는 방사형으로 v를 추가해주는 옵션

inherit Vel이 낮고 Radial 이 높다면 180도 에 가까운 각도로 방출된다.

→ 적절히 섞어 주고== Birth의 Seed 도 $F로 다양성==을 주면서 다양한 각도로 퍼지게 할 수 있다.

Uniform Scale같은 경우 소스의 @pscale의 값을 따라간다.
