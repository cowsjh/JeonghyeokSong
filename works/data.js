// Auto-synced from works/<slug>/main.md — do not edit directly.
// Edit the corresponding .md file, then run: node works-sync.js
window.WORKS = {
  'bakerst': `---
title: Bakerst
category: Tool
thumbnail: paste-20260605160613.webp
date: 2026.06
tools: Unreal Engine, C++, AI
featured: false
order: 
draft: false
link: 
---

## Overview
![](paste-20260605160613.webp)

머티리얼 단일화 플러그인

언리얼 엔진에도 다양한 베이크 기능이 있지만, 한 컴포넌트에 복잡한 여러 머티리얼을 사용하는 오브젝트는 베이크의 결과물이 아쉽다. 또한 높은 해상도는 작업 시간이 오래 걸리기도 하기 때문에 AI의 도움을 받아 플러그인을 제작했다.

### 기존 Bake의 한계
- **Actor Merge — Material Merge** : 여러 액터를 하나로 병합하면서 머티리얼도 합쳐주지만, 다양한 머티리얼을 하나로 베이크할 때는 UV 레이아웃이 비효율적인 모양을 보인다. (화질이 너무 떨어져 보임)
- **BakeTextureFromRenderCaptures (BakeRC)** : GeometryScript에서 제공하는 렌더 캡처 기반 베이크 함수. 복잡한 머티리얼도 베이크가 가능하다. 하지만 카메라 6개를 자동 배치해 캡처하므로, 코너나 오목면처럼 카메라 시야에 들어오지 않는 부분은 텍스처가 비어버리고 조금의 왜곡이 존재한다.

Original | BakeRC | *Bakerst* |
--- | --- | --- |
![](paste-20260605174323.webp)|![](paste-20260605174233.webp)|![](paste-20260605174248.webp)|

BakeRC 방법은 색이 조금 바래 보이거나 캡처 시 조금 왜곡되는 현상이 보인다.
\`\`\`compare
![](paste-20260608095740.webp)
![](paste-20260608095757.webp)
Bakerst
BakeRC
\`\`\`


Bakerst는 이 한계를 해결하기 위해 만든 플러그인으로, **여러 소스 메시의 머티리얼을 하나의 아틀라스 텍스처로 베이크해 단일 머티리얼로 병합할 수 있게 한다.**


## 구조
\`\`\`
Source Actors 
        ↓  BakeSourceActorsToTarget()
Target Mesh (clean UV0)
        ↓
Atlas Textures (BaseColor, Normal, Roughness, Metallic …)
\`\`\`

### Workflow
1. 타겟 메시는 소스 메시들을 병합하고 UV를 깔끔하게 펼쳐 준비한다. — 여기서는 Houdini에서 가공했지만, 언리얼 모델링 모드에서도 충분히 가능할 것 같다. 타겟 메시를 소스 메시들과 동일한 공간에 위치시킨다.
2. 월드에서 소스 액터들 선택
3. 해상도, 경로, 원하는 텍스처맵을 선택하고 베이크한다.

## Algorithm

### TopologyMatching
카메라 없이 UV 공간에서 직접 베이크한다.
소스 삼각형의 무게중심을 기준으로 타겟 표면에 가장 가까운 삼각형을 찾아 UV를 대응시킨다. 

소스·타겟이 동일 월드 위치에 있어야 하지만 해상도 손실이 없고 전체 10종 맵을 지원한다.

#### Cage 메쉬 노멀 베이크
일반적인 베이크는 머티리얼의 노멀맵만 굽고 메쉬 자체의 기하(형상) 노멀은 포함하지 않는다. Bakerst는 이를 보완하기 위해 **cage 광선 베이크**를 추가했다 — 타겟 텍셀마다 표면 법선 방향으로 광선을 쏴 소스 하이폴리 표면에 명중시키고, 그 기하 노멀을 머티리얼 노멀과 합성 한다. **카메라가 없어 구석,오목면도 누락이 없고, 풀해상도 버퍼를 사용하지 않아 메모리 부담이 적다.**
\`\`\`compare
![](paste-20260611154250.webp)
![](paste-20260611154215.webp)
원본 메가스캔 데이터
로우폴리 베이크 데이터+베이크 텍스쳐
\`\`\`

#### 단점
VRAM을 사용하기 때문에 빈 레벨에서 굽는 것을 권장한다. MaterialBaking이 GPU에서 렌더링하는 방식이라, 레벨에 오브젝트가 많으면 VRAM이 부족해져 **결과가 전부 검정**으로 나올 수 있다.

**버추얼 텍스처(VT) 머티리얼**은 결과가 좋지 않다. TopologyMatching은 화면 밖 UV 공간에서 직접 렌더링하는 방식이라 카메라 개념이 없고, VT는 카메라 거리에 따라 해상도가 결정되기 때문에 항상 저해상도 버전으로 샘플된다. SVT(Streaming VT, 메가스캔 타일링 텍스처 등)는 **흐리게**, RVT(Runtime VT)는 **전부 검정**으로 나온다. **VT 머티리얼은 RaycastProjection을 사용할 것.**

### RaycastProjection
소스 메시 주변에 렌더 캡처 카메라 6개를 자동 배치해 머티리얼을 캡처한 뒤 타겟 UV로 투영한다. 버추얼 텍스처가 사용 된 메쉬에 차선으로 사용가능 하다.
임의의 형상 차이에도 동작하지만 카메라 사각지대(코너·오목면)는 누락될 수 있다.

위의 문제는 파라미터로 일정 부분 커버 가능하다.
![](paste-20260617072400.webp)


#### 단점
카메라 사각지대 누락 외에 SSAA 미지원, 맵별 해상도 조정 불가, OpacityMask/AO 미지원.


### Parameters
![](paste-20260611155655.webp)
Parm | Description |
--- | --- |
**Set Sources** | 월드 액터들 선택 후 버튼을 누르면 자동으로 파라미터가 작성된다. |
**Target Material** | 머티리얼에 같은 이름을 공유하는 Texture 2D Parm이 있다면, 자동으로 텍스처를 넣어 메시에 적용시켜 준다. |
**Projection Distance** | 소스-타겟 간 최대 허용 거리 (기본 1.0 cm) - 로우 메시 경우 버텍스 위치가 달라질 수 있기 때문에 값을 높여줘야 한다. |
**Blend Mesh Normal** | (TopologyMatching) ON 시 소스 메쉬 기하 노멀을 cage 광선으로 포집해 머티리얼 노멀과 합성. OFF면 머티리얼 노멀만. |
**Export to Disk** | 이미지를 디스크로 익스포트 |
**Output** | 텍스쳐맵별로 해상도를 개별 조정 |
**SuperSample** | 경계 품질 향상 |

![](<2026-06-08 17-43-59.mp4>)

>[!important]
위치 베이스 베이킹이기 때문에 소스와 타겟 액터는 반드시 월드상 동일한 위치에 있어야 한다.

BaseColor | Normal | Roughness |
--- | --- | --- |
![](Target_Bakerst_BaseColor.webp)|![](Target_Bakerst_Normal.webp)|![](Target_Bakerst_Roughness.webp)|





## Result
Bake RC 보다 훨씬 빠른 속도로 베이크가 가능 하며 불필요 하게 뭉쳐 있는 드로우콜을 풀어 줄 수 있어 좋다. 머티리얼 병합과 함께 하이-로우폴리 노멀 베이크도 가능하다.
Original | Bake |
--- | --- |
![](paste-20260605182517.webp) | ![](paste-20260605182538.webp) |
![](paste-20260605182700.webp) | ![](paste-20260605182647.webp) |



`,

  'Cliff': `---
title: Cliff
category: Game Art
thumbnail: thum.webp
date: 2026.05
tools: Houdini, Zbrush, Substance Painter
featured: false
link : https://www.artstation.com/artwork/ZlNAZX
draft: false
---
## Overview
[HDA](../RockCliffGen/main.md)로 더미 데이터를 생성하여 Zbrush로 제작한 에셋 텍스쳐는 Substance Painter에서 진행했다.
![alt text](ph02.webp)
![alt text](ph03.webp)

## Workflow
### Decimation
지브러시로 스컬프팅한 메쉬를 후디니로 불러와 최적화를 진행했다. Zbrush에서도 기능이 있지만 훨씬 빠른 연산으로 Houdini 에서 작업했다. 베이크용으로 제작한 로우 메쉬를 이용해 텍스쳐를 제작하고 한번 더 폴리곤을 정리해 주었다. 베이크용 로우 메쉬가 폴리곤이 너무 적으면 베이크에 문제가 생기는데 이 절차로 그런 에러를 확실히 줄일 수 있었다.
![alt text](ph01.webp)

스컬프팅 이후에 메쉬가 꼬여 있는 흔적을 종종 볼 수 있는데 이대로 리메쉬를 진행하면 꼬인 면이 그대로 노출 되기 때문에 \`measure\`노드로 필터링 하여 면을 정리 했다.
![](<2026-05-30 01-43-45.mp4>)
`,

  'RockCliffGen': `---
title: Stylized Rock Cliff Generator HDA
category: Game Art
thumbnail: image.webp
date: 2026.05
tools: Houdini, Unreal
featured: true
link: https://www.artstation.com/artwork/lGgKxa
---

## Overview
Stylized 아트 표현을 목표로 제작된 모듈 에셋 생성기. VDB와 하이폴리 사용을 배제하여 폴리곤 수와 베이크 시간을 아끼는 방향으로 제작되었다.
https://www.youtube.com/watch?v=kQhtnKJwX6Q

### 우선 순위
1. Stylized 디테일 구현해 보기
2. 사용 가능한 실루엣
3. VDB·하이폴리 조작 배제

## Workflow

### Vertex Color
Unreal에서의 사용을 염두에 두고 인풋을 버텍스 컬러로 선정했다. 높낮이를 2D로 저장할 수 있는 지형적 특성을 활용하여, 버텍스 컬러는 높이 값으로 변환되어 에셋으로 생성된다.
![alt text](image-9.webp) | ![alt text](image-10.webp) |
--- | --- |
![alt text](houdini_XWSIGpDjmV.webp) | ![alt text](houdini_KFLRxD0jZo.webp) | ![alt text](houdini_n7YZnBJzeG.webp) |


### Clustering
얻은 버텍스 컬러로 마스킹과 클러스터링을 진행했다.
![alt text](<2026-05-16 14-16-31_trimmed.webm>)

바위의 덩어리감을 잡는 방법으로는 \`voronoifracture\`를 먼저 떠올렸다. 하지만 스캐터된 포인트만으로 형태감을 유도하는 것은 쉽지 않았다. 겹치는 부분이 제한적이고 조각의 모양 또한 인위적이어서 추가 공정이 필요했다. \`cluster\`와 \`shrink\` 노드로 덩어리감을 살리고, 클러스터 밀도도 조작할 수 있게 만들었다.
![alt text](image-18.webp) | ![alt text](image-19.webp) |
--- | --- |

### Bevel, Crack
Stylized 작업에서 자주 쓰이는 스컬핑 방식을 참고하여, 바위의 모서리와 크랙 형태를 \`polyextrude\`와 \`polybevel\` 노드로 적용했다. 크랙은 \`edgefracture\` 노드를 활용해 유기적인 패턴을 만들었다.
![alt text](houdini_WHRgTjvI00.webp) 
#### Geometry control
\`polybevel\` 노드는 강력하지만, 프로시쥬얼로 예민한 파라미터를 가지고 있다. 그래서 중간중간 보정이 필요한데, 어느 정도 튀는 포인트는 \`blur\`나 \`smooth\`로 조절할 수 있다. 다만 격하게 튀는 포인트들은 반복문을 쓰거나 값을 높여도 비용만 늘고 결과가 아쉬울 때가 있다. 이 경우에는 안정화 작업 전에 한 번 필터링해 주는 편이 효율적이다.
![alt text](houdini_m9zxRQDVih.webp) | ![alt text](image-17.webp) |
--- | --- |

### UV, Collision, LOD
UV 는 커스텀 Box 매핑 노드를 사용했다.
![alt text](image-1.webp)
후디니는 언리얼과 호환되는 어트리뷰트, 그룹핑 파이프라인을 가지고 있다.[Unreal](https://www.sidefx.com/docs/houdini/unreal/attributes.html)
어트리뷰트와 그룹 네임을 이용해서 Bake 경로, 이름, Collision, LOD 설정을 해주었다.
![alt text](image-2.webp)

## Optimizing
생각보다 생성에 시간이 오래 걸려, 전체적인 최적화를 한번 진행하기로 했다.

- 불필요한 반복 구조 제거
- 불필요 공정 제거
- 메커니즘 교체

### Optimizing Node
HDA에서 가장 불안정한 부분은 크랙과 베벨이 적용되는 단계였다. 지오메트리가 과도하게 찢어지는 현상을 방지하기 위해 안정화 작업을 진행했는데, 이 단계의 연산 시간이 상대적으로 오래 걸려 최적화를 함께 진행했다.
- 노드 교체: blur > smooth
- 필터링 방식 수정

![alt text](image-6.webp)
좌) 수정 전 우) 수정 후

### Result
최적화 + 지오메트리 정리 추가
![alt text](image-20.webp)
지오메트리 시드가 조금씩 바뀐 점을 감안하면, 이전과 같은 아웃풋이 나오는 것을 확인할 수 있다.
![alt text](houdini_tK4uRqQAiu.webp) | ![alt text](image-14.webp) |
--- | --- |
최적화 전 | 최적화 후 |

## Unreal
Vertex Painting을 통해 버텍스 컬러를 입히고 그걸을 베이스로 에셋이 생성 된다. 불필요한 연산은 피하기 위해 파라미터 조작시 collision, lod, polyreduce 등의 포스트 프로세스 파라미터를 분리 시켜 놓았다.
https://www.youtube.com/watch?v=eH-oy7hPmHQ&feature=youtu.be
`,

  'ezcut': `---
title: ezcut
category: Tool
thumbnail: works/ezcut/image.png
date: 2026.04
tools: AI, python
featured: false
order: 
draft: false
link: 
---

## Overview
레퍼런스나 클립으로 제작한 mp4, mkv, mov 등을 상호 컨버팅하는 툴이다. gif를 지원하며 trim 기능이 있어 영상을 간단하게 잘라서 보관할 수 있다.

![alt text](image.png)

### 구조

####  Input
파일을 드래그하거나 파란 박스를 선택해서 파일을 찾는다. 첨부된 파일 확장자를 자동으로 인식한다. 출력 포맷을 설정할 수 있다.
![alt text](image-2.png)

#### Trim
간단한 핸들로 영상을 자르는 기능을 제공한다.
스크롤 - 타임라인 확대
드래그 - 클립 영역 이동     
![alt text](<2026-04-20 14-51-12_trimmed.webm>)


### 설정
간단한 아웃풋 설정이 가능하다.
![alt text](image-1.png)
`,

  'desertbiom': `---
title: Desert Biom (PCG)
category: Game Art
thumbnail: image.webp
date: 2026.01
tools: Unreal Engine, Houdini, Zbrush, Substance Designer
featured: true
order: 1
link : https://www.artstation.com/artwork/Zlr0WG
---

## Overview
PCG 공부를 위해서 작업해본 바이옴 셋업.
## Workflow
유연한 영역 설정이 가능한 Spline을 채택했고 노이즈의 조합으로 인스턴싱되는 요소들을 배치했다. 자연적인 패턴을 노이즈의 적당한 비율로 구현하는 것이 시간이 조금 걸렸다. 아무래도 너무 뭉치거나 퍼지거나 해도 안 되고 패턴이 너무 보이는 것도 피해야 했다.

### Landscape
Houdini에서 제작되었다.

#### Material
[MW_Landscape Auto Material](https://fab.com/s/0c488c6f4347)을 참고해서 구현했다. 지형의 slope 값을 이용한 mask로 텍스쳐를 배치했다.

### PCG_Biom
가장 많이 쓰이고 베이스가 되는 셋업이다.
기본 요소로는 돌, 부쉬, 풀, 나무, 마른 나무 가지 - 총 5개로 구성되어 있다.

![alt text](image-2.webp)

파라미터의 조합으로 다양한 컨셉을 구현할 수 있다. 
![](<pcg01.mp4>)

### PCG_Rock

큰 바위는 Zbrush에서 작업되었으며, 하나의 메쉬를 최대한으로 활용하고 싶었기 때문에 한 메쉬에서 3가지 정도의 실루엣이 나올 수 있게 디자인했다. \`PCG_Biom\`을 응용해서 큰 바위 주변에 \`PCG_Biom\`과 같은 패턴의 메쉬들이 인스턴싱될 수 있게 셋업했다. 그 결과 landscape와 바위 메쉬의 경계선도 가릴 수 있게 되었고 더욱 자연스러운 느낌을 만들 수 있었다.
![](<CineCameraActor4-1.mp4>)

### PCG_Road
Unreal의 spline road 시스템을 이용해서 주변에 돌을 인스턴싱했다. 추가로 차 바퀴 자국용 PCG를 제작해서 기존에 있는 길의 패턴을 깨주는 용도로 사용했다. 도로의 텍스쳐는 Substance Designer에서 제작되었으며 Virtual Texture를 이용해서 landscape와 블렌딩 시켜 주었다.
![alt text](image-3.webp)

### Material

#### Big Rock
바위는 씬에서 비교적 큰 오브젝트이기 때문에 메테리얼을 따로 제작해 주었다. 버츄얼 텍스처링으로 랜드스케이프와 블렌딩시켜 주었고 픽셀 노말을 이용하여 모래가 덮인 느낌을 구현했다.
![alt text](image-6.webp) | ![alt text](image-7.webp) | ![alt text](image-5.webp) |
--- | --- | --- |

#### LandScape

랜드스케이프의 기울기를 통해 여러 장의 텍스쳐를 레이어링하였다. 각 레이어의 텍스쳐 팩들은 메테리얼 펑션을 제작해 파라미터로 조작 가능하다.
![alt text](image-8.webp) | ![alt text](image-9.webp) |
--- | --- |

### Optimization
셋업을 마친 후에 PCG 내부에서 \`Profiling\` 탭을 이용한 노드 프로파일링을 진행했다. \`Scale by Density\` 노드가 상당 부분 연산 시간을 잡아먹는 것을 볼 수 있다. \`Density\` 어트리뷰트를 이용해서 스케일을 조정하는 노드이다. \`Scale by Density\`는 \`PointBodyLoop\`가 내장되어 있어 포인트가 많을 경우 연산 시간이 많이 늘어난다. 때문에 간단한 연산은 네이티브 노드들로 교체하는 것이 가장 좋다.
블루프린트 노드의 교체와 전체적으로 노드 수를 줄이는 최적화도 진행했다. 아래는 같은 파라미터를 가진 최적화 전후의 차이이다.
![alt text](image-4.webp)
![alt text](UnrealEditor_mPFYwplYyw.webp)
![alt text](image-10.webp)
왼쪽이 기본 셋업, 오른쪽이 최적화 후 셋업


## Result
![alt text](image.webp)
![alt text](image-1.webp)`,

  'tree-generator-hda': `---
title: Tree Generator HDA
category: Game Art
thumbnail: works/tree-generator-hda/TreeGenHDA01.webp
date: 2026.01
tools: Houdini 21.0, Unreal Engine 5.6
link: https://www.artstation.com/artwork/x3k13R
featured: true
order: 0
description: 모듈식 프로시쥬얼 나무 에셋 제작을 위한 Houdini HDA. SpeedTree의 노드 워크플로우에서 영감받아 확장성에 집중하여 구현.
---

# Overview

모듈식 프로시쥬얼 에셋에 대한 이해를 위해 구현해본 작업물. 노드 기반 워크플로우를 가진 SpeedTree에서 영감받아 만들어졌다. 실제로 구현이나 파라미터 디자인을 많이 참고했다. 확장성에 최대한 집중하며, 가능한 많은 것들을 구현할 수 있는 툴을 지향했다.
![wallpaper](TreeGenHDA01.webp)
https://www.youtube.com/watch?v=IOFI6T4mfyU

## 목표
1. bake는 하지 않고 재사용 가능한 텍스쳐 소스로 제작 하는 워크 플로우
2. 노드 구조 적극 활용
3. 확장성
4. 아트
5. 개인 작업이라고 대충 만들지 않기



# Workflow

## Nodes

- Trunk
- Branch
- Convert Card
- Scattering
- Card Layout
https://www.youtube.com/watch?v=mKwSIvJYMk4&feature=youtu.be

## Key Attributes
모듈식 워크플로우를 구현하려면 어트리뷰트 관리가 아주 중요하다는 걸 느꼈다. 아래는 모듈식 구성의 핵심 어트리뷰트들이다.
\`\`\`
s@part : trunk, branch, leaf
s@type : skin, card, curve, ribbon, ribbon_curve
s@name
    - 가지 하나당 고유 이름
s@path
    - 가지가 생성된 부모 가지의 경로
i@level
    - 가지 레벨 (트렁크 = 0)
s@tag
    - 노드에서 생성될 때마다 부여되는 고유 태그
s[]@tags
    - 나무에 들어간 모든 태그들
\`\`\`

## Trunk, Branch
기본적으로 하위 노드의 아웃풋을 받아오며 레벨을 쌓아가는 구조이다. 다양한 그룹핑과 조건으로 랜덤한 생성이 가능하고 여러 파라미터를 조합하여 많은 패턴을 생성 가능하다. Branch 노드는 유일하게 input과 output을 모두 공유하는 노드이기 때문에 내부적으로 재사용이 가능한 어트리뷰트의 관리가 아주 중요했다. 그 결과 노드 구조를 응용한다면 만들어놓은 가지 셋업을 여러 나무에 붙여 재사용한다던지, for 노드 안에서 가지를 반복시킬 수도 있다.
![](branchnode.webp)

나무를 디자인할 때는 원하는 부분은 독립적으로 만들고 후에 합쳐 완성할 수 있다. 이 기능은 어떤 걸 추가하고 있는지 명확하게 보이는 장점도 있지만, 노드 가독성에도 효과가 좋았다.
![alt text](<2026-04-15 01-30-12_trimmed.webm>)

가지들은 분기를 가지고 부모 레벨에서 자라나는데 이때 **이어지게 보이는 것** 이 중요하다. VDB나 boolean으로 지오메트리를 강제적으로 붙일 수도 있겠으나 폴리곤이 중요한 게임용 에셋에선 비싼 비용이 들어가는 방법들을 마구잡이로 쓸 수 없었다. 때문에 다른 방법을 쓰기로 했는데 그것이 노말 블렌딩이다. **가지가 돋아나는 시작점의 노말을 부모 가지와 블렌딩시켜 주는 것이다.** 노말 블렌딩은 게임에서 자주 쓰이는 방법으로 폴리곤을 건들지 않아도 된다는 장점이 있다. 기존 labs Tree 노드에도 이러한 기법을 사용한다.
![](branch04.webp)|![](branch03.webp)|![](branch05.webp)|
--- | --- | --- |
\`before\` | \`after\` | 

나무는 랜덤하게 뻗어나가는 가지만 있는 것은 아니다. 수종에 따라 독특한 패턴을 띠며 자라는 것들 중 white pine tree를 참고했다. 이 수종은 가지들이 수평적으로 자라나면서 옆으로 퍼져나간다. 이 부분에선 Labs Tree를 참조해 가지의 중심각을 파라미터를 통해 패턴화시켜 주었다. **90, 180, 137.5, random 총 4가지의 패턴을 사용할 수 있으며 특정 패턴을 반복적으로 사용하며 원하는 모양의 나무를 디자인할 수 있게 만들었다.**
![alt text](<2026-04-14 02-26-11_trimmed.webm>)

같은 맥락으로 force 파라미터는 나무의 컨셉을 잡는 데 중요한 기능을 한다. 말 그대로 가지가 힘을 받고 변형되는 방향과 세기를 정한다. **force는 중첩시킬 수 있으며 force가 적용되는 순서를 변경하면서 다양한 모양을 만들 수 있다.**
![alt text](<2026-04-14 02-45-53_trimmed.webm>)

내부적으로 노드는 인풋으로 받은 지오메트리를 에셋에서 사용 가능하게 재구성하기 때문에 외부에서 자유롭게 지오메트리를 조작해도 오류없이 출력할 수 있다. 이를 이용하여 원하는 쉐잎을 보다 쉽게 얻을 수 있다.
![alt text](image-1.webp)


## Convert Card, Scattering
Card convert와 Scattering 노드는 이 HDA의 핵심 기능이다. 어떻게 조합하느냐에 따라서 다양한 디테일을 추가하고, 폴리곤 비용을 줄일 수 있다. Card convert 노드는 외부에서 가져오거나 모듈에서 자체 제작한 3D 지오메트리를 에셋에서 사용할 수 있는 card 형태의 지오메트리로 변환된다. 이때 UV를 저장하여 마지막 Layout 노드에서 아틀라스로 변환된다. Scattering 노드는 이렇게 만들어진 카드들을 기존에 있는 skin 또는 card에 인스턴싱시켜준다. **이 과정에서 폴리곤을 25% 수준으로 줄일 수 있었다.**

![](scattering03.webp)|![](scattering02.webp)|![](scattering01.webp)|
--- | --- | --- |
\`High Poly\`|\`Card Converting\`|\`Texturing\`


1차원의 커브 위에 가지를 인스턴싱하는 방법과 달리 2차원의 카드 위에 인스턴싱할 때에는 다른 필터링이 필요했다. 처음엔 scatter 노드로 포인트를 생성하고 그 위에 인스턴싱을 하는 구조를 생각했으나, 포인트를 생성하는 2차 비용이 발생하고, 필터링도 복잡한 과정이 예상되어 더 간단한 구조를 생각했다. 어차피 card로 메쉬를 가공할 때 일정한 간격의 포인트들이 카드 안에 존재하기 때문에 이를 활용하면 더 싸고 직관적인 조작이 가능했다. 카드는 기본적으로 root(B), mid(R), tip(G) 그룹을 가진다. **root는 카드를 인스턴싱할 때 피봇으로 사용된다. mid와 tip은 다른 카드들을 인스턴싱할 때 소스 포인트로 사용된다.** mid와 tip을 나눈 이유는 잎과 가지의 관계 때문이다. 중간용 가지를 따로 만들면 문제가 되진 않겠지만, 상대적으로 얇은 가지 끝에서 또 다른 가지가 난다는 것이 어색하기 때문이다.
![alt text](<2026-04-14 15-33-28_trimmed.webm>)
![alt text](<2026-04-14 16-21-28_trimmed.webm>)
![alt text](image.webp)|![alt text](image-4.webp)|![](image-3.webp)|
--- | --- | --- |
\`prims 1,878\` \`points 1,754\` |||

가지를 카드로 만들고 인스턴싱하는 방법은 원하는 모양을 찾기 힘들 수 있기 때문에 다른 워크플로우를 추가로 고안했는데, 하이 폴리로 만들어진 나무에서 원하는 레벨의 특정한 가지를 카드로 선별하는 기능이다. 해당 기능은 파라미터로 가지를 선별하고 원하는 방향에서 프로젝션하여 카드로 만들 수 있다. 이 과정에서 x, y, z 평면을 참조하는 방법을 사용했지만 **좀 더 직관적인 조작이 필요하다고 느껴 파이썬과 VEX를 통해 카메라 프로젝션을 도입했다.** 확실히 원하는 모양의 레퍼런스를 쉽고 빠르게 찾을 수 있었다.
![alt text](<2026-04-14 01-01-49_trimmed.webm>)

Card Convert 노드는 ribbon 타입을 지원한다. **ribbon 타입은 카드보다 폴리곤을 조금 더 쓰지만 훨씬 입체적**이며 상황에 따라서는 카드보다 훨씬 뛰어난 룩을 얻을 수 있다. 특히 작은 가지들의 디테일을 가진 경우 효과가 좋다.
![alt text](<2026-04-14 17-36-02_trimmed.webm>)
![alt text](houdini_U289vRYpT5.webp) |![alt text](houdini_gHJ2ultunc.webp)  |
---|---|
\`prims 86,388\` \`points 99,112\` \`highpoly\`| \`prims 13,936\` \`points 30,946\` \`ribbon\`|

또한 texture 모드를 지원하여 아틀라스 텍스쳐 팩이 있다면 해당 잎의 폴리지 카드를 쉽게 뽑아낼 수 있다.
![](convertcard01.webp)

## Card Layout

최종적으로 uv 정리, 아틀라스 제작, normal 블렌딩, vertex color 생성 등이 이루어지는 마지막 노드이다. Layout 노드 사용 시 사용되었던 모든 카드의 \`skin\`과 \`card\` 지오메트리를 인풋 2, 3에 연결시켜 주어야 한다.

COPs를 이용해서 아틀라스의 basecolor, normal, roughness, mask를 제작했다. \`card\`에서 uv를 보존하여 texture를 샘플링하고 Extrapolate Boundaries 노드로 마무리 해주었다. normal 같은 경우는 나뭇잎이나 가지의 height 텍스쳐를 Height to Normal 노드로 변환하는 과정을 거친다.

같은 카드를 재사용하면 아틀라스 리소스 하나로 여러 개의 나무를 제작할 수 있다.

![](layout05.webp)
<!-- ![alt text](layout01.webp)|![alt text](layout02.webp) |
--- | --- | -->

![alt text](layout04.webp)

Layout 노드에서 부여되는 vertex color는 아웃풋 어트리뷰트 중 엔진에서 쓸만한 것들을 다듬어 놓은 것이다.
\`\`\`
R = AO
G = Value ( 뿌리와 멀어질 수록 낮은 값. )
B = Curvature
\`\`\`
![alt text](layout03.webp)

## Unreal

### Card Material
![alt text](image-6.webp)
카드 메테리얼은 리얼한 나무의 느낌을 주기 위해서 중요한 요소이다.
![alt text](image-2.webp)
잎의 wind세기 sss 색상 등을 조절 할 수 있게 해주었다. Houdini 에서 가공한 vertex color 를  wind offset 부분에서 사용 하였다. wind는 카드마다 포지션 마다 랜덤한 방향이 지정된다.
![](<2026-05-29 21-51-28-1.mp4>)

#### Foliage Fade
카메라의 거리, 면의 방향 에 따라서 DitherTemporalAA 노드를 활용해 자연스러운 블렌딩을 구현했다.
![alt text](image-7.webp) | ![alt text](image-8.webp) |
--- | --- |

# Result
노드 구조에 대한 테스트. 노드 특성상 재활용이 가능하다는 큰 장점이 있는데, 원하는 잔가지 + 잎의 디자인을 제작했다면 일관성을 가지고 다른 가지에도 적용시킬 수 있다.
![](jh-render02-0001.webp)
Branch 노드를 통한 뿌리 디자인과 카드 인스턴싱의 반복 패턴에 대한 테스트. 뿌리 자체는 가지와 같은 메커니즘으로 해석하여 따로 노드는 제작하지 않았고 대신 Branch 노드에서 포괄적으로 다룰 수 있게 디자인했다.
![](jh-render02-0002.webp)
일정한 층을 가지고 있는 듯한 소나무를 통해 Branch 노드의 패턴을 테스트해보았다. 이런 패턴은 노이즈나 랜덤성으로만 구현하기에는 무리가 있고 규칙을 가진 파라미터로 표현이 가능하다.
![](jh-render02-0003.webp)
가지와 잎의 클러스터링 패턴 테스트. 필터링 파라미터를 이용하여 뭉쳐 보이는 패턴을 구현하여 자연스러운 연출이 가능하게 디자인했다.
![](jh-render02-0004.webp)
![](jh-render02-0005.webp)
![](jh-cinecameraactor-0001.webp)
![](jh-render02-0007.webp)
스타일라이즈 테스트, [Lip Comarella 의 컨셉아트](https://www.artstation.com/artwork/ao4bq)를 레퍼런스 하였다.

물론 SpeedTree보다는 기능이 적지만, 원하는 퀄리티에 따라서는 다른 프로그램을 따로 사용하지 않고 Houdini 안에서 끝나는 공정이 큰 장점이 된다. 데칼 기능이나 python viewer states의 추가로 편의성을 조금 더 높일 수 있을 것 같다.`,

  'HARIO_V60_driper_server': `---
title: HARIO V60 Driper, Server
category: Game Art
thumbnail: image_01.webp
date: 2025.12
tools: Blender, Substance Painter
featured: true
link: https://www.artstation.com/artwork/AZxEZq
---
심한 웨더링보다는 현실적인 사용감에 집중해본 작업
![alt text](image-1.webp)
![alt text](image-2.webp)
![alt text](image-3.webp)
![alt text](image-4.webp)
![alt text](image-5.webp)
![alt text](image.webp)`,

  'MushRoomHDA': `---
title: Mushroom HDA
category: Game Art
thumbnail: image.webp
date: 2025.11
tools: Houdini, Substance Painter
featured: true
order: 2
link: https://www.artstation.com/artwork/RKGgJe
---

## Overview
하나의 컨셉을 가진 버섯 에셋을 만들어 보았다. 다양한 버섯을 위한 범용적인 셋업은 아니지만 파라미터 조절로 **개연성 있는 성장 단계**를 구현해보고 싶었다. 
버섯의 전체적인 크기를 기준으로 단계가 정해진다.
![alt text](image-1.webp)
![alt text](image-2.webp)
## Workflow
Module 형식으로 제작한 이유는 사용자가 노드 중간에서 지오메트리를 조작할 수 있도록 하기 위해서다. 또한 하이 메쉬로 제작되기 때문에 순차적으로 빌드하는 것이 효율이 좋을 거라고 생각했다.
![alt text](image-3.webp)

버섯의 분포는 지정된 파라미터로 쉽게 조작할 수 있게 구성했다.
![alt text](timeline-1_trimmed.webm)

### Pattern
대부분의 패턴은 VOP 안에서의 attribute와 noise를 조합하여 제작되었다.
![alt text](<2026-04-28 18-27-55_trimmed.webm>)

### Lowpoly
highpoly와 lowpoly가 병렬적으로 생성되는 워크플로우를 채택했다. 각 노드의 연산 비용이 증가하지만 UV 보존을 용이하게 하고 내가 원하는 디테일을 의도적으로 보존할 수 있다는 확실한 장점이 있다.
![alt text](image-8.webp) | ![alt text](image-7.webp) |
--- | --- |



### Texture
Houdini 내에서 lowpoly, highpoly, IDmap(VertexColor), UDIM 등의 Substance Painter 에서 사용할 요소들이 만들어진다. 때문에 master material을 하나 만들어 놓고 일괄적으로 적용 가능하게 구성하였다.
![alt text](image-9.webp) | ![alt text](image-6.webp) |
--- | --- |

> [!NOTE]
> 지금 워크플로우는 한 번에 여러 오브젝트를 만들지만, 하나씩 생성 후에 Unreal 내부에서 레벨로 만들어 사용하거나 인스턴싱하는 방식도 괜찮을 것 같다.

![alt text](image-4.webp)

## Result
![alt text](image.webp)
`,

  'Snowrock': `---
title: Snow Rock Texture
category: Game Art
thumbnail: works/Snowrock/jh-rock-01.jpg
date: 2025.10
tools: Substance Designer
featured: true
---

## Overview

Substance Designer 공부를 위한 텍스쳐 제작

![alt text](jh-rock-01.jpg)

## Workflow
HDA 같은 에셋을 만들어 보고 싶어 이것저것 건드려보다가 Pixel Processor를 발견했고, 이것을 이용하여 간단한 마스크 툴을 제작해 보았다.
Substance Painter에 있는 light와 동일한 기능을 가진 툴이다. 라이트 종류는 direction, point 두 가지를 지원한다.

![alt text](2025-10-24-00-26-11_trimmed.webm)
![alt text](jh-adobe-substance-3d-designer-hoi5912muo.jpg)

만든 light map 을 이용해 눈을 만들어 보았다.
![alt text](jh-snow-01.jpg)
![alt text](jh-snow-02.jpg)`,

  'AncientRuinForest': `---
title: Ancient Ruin Forest setup
category: Game Art
thumbnail: image.webp
date: 2025.09
tools: Houdini, Substance 3D, Unreal Engine
featured: true
link: https://www.artstation.com/artwork/1NDAlK
---

## Overview
환경 제작을 목적으로 Unreal의 기본 기능들을 익히며 작업했다. 대부분 Megascan Asset을 사용했으며 필요한 에셋들은 Houdini에서 직접 제작했다.

## Workflow

### Giant Tree HDA
앙코르와트 사원을 감싸는 나무를 레퍼런스로 제작한 HDA. 기본적으로 curve를 인풋으로 받아 나무가 생성된다.

#### Stage Parameter
HDA 내에서 **Stage** 를 오가며 파라미터를 조작할 수 있다. 각 단계별로 조작이 가능하고 불필요한 연산을 피할 수 있다.
![alt text](<2026-04-29 18-44-54_trimmed.webm>)

#### Collision + VDB Vector field
콜리전을 이용하여 나무가 오브젝트를 감싸는 표현을 구현했다. 뿌리의 형태는 VDB Vector field로 커브를 생성했다. Curve를 직접 조작하는 것보다 유기적이고 자연스러운 모습을 만들 수 있다.
![alt text](main_trimmed.webm)

레퍼런스 나무는 뿌리와 몸통이 부드럽게 이어지는 모습이기 때문에 VDB로 합친 후 하이 폴리 단계에서 노이즈를 주어 디테일을 넣어주었다.
![alt text](<2026-04-29 18-09-12_trimmed.webm>)

#### lowpoly
제작된 하이 폴리는 폴리곤 수와 디테일이 많아 로우 폴리 로 변환하는 과정에서 노드 연산 비용이 컸다. 자잘한 노이즈는 생략하고 큰 실루엣을 유지하는 중간 단계의 지오메트리를 거쳐 진행했다. 그 결과 예상보다 연산이 빠르고 실루엣을 잃지 않는 선에서 만족스러운 로우 폴리 를 만들 수 있었다.
![alt text](image-3.webp)|![alt text](image-4.webp)|![alt text](image-2.webp)|
--- | --- | -- |
\`high\` \`1.5m\` | \`medium\` \`237k\` |\`low\` \`8k\` |

원하는 모양이 픽스되면 \`refresh\` 버튼으로 생성된다. 라이브 업데이트는 연산 시간이 불필요하게 길어지기 때문에 원하는 결과가 나왔을 때 마지막 단계로 생성하는 것이 효율적이다.
![alt text](image-8.webp)

#### Texture
텍스쳐는 Substance Painter에서 만들어 주었다. 이 단계에서는 이끼의 분포와 껍질의 디테일을 집중적으로 작업했다. 
![alt text](image-5.webp)

### Block

반복 배치되는 블럭의 경우 Houdini의 PDG를 통해 절차적으로 생성되게 디자인했다.

#### Shape
SDF 로 블럭의 부식 노이즈를 만들고 텍스쳐링에 쓰일 마스크도 만들어 주었다.
![alt text](image-11.webp) |![alt text](image-12.webp) | ![alt text](image-13.webp) | ![alt text](image-14.webp) |
--- | --- | --- | --- |

#### Texture
##### UV Box mapping
블럭 형태의 UV는 Box mapping 으로 제작 했다. 하지만 Houdini 에는 Box mapping 하는 노드가 없기 때문에 따로 만들어 주었다.
![alt text](<2026-04-29 20-23-13_trimmed.webm>)

Bake와 Texture 제작은 COPs에서 진행했다. 텍스처 리소스를 블렌딩하여 활용했다.
![alt text](T_stoneBlock_01_B.webp) |![alt text](T_stoneBlock_01_R.webp)| ![alt text](T_stoneBlock_01_Nt.webp)|
--- | --- | --- |
Base Color | Roughness | Normal |



![alt text](image-1.webp)




## Result

![alt text](image.webp)

`,

  'RugFattern': `---
title: Rug Pattern (COPs)
category: Game Art
thumbnail: image.webp
date: 2025.09
tools: Houdini
featured: true
link: https://www.artstation.com/artwork/QK51EE
---
## Overview
Houdini COPs에서 지오메트리 데이터를 활용해 Procedural 러그 텍스처를 제작했다. 그리드 지오메트리를 인풋으로 받아 영역, 코너, 테두리 정보를 마스크로 분리해 각 구역에 서로 다른 패턴을 자동으로 배치한다.
![alt text](image-1.webp)

## Workflow

### Patterns
\`SDFshape\`와 \`curve3d\`를 적극 사용해서 문양을 제작했다.
![alt text](image-6.webp) | ![alt text](image-7.webp) |
--- | --- |

![alt text](<2026-04-30 00-00-09_trimmed.webm>)

### Geometry Data

러그는 중앙, 코너, 테두리 세 영역에 각각 다른 패턴이 들어가야 하기 때문에, 그리드를 인풋으로 크게 3가지 섹션으로 나눠 COPs 안에서 마스킹으로 사용하였다.
 ![alt text](image-14.webp) |![alt text](image-12.webp) |![alt text](image-13.webp) |
--- | --- | --- |

테두리 부분의 point 데이터를 이용해서 패턴을 인스턴싱하였다. point의 @N으로 패턴의 방향을 설정했다.
![alt text](image-2.webp) | ![alt text](image-3.webp) |
--- | -- |
![alt text](image-4.webp) | ![alt text](image-5.webp) |

grid의 경계 부분의 포인트 데이터로 러그의 마감 부분의 짜임 패턴을 인스턴싱하였다.
![alt text](image-9.webp) | ![alt text](image-10.webp) |
--- | --- |



### Weave Pattern

\`tilepattern\` 노드는 Substance Designer의 tile 노드들과 동일한 기능을 한다.
![alt text](image-11.webp) | ![alt text](image-8.webp) |
--- | --- |


## Result
지오메트리 데이터를 텍스처 제작에 직접 활용하는 COPs만의 워크플로우로, 패턴의 배치, 방향, 밀도를 그리드 인풋 하나로 일괄 제어할 수 있었다. COPs는 Houdini의 지오메트리와 시뮬레이션을 활용한 독특한 패턴 제작에서 강점을 보이지만, 노드의 안정성과 다양성 면에서는 Substance Designer에 비해 아쉬운 부분이 있어 일반적인 텍스처 작업에는 후자가 더 효율적인 선택이 될 수 있다.`,

  'parmstore': `---
title: File Cache parm
category: Tool
thumbnail: works/parmstore/image-1.webp
date: 2023.11
tools: python
featured : false
---
## Overview

많은 지오메트리나 작은 복셀의 시뮬레이션에 대한 뷰포트 연산 속도나 노드 네트워크 cook 시간에 영향을 주게 되면서, 작업시 버퍼링을 대기하는 시간이 길어진다. 이를 조금이나마 해결하고자 고안한 툴. 렌더팜과 함께 사용하면 효과가 좋다. 셋업을 마무리하고 복셀 사이즈나 포인트를 살짝만 더 높은 값으로 저장해 놓으면 로우 셋업에서 작업을 쉽게 진행한 후 결과만 저장된 값으로 볼 수 있다.
>[!note]
>PDG와 유사한 메커니즘이지만 파라미터만 저장하기 때문에 훨씬 단순하고 쉽게 사용할 수 있다.

## How to use
1. 원하는 파라미터 첨부 (드래그 드랍)
2. build 버튼 클릭
3. 원하는 값 기입
4. 캐시
![alt text](<2026-04-20 16-54-44_trimmed.webm>)

셋업을 수정할때 최적화 셋업을 꺼놓고 확인 해 보는 경우가 많은데, 이 경우 스위치 파라미터를 저장함으로써 최종 결과에 반영되는 최적화를 쉽게 보존시킬 수 있다.
![alt text](image-2.webp)

Advanced -> Script 섹션의 render script에서 경로의 python 파일을 받아와 작동한다. HDA가 아니기 때문에 houdini module을 사용할 수 없었고, 코드를 따로 관리하고 싶어서 이 방식을 따랐다.
![alt text](image-1.webp)`,

  'hip-manager': `---
title: Hip Manager
category: Tool
thumbnail: works/hip-manager/image.png
date: 2023.09
tools: python
featured : false
---


## Overview

프로젝트가 진행되다가 이전의 셋업이 필요하거나 할 때 찾기가 힘든 경우가 있어 hip 파일의 버전 관리를 조금 더 세분화하기 위한 Houdini python panel이다. 1차적으로 색상을 통해 시각적으로 분류하고 메모로 세분화한다. 날짜나 시간도 기입이 가능하고, preset 버튼으로 pub, render, submit 등 체크해 놓을 수 있다. 메모 내용 검색을 통해 파일을 찾을 수도 있다.

왼쪽 상단 부터 - \`색상\`, \`버전 추가\`, \`새로고침\`, \`검색\`, \`파일 삭제\`
![alt text](image.png)

\`새창에서 파일 열기\`, \`메모 창\`, \`preset 버튼\`
![alt text](image-2.png)

#### Color
텍스트의 색상을 통해 먼저 선별하는 것이 흐름을 알기 좋다.
![alt text](image-1.png)

#### Note, Search
노트의 내용을 통해 버전을 검색할 수 있다.
![alt text](<2026-04-20 12-08-49_trimmed.webm>)

#### JSON
노트와 색상 같은 정보는 전부 hip 경로에 있는 backup 폴더에 저장된다. 그렇기 때문에 새로운 프로젝트 씬이라면 저장을 한번 해주어야 한다.
경로 : \`./backup/HipManagerInfos.json\`
![alt text](image-5.png)

### 설치

#### PySide 모듈 설치
\`\`\`
pip install pyside6
\`\`\`
#### Houdini python panel
\`\`\`
import sys, imp
sys.path.append('경로')
import VersionManager_v02

imp.reload(VersionManager_v02)

def onCreateInterface():
    widget = VersionManager_v02.VersionManager()
    return widget

\`\`\`
`,

  'FE': `---
title: Fire Extinguisher
category: Game Art
thumbnail: image-17.webp
date: 2021.07
tools: Houdini 18.5
featured: true
description: Houdini HDA로 제작한 프로시쥬얼 소화기 에셋. 파라미터 조합으로 다양한 형태의 에셋을 생성할 수 있도록 설계.
---
# Overview
Procedural 소화기 HDA
## Planning
대략적인 노드 구조를 짜보았다. HDA에서 다양한 종류의 에셋을 만들 수 있는 것은 중요하지만, 너무 많은 파라미터들은 오히려 독이 될 수 있어 계획 단계에서 만들어질 요소들과 상관관계를 정리하고 시작했다.
![alt text](<image_10.webp>)
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

실린더의 두께, 길이, 핸들의 높이 등 파라미터의 조합으로 여러 가지의 형태를 만들 수 있게 설계했다. 요소들이 실린더를 베이스로 한 포인트에서 제작되었기 때문에 위치나 각도가 즉시 반영된다.
![alt text](<2026-04-15 19-03-27_trimmed.webm>)

### Hose
호스 모델링, 호스가 시작되는 부분과 끝부분의 노말 벡터를 이용해 부드럽게 이어지는 커브를 만들고 sweep으로 두께를 만들었다.
![alt text](<2026-04-15 18-37-46_trimmed.webm>)
![alt text](44d57109-bf8b-11eb-937a-48df37269ee2_trimmed.webm)

### Trolly

트롤리는 A 타입 B 타입이 있으며 바퀴, 프레임등 세부 요소도 조절 할 수 있다. 실린더를 베이스로 하기 때문에 크기나 변형이 있어도 적용된다.
![alt text](houdini_mujUK7Byar.webp) |![alt text](houdini_vPkfEBOE5u.webp)|
--- | --- |
\`type A\` | \`type B\`

![alt text](houdini_tezYex0ePb.webp) |![alt text](houdini_XvVWbT3Kz8.webp) |![alt text](houdini_CdpOSwOlcu.webp)|
--- | --- | --- |


## Texturing
worldposition, objectposition, normal, curvature, ao 등을 활용해서 개연성 있는 텍스쳐를 만들고자 했다.

**텍스쳐 레퍼런스**
![alt text](chrome_K3OERJFM1F.webp) |![alt text](chrome_KeYIWmdffM.webp) |![alt text](chrome_q6e7ljdTX8.webp) |![alt text](chrome_vIUu2jPtVT.webp)|
--- | --- | --- | --- |

\`VEX Material Builder\`에서 VOP을 이용해 프로시쥬얼 텍스쳐 생성. worldposition, normal, curvature를 이용해 먼지가 쌓인 부분, 스크래치를 생성하고 노이즈로 도금이 벗겨져 녹슨 부분을 표현했다.
![alt text](image-1.webp) | ![alt text](image-99.webp) | ![alt text](image.webp)| 
--- | --- | --- |



바리에이션에 적용한 모습
![alt text](houdini_vJHVFKLP8m.webp) |![alt text](houdini_0N89gLKUaG.webp)|
--- | --- |
![alt text](houdini_576HIfqRfz.webp) |![alt text](houdini_GX3eHoMIin.webp) | ![alt text](houdini_hftveQ7fAL.webp)|

## Texturing - 2026
\`2026.04\`
위의 방법은 오래됐기도 하고, 예전에 만들어 놓은 텍스쳐 워크플로우라 현재 쓰기에는 무리가 있다. 게다가 Houdini 렌더러에 맞춰서 만들어진 것이기 때문에 이번에 새롭게 Unreal에서 메테리얼을 제작했다.

베이크를 하면 프로시쥬얼 모델링의 장점이 반감된다고 생각되어 최대한 리소스를 사용하거나 메테리얼을 제작하는 방식으로 바리에이션을 만들면 좋을 것 같다.

\`\`\`
1. 대량 인스턴싱을 전제함
2. 베이크 X
\`\`\`
소화기에는 다양한 재질이 있다. 도금속, 플라스틱, 고무(호스) ... 일단 게이지의 유리 부분은 어쩔 수 없지만 다른 부분들은 마스킹으로 분리할 수 있을 거라 생각했다.

### Attribute
#### ID mask
ID 맵을 만드려고 했으나 이것 또한 위와 같은 이유로 다량으로 사용시 텍스쳐도 늘어나기 때문에 vertex color 로 ID 맵을 대체 하기로 했다.
\`1.0/재질의 수\` 값을 @Cd.r 로 저장하고 Unreal 에서 step으로 필터링 하여 마스크를 제작 했다.
![alt text](Artboard-1.webp)

#### Curvature, AO
Houdini 에서 미리 계산된 Curvature 와 AO값을 각 G, B 에 저장 해 주었다.
![alt text](image-2.webp)

### Material
일단 녹이나 기타 웨더링을 위해서는 노이즈가 필수적일 텐데, Unreal에서 제공하는 noise는 비용이 좀 크다.
때문에 웨더링 노이즈 부분은 텍스쳐로 교체.
바디 부분에서 텍스쳐의 심이 제일 잘 보이기 때문에 노이즈 텍스쳐의 사용을 위해서 uv맵을 다시 정렬 해 주었다.
![alt text](image-5.webp) | ![alt text](image-6.webp) |
--- | --- |
기존의 uv | 0_1로 정렬된 body 파트의 uv |

![alt text](image-3.webp) | ![alt text](image-4.webp) |
--- | --- |
![alt text](image-9.webp) | ![alt text](image-8.webp) |
\`상) noise 노드\` \`하) 텍스쳐\` | Shader Complexity |


![alt text](<2026-04-27 18-40-27_trimmed.webm>)

텍스쳐는 Substance Designer 로 만들어 주었다. 각 재질별로 2장의 텍스쳐가 쓰였다.
\`\`\`
RGBA - BaseColor + Roughness
RGB - Normal
\`\`\`
![alt text](<Artboard 2.webp>)

## Result
![alt text](image-16.webp)
`
};
