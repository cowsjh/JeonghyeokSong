---
title: Fire Extinguisher
category: Game Art
thumbnail: image-17.png
date: 2021.07
tools: Houdini 18.5
featured: true
description: Houdini HDA로 제작한 프로시쥬얼 소화기 에셋. 파라미터 조합으로 다양한 형태의 에셋을 생성할 수 있도록 설계.
---
# Overview
Procedural 소화기 HDA
## Planning
대략적인 노드 구조를 짜보았다. HDA에서 다양한 종류의 에셋을 만들 수 있는 것은 중요하지만, 너무 많은 파라미터들은 오히려 독이 될 수 있어 계획 단계에서 만들어질 요소들과 상관관계를 정리하고 시작했다.
![alt text](<image_10.png>)
### Parameter
- Body
    - 너비
    - 길이
    - 형태

- Hose
    - 타입 A/B
    - Nozzle
        - 크기
        - 길이
- Trolly
    - 타입 A/B
    - 바퀴
        - 두께
        - 크기
    


# Workflow

## Modeling
### Body

실린더의 두께, 길이 핸들의 높이 등 파라미터의 조합으로 여러가지의 형태를 만들 수 있게 설계 했다. 요소들이 실린더를 베이스로 한 포인트에서 제작 되었기 때문에 위치나 각도가 즉시 반영 된다.
![alt text](<2026-04-15 19-03-27_trimmed.gif>)

### Hose
호스 모델링, 호스가 시작 되는 부분과 끝부분의 노말 벡터를 이용해 부드럽게 이어지는 커브를 만들고 sweep으로 두께를 만들었다. 
![alt text](<2026-04-15 18-37-46_trimmed.gif>)
![alt text](44d57109-bf8b-11eb-937a-48df37269ee2_trimmed.gif)

### Trolly

트롤리는 A 타입 B 타입이 있으며 바퀴, 프레임등 세부 요소도 조절 할 수 있다. 실린더를 베이스로 하기 때문에 크기나 변형이 있어도 적용 된다.
![alt text](houdini_mujUK7Byar.png) |![alt text](houdini_vPkfEBOE5u.png)|
--- | --- |
`type A` | `type B`

![alt text](houdini_tezYex0ePb.png) |![alt text](houdini_XvVWbT3Kz8.png) |![alt text](houdini_CdpOSwOlcu.png)|
--- | --- | --- |


## Texturing
worldposition, objectposition, normal, curvature, ao 등을 활용해서 개연성 있는 텍스쳐를 만들고자 했다.

**텍스쳐 레퍼런스**
![alt text](chrome_K3OERJFM1F.png) |![alt text](chrome_KeYIWmdffM.png) |![alt text](chrome_q6e7ljdTX8.png) |![alt text](chrome_vIUu2jPtVT.png)|
--- | --- | --- | --- |

`VEX Material Builder` 에서 VOP 을 이용해 프로 시쥬얼 텍스쳐 생성. worldposition, normal, curvature 을 이용해 먼지가 쌓인 부분, 스크래치 를 생성 하고 노이즈로 도금이 벗겨져 녹슨 부분을 표현했다.
![alt text](<image (1).png>) |![alt text](<image (2).png>)| ![alt text](image.png)|
--- | --- | --- |

바리에이션에 적용한 모습
![alt text](houdini_vJHVFKLP8m.png) |![alt text](houdini_0N89gLKUaG.png)|
--- | --- |
![alt text](houdini_576HIfqRfz.png) |![alt text](houdini_GX3eHoMIin.png) | ![alt text](houdini_hftveQ7fAL.png)|

## Texturing - 2026
`2026.04`
위의 방법은 오래됐기도 하고, 예전에 만들어 놓은 텍스쳐 워크플로우라 현재 쓰기에는 무리가 있다. 게다가 후디니 렌더러에 맞춰서 만들어진 것이기 때문에 이번에 새롭게 Unreal에서 메테리얼을 제작했다.

베이크를 하면 프로시쥬얼 모델링의 장점이 반감된다고 생각 되어 최대한 리소스를 사용하거나 메테리얼을 제작 하는 방식으로 바리에이션을 만들면 좋을 것 같다.

```
1. 대량 인스턴싱을 전제함
2. 베이크 X
```
소화기에는 다양한 재질이 있다. 도금속, 플라스틱, 고무(호스) ... 일단 게이지의 유리 부분은 어쩔수 없지만 다른 부분들은 마스킹으로 분리할 수 있을거라 생각 했다.

### Attribute
#### ID mask
ID 맵을 만드려고 했으나 이것 또한 위와 같은 이유로 다량으로 사용시 텍스쳐도 늘어나기 때문에 vertex color 로 ID 맵을 대체 하기로 했다.
`1.0/재질의 수` 값을 @Cd.r 로 저장하고 Unreal 에서 step으로 필터링 하여 마스크를 제작 했다.
![alt text](Artboard-1.png)

#### Curvature, AO
Houdini 에서 미리 계산된 Curvature 와 AO값을 각 G, B 에 저장 해 주었다.
![alt text](image-2.png)

### Material
일단 녹이나 기타 웨더링을 위해서는 노이즈가 필수 적일 텐데, unreal에서 제공 하는 noise는 비용이 좀 크다.
때문에 웨더링 노이즈 부분은 텍스쳐로 교체.
바디 부분에서 텍스쳐의 심이 제일 잘 보이기 때문에 노이즈 텍스쳐의 사용을 위해서 uv맵을 다시 정렬 해 주었다.
![alt text](image-5.png) | ![alt text](image-6.png) |
--- | --- |
기존의 uv | 0_1로 정렬된 body 파트의 uv |

![alt text](image-3.png) | ![alt text](image-4.png) |
--- | --- |
![alt text](image-9.png) | ![alt text](image-8.png) |
`상) noise 노드` `하) 텍스쳐` | Shader Complexity |


![alt text](<2026-04-27 18-40-27_trimmed.gif>)

텍스쳐는 Substance Designer 로 만들어 주었다. 각 재질별로 2장의 텍스쳐가 쓰였다.
```
RGBA - BaseColor + Roughness
RGB - Normal
```
![alt text](<Artboard 2.png>)

## Result
![alt text](image-16.png)
