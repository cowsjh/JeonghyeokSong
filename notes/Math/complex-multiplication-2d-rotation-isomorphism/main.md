---
title: 복소수 곱셈과 2D 회전행렬의 동형사상
date: 2026-08-21
tags: complex-number, rotation
order: 
featured: false
draft: false
---

# 복소수 곱셈과 2D 회전행렬의 동형사상

$a+bi$라는 [복소수](../허수와-복소수/main.md)를 이런 2×2 행렬 하나로 바꿔보자.

$a+bi \quad\longleftrightarrow\quad \begin{bmatrix} a & -b \\ b & a \end{bmatrix}$

이 대응은 덧셈도 곱셈도 그대로 보존한다. 즉 복소수 두 개를 곱한 결과와,
대응하는 행렬 두 개를 곱한 결과가 정확히 일치한다(동형, isomorphism).

여기에 $i=0+1i$를 넣으면:

$i \quad\longleftrightarrow\quad \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$

$R(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$

2D 회전 행렬과 동일한 모양이 나온다.
$\theta=90°$를 넣으면 $\cos90°=0,\ \sin90°=1$이라, $i$에 대응하는 행렬과 한 치도 다르지 않다.

즉 "$z$에 $i$를 곱한다"는 연산은 "벡터 $(a,b)$에 90° 회전행렬을 곱한다"는 연산과 비유가 아니라 정확히 같은 연산이다.

일반화하면 임의의 단위복소수 $e^{i\theta}=\cos\theta+i\sin\theta$도 마찬가지로 $R(\theta)$ 그 자체와 대응한다. 크기가 1이 아니면 $r\cdot R(\theta)$가 되어 회전에 확대·축소가 얹힌다.

## $i^2=-1$의  행렬 검증

$\begin{bmatrix}0&-1\\1&0\end{bmatrix}\begin{bmatrix}0&-1\\1&0\end{bmatrix} = \begin{bmatrix}-1&0\\0&-1\end{bmatrix} = -I$

90° 회전을 두 번 하면 180° 회전, 즉 부호 반전과 같다는 걸 행렬로도 그대로 확인할 수 있다.
$i^2=-1$이라는 대수 규칙 하나가 "90° 회전 두 번 = 반전"이라는 기하학적 사실을 그대로 인코딩하고 있는 셈이다. 이 2차원에서의 동형 관계를, 회전축을 셋으로 늘려 4차원으로 확장한 것이 쿼터니언이다.


> [!NOTE]
> **왜 담았나**
> 로봇 수업에서 이미 배운 2D 회전행렬과 복소수 곱셈을 그동안 "곱셈=회전"이라고 비유적으로만 엮어왔는데, 실제로 완전히 같은 구조(동형)라는 걸 행렬로 직접 증명해서 남겨둠.