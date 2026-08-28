---
title: 4단계 — 오일러 공식 (Euler's Formula)
date: 2026-08-06
tags: euler-formula, complex-number
order: 
featured: false
draft: false
---

# 4단계 — 오일러 공식 (Euler's Formula)

2계 ODE의 특성방정식이 복소근을 가질 때(판별식 $D<0$), 그리고 라플라스 변환에서
$\cos, \sin$이 지수함수와 얽힐 때 반드시 필요합니다.

## 1. 공식

$$e^{i\theta} = \cos\theta + i\sin\theta$$

## 2. 유도 (Maclaurin 급수를 이용, 강의노트 2장 8p에 동일하게 등장)

$e^x$의 Maclaurin 급수([급수 수렴의 토대](../sequence-limits-and-infinite-series/main.md)):

$$e^x = 1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\frac{x^4}{4!}+\cdots$$

여기에 $x=i\theta$를 대입하면 ($i^2=-1, i^3=-i, i^4=1$ 반복 이용):

$$e^{i\theta} = 1+i\theta+\frac{(i\theta)^2}{2!}+\frac{(i\theta)^3}{3!}+\frac{(i\theta)^4}{4!}+\cdots$$

$$= \left(1-\frac{\theta^2}{2!}+\frac{\theta^4}{4!}-\cdots\right) + i\left(\theta-\frac{\theta^3}{3!}+\frac{\theta^5}{5!}-\cdots\right)$$

앞 괄호는 $\cos\theta$의 급수, 뒤 괄호는 $\sin\theta$의 급수이므로

$$e^{i\theta} = \cos\theta + i\sin\theta$$

같은 방법으로 $e^{-i\theta} = \cos\theta - i\sin\theta$.

## 3. 역으로 코사인·사인을 지수함수로 표현

$$\cos\theta = \frac{e^{i\theta}+e^{-i\theta}}{2}, \qquad \sin\theta = \frac{e^{i\theta}-e^{-i\theta}}{2i}$$

## 4. 복소수 $z=s+it$에 대한 지수함수 정의

$$e^z = e^{s+it} = e^s e^{it} = e^s(\cos t + i\sin t)$$

## 5. 왜 필요한가 — 2계 ODE에서의 활용

특성방정식 $\lambda^2+a\lambda+b=0$의 근이 $\lambda = \alpha\pm i\beta$ (복소근)일 때:

$$e^{\lambda_1 x} = e^{(\alpha+i\beta)x} = e^{\alpha x}(\cos\beta x+i\sin\beta x)$$
$$e^{\lambda_2 x} = e^{(\alpha-i\beta)x} = e^{\alpha x}(\cos\beta x-i\sin\beta x)$$

중첩의 원리로 두 해를 더하고 빼서 2로 나누면 **실함수인 해의 기저**를 얻습니다:

$$y_1 = \frac{e^{\lambda_1 x}+e^{\lambda_2 x}}{2} = e^{\alpha x}\cos\beta x, \qquad y_2=\frac{e^{\lambda_1 x}-e^{\lambda_2 x}}{2i}=e^{\alpha x}\sin\beta x$$

따라서 일반해는

$$y = e^{\alpha x}(C_1\cos\beta x + C_2\sin\beta x)$$

이 과정을 스스로 유도할 수 있으면 2장 "경우Ⅲ(복소근)"과 라플라스 변환의
$\mathcal{L}(e^{at}\cos\omega t)$류 공식이 왜 그런 형태인지 자연스럽게 이해됩니다.

## 예제

### 공식 값 계산

**1)** $e^{i2\pi}$의 값을 구하라.

<details>
<summary>정답 보기</summary>

$$e^{i2\pi}=\cos2\pi+i\sin2\pi=1+i(0)$$

**답: $e^{i2\pi}=1$**

</details>

**2)** $e^{i\frac{5\pi}{6}}$의 실수부와 허수부를 구하라.

