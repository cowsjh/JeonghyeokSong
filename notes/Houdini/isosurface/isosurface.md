---
title: isosurface
date: 2022-10-31
tags: TIP, Volume, GraphicTheory
---

## Isosurface란?

볼륨 데이터 안에서 **동일한 값을 갖는 점들을 이어 만든 표면**이다.

2D에서의 등위선(Contour)을 3D로 확장한 개념으로, 예를 들어 밀도 필드에서 값이 `0.5`인 지점들만 이으면 하나의 곡면이 만들어진다.

> [!NOTE]
> VDB에서 SDF(Signed Distance Field)의 isosurface = 0 이 곧 오브젝트의 표면이다.

---

## Houdini에서의 사용

### VDB from Polygons → Convert VDB

폴리곤을 SDF 볼륨으로 만든 뒤 다시 메시로 추출하는 흐름이 기본이다.

```
Geometry → VDB from Polygons → Convert VDB (Fog to Polygons / SDF to Polygons)
```

### IsoOffset SOP

볼륨을 직접 생성하거나 기존 지오메트리에서 오프셋 표면을 만들 때 사용한다.

| 파라미터 | 설명 |
|---|---|
| Iso Value | 등위면을 추출할 기준값 |
| Offset | 표면에서의 거리 오프셋 |
| Output Type | Surface / Volume / SDF |

### Convert SOP

`IsoOffset`이나 볼륨 시뮬레이션 결과를 폴리곤 메시로 변환할 때 쓴다.

```
Volume → Convert (Convert To: Polygon Soup)
```

---

## SDF와의 관계

SDF(Signed Distance Field)는 isosurface의 대표적인 활용 사례다.

- 값 `0` = 표면
- 값 `< 0` = 오브젝트 내부
- 값 `> 0` = 오브젝트 외부

VDB SDF에서 `Iso Value = 0`으로 Convert하면 원본 표면을 복원할 수 있다.

> [!TIP]
> Pyro나 Fluid 시뮬레이션 결과의 `density` 필드에서 isosurface를 추출할 때는 Iso Value를 낮게 (0.01~0.1) 설정하면 더 얇고 깨끗한 표면이 나온다.

---

## Marching Cubes

Houdini 내부적으로 isosurface 추출에는 **Marching Cubes** 알고리즘이 사용된다.

복셀 그리드를 순회하며 각 셀의 꼭짓점 값이 임계값(iso value)을 기준으로 안/밖으로 나뉘는 지점에 삼각형을 생성하는 방식이다.

해상도가 높을수록 표면이 정밀해지지만 연산 비용도 증가한다.
