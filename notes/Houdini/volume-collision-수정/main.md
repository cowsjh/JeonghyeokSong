---
title: Volume Collision 수정
date: 2021-10-22
tags: node, DOP, Volume, TIP
---

Volume Source를 이용해서 collision을 불러올 때 이런식으로 구멍이 나면서 제대로 역할을 할 수 없을 때가 있다.

위의 방식처럼 collision의 fill interior와 레졸루션, smoke object의 레졸루션도 맞춰가는 방식이 필요하다.