<details>
<summary>정답 보기</summary>

$$e^{i\frac{5\pi}{6}}=\cos\frac{5\pi}{6}+i\sin\frac{5\pi}{6}$$

$\cos\frac{5\pi}{6}=-\frac{\sqrt3}{2}$, $\sin\frac{5\pi}{6}=\frac12$ 이므로

**답: 실수부 $-\dfrac{\sqrt3}{2}$, 허수부 $\dfrac12$**, 즉 $e^{i\frac{5\pi}{6}}=-\dfrac{\sqrt3}{2}+i\dfrac12$

</details>

### Maclaurin 급수로 유도/확인

**1)** Maclaurin 급수를 이용하여 $e^{-i\theta}=\cos\theta-i\sin\theta$ 임을 유도하라.

<details>
<summary>정답 보기</summary>

$e^x$의 Maclaurin 급수에 $x=-i\theta$를 대입한다 ($(-i)^2=-1,\ (-i)^3=i,\ (-i)^4=1$ 반복):

$$e^{-i\theta}=1+(-i\theta)+\frac{(-i\theta)^2}{2!}+\frac{(-i\theta)^3}{3!}+\frac{(-i\theta)^4}{4!}+\cdots$$

$$=\left(1-\frac{\theta^2}{2!}+\frac{\theta^4}{4!}-\cdots\right)+i\left(-\theta+\frac{\theta^3}{3!}-\cdots\right)$$

앞 괄호는 $\cos\theta$, 뒤 괄호는 $-\sin\theta$의 급수이므로

**답: $e^{-i\theta}=\cos\theta-i\sin\theta$**

</details>

**2)** $e^{i\theta}$의 Maclaurin 급수를 $\theta^4$ 항까지만 전개하여 실수부 근사식을 구하고, $\theta=\dfrac{\pi}{2}$를 대입한 근사값이 실제값 $\cos\dfrac{\pi}{2}=0$에 얼마나 가까운지 확인하라.

<details>
<summary>정답 보기</summary>

$$e^{i\theta}\approx 1+i\theta-\frac{\theta^2}{2!}-i\frac{\theta^3}{3!}+\frac{\theta^4}{4!}$$

실수부 근사식(=$\cos\theta$의 4차 근사): $1-\dfrac{\theta^2}{2}+\dfrac{\theta^4}{24}$

$\theta=\frac{\pi}{2}\approx1.5708$을 대입하면 $\dfrac{\theta^2}{2}\approx1.2337,\ \dfrac{\theta^4}{24}\approx0.2537$

$$1-1.2337+0.2537\approx0.02$$

**답: 근사값 $\approx0.02$로 실제값 $0$에 매우 가깝다** → 항을 더 더할수록 급수가 $\cos\theta$로 수렴함을 확인.

</details>

### 코사인·사인을 지수함수로 표현

**1)** $\cos\dfrac{\pi}{3}=\dfrac{e^{i\pi/3}+e^{-i\pi/3}}{2}$ 공식을 이용해 값이 $\dfrac12$임을 확인하라.

<details>
<summary>정답 보기</summary>

$$e^{i\pi/3}=\cos\frac\pi3+i\sin\frac\pi3=\frac12+i\frac{\sqrt3}{2},\qquad e^{-i\pi/3}=\frac12-i\frac{\sqrt3}{2}$$

$$\frac{e^{i\pi/3}+e^{-i\pi/3}}{2}=\frac{\left(\frac12+i\frac{\sqrt3}2\right)+\left(\frac12-i\frac{\sqrt3}2\right)}{2}=\frac{1}{2}$$

**답: $\cos\dfrac\pi3=\dfrac12$**, 공식과 일치.

</details>

**2)** $\cos\theta=\dfrac{e^{i\theta}+e^{-i\theta}}{2}$와 $\sin\theta=\dfrac{e^{i\theta}-e^{-i\theta}}{2i}$를 이용하여 $\cos^2\theta+\sin^2\theta=1$임을 증명하라.

