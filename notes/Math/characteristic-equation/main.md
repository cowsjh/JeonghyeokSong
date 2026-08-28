---
title: 특성방정식
date: 2026-08-24
tags: matrix, eigenvalue
order: 
featured: false
draft: false
---

# 특성방정식

정사각행렬 $A$에 대해, 어떤 벡터 $v \ne 0$ 와 스칼라 $\lambda$ 가

$$Av=λv$$
를 만족하면, $\lambda$를 고유값, $v$ 를 고유벡터라고 부른다.

직관적으로 생각 하면  
벡터에 행렬 $A$ 를 곱하면 그 벡터의 방향이 바뀐다. 그런데 어떤 특별한 방향의 벡터 $v$는 $A$를 곱해도 방향이 안 바뀌고 **길이(크기)만** $\lambda$배로 변한다. 그 특별한 배율이 **고유값**이다.

## 수식 정리

$$Av = \lambda v$$
$$Av - \lambda v = 0$$
$v$ 로 식을 묶어 주고,
행렬에서 실수를 뺄 수 없기 때문에 **단위 행렬**을 곱해 준다.

$$(A-\lambda I)v = 0$$

 $(A-\lambda I)$ 는 $v$ 를 [영공간](../determinant-column-space-null-space/main.md) 으로 보내는 행렬이 된다. 따라서 이 행렬에 역행렬은 존재 하지 않는다. 이것을 특**성 방정식**이라고 한다.
정사각 행렬이 역행렬을 갖지 않을 필요 충분 조건은 행렬식 이 0 이라는 것이다. 그것을 식으로 표현 하면

$$det(A-\lambda I) = 0$$
이 식은 [행렬식](../determinant-column-space-null-space/main.md)을 이용 하여 고유값을 얻을 수 있다.

## 행렬 $A$ 가 대칭 일때
$$A = \begin{pmatrix}2&1\\1&2\end{pmatrix}$$
행렬 $A$ 를 대칭으로 예를 들어 식을 풀어 보자.
$$ det(A-\lambda I) = \begin{pmatrix}2-\lambda& 1 \\ 1 & 2 - \lambda \end{pmatrix}$$
$$= (2 - \lambda)(2-\lambda) - 1$$
$$=(2-\lambda)^2 -1$$
$$=\lambda^2 -4\lambda+3$$

이렇게 이차방정식이 나오고, [근의 공식](../quadratic-formula/main.md)으로 이걸 인수 분해 하면

$$\lambda = 1,3$$
고유값은 1과 3이 나왔다.

## 행렬 $A$ 가 비대칭 일때

고유값은 행렬이 대칭일때와 같이 근의 공식으로 풀수 있는 식이 존재 하는 반면, 그렇지 않을 때도 있다.

$$A = \begin{pmatrix}0&-1\\1&0\end{pmatrix}$$
행렬 $A$ 가 90도 회전 행렬 일때,
$$ A-\lambda I = \begin{pmatrix}-\lambda& -1 \\ 1 & - \lambda \end{pmatrix}$$
$$det(A-\lambda I)= (- \lambda)^2 - (-1)$$
$$=\lambda^2+1 = 0$$
$+1$ 을 옮기면
$$\lambda^2 = -1$$
이 식은 [허수](../허수와-복소수/main.md)를 나타 낼때 $i^2 = -1$ 와 동일 한 식이다. 
그러므로
$$\lambda = \pm i$$

직관적으로생각해 본다면 90도 회전 시키는 행렬은 어떤 벡터를 넣어도 **방향이 유지되는 실수가 존재 할 수 없다.** 모든 벡터가 90도를 회전 하기 때문이다.  
그렇기 때문에 **실수 에서는 고유 벡터를 찾을 수 없고**, 수학적으로 **복소수**의 영역 까지 확장 해야 하는 것 이다.