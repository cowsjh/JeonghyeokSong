---
title: For each loop
date: 2021-02-09
tags: node, SOP
---

> [!warning] ⚠️
> 명령을 반복하여 값을 도출 하는 노드

기본적으로 tab을 누른 후 for each를 검색 하면 여러 가지 For each가 나오는데, 자주 사용 하는 설정을 후디니에서 정해놓은거라고 생각 하면 될거 같다.

그 설정 들은 항목 이름 처럼  attribute(name), class에 따라 알맞게 되어있다.

<!-- Column 1 -->

<!-- Column 2 -->


제일 기본적으로 For each point 를 꺼내면 노드가 2개 나온다.

위에 노드가 input 아래 노드가 output이고 그 중간에서 명령이 반복 된다.

> [!note]+ 🧱Block Begin
> > [!note] 👇
> > 반복문의 값을 도출 하는 Block begin 노드의 항목들을 살펴보자
>
> > [!note]+ **Methhod** : begin 노드에 input되는 값의 출처를 정한다.
> > - **Fetch feedback** : end 노드에서 나온 값이 들어 간다 , begin노드에 직접적으로 연결 되는 것이 없어도 기능 한다.
> > - **Fetch Piece or Point** : input에 들어오는 point,piece 가 차례대로 들어온다
> >
> >
>
> ---
>
>

> [!note]+ 🧱Block End
> > [!note] 👇
> > 반복문의 값을 도출 하는 Block End 노드의 항목들을 살펴보자
>
> > ---
>
> ### Iteration methhod
>
> - 반복 하는 방법을 결정 한다. input에 대입 되는 point의 갯수 대로 반복 할 수 도 있고, 원하는 만큼 반복 시킬 수 도 있다.
>
> ---
>
> ### Gather Methhod
>
> - 도출 되는 결과 값을 어떻게 출력 할것인가를 정한다. 각자 계산된 값들을 따로 보거나, 한꺼번에 merge해서 볼 수있다.
>
> ---
>
> ### Piece Attribute
>
> - 체크 하면 attribute를 기준으로 명령을 할 수 있다. (이건 아직 잘 모르겠다.)
>
> ---
>
> ### Max Iteration
>
> - 최대 반복을 정해줄 수 있다.
>
> ---
>
> End 블럭에 single pass를 체크해주면 순서대로 값을 따로 볼 수가 있다. 실제로 각자 값이 도출 되는것은 아니고 시각 적으로만 확인하는 용도로 생각 하자.
>
> 위 사진 처럼 single pass == 0 상태에서는 제일 첫번째(pt0) 값이 나온다.
>




# EX

---

grid를 연결 한 모습이다. 별거 없어 보이지만, 명령이 없다 뿐이지 작동 하는 중이다.