<details>
<summary>정답 보기</summary>

$$\cos^2\theta=\frac{e^{2i\theta}+2+e^{-2i\theta}}{4}$$

$$\sin^2\theta=\frac{(e^{i\theta}-e^{-i\theta})^2}{(2i)^2}=\frac{e^{2i\theta}-2+e^{-2i\theta}}{-4}=-\frac{e^{2i\theta}-2+e^{-2i\theta}}{4}$$

두 식을 더하면

$$\cos^2\theta+\sin^2\theta=\frac{(e^{2i\theta}+2+e^{-2i\theta})-(e^{2i\theta}-2+e^{-2i\theta})}{4}=\frac{4}{4}$$

**답: $\cos^2\theta+\sin^2\theta=1$** (지수함수 표현만으로 피타고라스 항등식이 유도됨)

</details>

### 복소수 지수함수 $e^z=e^{s+it}$ 계산

**1)** $z=2+i\pi$일 때 $e^z$의 값을 구하라.

<details>
<summary>정답 보기</summary>

$$e^z=e^{2+i\pi}=e^2\cdot e^{i\pi}=e^2(\cos\pi+i\sin\pi)=e^2(-1+i(0))$$

**답: $e^z=-e^2$** (실수)

</details>

**2)** $z=\ln2+i\dfrac{\pi}{3}$일 때 $e^z$의 실수부와 허수부를 구하라.

<details>
<summary>정답 보기</summary>

$$e^z=e^{\ln2}\cdot e^{i\pi/3}=2\left(\cos\frac\pi3+i\sin\frac\pi3\right)=2\left(\frac12+i\frac{\sqrt3}{2}\right)$$

**답: $e^z=1+i\sqrt3$**, 즉 실수부 $1$, 허수부 $\sqrt3$

</details>

### 2계 ODE에서의 활용

**1)** 특성방정식 $\lambda^2-4\lambda+13=0$의 근을 구하고 일반해를 써라.

<details>
<summary>정답 보기</summary>

$$\lambda=\frac{4\pm\sqrt{16-52}}{2}=\frac{4\pm\sqrt{-36}}{2}=\frac{4\pm6i}{2}=2\pm3i$$

$\alpha=2,\ \beta=3$이므로

**답: $y=e^{2x}(C_1\cos3x+C_2\sin3x)$**

</details>

**2)** 특성방정식 $\lambda^2+2\lambda+10=0$의 근을 구하고, 초기조건 $y(0)=1,\ y'(0)=0$을 만족하는 특수해를 구하라.

<details>
<summary>정답 보기</summary>

$$\lambda=\frac{-2\pm\sqrt{4-40}}{2}=\frac{-2\pm6i}{2}=-1\pm3i$$

$\alpha=-1,\ \beta=3$이므로 일반해는

$$y=e^{-x}(C_1\cos3x+C_2\sin3x)$$

$y(0)=C_1=1$.

$$y'=-e^{-x}(C_1\cos3x+C_2\sin3x)+e^{-x}(-3C_1\sin3x+3C_2\cos3x)$$

$y'(0)=-C_1+3C_2=0 \Rightarrow C_2=\dfrac{1}{3}$ (∵ $C_1=1$)

**답: $y=e^{-x}\left(\cos3x+\dfrac13\sin3x\right)$**

</details>

## 체크리스트

- [ ] $e^{i\theta}=\cos\theta+i\sin\theta$ 를 Maclaurin 급수로 직접 유도 가능
- [ ] $\cos\theta, \sin\theta$를 지수함수로 표현하는 역방향 공식도 사용 가능
- [ ] 복소근을 갖는 2계 ODE 일반해가 왜 $e^{\alpha x}(\cos\beta x, \sin\beta x)$ 형태가
      되는지 설명 가능

---

**이전**: [03_적분](../integration/main.md)
