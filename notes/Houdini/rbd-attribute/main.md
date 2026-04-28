---
title: RBD attribute
date: 2021-07-18
tags: DOP, RBD, VEX
---

> [!note]+ f@speedmax
> v의 length(speed)를 가지고 객체의 최대 속력을 clamp 해준다

> [!note]+ v@w → anglea
>
> RBD Packed Object 에 Angular Velocity 에 해당 하는 attrib이다. 1초 동안 회전하는 값을 지정할 수 있음. v 처럼 매프레임마다 회전을 더해주게 된다.

> [!note]+ i@active
> dynamic의 활성 여부
>
> 0 = static

> [!note]+ i@animated
> 객체가 animated 되어 있는것을 반영 하느냐의 여부
>
> animated는 pack 된 후 transform과 같은 matrix가 통으로 움직이는것을 의미한다.
>
> pack이전의 움직임은, 각 포인트의 변환이며 deforming이라고 한다.
>

> [!note]+ i@deforming
>
> pack이전의 geo가 변화하는 상태는 각 포인트의 값들이 변하기 때문에 deforming상태라고 한다.
>
> 1 : 활성, 0 : 비활성
>

> [!note]+ f@bounce
> collision될때 튕기는 세기를 정한다.

> [!note]+ i@bullet_add_impact
> 해당 오브젝트에 impact정보를 추가해준다.
>
> RBD packed object 에도 포함 되어있는 설정

> [!note]+ i@bullet_ignore
> 0 일때 시뮬을 무시

> [!note]+ bullet_linear_angular_sleep
> f@bullet_linear_sleep_threshold
>
> f@bullet_angular_sleep_threshold
>
> active와는 조금 다르고, 동작을 멈출 뿐임
>
> 임계값 이하로 떨어지면 동작을 일시적으로 비활성화 해 준다.
>
> linear = 속력, angular = 회전력
>
