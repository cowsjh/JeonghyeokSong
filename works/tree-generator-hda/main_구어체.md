---
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

모듈식 프로시쥬얼 에셋의 구조를 직접 구현하며 이해하고자 제작한 작업물이다. SpeedTree의 노드 기반 워크플로우에서 영감을 받아 시작하였으며, 구현 방식과 파라미터 설계에 있어 많은 참고를 했다. 확장성을 최우선으로 두고, 다양한 상황에 대응할 수 있는 툴을 지향했다.
![wallpaper](TreeGenHDA01.jpg)
https://www.youtube.com/watch?v=IOFI6T4mfyU

## 목표
1. bake 없이 재사용 가능한 텍스쳐 소스로 제작하는 워크플로우
2. 노드 구조 적극 활용
3. 확장성
4. 아트
5. 개인 작업이라도 완성도 유지



# Workflow

## Nodes

- Trunk
- Branch
- Convert Card
- Scattering
- Card Layout
https://www.youtube.com/watch?v=mKwSIvJYMk4&feature=youtu.be

## Key Attributes
모듈식 워크플로우를 구현하는 데 있어 어트리뷰트 관리가 핵심임을 깨달았다. 아래는 모듈식 구성의 핵심 어트리뷰트들이다.
```
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
```

## Trunk, Branch
기본적으로 하위 노드의 아웃풋을 받아 레벨을 쌓아가는 구조이다. 다양한 그룹핑과 조건을 통해 랜덤한 생성이 가능하며, 여러 파라미터를 조합하여 다양한 패턴을 만들어낼 수 있다. Branch 노드는 이 HDA에서 유일하게 input과 output을 모두 공유하는 노드로, 내부적으로 재사용 가능한 어트리뷰트 관리가 특히 중요했다. 이를 통해 노드 구조를 응용하면 완성된 가지 셋업을 여러 나무에 재사용하거나, for 노드 내에서 반복 적용하는 것도 가능하다.
![](branchnode.png)

나무를 디자인할 때 원하는 부분을 독립적으로 제작하고 이후 합쳐 완성하는 방식을 채택했다. 이는 작업 중 어떤 요소를 추가하고 있는지 명확하게 파악할 수 있을 뿐만 아니라, 노드 가독성 향상에도 효과적이었다.
![alt text](<2026-04-15 01-30-12_trimmed.gif>)

가지들이 부모 레벨에서 분기될 때 **자연스럽게 이어져 보이는 것**이 중요한 요소다. VDB나 boolean 연산으로 지오메트리를 강제로 결합하는 방법도 있으나, 폴리곤 비용이 중요한 게임용 에셋에서는 비효율적인 방법을 무분별하게 적용하기 어렵다. 이에 노말 블렌딩을 선택했다. **가지가 돋아나는 시작점의 노말을 부모 가지와 블렌딩하는 방식으로**, 폴리곤을 수정하지 않아도 자연스러운 연결을 구현할 수 있다. 이는 게임에서 자주 사용되는 기법으로, labs Tree 노드에서도 동일한 방식을 적용하고 있다.
![](branch04.png)|![](branch03.png)|![](branch05.png)|
--- | --- | --- |
`before` | `after` | 

나무는 단순히 무작위로 뻗어나가는 가지만으로 구성되지 않는다. 수종에 따라 독특한 성장 패턴을 보이는데, 본 작업에서는 white pine tree를 참고했다. 이 수종은 가지가 수평적으로 자라며 옆으로 퍼져나가는 특징이 있다. labs tree를 참조하여 가지의 중심각을 파라미터를 통해 패턴화하였으며, **90, 180, 137.5, random 총 4가지 패턴을 제공하여 이를 조합함으로써 원하는 형태의 나무를 디자인할 수 있다.**
![alt text](<2026-04-14 02-26-11_trimmed.gif>)

force 파라미터 또한 나무의 컨셉을 결정하는 중요한 요소이다. 가지가 힘을 받아 변형되는 방향과 세기를 지정하며, **여러 force를 중첩하거나 적용 순서를 변경하는 것만으로도 다양한 형태를 만들어낼 수 있다.**
![alt text](<2026-04-14 02-45-53_trimmed.gif>)

## Convert Card, Scattering
Card Convert와 Scattering 노드는 이 HDA의 핵심 기능이다. 두 노드의 조합 방식에 따라 다양한 디테일을 추가하면서도 폴리곤 비용을 크게 절감할 수 있다. Card Convert 노드는 외부에서 가져오거나 모듈 내에서 직접 제작한 3D 지오메트리를 에셋에 적용 가능한 card 형태의 지오메트리로 변환한다. 이때 UV를 보존하여 최종 Layout 노드에서 아틀라스로 정리된다. Scattering 노드는 이렇게 만들어진 카드를 기존의 skin 또는 card에 인스턴싱하며, **이 과정에서 폴리곤을 25% 수준으로 절감할 수 있었다.**

