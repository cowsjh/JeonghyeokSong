---
title: 행렬의 선형변환
date: 2026-08-19
tags: matrix, linear-algebra
order: 
featured: false
draft: false
---

# 행렬의 선형변환

함수 $T$ : $R^n \rightarrow R^m$ 이 모든 벡터 $u, v$ 와 스칼라 $c$ 에대해
$$T(u+v) = T(u) + T(v), $$
$$ T(cu) = cT(u) $$
를 만족 하면 선형 변환 이라 한다.
두 조건을 합치면 **선형 결합을 보존한다**는 문장이 된다.

## 행렬 $\rightarrow$  선형변환

위의 조건식에 따라 행렬곱 식 $Ax$에 대해서

$T(x)=Ax$

$T(u+v)=A(u+v)$

$=Au+Av$

$=T(u)+T(v)$

가, 되기 때문에

## 선형변환 $\rightarrow$ 행렬

임의의 변환 $T$ 를 만들때
표준기저가 어디로 가는지만 관찰하면 된다.

- $e_1=(1,0)$ 은 그대로 → $T(e_1)=(1,0)$
- $e_2=(0,1)$ 은 오른쪽으로 1만큼 밀려서 $(1,1)$ 로 이동 → $T(e_2)=(1,1)$

이 두 결과를 열벡터로 나열하면 **표준행렬**이 바로 나온다.
$$A = [\,T(e_1)\ \ T(e_2)\,] = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$$
### 검산

1. 선형성만으로 직접 계산: $x = 2e_1+3e_2$ 이므로
$$T(x) = 2T(e_1)+3T(e_2) = 2(1,0)+3(1,1) = (5,3)$$
2. 방금 만든 행렬로 계산:
$$Ax = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}\begin{bmatrix} 2 \\ 3 \end{bmatrix} = \begin{bmatrix} 1(2)+1(3) \\ 0(2)+1(3) \end{bmatrix} = \begin{bmatrix} 5 \\ 3 \end{bmatrix}$$

 **행렬벡터곱도** $Ax$  = $A$의 열들을 $x$의 성분 비율로 **선형결합** 이고,
 **선형변환도** $T(x)=x_1T(e_1)+\cdots+x_nT(e_n)$ 로 정확히 같은 **선형결합** 이다.

즉 $Ax$ 와 $T(x)$ 는 애초에 **"기저의 상(image)을 성분대로 섞는다"는 같은 계산을 가리키므**로, 선형변환은 필연적으로 행렬이 된다.

### 선형변환 종류

- **크기 (scaling)**: 각 축 방향으로 $k$배 늘이거나 줄인다. $\begin{bmatrix} k & 0 \\ 0 & k \end{bmatrix}$ (축마다 다른 배율도 가능: $\begin{bmatrix} k_1 & 0 \\ 0 & k_2 \end{bmatrix}$)
- **회전 (rotation)**: 원점을 중심으로 각 $\theta$ 만큼 회전. $\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$ — [2-3 3D 회전 표현법 총정리](../../Robotics/orientation-representations/main.md)의 2D 버전.
- **전단 (shear)**: 한 축은 고정, 다른 방향은 첫 축 성분에 비례해 밀린다. $\begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix}$ (평행사변형처럼 찌그러뜨리는 변환)
- **반사 (reflection)**: 특정 축/직선을 기준으로 뒤집는다. 예를 들어 $x$축 기준 반사는 $\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$

## 로보틱스와의 연결

- 로봇팔의 [2-2 변환 행렬과 연산자 (Transformation Matrix)](../../Robotics/transformation-matrix/main.md)에서 다루는 회전 행렬 $R$ 도 결국 이 선형변환의 한 종류다 — 좌표계를 회전시키는 연산자(operator)나 좌표를 다른 프레임으로 매핑(mapping)하는 것 모두, 위에서 정의한 "선형결합을 보존하는 함수"라는 성질을 그대로 만족한다.
- 다만 로봇팔의 위치 변환은 회전(선형) + 이동(translation)이 섞인 **아핀변환**이라 원점이 고정되지 않고, 그래서 동차좌표(homogeneous coordinate)로 4×4 행렬을 써서 억지로 선형화한다 — 순수 선형변환과 아핀변환의 차이는 별도로 정리할 만하다.
- [행렬식, 열공간, 영공간 (Inverse Matrices, Column Space & Null Space)](../determinant-column-space-null-space/main.md): 표준행렬 $A$ 의 열공간은 $T$ 의 치역(range), 영공간은 $T(x)=0$ 이 되는 입력들의 집합이다 — 선형변환을 통째로 행렬의 언어로 재서술한 것.
