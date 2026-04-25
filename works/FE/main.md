---
title: Fire Extinguisher
category: Game Art
thumbnail: works/FE/houdini_Nghg5RPDjt.png
date: 2021.07
tools: Houdini 18.5
featured: true
description: Houdini HDA로 제작한 프로시쥬얼 소화기 에셋. 파라미터 조합으로 다양한 형태의 에셋을 생성할 수 있도록 설계.
---
# Overview
Procedural 소화기 HDA
## Planning
대략적인 노드 구조를 짜보았다. HDA에서 다양한 종류의 에셋을 만들 수 있는것은 중요하지만, 너무 많은 파라미터들은 오히려 독이 될수 있어 계획 단계에서 만들어질 요소들과 상관관계를 정리하고 시작했다.
![alt text](<image (3).png>)
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
호스 모델링, 호스가 시작 되는 부분과 끝부분의 노말 벡터를 이용해 부드럽게 이어지는 커브를 만드로 sweep 으로 두께를 만들었다. 
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
worldposition, objectposition, normal, curvature, ao 등을 활용 해서 개연성 있는 텍스쳐를 만들고자 했다.

텍스쳐 레퍼런스
![alt text](chrome_K3OERJFM1F.png) |![alt text](chrome_KeYIWmdffM.png) |![alt text](chrome_q6e7ljdTX8.png) |![alt text](chrome_vIUu2jPtVT.png)|
--- | --- | --- | --- |

`VEX Material Builder` 에서 VOP 을 이용해 프로 시쥬얼 텍스쳐 생성. worldposition, normal, curvature 을 이용해 먼지가 쌓인 부분, 스크래치 를 생성 하고 노이즈로 도금이 벗겨져 녹슨 부분을
![alt text](<image (1).png>) |![alt text](<image (2).png>)| ![alt text](image.png)|
--- | --- | --- |

![alt text](houdini_vJHVFKLP8m.png) |![alt text](houdini_0N89gLKUaG.png)|
--- | --- |
![alt text](houdini_576HIfqRfz.png) |![alt text](houdini_GX3eHoMIin.png) | ![alt text](houdini_hftveQ7fAL.png)|