![](scattering03.png)|![](scattering02.png)|![](scattering01.png)|
--- | --- | --- |
`High Poly`|`Card Converting`|`Texturing`


커브(1차원) 위에 인스턴싱하는 방식과 달리, 카드(2차원) 위에 인스턴싱할 때는 다른 필터링 방법이 필요했다. 처음에는 scatter 노드로 포인트를 생성한 뒤 인스턴싱하는 방식을 고려했으나, 포인트 생성에 추가 비용이 발생하고 필터링 과정도 복잡해질 것으로 판단하여 더 단순한 구조를 채택했다. card로 메쉬를 가공하는 과정에서 일정 간격의 포인트가 카드 내부에 이미 존재하기 때문에, 이를 활용하면 비용이 적고 직관적인 조작이 가능하다. 카드는 기본적으로 root(B), mid(R), tip(G) 그룹으로 구성된다. **root는 카드 인스턴싱 시 피봇으로 사용되며, mid와 tip은 다른 카드를 인스턴싱할 때의 소스 포인트로 활용된다.** mid와 tip을 분리한 이유는 잎과 가지의 관계를 고려한 것으로, 상대적으로 얇은 가지 끝에서 또 다른 가지가 생성되는 형태가 자연스럽지 않기 때문이다.
![alt text](<2026-04-14 15-33-28_trimmed.gif>)
![alt text](<2026-04-14 16-21-28_trimmed.gif>)
![alt text](image.png)|![alt text](image-4.png)|![](image-3.png)|
--- | --- | --- |
`prims 1,878` `points 1,754` |||

가지를 카드로 변환하고 인스턴싱하는 방법만으로는 원하는 형태를 찾기 어려울 수 있다. 이를 보완하기 위해 하이 폴리 나무에서 원하는 레벨의 특정 가지를 선별하여 카드로 변환하는 기능을 추가했다. 파라미터로 가지를 선별하고 원하는 방향에서 프로젝션하여 카드를 생성할 수 있다. 초기에는 x, y, z 평면을 기준으로 하는 방식을 사용했으나, **보다 직관적인 조작을 위해 Python과 VEX를 통한 카메라 프로젝션을 도입했다.** 이를 통해 원하는 형태의 레퍼런스를 보다 빠르고 쉽게 추출할 수 있다.
![alt text](<2026-04-14 01-01-49_trimmed.gif>)

Card Convert 노드는 ribbon 타입을 지원한다. **ribbon 타입은 카드보다 폴리곤을 다소 더 사용하지만 훨씬 입체적인 결과물**을 얻을 수 있으며, 상황에 따라서는 카드보다 우수한 시각적 품질을 제공한다. 특히 잔가지처럼 세밀한 디테일이 필요한 경우에 효과적이다.
![alt text](<2026-04-14 17-36-02_trimmed.gif>)
![alt text](houdini_U289vRYpT5.png) |![alt text](houdini_gHJ2ultunc.png)  |
---|---|
`prims 86,388` `points 99,112` `highpoly`| `prims 13,936` `points 30,946` `ribbon`|

texture 모드도 지원하여, 아틀라스 텍스쳐 팩이 있다면 해당 잎의 폴리지 카드를 손쉽게 추출할 수 있다.
![](convertcard01.png)

## Card Layout

UV 정리, 아틀라스 제작, 노말 블렌딩, vertex color 생성 등이 이루어지는 최종 노드이다. Layout 노드 사용 시 작업에 사용된 모든 카드의 `skin`과 `card` 지오메트리를 인풋 2, 3에 연결해야 한다.

COPs를 활용하여 아틀라스의 basecolor, normal, roughness, mask를 제작했다. `card`에서 UV를 보존하여 텍스쳐를 샘플링하고, Extrapolate Boundaries 노드로 마무리했다. normal의 경우 나뭇잎이나 가지의 height 텍스쳐를 Height to Normal 노드를 통해 변환하는 과정을 거친다.

동일한 카드를 재사용하면 하나의 아틀라스 리소스로 여러 나무를 제작하는 것이 가능하다.

![](layout05.png)
<!-- ![alt text](layout01.png)|![alt text](layout02.png) |
--- | --- | -->

![alt text](layout04.png)

Layout 노드에서 부여되는 vertex color는 출력 어트리뷰트 중 엔진에서 활용 가능한 요소들을 정제한 것이다.
```
R = AO
G = Value ( 뿌리와 멀어질 수록 낮은 값. )
B = Curvature
```
![alt text](layout03.png)



# Result
![](jh-render02-0001.png)
![](jh-render02-0002.png)
![](jh-render02-0003.png)
![](jh-render02-0004.png)
![](jh-render02-0005.png)
![](jh-cinecameraactor-0001.png)
![](jh-render02-0007.png)
