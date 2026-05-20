---
title: Dynamic Resolution Scaling (DRS)
date: 2026-05-20
tags: optimization
draft: false
---

[Tech Focus - Dynamic Resolution Scaling: A Great Fit For PC Gaming?](https://www.youtube.com/watch?v=180nuQJccTA)
[Dynamic resolution scaling in Monogame/XNA](https://konradzaba.github.io/blog/tech/Dynamic-resolution-scaling-in-Monogame-XNA/)
[Dynamic Resolution](https://yggdrasil-917.github.io/posts/dynamic-resolution/dynamic-resolution/)

---

## DRS

GPU의 렌더링 시간은 해상도에 비례 하는 특성을 이용해 부하가 높은 장면에서 해상도를 동적으로 조절하여 프레임 레이트를 유지하는 방식.
- 해상도를 낮추는 방식이기 때문이 이미지의 퀄리티 저하는 어쩔 수 없다.
- CPU 병목 현상에 대한 큰 효과는 없다.
- 최저 해상도 제한, 타겟 프레임 레이트, 헤드룸 설정 등 매개변수가 존재한다.

### 구성
- Target Framerate - 기준이 되는 목표 프레임
- Updata Interval - 얼마나 자주 스케일링을 할 것 인지
- Minimum Height Resolution - 최저 해상도 한계 설정 통상적으로 50% 
- GPU Headroom Before Increasing - GPU 활용도 측정, 해상도 높일 수 있을지 결정
- Decrease Rate of Change - DRS 가 해상도를 낮추는 비율
- Increase Rate of Change - DRS 가 해상도를 올리는 비율

## 원리

1. 이전 프레임의 GPU 시간 측정
2. 비례 모델 설정 
3. 다음 프레임 시작시 새 스케일 반영.
4. TAA 적용


### 비례 모델
가로 세로 양축을 모두 줄이거나, 한쪽 축만 줄이는 방식이 있다. 영상은 때에 따라 한쪽 축만 조정하는 것이 시각적으로 덜 거슬릴 수 있기 때문이다.
- 가로 선의 패턴이 잘 보이는 씬의 경우 x축만 줄이는 방식은 눈에 띌 수 있다.

$S' = S × (T / t)^k$

$S =$ 현재 해상도 스케일
$S' =$ 새 해상도 스케일
$T =$ 목표 프레임 시간
$t =$ 측정된 현재 프레임 시간
$k =$ 변화율 상수

