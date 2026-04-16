---
title: GPU Pyro
date: 2021-11-01
tags: TIP, Volume
---

GPU로 빠른 계산을 하는 pyro 솔버 에셋노드이다.

하지만 이노드는 3가지의 볼륨밖에 없고 모션 블러에 필요한 vel이 없다.

solver안으로 다이브 해서 switch 대신 dopimport를 연결해 준다.

Vel이 같이 들어온 모습

후에 vel만 따로 가공해 준다.
