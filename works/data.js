// Auto-synced from works/*.md — do not edit directly.
// Edit the corresponding .md file, then update here to match.
window.WORKS = {
  'tree-generator-hda': `---
title: Tree Generator HDA
category: Game Art
thumbnail: assets/images/TreeGenHDA01.jpg
date: 2026.01
tools: Houdini 21.0, Unreal Engine 5.6
link: https://www.artstation.com/artwork/x3k13R
---

## Overview

하나의 아틀라스 텍스처로 나무와 관목을 모두 찍어내는 Houdini Digital Asset입니다.

기존에는 **SpeedTree**로 나무를 제작했지만, 툴 전환 비용이 파이프라인 효율을 낮춘다고 판단했습니다.
Houdini 안에서 완결되는 나무 생성 시스템을 직접 구축한 결과물입니다.

- 5개 노드 모듈 구성
- 나무(Tree) / 관목(Bush) 모두 지원
- 한/영 혼용 파라미터 UI

---

## Gallery

<!-- TreeGenHDA_Variation01.jpg -->
<!-- TreeGenHDA_Variation02.jpg -->
<!-- TreeGenHDA_Variation03.jpg -->

---

## 핵심 강점

**1. 아틀라스 재사용 — 텍스처 메모리 절감**

Convert Card + Layout 노드를 재사용하면 하나의 아틀라스 텍스처로 수종이 다른 나무를 여러 개 생성할 수 있습니다.
텍스처를 추가로 제작하지 않아도 되므로 메모리 비용을 크게 줄일 수 있습니다.

**2. 모듈형 노드 구조 — 일관성 유지**

가지 어셈블리를 독립적으로 구성해두면 다른 Trunk나 Branch에 그대로 연결할 수 있습니다.
수종이 달라져도 동일한 셋업을 재사용하기 때문에 결과물의 일관성을 유지하면서 재작업을 최소화합니다.

**3. 적용 범위 확장 — Bush까지**

나무뿐 아니라 관목(Bush)까지 동일한 HDA로 제작할 수 있어, 식생 에셋 전반을 하나의 툴로 커버합니다.

---

## Technical Architecture

<!-- TreeGenHDA_NodeNetwork.jpg -->

HDA는 5개의 독립 노드로 구성됩니다. 각 노드는 이전 노드의 출력을 받아 단계적으로 형태를 완성합니다.

| 노드 | 역할 | 입력 |
|---|---|---|
| **Trunk** | 나무 줄기 생성 | — |
| **Branch** | 가지 분포 | Trunk / 기존 Branch |
| **Scattering** | 카드 분포 | Trunk + Branch + Foliage |
| **Convert Card** | 3D 가지·잎 → 2D 카드 변환 | Branch |
| **Layout** | UV 정리, 아틀라스 배치, Vertex Color | 전체 |

---

## Houdini 내부 워크플로우

노드를 모듈처럼 조합해 다양한 수형을 만들 수 있습니다.

\`\`\`
나무 A:    Trunk → Branch
가지 a:    Trunk → Branch → Convert Card
                    ↓
Scattering:  나무 A에 가지 a 분포
                    ↓
           Layout → Export
\`\`\`

가지 a를 독립 어셈블리로 만들어두면 나무 B, 나무 C에도 동일하게 연결할 수 있습니다.
**For Each 노드**를 활용하면 같은 설정을 여러 가지에 일괄 반복 적용하는 것도 가능합니다.

<!-- TreeGenHDA_UE5.jpg -->

---

## L-System 가지 생성

<!-- TreeGenHDA_LSys.jpg -->

**분기 각도 제어**

가지마다 분기 각도를 개별로 설정할 수 있습니다. For Each 노드와 함께 사용하면 동일한 각도 설정을 모든 가지에 일괄 적용할 수도 있습니다.

**길이 기반 분기 수 계산**

분포 단위를 지정하면 가지 길이에 비례해 하위 분기 수가 자동으로 결정됩니다.
예를 들어 단위를 5로 설정하면 길이 10인 가지에는 하위 분기 1개가 생성됩니다.
이 방식으로 가지가 깊어질수록 기하급수적으로 늘어나는 문제를 방지합니다.

**랜덤 Cutoff**

확률적으로 가지를 제거하는 기능으로 자연스러운 불규칙성을 확보합니다.
계산된 규칙과 랜덤 변화를 조합해 제어 가능하면서도 유기적인 결과를 만듭니다.
`,
};
