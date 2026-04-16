---
title: Vellum Rest Blend
date: 2021-07-16
tags: vellum, SOP, node
---

> [!note] 🔥
> [vellum 의 기본 구성](/f9289a67b67342a6a4f0459e8155d9d2)을 먼저 알고 오자

Vellum Rest Blend : pt정보가 같은 객체들의 모양을 blend 시켜주는 기능

<!-- Column 1 -->

<!-- Column 2 -->
rest blend의 기본 구성

두가지 객체를 준비한다.

하나는 목표가 되는 객체(A), 하나는 변하는 객체(B)

==A는 numpt가 B와 같아야 한다. ==

ray 노드를 쓰거나 vex를 이용해서 모양을 만들어내는것이 관건인듯 하다.

Vellum solver 안에서의 rest blend 사용

dopnet 에서도 처리해줄 수 있다.
