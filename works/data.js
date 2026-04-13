// Auto-synced from works/*.md — do not edit directly.
// Edit the corresponding .md file, then update here to match.
window.WORKS = {
  'tree-generator-hda': `---
title: Tree Generator HDA
category: Game Art
thumbnail: assets/images/tree-generator-hda/TreeGenHDA01.jpg
date: 2026.01
tools: Houdini 21.0, Unreal Engine 5.6
link: https://www.artstation.com/artwork/x3k13R
---

# Overview

https://www.youtube.com/watch?v=IOFI6T4mfyU


모듈식 프로시쥬얼 에셋에 대한 이해를 위해 구현 해본 작업물. Houdini 와 비슷한 SpeedTreed의 노드식 워크플로우에 기인하여 만들어졌다. 실제로 구현이나 파라미터 디자인에 참고를 많이 했다 확장성에 최대한 집중하며, 최대한 많은 것들을 구현 할 수 있는 툴을 지향 했다.

HDA 는 **Trunk, Branch, Convert Card, Scattering, Card Layout** 총 5개의 노드로 구성 되어 있다.

기본적인 에셋의 구조는 아래의 어트리뷰트의 조합을 통해 다루어진다.
\`\`\`
@part : trunk, branch, leaf
@type : skin, card, curve
\`\`\`
Leaf card 는 beanch

![wallpaper](assets/images/tree-generator-hda/TreeGenHDA01.jpg)

---

# Workflow

## Trunk, branch
기본적으로 하위 노드의 아웃풋을 받아 오며 레벨을 쌓아가는 구조이다. 다양한 그룹핑 과 조건으로 랜덤한 생성이 가능하고 여러 파라미터를 조합 하여 많은 패턴을 생성 가능하다. 또한 노드 구조를 응용 한다면 만들어놓은 가지 셋업을 a,b,c, 나무에 붙여 재사용 한다던지, for 노드 안에서 가지를 반복 시킬 수도 있다.

![](assets/images/tree-generator-hda/branchnode.png)
---

## Convert Card, Scattering
Card convert 와 Scattering 노드는 이 HDA 의 핵심 기능이다. 어떻게 조합 하느냐에 따라서 다양한 디테일을 추가 하고, 폴리곤 비용을 줄일 수 있다. Card convert 노드는 외부에서 가져오거나 모듈에서 자체 제작한 3D 지오 메트리 를 에셋에서 사용할 수 있는 card 형태의 지오메트리로 변환 된다. 이때 UV 를 저장하여 마지막 Layout 노드에서 아틀라스로 변환 된다.
Scattering 노드는 이렇게 만들어진 카드들을 기존에 있는 skin 또는 card에 인스턴싱 시켜준다.

### Convert Card
convert card 에서는 texture 모드를 지원하여 아틀라스가 있다면 해당 잎의 폴리지 카드를 쉽게 뽑아낼 수 있다.
![](assets/images/tree-generator-hda/convertcard01.png)
### Scattering
Scattering 노드는 Convert Card 에서 만들어진 card들을 skin 이나 card 에 인스턴싱 하는 방식이다. 이때 인스턴싱 되는 card가 leaf 타입을 가진 다면 @age 를 통해 계절감을 나타낼 수 있다.


### Card Layout - COPs




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
`,
};
