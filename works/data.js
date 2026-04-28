// Auto-synced from works/<slug>/main.md — do not edit directly.
// Edit the corresponding .md file, then run: node works-sync.js
window.WORKS = {
  'ezcut': `---
title: ezcut
category: Tool
thumbnail: works/ezcut/image.png
date: 2026.04
tools: AI, python

---

## Overview
레퍼런스나 클립 으로 제작한 mp4, mkv, mov 등 상호 컨버팅 하는 툴이다. gif 를 지원하며 trim 기능이 있어 영상을 간단하게 잘라서 보관할 수 있다.

![alt text](image.png)

### 구조

####  Input
파일을 드래그 하거나 파란 박스를 선택 해서 파일을 찾는다. 첨부된 파일 확장자를 자동으로 인식 한다. 출력 아웃풋을 설정할 수 있다.
![alt text](image-2.png)

#### Trim
간단한 핸들로 영상을 자르는 기능을 제공한다.
스크롤 - 타임라인 확대
드래그 - 클립 영역 이동     
![alt text](<2026-04-20 14-51-12_trimmed.gif>)


### 설정
간단한 아웃풋 설정이 가능하다.
![alt text](image-1.png)`,

  'tree-generator-hda': `---
title: Tree Generator HDA
category: Game Art
thumbnail: works/tree-generator-hda/TreeGenHDA01.jpg
date: 2026.01
tools: Houdini 21.0, Unreal Engine 5.6
link: https://www.artstation.com/artwork/x3k13R
featured: true
description: 모듈식 프로시쥬얼 나무 에셋 제작을 위한 Houdini HDA. SpeedTree의 노드 워크플로우에서 영감받아 확장성에 집중하여 구현.
---

# Overview

모듈식 프로시쥬얼 에셋에 대한 이해를 위해 구현해본 작업물. Houdini와 비슷한 SpeedTree의 노드식 워크플로우에 기인하여 만들어졌다. 실제로 구현이나 파라미터 디자인에 참고를 많이 했다. 확장성에 최대한 집중하며, 최대한 많은 것들을 구현할 수 있는 툴을 지향했다.
![wallpaper](TreeGenHDA01.jpg)
https://www.youtube.com/watch?v=IOFI6T4mfyU

## 목표
1. bake는 하지 않고 재사용 가능한 텍스쳐 소스로 제작 하는 워크 플로우
2. 노드 구조 적극 활용
3. 확장성
4. 아트
5. 개인 작업이라고 대충 만들기 않기



# Workflow

## Nodes

- Trunk
- Branch
- Convert Card
- Scattering
- Card Layout
https://www.youtube.com/watch?v=mKwSIvJYMk4&feature=youtu.be

## Key Attributes
모듈식 워크플로우를 구현하려면 어트리뷰트 관리가 아주 중요하단걸 느꼈다. 아래는 모듈식 구성의 핵심 어트리뷰트들이다.
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
기본적으로 하위 노드의 아웃풋을 받아오며 레벨을 쌓아가는 구조이다. 다양한 그룹핑과 조건으로 랜덤한 생성이 가능하고 여러 파라미터를 조합하여 많은 패턴을 생성 가능하다. Branch 노드는 유일하게 input, output 모두 공유하는 노드이기 때문에 내부적으로 재사용이 가능한 어트리뷰트의 관리가 아주 중요했다. 그 결과 노드 구조를 응용한다면 만들어놓은 가지 셋업을 여러 나무에 붙여 재사용한다던지, for 노드 안에서 가지를 반복시킬 수도 있다.
![](branchnode.png)

나무를 디자인할 때는 원하는 부분은 독립적으로 만들고 후에 합쳐 완성할 수 있다. 이 기능은 어떤 걸 추가하고 있는지 명확하게 보이는 장점도 있지만, 노드 가독성에도 효과가 좋았다.
![alt text](<2026-04-15 01-30-12_trimmed.gif>)

가지들은 분기를 가지고 부모 레벨에서 자라나는데 이때 **이어지게 보이는 것** 이 중요하다. VDB나 boolean으로 지오메트리를 강제적으로 붙일 수도 있겠으나 폴리곤이 중요한 게임용 에셋에선 비싼 비용이 들어가는 방법들을 마구잡이로 쓸 수 없었다. 때문에 다른 방법을 쓰기로 했는데 그것이 노말 블렌딩이다. **가지가 돋아나는 시작점의 노말을 부모 가지와 블렌딩시켜 주는 것이다.** 노말 블렌딩은 게임에서 자주 쓰이는 방법으로 폴리곤을 건들지 않아도 된다는 장점이 있다. 기존 labs Tree 노드에도 이러한 기법을 사용한다.
![](branch04.png)|![](branch03.png)|![](branch05.png)|
--- | --- | --- |
\`before\` | \`after\` | 

나무는 랜덤하게 뻗어나가는 가지만 있는 것은 아니다. 수종에 따라 독특한 패턴을 띠며 자라는 것들 중 white pine tree를 참고했다. 이 수종은 가지들이 수평적으로 자라나면서 옆으로 퍼져나간다. 이 부분에선 labs tree를 참조해 가지의 중심각을 파라미터를 통해 패턴화시켜 주었다. **90, 180, 137.5, random 총 4가지의 패턴을 사용할 수 있으며 특정 패턴을 반복적으로 사용하며 원하는 모양의 나무를 디자인할 수 있게 만들었다.**
![alt text](<2026-04-14 02-26-11_trimmed.gif>)

같은 맥락으로 force 파라미터는 나무의 컨셉을 잡는 데 중요한 기능을 한다. 말 그대로 가지가 힘을 받고 변형되는 방향과 세기를 정한다. **force는 중첩시킬 수 있으며 force가 적용되는 순서를 변경하면서 다양한 모양을 만들 수 있다.**
![alt text](<2026-04-14 02-45-53_trimmed.gif>)

## Convert Card, Scattering
Card convert와 Scattering 노드는 이 HDA의 핵심 기능이다. 어떻게 조합하느냐에 따라서 다양한 디테일을 추가하고, 폴리곤 비용을 줄일 수 있다. Card convert 노드는 외부에서 가져오거나 모듈에서 자체 제작한 3D 지오메트리를 에셋에서 사용할 수 있는 card 형태의 지오메트리로 변환된다. 이때 UV를 저장하여 마지막 Layout 노드에서 아틀라스로 변환된다. Scattering 노드는 이렇게 만들어진 카드들을 기존에 있는 skin 또는 card에 인스턴싱시켜준다. **이 과정에서 폴리곤을 25% 수준으로 줄일 수 있었다.**

![](scattering03.png)|![](scattering02.png)|![](scattering01.png)|
--- | --- | --- |
\`High Poly\`|\`Card Converting\`|\`Texturing\`


1차원의 커브 위에 가지를 인스턴싱 하는 방법과 달리 2차원의 카드 위에 인스턴싱 할 때에는 다른 필터링이 필요 했다. 처음엔 scatter 노드로 포인트를 생성하고 그 위에 인스턴싱을 하는 구조를 생각했으나, 포인트를 생성하는 2차 비용이 발생하고, 필터링도 복잡한 공정이 예상되어 더 간단한 구조를 생각했다. 어차피 card로 메쉬를 가공할 때 일정한 간격의 포인트들이 카드 안에 존재하기 때문에 이를 활용하면 더 싸고 직관적인 조작이 가능했다. 카드는 기본적으로 root(B), mid(R), tip(G) 그룹을 가진다. **root는 카드를 인스턴싱할 때 피봇으로 사용된다. mid와 tip은 다른 카드들을 인스턴싱할 때 소스 포인트로 사용된다.** mid와 tip을 나눈 이유는 잎과 가지의 관계 때문이다. 중간용 가지를 따로 만들면 문제가 되진 않겠지만, 상대적으로 얇은 가지 끝에서 또 다른 가지가 난다는 것이 어색하기 때문이다.
![alt text](<2026-04-14 15-33-28_trimmed.gif>)
![alt text](<2026-04-14 16-21-28_trimmed.gif>)
![alt text](image.png)|![alt text](image-4.png)|![](image-3.png)|
--- | --- | --- |
\`prims 1,878\` \`points 1,754\` |||

가지를 카드로 만들고 인스턴싱하는 방법은 원하는 모양을 찾기 힘들 수 있기 때문에 다른 워크플로우를 추가적으로 고안해 내었는데, 하이 폴리로 만들어진 나무에서 원하는 레벨의 특정한 가지를 카드로 선별하는 기능이다. 해당 기능은 파라미터로 가지를 선별하고 원하는 방향에서 프로젝션하여 카드로 만들 수 있다. 이 과정에서 x, y, z 평면을 참조하는 방법을 사용했지만 **좀 더 직관적인 조작이 필요하다고 느껴 파이선과 VEX를 통해 카메라 프로젝션을 도입했다.** 확실히 원하는 모양의 레퍼런스를 쉽고 빠르게 찾을 수 있었다.
![alt text](<2026-04-14 01-01-49_trimmed.gif>)

Card Convert 노드는 ribbon 타입을 지원한다. **ribbon 타입은 카드보다 폴리곤을 조금 더 쓰지만 훨씬 입체적**이며 상황에 따라서는 카드보다 훨씬 뛰어난 룩을 얻을 수 있다. 특히 작은 가지들의 디테일을 가진 경우 효과가 좋다.
![alt text](<2026-04-14 17-36-02_trimmed.gif>)
![alt text](houdini_U289vRYpT5.png) |![alt text](houdini_gHJ2ultunc.png)  |
---|---|
\`prims 86,388\` \`points 99,112\` \`highpoly\`| \`prims 13,936\` \`points 30,946\` \`ribbon\`|

또한 texture 모드를 지원하여 아틀라스 텍스쳐 팩이 있다면 해당 잎의 폴리지 카드를 쉽게 뽑아낼 수 있다.
![](convertcard01.png)

## Card Layout

최종적으로 uv 정리, 아틀라스 제작, normal 블렌딩, vertex color 생성 등이 이루어지는 마지막 노드이다. Layout 노드 사용 시 사용되었던 모든 카드의 \`skin\`과 \`card\` 지오메트리를 인풋 2, 3에 연결시켜 주어야 한다.

COPs를 이용해서 아틀라스의 basecolor, normal, roughness, mask를 제작했다. \`card\`에서 uv를 보존하여 texture를 샘플링하고 Extrapolate Boundaries 노드로 마무리 해주었다. normal 같은 경우는 나뭇잎이나 가지의 height 텍스쳐를 Height to Normal 노드로 변환하는 과정을 거친다.

같은 카드를 재사용하면 아틀라스 리소스 하나로 여러 개의 나무를 제작할 수 있다.

![](layout05.png)
<!-- ![alt text](layout01.png)|![alt text](layout02.png) |
--- | --- | -->

![alt text](layout04.png)

Layout 노드에서 부여되는 vertex color는 아웃풋 어트리뷰트 중 엔진에서 쓸만한 것들을 다듬어 놓은 것이다.
\`\`\`
R = AO
G = Value ( 뿌리와 멀어질 수록 낮은 값. )
B = Curvature
\`\`\`
![alt text](layout03.png)



# Result
![](jh-render02-0001.png)
![](jh-render02-0002.png)
![](jh-render02-0003.png)
![](jh-render02-0004.png)
![](jh-render02-0005.png)
![](jh-cinecameraactor-0001.png)
![](jh-render02-0007.png)
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
HDA 같은 에셋을 만들어 보고 싶어 이것 저것 건드려보다가 Pixel Processor 를 발견했고, 이것을 이용하여 간단 한 마스크 툴을 제작해 보았다.
Substance Painter 에 있는 light 와 동일한 기능을 가진 툴이다. 라이트 종류는 direction, point 두가지를 지원한다.

![alt text](2025-10-24-00-26-11_trimmed.gif)
![alt text](jh-adobe-substance-3d-designer-hoi5912muo.jpg)

만든 light map 을 이용해 눈을 만들어 보았다.
![alt text](jh-snow-01.jpg)
![alt text](jh-snow-02.jpg)`,

  'parmstore': `---
title: Hip Manager
category: Tool
thumbnail: works/parmstore/image.png
date: 2023.11
tools: python
featured : false
---
## Overview

많은 지오메트리나 작은 복셀의 시뮬레이션에 대한 뷰포트 연산 속도나 노드 네트워크 cook 시간에 영향을 주게 되면서, 작업시 버퍼링을 대기하는 시간이 길어진다. 이를 조금이나마 해결하고자 고안한 툴. 렌더팜과 사용하면 효과가 좋다. 셋업을 마무리하고 복셀 사이즈나 포인트를 살짝만 더 높은 값으로 저장 해 놓으면 로우 셋업에서 작업을 쉽게 진행한 후 결과만 저장된 값으로 볼 수 있다. 
>[!important]
>PDG 와 유사한 메커니즘이지만 파라미터만 저장 하기때문에 훨씬 단순하고 쉽게 사용 할 수 있다.

## How to use
1. 원하는 파라미터 첨부 (드래그 드랍)
2. build 버튼 클릭
3. 원하는 값 기입
4. 캐시
![alt text](<2026-04-20 16-54-44_trimmed.gif>)

셋업을 수정할때 최적화 셋업을 꺼놓고 확인 해 보는 경우가 많은데, 이 경우 스위치 파라미터를 저장함으로서 최종 결과에 반영되는 최적화를 쉽게 보존 시킬 수 있다.
![alt text](image-2.png)

Advanced -> Script 섹션에 render script 에서 경로의 python 파일을 받아와 작동 한다. HDA 가 아니기 때문에 houdini module 을 사용할 수 없었고, 코드를 따로 관리 하고 싶어서 이 방식을 따랐다.
![alt text](image-1.png)`,

  'hip-manager': `---
title: Hip Manager
category: Tool
thumbnail: works/hip-manager/image.png
date: 2023.09
tools: python
featured : false
---


## Overview

프로젝트가 진행 되다가 이전의 셋업이 필요 하거나 할때 찾기가 힘든 경우가 있어 hip파일의 버전 관리를 조금 더 세분화 하기 위한 Houdini python panel 이다. 1차적으로 색상을 통해 시각적으로 분류 하고 메모로 세분화 한다. 날짜나 시간도 기입이 가능하고, preset 버튼으로 pub,render,submit 등 체크해 놓을 수 있다. 메모 내용 검색을 통해 파일을 찾을 수도 있다.

왼쪽 상단 부터 - \`색상\`, \`버전 추가\`, \`새로고침\`, \`검색\`, \`파일 삭제\`
![alt text](image.png)

\`새창에서 파일 열기\`, \`메모 창\`, \`preset 버튼\`
![alt text](image-2.png)

#### Color
텍스트의 색상을 통해 먼저 선별 하는 것이 흐름을 알기 좋다.
![alt text](image-1.png)

#### Note, Search
노트의 내용을 통해 버전을 검색 할 수 있다.
![alt text](<2026-04-20 12-08-49_trimmed.gif>)

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
thumbnail: image-17.png
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
\`type A\` | \`type B\`

![alt text](houdini_tezYex0ePb.png) |![alt text](houdini_XvVWbT3Kz8.png) |![alt text](houdini_CdpOSwOlcu.png)|
--- | --- | --- |


## Texturing
worldposition, objectposition, normal, curvature, ao 등을 활용 해서 개연성 있는 텍스쳐를 만들고자 했다.

**텍스쳐 레퍼런스**
![alt text](chrome_K3OERJFM1F.png) |![alt text](chrome_KeYIWmdffM.png) |![alt text](chrome_q6e7ljdTX8.png) |![alt text](chrome_vIUu2jPtVT.png)|
--- | --- | --- | --- |

\`VEX Material Builder\` 에서 VOP 을 이용해 프로 시쥬얼 텍스쳐 생성. worldposition, normal, curvature 을 이용해 먼지가 쌓인 부분, 스크래치 를 생성 하고 노이즈로 도금이 벗겨져 녹슨 부분을 표현했다.
![alt text](<image (1).png>) |![alt text](<image (2).png>)| ![alt text](image.png)|
--- | --- | --- |

바리에이션에 적용한 모습
![alt text](houdini_vJHVFKLP8m.png) |![alt text](houdini_0N89gLKUaG.png)|
--- | --- |
![alt text](houdini_576HIfqRfz.png) |![alt text](houdini_GX3eHoMIin.png) | ![alt text](houdini_hftveQ7fAL.png)|

## Texturing - 2026
\`2026.04\`
위의 방법은 오래 됐기도 하고, 예전에 만들어 놓은 텍스쳐 워크플로우라 현재 쓰기에는 무리가 있다. 게다가 후디니 렌더러에 맞춰서 만들어진 것이기 때문에 이번에 새롭게 unreal 에서 메테리얼을 제작 했다.

베이크를 하면 프로시쥬얼 모델링의 장점이 반감된다고 생각 되어 최대한 리소스를 사용하거나 메테리얼을 제작 하는 방식으로 바리에이션을 만들면 좋을 것 같다.

\`\`\`
1. 대량 인스턴싱을 전제함
2. 베이크 X
\`\`\`
소화기에는 다양한 재질이 있다. 도금속, 플라스틱, 고무(호스) ... 일단 게이지의 유리 부분은 어쩔수 없지만 다른 부분들은 마스킹으로 분리할 수 있을거라 생각 했다.

### Attribute
#### ID mask
ID 맵을 만드려고 했으나 이것 또한 위와 같은 이유로 다량으로 사용시 텍스쳐도 늘어나기 때문에 vertex color 로 ID 맵을 대체 하기로 했다.
\`1.0/재질의 수\` 값을 @Cd.r 로 저장하고 Unreal 에서 step으로 필터링 하여 마스크를 제작 했다.
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
\`상) noise 노드\` \`하) 텍스쳐\` | Shader Complexity |


![alt text](<2026-04-27 18-40-27_trimmed.gif>)

텍스쳐는 Substance Designer 로 만들어 주었다. 각 재질별로 2장의 텍스쳐가 쓰였다.
\`\`\`
RGBA - BaseColor + Roughness
RGB - Normal
\`\`\`
![alt text](<Artboard 2.png>)

## Result
![alt text](image-16.png)
`
};
