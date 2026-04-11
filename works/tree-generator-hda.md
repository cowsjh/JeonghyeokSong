---
title: Tree Generator HDA
category: Game Art
thumbnail: assets/images/TreeGenHDA01.jpg
date: 2026.01
tools: Houdini 21.0, Unreal Engine 5.6
link: https://www.artstation.com/artwork/x3k13R
---

## Overview

나무를 생성 하는 모듈형 HDA. 총 5개의 노드로 구성 되어 있다. 후디니 내부의 노드 방식의 워크플로우는 Speed Tree와 유사 하여 제작에 있어 참고가 많이 되었다. 

---

## How It Works

### Trunk & Branch

L-System을 기반으로 줄기(Trunk)와 가지(Branch)를 생성합니다.

**분기 각도 제어**  
가지마다 분기 각도를 개별로 설정할 수 있습니다. For Each 노드와 함께 사용하면 동일한 각도 설정을 모든 가지에 일괄 적용할 수도 있습니다.

**길이 기반 분기 수 계산**  
분포 단위를 지정하면 가지 길이에 비례해 하위 분기 수가 자동으로 결정됩니다.  
예를 들어 단위를 5로 설정하면 길이 10인 가지에는 하위 분기 1개가 생성됩니다.  
이 방식으로 가지가 깊어질수록 기하급수적으로 늘어나는 문제를 방지합니다.

**랜덤 Cutoff**  
확률적으로 가지를 제거해 자연스러운 불규칙성을 확보합니다.  
계산된 규칙과 랜덤 변화를 조합해 제어 가능하면서도 유기적인 결과를 만듭니다.

---

### Scattering & Card

**Scattering**  
Trunk와 Branch, Foliage 위에 카드를 분포시킵니다.  
Branch 어셈블리는 독립적으로 구성되어 있어, 다른 Trunk나 Branch에 그대로 재연결할 수 있습니다.

**Convert Card**  
3D로 만든 가지와 잎을 2D 카드로 변환합니다.  
이 카드들이 이후 Layout 노드에서 아틀라스로 정리됩니다.

```
나무 A:    Trunk → Branch
가지 a:    Trunk → Branch → Convert Card
                    ↓
Scattering:  나무 A에 가지 a 분포
                    ↓
           Layout → Export
```

가지 a를 독립 어셈블리로 만들어두면 나무 B, 나무 C에도 동일하게 연결할 수 있습니다.

---

### Export & Integration

**Layout**  
UV를 정리하고 아틀라스 배치와 Vertex Color를 설정합니다.  
Convert Card + Layout을 재사용하면 수종이 달라도 동일한 텍스처를 공유할 수 있어 메모리 비용을 줄일 수 있습니다.

**Export**  
완성된 메시를 FBX 또는 USD로 익스포트합니다.

**UE5 Import**  
익스포트된 메시를 UE5 Foliage Tool에 임포트합니다.  
Vertex Color 채널을 활용해 바람 애니메이션 등 셰이더 파라미터를 제어합니다.

---

## Parameters & Controls

<!-- 파라미터 목록 확인 후 작성 -->

---

## Results Gallery

<!-- TreeGenHDA_Variation01.jpg -->
<!-- TreeGenHDA_Variation02.jpg -->
<!-- TreeGenHDA_Variation03.jpg -->

---

## Engine Integration

UE5 Foliage System에 직접 임포트해 레벨 배치까지 연결되는 워크플로우입니다.

**Vertex Color 활용**  
Layout 노드에서 설정한 Vertex Color를 UE5 머티리얼에서 읽어 바람 반응 강도를 제어합니다.  
루트에 가까울수록 고정, 끝 가지로 갈수록 흔들리는 자연스러운 움직임을 표현합니다.

**LOD**  
카드 기반 구조 덕분에 LOD 전환 시 폴리곤 감소폭이 크고, 원거리에서도 실루엣을 유지합니다.

---

## Technical Notes

| 노드 | 역할 | 입력 |
|---|---|---|
| **Trunk** | 나무 줄기 생성 | — |
| **Branch** | 가지 분포 | Trunk / 기존 Branch |
| **Scattering** | 카드 분포 | Trunk + Branch + Foliage |
| **Convert Card** | 3D 가지·잎 → 2D 카드 변환 | Branch |
| **Layout** | UV 정리, 아틀라스 배치, Vertex Color | 전체 |

**For Each 활용**  
For Each 노드를 사용하면 동일한 설정(분기 각도, Cutoff 등)을 복수의 Branch에 일괄 반복 적용할 수 있습니다.  
수작업 반복 없이 일관된 수형을 유지하는 핵심 패턴입니다.

**아틀라스 재사용**  
Convert Card + Layout을 재사용 가능한 어셈블리로 구성해두면, 수종이 달라져도 동일한 아틀라스 텍스처를 공유할 수 있습니다.  
텍스처를 추가로 제작하지 않아도 되므로 메모리 비용과 제작 시간을 모두 줄일 수 있습니다.

---

## Takeaways

**Houdini 통합 파이프라인의 이점**  
SpeedTree처럼 외부 툴로 전환하지 않고 Houdini 안에서 모델링부터 익스포트까지 완결되어, 반복 작업 속도가 크게 향상됐습니다.

**모듈형 설계의 가치**  
노드를 독립 어셈블리로 구성해두면 재사용과 변형이 쉽습니다.  
수형이 달라질 때도 전체를 다시 만드는 대신 일부 노드만 교체하거나 재연결하면 됩니다.

**제어 가능한 랜덤성**  
규칙(L-System, 길이 기반 계산)과 랜덤(Cutoff, 분기 각도 변화)을 조합하면 자연스러우면서도 예측 가능한 결과를 만들 수 있다는 것을 확인했습니다.
