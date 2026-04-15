---
title: Camera NDC
date: 2022-05-28
tags: VEX
---

## NDC란?

NDC (Normalized Device Coordinates) — 카메라를 기준으로 정규화된 좌표계다.

3D 공간의 점을 카메라 시야 안에서 어디에 위치하는지 0~1 범위로 표현한다.

| 축 | 범위 | 설명 |
|---|---|---|
| X | 0 ~ 1 | 화면 왼쪽(0) → 오른쪽(1) |
| Y | 0 ~ 1 | 화면 아래(0) → 위(1) |
| Z | 양수 절대값 | 카메라로부터의 거리 (깊이) |

> [!NOTE]
> Z축은 0~1로 정규화되지 않는다. 카메라가 바라보는 방향이 음(−), 반대가 양(+)이며 절대 거리값을 가진다.

카메라 프레임 밖의 점은 X, Y가 0보다 작거나 1보다 크다. 이를 이용해 오브젝트가 카메라 안에 있는지 판별할 수 있다.

---

## toNDC / fromNDC

Houdini VEX에는 두 가지 변환 함수가 있다.

### toNDC

```vex
vector toNDC(string camera, vector pos)
```

월드 공간의 점 `pos`를 NDC 좌표로 변환한다.

```vex
string cam = "/obj/cam1";
vector ndc = toNDC(cam, @P);

// 화면 안에 있는지 확인
if (ndc.x > 0 && ndc.x < 1 && ndc.y > 0 && ndc.y < 1) {
    // 카메라 프레임 안
}
```

### fromNDC

```vex
vector fromNDC(string camera, vector ndc)
```

NDC 좌표를 다시 월드 공간으로 역변환한다.

```vex
string cam = "/obj/cam1";
vector world_pos = fromNDC(cam, set(0.5, 0.5, 10));
// 화면 정중앙, 카메라에서 10 거리의 월드 좌표
```

---

## 활용 예시

**카메라 기반 컬러 매핑**
```vex
string cam = "/obj/cam1";
vector ndc = toNDC(cam, @P);
@Cd = set(ndc.x, ndc.y, 0);
```

**카메라 밖 포인트 제거**
```vex
string cam = "/obj/cam1";
vector ndc = toNDC(cam, @P);
if (ndc.x < 0 || ndc.x > 1 || ndc.y < 0 || ndc.y > 1) {
    removepoint(0, @ptnum);
}
```

> [!TIP]
> `toNDC`는 SOP 레벨의 Wrangle에서 카메라 경로를 문자열로 직접 지정해야 한다. 카메라가 씬에 없으면 오류가 발생하므로 경로를 파라미터로 빼두는 게 좋다.
