---
title: Ancient Ruin Forest setup
category: Game Art
thumbnail: image.png
date: 2025.09
tools: Houdini, Substance 3D, Unreal Engine
featured: true
link: https://www.artstation.com/artwork/1NDAlK
---

## Overview
환경 제작을 위한 Unreal 의 기본적인 기능들 과 조작법을 공부 하기 위해 작업 했다. 대부분 Megascan Asset 을 사용했으며 필요한 것들은 Houdini 에서 제작 되었다. 

## Workflow

### Giant Tree HDA
앙코르 와트의 사원을 감싸는 큰 나무들을 레퍼런스를 베이스로 제작한 나무 HDA. 기본적으로 curve를 인풋으로 받고 그것을 베이스로 나무가 생성된다.

#### Stage Parameter
HDA 내에서 **Stage** 를 오가며 파라미터를 조작할 수 있다. 각 단계별로 조작이 가능하고 불필요한 연산을 피할 수 있다.
![alt text](<2026-04-29 18-44-54_trimmed.gif>)

#### Collision + VDB Vector field
콜리전을 이용하여 나무가 오브젝트를 감싸는 표현을 구현했다. 뿌리의 형태는 VDB Vector field 로 커브를 생성했다. Curve 를 직접 조작 하는 것 보다 유기적이고 자연스러운 모습을 만들 수 있다.
![alt text](main_trimmed.gif)

레퍼런스 나무는 뿌리들과 나무의 몸통이 부드럽게 이어지는 모습을 보여 주기 때문에 VDB 로 합친 후 Highpoly 단계에서 노이즈를 주어 디테일을 넣어 주었다.
![alt text](<2026-04-29 18-09-12_trimmed.gif>)

#### lowpoly
제작된 highpoly 는 폴리곤 수도 많고 디테일도 아주 많기 때문에 lowpoly로 만드는 공정에 노드 연산이 비 효율적으로 높았다. 때문에 자잘한 노이즈는 생략 하고 큰 실루엣은 잃어 버리지 않는 medium 단계의 지오메트리를 따로 만들어 진행했다. 그 결과 예상보다 연산도 빠르고 실루엣도 잃어 버리지 않는 선에서 만족할 만한 lowpoly를 만들 수 있었다.
![alt text](image-3.png)|![alt text](image-4.png)|![alt text](image-2.png)|
--- | --- | -- |
`high` `1.5m` | `medium` `237k` |`low` `8k` |

원하는 모양이 픽스 되면 `refresh` 버튼으로 생성된다. 라이브로 업데이트가 되다 보면 불필요하게 연산 하는 시간이 길어지기 때문에 원하는 결과가 나왔을 때 마지막 단계로 생성해주는 것이 효율적이다.
![alt text](image-8.png)

#### Texture
텍스쳐는 Substance Painter에서 만들어 주었다. 이 단계에서는 이끼의 분포와 껍질의 디테일을 집중적으로 작업했다. 
![alt text](image-5.png)

### Block

반복적으로 배치되는 블럭같은 경우 houdini 의 PDG를 통해 절차적으로 생성되는 워크플로우를 만들었다. 

#### Shape
SDF 로 블럭의 부식 노이즈를 만들고 텍스쳐링에 쓰일 마스크도 만들어 주었다.
![alt text](image-11.png) |![alt text](image-12.png) | ![alt text](image-13.png) | ![alt text](image-14.png) |
--- | --- | --- | --- |

#### Texture
##### UV Box mapping
블럭 형태의 UV는 Box mapping 으로 제작 했다. 하지만 Houdini 에는 Box mapping 하는 노드가 없기 때문에 따로 만들어 주었다.
![alt text](<2026-04-29 20-23-13_trimmed.gif>)

Bake와 Texture 제작은 COPs 에서 진행했다. 텍스처 리소스를 블렌딩하여 활용 하였다.
![alt text](T_stoneBlock_01_B.png) |![alt text](T_stoneBlock_01_R.png)| ![alt text](T_stoneBlock_01_Nt.png)|
--- | --- | --- |
Base Color | Roughness | Normal |



Unreal rendering
![alt text](image-1.png)



## Result

![alt text](image.png)

