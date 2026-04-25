---
title: White Water Tip
date: 2021-09-03
tags: DOP, Flip, Particle
---

물의 세부표현으로는 총 3가지 종류가 있는데

1. bubble : 물속에 있는 거품 입자들. (sdf 음수)
2. faom : 물표면에 있는 거품 입자들. (sdf 0)
3. spray(mist) : 물밖에 있는 거품 입자들.(sdf 양수)

화이트 워터 만드는 원리

dop 안의 계산된 fluid tank를 소스로 가져와 볼륨, 파티클들을 만들어 표현한다.

---

# Self Tool - White Water

Self Tool 에 있는 White Water의 노드들

> [!note]+ whitewater_source - ( DOP에 있는 flip tank를 소스로 가공하는 단계 )


> [!note]+ whitewater_sim - ( 가공된 소스로 파티클을 만드는 단계 )


> [!note]+ whitewater_import - ( 만들어진 파티클들로 볼륨을 만드는 단계 )
>
> 4. fluid tank를 소스로 하여 만든 파티클들을 가져온다.
> 5. depth와 age를 이용해서 density를 만든다.
> 6. density로 볼륨을 만든다.( fog )
> 7. denstiy 의 값을 반전시킨다. ( 내부 : - / 외부 : + )
> 8. 반전시킨 값을 토대로 gradiant( normal )을 구한다.
>     1. 볼륨의 normal을 구하는 이유는 렌더링시 반사가 일어나 실제같은 표현을 해주기 위함.
>

---

# Custom White Water

DOP 에서 만들어진 fluid를 속도(v), dot, depth를 조건들로 지오메트리 표면에 붙어있는 파티클들을 걸러준다.

> [!note]+ 파티클들의 V를 커스텀 하는법.
> > [!note]+ 1. volume의 vel을 이용해서 움직인다.
> >
> > 가져온 소스의 vel volume을 이용해서 파티클들을 움직인다. volume은 vdb로 변환후 vdbmerge 를 이용해서 가져온다.
> >
>
> > [!note]+ 2. volumegradiant를 이용해서 파티클들을 표면위로 붙여준다.
> >
> > 서로 모여서 선으로 보이는 형태가 된다.

## 영역 가공

popkill을 이용 일전에 boundary를 아용한 부분을 지워준다.


---

# Repellant_Point

SOP solver 로 repellantpoint를 만들고 POP wrangle 을 이용해서 파티클을 밀어주기.

> [!note]+ %%%%%%pointfromvolume이 작동 되지 않을 때.


surface volume 을 이용 해서 point 를 필터링 해줌

POP object 는 그룹을 가지고 있다. 이것을 이용해서 foam 파티클들만 뽑아낼 수 있음.

sop solver에서 생성한 repellant point를 기반으로 밀어주는 코드 작성.

퍼지는 넓이 모양을 랜덤, 노이즈를 이용해 바꿔 준다.

---

실제로 만들어 지는 geo는 소스보다 조금 두껍기 때문에 만들어진 폼 파티클들이 묻힐 수 있다. 그렇기 때문에 surface 값을 이용해서 offset을 해줘야. 보일 수 있다.
