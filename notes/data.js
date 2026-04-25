// Auto-synced from blog/**/*.md — do not edit directly.
// Edit the corresponding .md file, then run: node blog-sync.js
window.BLOG = {
  'ComputerGraphics/Batching': `---
title: Batching
date: 2026-04-17
tags: optimization, Rendering
---

CPU의 병목 현상을 해결하는 방법 중 하나.

동일한 재질의 메쉬를 병합하여 한 번의 드로우 콜로 렌더링 하는 최적화 기법

### 원리
1. 동일한 재질의 메쉬 병합
2. 병합된 메쉬 한번에 드로우콜

### 결과
드로우콜 감소

### 단점
**렌더링은 빠르지만 VRAM 사용량 급증 합쳐진 메쉬가 한번에 메모리에 저장 되기 때문.** 일반 적인 드로우콜은 1번에 메쉬 한 개 이기때문에 차이가 난다.

`,

  'ComputerGraphics/Instancing': `---
title: Instancing
date: 2026-04-17
tags: optimization
---

CPU와 GPU간의 병목 현상을 해결 하는 방법중 하나

### 기존 렝더링
1,000 개를 그릴때 CPU는 GPU에게 1,000 번 명령

### 원리
1. mesh (공통 데이터) / instance buffer (인스턴스 데이터 - trans, rot, scale ...) **데이터 분리**
2. 무거운 공통 메시 데이터는 GPU 메모리(VRAM)에 **한 번만 업로드**.
3. instance buffer 전달.
4. **GPU의 병렬 처리** (공통 메시 데이터를 instance buffer 와 조합)

### 결과
CPU의 작업 부하를 줄임 1,000 >>>> mesh,instance buffer

`,

  'ComputerGraphics/aboutDraw': `---
title: Draw Call
date: 2026-04-21
tags: optimization, Rendering
---
[Unreal Course - An In-Depth look at Real-Time Rendering](https://dev.epicgames.com/community/learning/courses/EGR/unreal-engine-an-in-depth-look-at-real-time-rendering/JEJ/geometry-rendering-part-1)

---

## Draw ?

Draw 는 CPU 가 GPU 에게 특정한 오브젝트를 화면에 렌더 하는것을 명령하고 그리는 것 언리얼은 기본적으로 수많은 렌더 패스를 수행한다. 지오메트리가 아니더라도 하늘, 대기 산란, post-processing, 에디터 UI 등 화면상 렌더되는 것은 전부 포함 된다.
![alt text](image.png)

## Draw call ?
CPU가 CPU API 에게 무엇을 어떻게 그릴지 알려주는 것. 각 드로 콜에넌 텍스쳐, 셰이더 및 버퍼 에대 한 정보가 있음.
같은 속성을 공유하는 폴리곤 그룹이 하나의 드로우콜로 정의 된다. (단일 메쉬에 여러개의 메테리얼이 존재하는 액터는 드로우콜에 영향을 미친다.)

 **대부분 draw call 자체 보다는 준비하는 과정에서 리소스가 더 많이 든다.**
또한 드로우콜은 렌더하고 마치면 완료했다고 말하고 다음 명령을 받아야하는 통신 과정이 이루어지기 때문에 단순 크기 보다 그 양이 많을 때 병목 현상이 일어나기 쉽다.
\`\`\`
1GB 파일 1개
vs
1KB 파일 100만개
\`\`\`
- 폴리곤 많을 때 : GPU 바쁨
- draw call 많을 때 : CPU bound, GPU 낭비
- 폴리곤이 많다고 Draw 시간이 비례하는 것은 아니다.
- 적은 큰 모델을 쓰는 것 < 작고 많은 모델을 쓰는 것

큰 모델을 쓸때는 아래 사항을 주의
- occlusion
- lightmapping
- collision calculation
- memory

## Merge Mesh
환경 배치 작업이 끝났다면 조건에 맞는 메쉬들 끼리 병합 하여 드로우콜을 줄일 수 있다.

**메시 병합 최적화 규칙**
\`\`\`
1. 사용 빈도가 높고 폴리곤수가 적을때
2. 동일한 구역 내에 있는 메시들
3. 동일한 메테리얼 을 공유하는 메시
4. 출돌 판정이 없거나 단순한 메시
5. 크기가 작은 메시, 다이내믹 라이틸만 받는 메시
6. 멀리있는 지형
\`\`\`

>[!important]
>모든 환경에서 병합이 최고의 방법은 아니다 물론 효율을 높일 순 있겠으나 충분히 잘 돌아간다면 다른 곳에 시간을 투자하는 것이 좋다.

## Instance Static Mesh Rendering
동일한 static mesh 그룹을 포함한 컴포넌트

크고 적은 메쉬를 인스턴스 하는것 보다 foliage 같은 작고 양이 많을 때 더 효과 적이다.

## LOD, HLOD

- 조건(거리)에 따라 로우 폴리로 교체되는 것.
- HLOD는 여러개의 메쉬가 조건에 따라 그룹핑 되어 하나의 메쉬로 교체 되는 것.
`,

  'ComputerGraphics/rasterizingandovershading': `---
title: Rasterizing and Overshading
date: 2026-04-21
tags: Rendering
---
[Rasterization, Overshading, and the GBuffer](https://dev.epicgames.com/community/learning/courses/EGR/unreal-engine-an-in-depth-look-at-real-time-rendering/aPo/rasterization-overshading-and-the-gbuffer)

---

## Overshading
### Rasterizing

- 픽셀 그리드로 버텍스 정보를 렌더링 하는것
- 1개의 픽셀에는 **무조건 1개의 polygon만 존재 한다.**
- 100,000개의 폴리곤이 아주 멀리 있어 1픽셀 만큼의 크기로 보인다면 그 1픽셀엔 1개의 폴리곤만 렌더된다.

하드웨어는 렌더할때 항상 2x2 픽셀 쿼드 가 사용 된다. 아주 작은 1픽셀 짜리 오브젝트를 렌더링 한다고 해도 4개의 픽셀이 그룹으로 연산된다.
초록색 - 폴리곤 영역
주황색 - 연산되는 픽셀
![alt text](image-1.png)

이와 같은 원리로 근접한 폴리곤 에서 overshading이 발생 한다.
![alt text](image-2.png)|![alt text](image-3.png)
--- | --- |
추가 폴리곤 영역 | 빨간부분 - overshading |

## Visualize
\`\`\`
view mode - OptimizationViewMode - Quad Overdraw
\`\`\`
폴리곤이 작게 몰려있는 픽셀에서 overshading 이 많이 발생 한다.
![alt text](image-4.png)

1. 밀도가 높은 곳이 높은 비용을 가진다.
2. 거리가 멀어지면 밀도가 높아진다.
3. 아주 얇거나 작은 트라이 폴리곤은 overshading을 유발한다.

3번의 이유로 이러한 폴리곤을 가진 모델링은 좋지 않다.
![alt text](image-5.png)`,

  'Game/DarkRuinsoptimization': `---
title: DarkRuins Optimization
date: 2026-04-24
tags: Unreal Engine, optimization
---
FABs 에 무료로 제공하는 \`DarkRuinsMegascansSample\` 씬을 최적화 해보자
![alt text](image-3.png)

## Hardware
- AMD Ryzen5 5500 6core
- NVIDIAGTX 1660 Super
- 16GB
Hardware RayTracing을 지원 하지 않기 때문에 씬의 MegaLight는 off, Reflection은 none 로 진행 한다.

일단 로직을 제외한 에셋 최적화를 우선적으로 진행한다.
최적화 이전의 stat
\`\`\`
FPS: 16.56
Frame: 60.25
Draw: 60.51
GPU Time: 59.49
\`\`\`

## Profiling

`,

  'Game/DitherTemporalAA': `---
title: DitherTemporalAA
date: 2026-04-16
tags: Unreal Engine, Material, optimization
---

DitherTemporalAA 노드는 픽셀 점묘 패턴을 생성하는 procedural meterial function 이다. **Opaque 나 Masked 같은 불투명 메테리얼을 블렌딩할때 주로 사용 된다.**

DitherTemporalAA 는 **시간적 데이터**를 기반으로 생성되고 패턴은 프레임마다 바뀐다.
- Frame 1 : 점 패턴 생성
- Frame 2 : 패턴 들의 사이 갭을 렌더
- result : 사람 눈에 더 부드럽게 보임 -> **플리커링 현상 없음**

![alt text](<2026-04-17 01-48-33_trimmed-1.gif>)

테스트 하는 법
\`\`\`
Detail -> Blend Node -> Masked
\`\`\`
![alt text](image.png)

### Use case

- LOD 교체시 부드럽게 블렌딩 가능
- PDO 와 조합시 메쉬간의 부드러운 블렌딩 가능 - [참조](../Pixel-Depth-Offset-(PDO)/Pixel-Depth-Offset-(PDO).md)
- foliage 블렌딩.


## Pros & Cons

### Pros
- Translucency 보다 비용이 싸다.
- 순서대로 렌더 되는게 아닌 **depth-buffer을 사용** 하기 때문에 우선순위를 맞출 필요도 없고 플리커링이 생길 일도 없다.

### Cons
- 이전 프레임(시간적 데이터)에 의존하기 때문에, 움직이는 물체 뒤에 **잔상이 남을 수 있다.**
`,

  'Game/Pixel-Depth-Offset-(PDO)': `---
title: Pixel Depth Offset (PDO)
date: 2026-04-16
tags: Unreal Engine, Material
---

Pixel Depth Offset (PDO) 는 depth buffer 에 적용 되는 픽셀의 Depth 값을 조정하는 속성이다. 쉐이더를 통해서 카메라에 더 가까이 보내거나 더 멀리 보낼 수 있다.
![alt text](<2026-04-17 01-32-53_trimmed.gif>)

>[!important]
>vertex를 물리적으로 움직이는 WPO 와는 다르게 PDO 는 occlusion과 z-buffer 에 쓰이는 depth data 만 조작한다.


## Use Case

통상적으로 [DitherTemporalAA](../DitherTemporalAA/DitherTemporalAA.md) 노드와 함께 사용하며 겹쳐있는 메쉬를 블렌딩 할때 쓴다.
![alt text](UnrealEditor_mY40lC1jo5.png)




`,

  'Game/Reflections': `---
title: Reflections
date: 2026-04-22
tags: Unreal Engine, rendering, shading
---

[An In-Depth look at Real-Time Rendering - Reflections](https://dev.epicgames.com/community/learning/courses/EGR/unreal-engine-an-in-depth-look-at-real-time-rendering/rEl/an-in-depth-look-at-real-time-rendering-reflections)

---

## Reflections

- Reflection 은 real-time 으로 렌더링 하기엔 비용이 크다.
- 3가지의 방법이 있으며 장단점이있다.
- 3가지의 방식은 순서차적으로 블렌딩된다.
- Lumen이 켜져 있다면 꺼야 적용 된다.

>[!note]
>PostProcessingVolume, Project Setting 에서 Lumen, SSR, none 을 선택 가능하다. Caputer 기능은 Lumen 환경에선 Lumen 이 오버 라이드 된다.

### Reflection Captures

- 액터 로케이션 기준으로 정적 큐브맵을 캡쳐하여 범위내 오브젝트에 블렌딩 하는 방식
- 여러개 배치 가능
- 매우 빠르다
- 살짝 부정확

\`\`\`
place actor > Visual Effect > Sphere/Box Reflection Capture
Build > Build Reflections Capture
\`\`\`

캡쳐 Resolution 설정
\`\`\`
Project Setting > Reflection Capture Resolution
\`\`\`

기본적으로 큰 것들을 여러개 배치해 원하는 지역을 덮고 반사성이 높은 객체에 작은 것들을 배치한다.
겹치는 갯수 만큼 블렌딩 연산을 하기 때문에 염두해두고 배치 한다.

![alt text](image.png)

### Planar Reflections

- 평면에 캡쳐
- 평면이 아니라면 제한적임
- 무거워질 수 있음
- 비교적 정확함
\`\`\`
place actor > Visual Effect > planar Reflection Capture
\`\`\`


### Screen Space Reflections (SSR)
1. 기본 reflection 시스템
2. real-time
3. 정확함
4. 노이즈가 끼고 조금 무겁다.
5. 현재 화면에 렌더링되어있는 것들만 반사한다.


reflection capture는 레벨을 로딩할 때 발생한다. 캡쳐할 것이 많다면 시간이 오래 걸릴 수 있다. - 패키징 하면 문제 해결 된다.


### Skylight

skylight 에도 reflection 캡쳐가 존재한다.
![alt text](image-1.png)
150000 유닛 을 클립 하고 캡쳐 하기때문에 스카이 큐브맵만 캡쳐한다. 오브젝트 주위에 reflection capture 액터가 없다면 skylight의 큐브맵을 reflection으로 사용 하게 된다.`,

  'Game/ShadersAndMaterials': `---
title: Shaders and Materials
date: 2026-04-22
tags: Unreal Engine, Rendering, shading
---

[Shaders and Materials](https://dev.epicgames.com/community/learning/courses/EGR/unreal-engine-an-in-depth-look-at-real-time-rendering/j1v/shaders-and-materials)

---

## Pixel Shaders
- GPU 가 연산
- 픽셀에서 실행 되는 프로그램
- 모든 픽셀에서 연산
- 렌더링의 모든 단계, 모든 부분에 사용됨.
    - material 시스템
    - lighting
    - post process
    - color correction
    - ...
- 쉐이더 언어로 작동됨 - 플랫폼 마다 상이
    - \`DirectX\` > \`HLSL\`

Shader Complexity 뷰에서 봤을 때 하단 바를 보면 현재 십자선 을 기준으로 PS(Pixel Shader) VS(Vertex Shader) 의 복잡도를 보여준다.
![alt text](image-3.png)

복잡한 PS는 pixel 단계에서 연산이 되기 때문에 pixel 에 적게 노출 되는, 멀리 있는 오브젝트에 있는 편이 낫다.

### 작동 방식

#### 기존 쉐이더 방식
1. 쉐이더가 작성됨
2. 짜여진 쉐이더 코드에 변수나 텍스쳐가 더 추가됨
3. 모델링에 출력

#### Unreal 에서
1. HLSL 코드가 USF 파일로 저장됨
    - Material Editor의 그래픽 노드 인터페이스 에서 USF 템플릿을 노드로 변한하여 사용함
3. Editor에서 작업된 것들이 컴파일되어 새로운 셰이더로 작성됨
    - 셰이더가 컴파일 되어 Material Instance 를 생성
4. 모델에 적용

Material Editor 에서 작성된 메테리얼 HLSL 확인
\`\`\`
Window > Shader Code > HLSL Code
\`\`\`

USF 템플릿 경로 : \`C:\Program Files\Epic Games\UE_5.6\Engine\Shaders\Private\`

이것들이 전부 제공하는 템플릿이고 사용자가 원하는 쉐이딩 모델 템플릿을 추가 해서 늘릴 수도 있다.
![alt text](image-1.png)

## Materials
머티리얼은 대부분 Physical Based Rendering (PBR) 기반의 통합된 쉐이딩 파이프라인을 가진다.

### 쉐이딩 통합의 이점
1. 단일화로 인한 효율
2. 일관적이고 예측 가능한 파이프 라인 구축 가능.
3. G-buffer 상속에 대한 제약
PBR은 거의 모든 재질이 roughness 와 metalic으로 조절이 가능하다.
![alt text](image-2.png)


stats 창을 보면 shader 가 얼마나 연산하는지 알수 있다 보통 100~300
![alt text](image-4.png)
`,

  'Game/culling': `---
title: Culling
date: 2026-04-17
tags: optimization
---
[Unreal Doc - Visibility and Occlusion Culling](https://dev.epicgames.com/documentation/unreal-engine/visibility-and-occlusion-culling-in-unreal-engine#cullingmethods)
[Unreal Doc - Cull Distance](https://dev.epicgames.com/documentation/unreal-engine/cull-distance-volumes-in-unreal-engine)
[Precomputed Visibility Volumes](https://dev.epicgames.com/documentation/unreal-engine/precomputed-visibility-volumes-in-unreal-engine)

---

>[!important]
>Culling은 Rendering 이전에 작동 한다.

보이지 않는 메쉬들을 제외 시켜 드로우콜을 낮추는 방법

## Culling Methods

비용이 싼 culling 부터 아래의 순서대로 작동한다.

1. Distance Culling
2. Frustum Culling
3. Precomputed Visibility
4. Nanite Culling
5. Occlusion Culling




## Frunstum, Occlusion

![alt text](image.png) | ![alt text](image-1.png) |
--- | --- |
Frustum | Frustum + Occlusion

### 컬링 확인 하는법

\`\`\`
r.VisualizeOccludedPrimitives 1 
stat initviews
\`\`\`


## Distance Culling

화면에 1px 정도 차지하는 아주 작은 메쉬라도 엔진은 한번의 드로우 콜을 생성한다. 사실상 육안으로 보이지 않는 부분에서 CPU 비용을 사용 하는 것. Distance Culling 은 이런 것들을 강제적으로 Culling 해주는 기법이다.

### 사용법

\`\`\`
Volume -> Cull Distance Volume
\`\`\`

여러 Cull Distance Pair 를 만들어 다양한 크기의 오브 젝트를 컬링한다.
![alt text](examplescenecdvvalues.png)

- 약 200 유닛 오브젝트 + 카메라 거리 1000 유닛 이상 컬링됩니다.
- 약 500 유닛 오브젝트 + 카메라 거리 2000 유닛 이상 컬링됩니다.
- 약 1000 유닛 오브젝트 컬링 X


## Precomputed Visibility Volumes

셀 단위에 가시성 데이터를 저장 하여 플레이어/카메라 의 위치에 따라 셀 안에 있는 오브젝트를 컬링 하는 기법. 매 프레임 계산하는 Occlusion Culling 보다 저렴하다.



가시성 데이터는 **라이팅 빌드**시 저장 된다. 이미 라이팅을 빌드 했다면 따로 빌드 할 수 도 있다.

\`\`\`
World Settings > Precompute Visibility 체크
Actor > Volume > precompute Visibility volume 배치
build > light

Show > Advanced > Precomputed Visibility 
\`\`\`
![alt text](image-2.png)
>[!tip]
>r.ShowRelevantPrecomputedVisibilityCells 을 사용하면 카메라 가까이에 있는 셀만 표시된다.
`,

  'Game/game-optimization-01': `---
title: "Game Optimization 01 - Introduction & General Principles"
date: 2026-04-16
tags: optimization
series: Game Optimization
---

[Game Optimization - Introduction & General Principles - Episode 1](https://www.youtube.com/watch?v=jt8b0cpjUVk&list=PL78XDi0TS4lG4wvgfyGECmB8XiJLCgfFD)

---

최적화는 성능을 측정하는 것에서 부터 시작 한다.

![](image-1.png)

### 최적화에는 크게 두가지가 존재

1. **에셋 단계**에서의 최적화
    - 각 에셋들의 최적화
    - 폴리곤 수, 드로우콜, 텍스쳐 사이즈 등
    - 에셋이 생성 될때
2. **게임, 레벨** 최적화
    - 씬 전체 적인 분석
    - 병목현상 분석
    - 전체적인 성능 향상

![](image-2.png)

최적화는 모든 과정에서 진행 되어야 한다.
`,

  'Game/game-optimization-02': `---
title: "Game Optimization 02 - The Graphics Pipeline and Rendering Types"
date: 2026-04-16
tags: optimization
series: Game Optimization
---

[The Graphics Pipeline and Rendering Types - Game Optimization - Episode 2](https://www.youtube.com/watch?v=27Am6QaH_Hc&list=PL78XDi0TS4lG4wvgfyGECmB8XiJLCgfFD&index=2)

[Forward and Deferred Rendering - Cambridge Computer Science Talks](https://www.youtube.com/watch?v=n5OiqJP2f7w)

[디퍼드 렌더링, 포워드 렌더링이란? 그리고 차이점에 대해서](https://hub1234.tistory.com/50)

[OpenGL - deferred rendering](https://www.youtube.com/watch?v=0ckE-CZpXAo)

---

![](image-3.png)

병목 현상이 일어날 수 있는 단계:

- CPU → GPU
- 많은 vertex → Vertex Shader
- 복잡한 Shader → Pixel Shader

## Rendering Methods

### Forward

- 오브젝트 하나씩 연산
- 오브젝트당 모든 라이트를 연산
- Back to Front rendering - Transparent Surfaces
- 장점
    - 간단한 씬에는 좋음
    - 각 오브젝트당 유니크한 쉐이딩이 가능함 (라이팅을 다 따로 계산 하기 때문에)
    - 텍스처 메모리를 적게씀 (오브젝트는 하나씩 렌더링 되기 때문에)
- 단점
    - 라이트에 대한 비용이 비쌈
    - drawcall = meshes * lights → CPU 에도 부담

불투명 메쉬가 겹치는 방식에 사용 되었던 Z-buffer를 더 응용하여 G-buffer를 사용하는 Deferred Rendering 이 나오게됨

### Deferred Rendering

- 모든 오브젝트의 텍스쳐 데이터(normal, worldposition, roughness, metal…)를 한장으로 합친다. - G-buffer
- G-buffer 데이터를 합친 후에 모든 라이트를 한번에 계산한다.
- 장점
    - 라이트가 많아도 렌더링이 빠르다
    - 비주얼적으로 뛰어남
- 단점
    - G-buffer 데이터를 축적해 놔야 하기 때문에 많은 memory 요구
    - No Transparent support
    - 다양한 쉐이더는 문제가 될 수 있다.

![엔진은 두 방법을 같이 쓴다. opaque - Deferred, transparent - Forward](image-4.png)

![Shader Complexity 디버그 모드에서 Transparent 메테리얼을 가진 오브젝트가 분홍색으로 보이는 모습](image-5.png)

엔진에서 Transparent 쉐이더는 라이트 까지 같이 계산 하기 때문에 비교적으로 비싸게 나오지만, 실제론 그렇지 않은 경우가 있다.
`,

  'Game/game-optimization-03': `---
title: "Game Optimization 03 - Preproduction Optimization Steps"
date: 2026-04-16
tags: optimization
series: Game Optimization
---

[Preproduction Optimization Steps - Game Optimization - Episode 3](https://www.youtube.com/watch?v=Q05R_UKhRo4&list=PL78XDi0TS4lG4wvgfyGECmB8XiJLCgfFD&index=4)

---

![](image-6.png)

1. 하드웨어의 기준을 정하기
    - 타겟 기기 - 모바일, 콘솔, PC
    - 권장 사양, 최소 사양, 해상도, FPS 등의 기준이 되는 목표를 정하는것
2. 해당 사양의 기기가 어느정도의 퍼포먼스를 내는지 확인
    - Polygon, Drawcall, Memory
3. Budget 내에서 각 파트마다 사용할 수 있는 리소스를 배분
    - UI, 에셋, …
4. 실시간 Budget 추적 하기

![](image-7.png)

## 퍼포먼스 측정

- 에디터 외부에서 측정 하기 (ex. 콘솔)
    - 에디터의 사용량을 제외한 게임 자체의 퍼포먼스를 확인
- 고정된 카메라나 경로를 이용
    - 가장 성능이 저조한 곳에 카메라 설정
    - 측정시 마다 카메라가 조금이라도 흔들린다면, 의도한 값이 왜곡되어 보일 수 있음
- Isolation
    - 환경 에셋을 확인 한다면, FX, PP 전부 off 시킨 상태에서 확인
- 엔진의 프레임률을 고정 하는 설정은 전부 끄기
    - UE - Frame smoothing 끄기
    - Vsync
- Tracking Results
    - 고정된 카메라에서의 초기 퍼포먼스와 실시간 변화율을 추적하기

### Unreal에서
프로젝트 스탯 확인
\`\`\`
stat Unit graph
\`\`\`
프로젝트 패키징
\`\`\`
Platforms -> Window -> Package Project
\`\`\`
`,

  'Game/game-optimization-04': `---
title: "Game Optimization 04 - Analyze First, Then Optimize"
date: 2026-04-16
tags: optimization
series: Game Optimization
---

[Game Optimization - Introduction & General Principles - Episode 4](https://www.youtube.com/watch?v=XgaEqRXVmO0)

---

>[!important]
>최적화 이전에 어느 곳에서 문제가 생기는지 파악 하고 분석하는것이 급선무.

**CPU, GPU bound**
- 퍼포먼스의 차이로 한쪽의 프로세서가 다른 한쪽의 진행을 기다리며 나타나는 병목 현상.
![alt text](image.png)

GPU bound 확인 법
\`\`\`
1. editor 밖에서 게임을 실행한다.
2. framerate counter 를 실행
3. 창 해상도를 줄인다.
4. 성능이 향상된다면 GPU bound
\`\`\`
![alt text](msedge_RnoiCNYD0B.png)

editor 밖에서 standalone 모드로 실행하는 법
\`\`\`
툴바에서 Platforms -> Window -> Package Project
\`\`\`

![alt text](msedge_BdaTdiTdet.png)
\`\`\`
Frame : 전체 프레임 처리 시간.
Game : CPU의 게임 스레드 에서 게임 로직을 처리하는데 걸리는 시간
Draw : CPU 가 GPU로 보낼 Draw call 을 준비하고 처리하는 시간.

GPU Time: GPU 가 실제 화면을 렌더링 하는 시간. 
\`\`\`

### EvaluateWPO
shader 에서 적용 되는 **World Position Offset**
초록 부분 활성화, 빨간 부분 비활성화
\`\`\`
View mode -> Nanite Visulization -> EvaluateWPO
\`\`\`
![alt text](image-1.png)

### pixel programing
빨간 색이 연산 많은 곳
\`\`\`
View mode -> Nanite Visulization -> Pixel Programmable
\`\`\`
![alt text](image-4.png)


![alt text](UnrealEditor_UhOoaNTdPB.png)|![alt text](UnrealEditor_QcnFdLc06o.png) |![alt text](image-3.png)|
--- | WPO 최적화 | PDO off |

쉐이더 단계 에서 최적화를 했는데 Draw 콜이 왜 낮아지나 싶지만,
WPO 는 CPU 가 Draw 를 준비 하는 과정에서 프레임마다 변하는 vertex의 위치를 계산하여 최신화 해야하기 때문
PDO 는 [여기로](../Pixel-Depth-Offset-(PDO)/Pixel-Depth-Offset-(PDO).md)
`,

  'Game/game-optimization-05': `---
title: "Game Optimization 05 - What to do if you're CPU Bound"
date: 2026-04-17
tags: optimization
series: Game Optimization
---

[What to do if you're CPU Bound - Game Optimization - Episode 5](https://www.youtube.com/watch?v=SwWW36mbDhU&list=PL78XDi0TS4lG4wvgfyGECmB8XiJLCgfFD&index=5)
[Visibility and Occlusion Culling](https://dev.epicgames.com/documentation/unreal-engine/visibility-and-occlusion-culling-in-unreal-engine)

---

## High Draw Calls
- [Instancing](../../ComputerGraphics/Instancing/Instancing.md) / [Batching](../../ComputerGraphics/Batching/Batching.md)
- Occlusion Culling
- Level Layout
- Early Distance Culling
- HLODS


## Unreal 에서 Occlusion Culling 확인하기

[Occlusion Culling](../occlusionculling/occlusionculling.md)
\`\`\`
콘솔 -> r.VisualizeOccludedPrimitives 1 
\`\`\`
![alt text](image.png)


## Level Layout

레벨 단계에서 특정 위치에선 특정 레이아웃만 보이게 계획 한다면, 컬링 시 큰 도움이 될것이다. 큰 맵에선 단일 트리거로 한번에 컬링 할 수 있다.
![alt text](image-1.png)

## Early Distance Culling

화면에 비치는 오브젝트가 얼마나 작은지 또는 카메라와의 거리에 따라 컬링 해주는 기법. 한 화면상의 2픽셀 정도의 오브젝트가 있다면 그것도 1의 드로우콜을 발생 시키기 때문에 필터링을 시켜주는 것이다.

\`\`\`
Volume -> Cull Distance Volume
\`\`\`

## Hierarchical Level of Detail (HLODS)

1. 오브젝트를 그룹으로 묶는다.
2. 오브젝트들을 단일 메쉬로 베이크 한다.
3. 거리에 따라서 각 그룹의 오브젝트들은 단일 메쉬로 치환된다.
- 많은 양의 드로우콜을 세이브할 수 있다.

## CPU Bound with Low Draw Calls
드로우콜이 낮음에도 높은 cpu 연산 시간을 가진다면 확인해야할 것 들이 있다.
- Pathfinding
- NPC AI logic
- Complex collision or physics
- Game logic
- Other CPU-intensive task`,

  'Game/profiling': `---
title: Profiling
date: 2026-04-22
tags: optimization, Unreal Engine
---

\`\`\`
stat unit gragh
stat RHI - 드로우 콜
\`\`\`

# GPU Visiualizer
드로우 시간중 어떤것들이 비중을 차지 하는지 시각적으로 알려줌

**캡쳐**
\`ctrl\`+\`shift\`+\`,\`

GPU time
![alt text](image.png)


# RenderDoc

RenderDoc 은 렌더뷰를 캡쳐해 화면에 그려지기 까지의 그 과정을 볼 수 있는 profiling 툴이다.
![alt text](image-copy.png)

렌더링 패스를 크게 나누면 이와 같다.
![alt text](image-1-copy.png)

### 설치

[RenderDoc 설치](https://renderdoc.org/builds)
\`\`\`
plugin setting - RenderDoc 체크
project setting - RenderDoc - auto attached 체크
\`\`\`
`,

  'Game/textures,pixelsshadersandmaterials': `---
title: Rendering and Textures
date: 2026-04-22
tags: optimization, Unreal Engine
---

[Rendering and Textures](https://dev.epicgames.com/community/learning/courses/EGR/unreal-engine-an-in-depth-look-at-real-time-rendering/beV/rendering-and-textures)

---

## Texture
- 텍스쳐는 임포트 될때 압축 된다. - 메모리와 대역폭 한계가 있기 때문
- 플랫폼 마다 압축 방법이 다르며 PC 는 BC(DTXC)를 사용 한다.
- UE5에서는 다양한 BC 압축 방법이 존재 한다.
- 쉐이더는 조회할 수 있는 텍스쳐 제한이 있다.

### Texture Streaming
어느시점에 어느 mipmap을 로드할지 결정하는 프로세스. 엔진은  텍스트를 위해 **Streaming Pool** 이라고 하는 VRAM의 일정량을 미리 할당한다.

### Mipmap
- 원본의 1/4 크기의 사본 이미지
- 모든 사본 이미지는 텍스쳐에 저장 된다.

밉맵이 없다면 먼거리의 텍스쳐는 노이즈 처럼 보이는 현상이 일어난다. 폴리곤의 오버쉐이딩 같은 느낌. 밉맵은 블렌딩되어 적용 된다.
![alt text](image.png) | ![alt text](msedge_5WwuiHeqQO.png) |
--- | --- |
mipmap 적용, 미적용 | 블렌딩 적용 방식 |

>[!note]
>streaming, mipmap 은 2제곱 크기의 해상도 를 지원한다.
GPU는 메모리를 절약을 위해 4*4 픽셀 블록 단위로 묶어서 압축된다.
>(직사각형)32x16도 지원한다.`,

  'Houdini/camera-ndc': `---
title: Camera NDC
date: 2022-05-28
tags: VEX
---

## NDC란?

NDC (Normalized Device Coordinates) — 카메라를 기준으로 정규화된 좌표계다.

3D 공간의 점을 카메라 시야 안에서 어디에 위치하는지 0~1 범위로 표현한다.

| 축 | 범위 | 설명 |
|---|---|---|
| X | 0 ~ 1 | 화면 왼쪽(0) → 오른쪽(1) |
| Y | 0 ~ 1 | 화면 아래(0) → 위(1) |
| Z | 양수 절대값 | 카메라로부터의 거리 (깊이) |

> [!NOTE]
> Z축은 0~1로 정규화되지 않는다. 카메라가 바라보는 방향이 음(−), 반대가 양(+)이며 절대 거리값을 가진다.

카메라 프레임 밖의 점은 X, Y가 0보다 작거나 1보다 크다. 이를 이용해 오브젝트가 카메라 안에 있는지 판별할 수 있다.

---

## toNDC / fromNDC

Houdini VEX에는 두 가지 변환 함수가 있다.

### toNDC

\`\`\`vex
vector toNDC(string camera, vector pos)
\`\`\`

월드 공간의 점 \`pos\`를 NDC 좌표로 변환한다.

\`\`\`vex
string cam = "/obj/cam1";
vector ndc = toNDC(cam, @P);

// 화면 안에 있는지 확인
if (ndc.x > 0 && ndc.x < 1 && ndc.y > 0 && ndc.y < 1) {
    // 카메라 프레임 안
}
\`\`\`

### fromNDC

\`\`\`vex
vector fromNDC(string camera, vector ndc)
\`\`\`

NDC 좌표를 다시 월드 공간으로 역변환한다.

\`\`\`vex
string cam = "/obj/cam1";
vector world_pos = fromNDC(cam, set(0.5, 0.5, 10));
// 화면 정중앙, 카메라에서 10 거리의 월드 좌표
\`\`\`

---

## 활용 예시

**카메라 기반 컬러 매핑**
\`\`\`vex
string cam = "/obj/cam1";
vector ndc = toNDC(cam, @P);
@Cd = set(ndc.x, ndc.y, 0);
\`\`\`

**카메라 밖 포인트 제거**
\`\`\`vex
string cam = "/obj/cam1";
vector ndc = toNDC(cam, @P);
if (ndc.x < 0 || ndc.x > 1 || ndc.y < 0 || ndc.y > 1) {
    removepoint(0, @ptnum);
}
\`\`\`

> [!TIP]
> \`toNDC\`는 SOP 레벨의 Wrangle에서 카메라 경로를 문자열로 직접 지정해야 한다. 카메라가 씬에 없으면 오류가 발생하므로 경로를 파라미터로 빼두는 게 좋다.
`,

  'Houdini/control-smoke-by-max-density': `---
title: Control Smoke by Max Density
date: 2023-04-05
tags: Volume, node, DOP
---

[https://www.youtube.com/watch?v=Wm4uGBcuh5g](https://www.youtube.com/watch?v=Wm4uGBcuh5g)

[http://127.0.0.1:45025/nodes/dop/gasreduce](http://127.0.0.1:45025/nodes/dop/gasreduce)

gasreduce 노드로 source field 의 max값

Dest Option : density / ( 이름 )

density filed에 저장이 된다. geometry 의 detail 같은 느낌

max(dopfield("/obj/ground_destruction_rnd/smoke/pyrosolver2/dopnet1","pyro","density","Options",0,"max"), dopfield("/obj/ground_destruction_rnd/smoke/pyrosolver2/dopnet1","pyro","density","Options",0,"maxmax") )

새로운 데이터 필드를 만들고, max를 불러 온다

이때 계산 되는 순서가 다르기때문에 maxmax는 한프레임 낮은 값을 가져오며 서로 다른 값들을max( a,b) 펑션으로 지속 적인 max값을 찾아준다.
`,

  'Houdini/extract-point-from-curve': `---
title: Extract Point From Curve
date: 2022-04-08
tags: node, SOP
---

![](https://i.imgur.com/mrodZ6c.png)

커브위의 포인트 어트리뷰트를 이용해서 값을 보간하여 그위치에 포인트를 만들어 준다

![](https://i.imgur.com/s9Rqgrm.png)

distance attribute는 보간에 쓰이는 포인트 어트리뷰트

Cut Value Attribute는 어떤값의 위치에 포인트를 만들 것인가.
`,

  'Houdini/for-each-loof': `---
title: For each loop
date: 2021-02-09
tags: node, SOP
---

> [!warning] ⚠️
> 명령을 반복하여 값을 도출 하는 노드

기본적으로 tab을 누른 후 for each를 검색 하면 여러 가지 For each가 나오는데, 자주 사용 하는 설정을 후디니에서 정해놓은거라고 생각 하면 될거 같다.

그 설정 들은 항목 이름 처럼  attribute(name), class에 따라 알맞게 되어있다.

<!-- Column 1 -->

<!-- Column 2 -->


제일 기본적으로 For each point 를 꺼내면 노드가 2개 나온다.

위에 노드가 input 아래 노드가 output이고 그 중간에서 명령이 반복 된다.

> [!note]+ 🧱Block Begin
> > [!note] 👇
> > 반복문의 값을 도출 하는 Block begin 노드의 항목들을 살펴보자
>
> > [!note]+ **Methhod** : begin 노드에 input되는 값의 출처를 정한다.
> > - **Fetch feedback** : end 노드에서 나온 값이 들어 간다 , begin노드에 직접적으로 연결 되는 것이 없어도 기능 한다.
> > - **Fetch Piece or Point** : input에 들어오는 point,piece 가 차례대로 들어온다
> >
> >
>
> ---
>
>

> [!note]+ 🧱Block End
> > [!note] 👇
> > 반복문의 값을 도출 하는 Block End 노드의 항목들을 살펴보자
>
> > ---
>
> ### Iteration methhod
>
> - 반복 하는 방법을 결정 한다. input에 대입 되는 point의 갯수 대로 반복 할 수 도 있고, 원하는 만큼 반복 시킬 수 도 있다.
>
> ---
>
> ### Gather Methhod
>
> - 도출 되는 결과 값을 어떻게 출력 할것인가를 정한다. 각자 계산된 값들을 따로 보거나, 한꺼번에 merge해서 볼 수있다.
>
> ---
>
> ### Piece Attribute
>
> - 체크 하면 attribute를 기준으로 명령을 할 수 있다. (이건 아직 잘 모르겠다.)
>
> ---
>
> ### Max Iteration
>
> - 최대 반복을 정해줄 수 있다.
>
> ---
>
> End 블럭에 single pass를 체크해주면 순서대로 값을 따로 볼 수가 있다. 실제로 각자 값이 도출 되는것은 아니고 시각 적으로만 확인하는 용도로 생각 하자.
>
> 위 사진 처럼 single pass == 0 상태에서는 제일 첫번째(pt0) 값이 나온다.
>




# EX

---

grid를 연결 한 모습이다. 별거 없어 보이지만, 명령이 없다 뿐이지 작동 하는 중이다.
`,

  'Houdini/gpu-pyro': `---
title: GPU Pyro
date: 2021-11-01
tags: TIP, Volume
---

GPU로 빠른 계산을 하는 pyro 솔버 에셋노드이다.

하지만 이노드는 3가지의 볼륨밖에 없고 모션 블러에 필요한 vel이 없다.

solver안으로 다이브 해서 switch 대신 dopimport를 연결해 준다.

Vel이 같이 들어온 모습

후에 vel만 따로 가공해 준다.
`,

  'Houdini/group-node-tip': `---
title: Group node tip
date: 2022-01-09
tags: node
---

> [!note]+ Group node
>
> 각 면의 **노말을 베이스** 로 각도에 따른 그룹 선택
>
> 면도 마찬가지
>
> 가장 테두리에 있는 엣지가 선택 됨

> [!note]+ Group Combine
>
> Group name : output 할 그룹
>

> [!note]+ Group Copy
>
> Prim 또는 PT의 수가 같아야 한다.
>
> 그룹의 이름이 같은 경우 처리 방법
>
> 1. 그냥 건너 뛰고 1번 인풋의 그룹을 유지한다.
> 2. 2번 인풋의 그룹으로 덮어 씌운다.
> 3. 넘버링을 붙여서 둘다 유지 한다.\
>
> 접두사를 붙여 따로 관리할 수 있다.

> [!note]+ Group Promote
>
> group을 속성간 이동시켜준다.
>
> 포인트와 버텍스만 이용할 수 있는 바운딩 리전 그룹 을 prim으로 전환 시켜줄 수도 있다.
>
> Group을 어트리뷰트로 옮겨준다.
>
> point에서 prim으로 그룹을 옮겨줄때 보다 같은 모습으로 전환 해줄 수 있다.
`,

  'Houdini/half-edge': `---
title: half-edge
date: 2022-09-01
tags: VEX, GraphicTheory
---

[https://www.youtube.com/watch?v=FpfA1CkH18E](https://www.youtube.com/watch?v=FpfA1CkH18E)

[https://www.youtube.com/watch?v=x7s7pCPNojs](https://www.youtube.com/watch?v=x7s7pCPNojs)

[https://www.sidefx.com/docs/houdini/vex/halfedges](https://www.sidefx.com/docs/houdini/vex/halfedges)

<!-- Column 1 -->

<!-- Column 2 -->
hal-edge는 각 primitive마다 normal 방향에 의하여 방향성을 가지는 엣지를 말한다.

두 면이 하나의 edge를 공유 한다면 각 면에서의 half-edge는 서로 다른 방향을 가지고 있다.


<!-- Column 1 -->

<!-- Column 2 -->
이 사진에서는 세개의 prim이 동일한 엣지를 공유 하고 있고, 이때 같은 방향성을 가지거나 서로 반대 방향을 가지고 있는 half-edge를 가진다.

** 방향성은 중요하지 않음

---

srcpoint - 방향성이 시작 하는 포인트

dstpoint - 방향성이 끝나는 포인트

sourcepoint 는 각 포인트와 같다.

\`\`\`python
int hedge1 = pointhedge(0,0,1);
int hedge2 = pointhedge(0,1,3);
i@hedge1 = hedge1;
i@hedge2 = hedge2;
\`\`\`

<!-- Column 1 -->

<!-- Column 2 -->
\`pointhedge(geometry, sourcepoint,dstpoint)\`

펑션은 srcpt와 dstpt를 이용해 half-edge의 넘버를 가져온다.

srcpt와 dstpt가 올바른 순서나 짝을 이루지 못하면 -1을 출력한다.
`,

  'Houdini/hbatch-basic': `---
title: hbatch Basic
date: 2022-10-12
tags: code
---

$HPS/bin/당신이나 하세요

기본값(C:/Program Files/Side Effects Software/Houdini 18.5.421/bin)

경로에 있는 hcmd.exe 또는

Command Line Tool 에서 배치파일을 실행 시킬 수 있음

\`\`\`powershell
Y:

Y:\>cd Y:\FX_TEAM\Test\SJH\RND\SJHRND\fx\dev\scenes\

Y:\FX_TEAM\Test\SJH\RND\SJHRND\fx\dev\scenes>hbatch hbatch_test_scene.hip
\`\`\`

후디니 파일경로로 열어 주는 코드

이 툴 안에서는 Hscript를 문법으로 사용하며

[https://www.sidefx.com/docs/houdini18.5/commands/index.html](https://www.sidefx.com/docs/houdini18.5/commands/index.html)

자세한 펑션은 여기 참조

툴안에서는 파이선을 사용할 수 있으며 파이선 파일을 실행 시키는 방법이 편리함.

\`\`\`powershell
python batch_deadline_test.py
python '경로/' + batch_deadline_test.py
## 같은 실행이다
\`\`\`

파이선 파일을 실행 시키는 코드

경로없이 이때 파이선 파일이름만 써준다면 hip파일과 같은 디렉토리에 존재해야 한다.

경로를 같이 적어주면 다른 경로에서 받아올 수 있다.
`,

  'Houdini/isosurface': `---
title: isosurface
date: 2022-10-31
tags: TIP, Volume, GraphicTheory
---

## Isosurface란?

볼륨 데이터 안에서 **동일한 값을 갖는 점들을 이어 만든 표면**이다.

2D에서의 등위선(Contour)을 3D로 확장한 개념으로, 예를 들어 밀도 필드에서 값이 \`0.5\`인 지점들만 이으면 하나의 곡면이 만들어진다.

> [!NOTE]
> VDB에서 SDF(Signed Distance Field)의 isosurface = 0 이 곧 오브젝트의 표면이다.

---

## Houdini에서의 사용

### VDB from Polygons → Convert VDB

폴리곤을 SDF 볼륨으로 만든 뒤 다시 메시로 추출하는 흐름이 기본이다.

\`\`\`
Geometry → VDB from Polygons → Convert VDB (Fog to Polygons / SDF to Polygons)
\`\`\`

### IsoOffset SOP

볼륨을 직접 생성하거나 기존 지오메트리에서 오프셋 표면을 만들 때 사용한다.

| 파라미터 | 설명 |
|---|---|
| Iso Value | 등위면을 추출할 기준값 |
| Offset | 표면에서의 거리 오프셋 |
| Output Type | Surface / Volume / SDF |

### Convert SOP

\`IsoOffset\`이나 볼륨 시뮬레이션 결과를 폴리곤 메시로 변환할 때 쓴다.

\`\`\`
Volume → Convert (Convert To: Polygon Soup)
\`\`\`

---

## SDF와의 관계

SDF(Signed Distance Field)는 isosurface의 대표적인 활용 사례다.

- 값 \`0\` = 표면
- 값 \`< 0\` = 오브젝트 내부
- 값 \`> 0\` = 오브젝트 외부

VDB SDF에서 \`Iso Value = 0\`으로 Convert하면 원본 표면을 복원할 수 있다.

> [!TIP]
> Pyro나 Fluid 시뮬레이션 결과의 \`density\` 필드에서 isosurface를 추출할 때는 Iso Value를 낮게 (0.01~0.1) 설정하면 더 얇고 깨끗한 표면이 나온다.

---

## Marching Cubes

Houdini 내부적으로 isosurface 추출에는 **Marching Cubes** 알고리즘이 사용된다.

복셀 그리드를 순회하며 각 셀의 꼭짓점 값이 임계값(iso value)을 기준으로 안/밖으로 나뉘는 지점에 삼각형을 생성하는 방식이다.

해상도가 높을수록 표면이 정밀해지지만 연산 비용도 증가한다.
`,

  'Houdini/keyframe-to-ramp': `---
title: KeyFrame To Ramp
date: 2022-10-10
tags: TIP, VEX
---

Curveu

Vex Code

\`\`\`python
float u = fit01(f@curveu,0,10000);
float ramp = chf('ramp',u*@TimeInc);
f@u = u;
@P += @N * ramp;
\`\`\`

chf 의 두번째 인풋에 프레임 * @TimeInc를 넣어주면 해당 프레임의 값을 받아 올 수 있는 특징을 이용하여 키프레임을 ramp처럼 이용 더욱 세밀한 값을 조절해줄 수 있다.
`,

  'Houdini/material-builder-occlusion': `---
title: Material Builder occlusion
date: 2021-08-05
tags: texturing, VOP, node
---

P의 거리기반으로 인접한 서페이스가 있을 경우 색을 눌러주는 용도로 이용 된다.
`,

  'Houdini/nodeshape-setting': `---
title: Nodeshape setting
date: 2022-10-17
tags: ui, TIP
---

\`\`\`plain text
{
    "data": [
                ["Object/*", "squared"],
                ["*", "circle"],
                ["Sop/rop_geometry", "tabbed_right"],
                ["Sop/filecache", "tabbed_right"],
                ["Sop/object_merge", "camera"],
                ["Sop/file", "bone"],
                ["Sop/attribwrangle", "circle"],
                ["Sop/volumerasterizeattributes", "circle"]
            ],
    "name": "SJH"
}
\`\`\`

\`\`\`python
{
    "name": "Circle Theme",
    "data": [
	["*", "circle"]
	]
}
\`\`\`

경로

C:\Users\jeonghyeok.song\Documents\houdini18.5

파일이름.nodeshape 으로 저장 하면 됨.
`,

  'Houdini/particle-hit-attribute': `---
title: Particle Hit Attribute
date: 2021-05-25
tags: Particle, DOP
---

파티클 운용시 사용할 만한 attrib 중에서 hit 관련 attrib들이 있다.

popsolver 에서 Add Hit Attributes를 체크하면 관련 어트리뷰트를 사용 할 수 있다.

add impacts = hit와 유사한 정보들을 가짐

Response 에서는 v값의 변화를 선택 할 수 있다.

hitnml = 충돌 후 방향

hitnum = 충돌 시 1로 변환

hitpos = 충돌 위치

hit prim = 충돌한 primnum

hittime = 충돌 시간

hituv = 충돌한 prim의 uv
`,

  'Houdini/particle-popforce': `---
title: Particle_popforce
date: 2021-05-25
tags: Particle, DOP, node
---

swirl size, scale을 이용해 눈에 띄는 패턴을 만들 수 이ㅃㅆ음

Pulse Length = 노이즈 변화 속도

popforce에서 적용된 속도는 계속 누적이 되기 때문에 후에 drag를 이용 해서 속도룰 잡아줄 필요가 있다.
`,

  'Houdini/pcopen': `---
title: pcopen / pcfilter
date: 2021-02-08
tags: VOP, node
---

어느 point의 attrib을 기준으로 하여 주변의 point들을 가져온다. pcfilter와 항상 같이 쓰인다.

## pcopen 파라미터

file : input

P : 기준이 되는 pt의 position값

radius : 탐색 범위

maxpoints : 탐색 최대 pt

handle : 찾은 pt 뭉치들을 다룬다.

## pcfilter 파라미터

pcopen의 handle을 받아 탐색한 pc의 attribute를 가져온다.

handle : 찾은 pt cloud를 뭉치로 가져온다.

signature : attribute의 type

Channel : 가져올 attribute

value : 출력
`,

  'Houdini/pcopen와-pcfind': `---
title: pcopen와 pcfind
date: 2022-06-28
tags: VEX
---

pcopen은 KD-tree ,pcfind는 BVH와 같은 가속 구조를 기본으로 한다.

[https://blog.hybrid3d.dev/2019-03-22-raytracing-kdtree-bvh](https://blog.hybrid3d.dev/2019-03-22-raytracing-kdtree-bvh)

위는 KD-tree와 BVH의 차이를 설명해준다.

결론은 KD-tree는 동적 움직임에 약하고, BVH는 성능이 조금 떨어지지만 동적 움직임에 좋다.

하지만 vex 안에서 의 차이도 존재 한다.

pcfind는 바로 array를 얻고, point.number, point.distance를 이용해서 정보들을 바로 사용 할 수 있다.

pcopen은 핸들을 반환하는 쿼리(Query)를 수행

pcopen은 메모리에 접근해 빠르지만, pcfind는 거리값이나 포인트 넘버를 즉시 어레이로 반환 하기 때문에 쓰기에 좀더 용이하다.

pcfind가 훨씬 빠르다?

100만개의 포인트에서 같은 처리를 해준 상태 pcfind가 2배정도 빠름

**pgfind **라는 것도 존재 한다.

# pcfind

---

pcfind 에서는 패턴 매칭을 사용할 수 있지만 이는 매우 느리다.

removeindex로대체

하지만 이 방법도 위험 할 수 있다. 같은 포지션에 여러개의 포인트가 겹쳐있다면 자신의 값을 먼저 받아온다는 확신이 없기 때문에, 아래와 같은 식으로 대체

value를 이용해서 값을 지워준다.

ptgroup, Pchannel, RadChannel 이 바뀔 때 마다 pcfind는 훨씬 느려진다, 많은 사람들이 radius를 변경해 보지만, 이는 오해이다. 저 채널들이 바꿔지면 가속 구조가 바뀌기 때문


# pcfilter

---

<!-- Column 1 -->

<!-- Column 2 -->

\`\`\`python
## 펑션을 만드는 코드.
function vector pcfilter2(int input; int pts[]; float dist []; string attrib)
{
    float    sum = 0, w, d;
    vector    value, result = 0;
    float maxd = dist[-1];
    int count = len(pts);

    for (int i = 0; i < count; ++i)
    {
        value = point(input,attrib,pts[i]);
        w = 1 - smooth(0, maxd * 1.1, dist[i]); ## pts와 거리가 멀수록 낮은 값의 Cd 를 가져옴
        sum += w;
        result += w * value;
    }
    result /= sum;
    return result;
}


float radius = ch('r');
int maxpts = chi('maxpts');
float dist[] = {};
int pts[] = pcfind(1,"P",@P, radius, maxpts,dist);

v@Cd = pcfilter2(1,pts,dist,"Cd");
\`\`\`


# pcfind로 min,maxpt 구하기

---

\`\`\`python
float radius = ch('radius');        ## 0.5
int minpts = chi('minpts');         ## 50
int maxpts = chi('maxpts');         ## 250

int pts[] = pcfind( 0 ,'P', @P, 1e15, minpts);               ## 주변 포인트 50개 수집
vector p = point(0,'P', pts[-1]);                            ## 제일 먼 포인트의 위치
float maxdist = distance(p,@P);                              ## 제일먼 포인트와의 거리
f@maxdist = maxdist;

if(maxdist < radius)                ## 0.5 범위 보다, 제일 먼 포인트와의 거리가 더 작다면
    pts = pcfind(0,"P",@P,radius,maxpts);      ##maxpts만큼 다시 수집, 0.5거리로


i@count = len(pts);                        ## 배열의 길이
\`\`\`

⇒ 밀집 되어 있는 곳의 pt는 많은 포인트의 배열을 가지고, 적은 분포를 가진 곳의 pt는 처음에 구한 배열을 가지고 있다.

그리고 길이 또는 거리 함수 대신 항상 제곱 버전을 사용해야 한다. 값의 제곱근을 계산하는것을 피하기 위함 ## pow함수를 쓰는것 보단 값을 직접 곱해주는 것이 빠르다. 이 두개를 적용해서 수정 하면

\`\`\`python
float radius = ch('radius');
int minpts = chi('minpts');
int maxpts = chi('maxpts');

int pts[] = pcfind( 0 ,'P', @P, 1e15, minpts);
vector p = point(0,'P', pts[-1]);
float maxdist = distance2(p,@P);                     ## distance2
f@maxdist = maxdist;

if(maxdist < radius * radius)                         ## radius * radius
    pts = pcfind(0,"P",@P,radius,maxpts);


i@count = len(pts);
\`\`\`

이와 같이 쓸 수 있다.

# pcfind_radius

---

[https://www.sidefx.com/docs/houdini/vex/functions/pcfind_radius.html](https://www.sidefx.com/docs/houdini/vex/functions/pcfind_radius.html)

pcfind에 부가적으로 radius가 달려있다. 찾는 대상의어트리뷰트를 이용해 찾을 수 있다.


# Unique Pair Matching

---

\`\`\`python

int count = findattribvalcount(1,"point",'match', @ptnum);
## 중복된 포인트를 잡은 pt들을 걸러 낸다.
if(count != 0)
    i@group_notfound = 0;

\`\`\`

\`\`\`python
int pts[] = pcfind(1,"notfound","P",@P,1e15,1);
i@match = pts[0];
\`\`\`

\`\`\`python
int index = findattribval(0,"point","match", i@match,0);
if ( index == @ptnum)
    i@group_notfound = 0;
\`\`\`

Stop Condition :  조건으로 반복을 멈춘다 ( 0이면 멈춤 )

pointlit : 포인트 그룹의 포인트들을 반환

argc : Hscript 타입의 리스트의 수를 반환

위의 코드는 notfound 그룹에 속해 있는 포인트 들이 없을때 반복을 중지 하겠다는 것.


# Camera Based Occlusion with Variable pscale

---

카메라 NDC를 이용하여 N방향을 정렬 시키거나, 겹쳐진 것들을 걸러낼 수 있다.

\`\`\`python
if( @uv.x > 1 || @uv.x < 0.000001 || @uv.y > 1 || @uv.y < 0.000001)
		removepoint(0,@ptnum);
\`\`\`

**uvtexture 노드를 카메라에 맵핑해서 uv값으로 카메라 밖의 포인트들을 지운다.**

\`\`\`python
string cam = chs('cam');
vector p0 = fromNDC(cam, set(0.5, 0.5, 0));
vector p1 = fromNDC(cam, set(0.5,0.5,-1));    ## 카메라 전방, 중앙에 벡터 위치 생성
vector n = normalize( p1 - p0);               ## 카메라 방향의 법선벡터 생성

vector q = dot(p0 - @P, n) *n;    ## 카메라의 원점 위치와 자신의 위치를 내적해서 방향을 얻고
	@dist = length(q);              ## 카메라 법선 벡터 값을 곱해서 수직 거리값을 얻을 수 있음.

v@Q = @P + q;
v@N = n;
\`\`\`

\`\`\`python
int pts[] = pcfind_radius(0,"Q","pscale",1,v@Q, @pscale, chi('maxpts'));

float dist [] = {};
foreach(int pt;pts)
{
    float d = point(0,'dist',pt);
    append(dist,d);
}

pts = reorder(pts,argsort(dist));    ### pts리스트를 argsort로 dist가 가까운 순서로 인덱스를
                                     ### 가져와서 다시 정렬 해준다.

if(@ptnum != pts[0])
    removepoint(0,@ptnum);

if(chi('preview'))
    @P = v@Q + @N + ch("s");
\`\`\`

reorder 쓰임

\`\`\`python
i[]@list = {4,3,5,6,2,1};
i[]@argsort = argsort(@list);
i[]@reorder = reorder(@list ,argsort(@list));
\`\`\`
`,

  'Houdini/pdg-시뮬레이션-셋업': `---
title: PDG 시뮬레이션 셋업
date: 2022-09-13
tags: TIP, DOP
---

pdg로 랜덤하게 바꿀 시드의 파라미터를 만들어줌

파라미터의 경로 이용할 어트리뷰트 작성

어트리뷰트는 바꿀 파라미터에 작성

아웃풋으로 받아올 노드 선택

뽑아지는 파일 이름 결정

시뮬레이션은 All Frame in One Batch 필수 시뮬레이션을 단위로 하나로 묶어줌

## deadlinescheduler 셋팅

환경 변수 설정

Priority 는 두자리수 으로

Concurrent Tasks는 팜 하나에 얼마나 줄건지 (무조건 1 이상)
`,

  'Houdini/pop-replicate': `---
title: POP_Replicate
date: 2021-06-17
tags: DOP, Particle, node
---

impulse rate : 프레임당 파티클 생성 수

Birth Rate : 초당 파티클 생성 수

파티클을 생성하는 포인트는 랜덤으로 지정 되는듯 하다.

 Seed 는 어느 점의 파티클의 생성 되는 위치를 정한다.

attribute를 지정해주면 원하는 포인트에서 모두 파티클을 복사 해줄 수 있다. ( 1 = on, 0 = off )

Radial Velocity는 방사형으로 v를 추가해주는 옵션

inherit Vel이 낮고 Radial 이 높다면 180도 에 가까운 각도로 방출된다.

→ 적절이 섞어 주고== Birth의 Seed 도 $F로 다양성==을 주면서 다양한 각도로 퍼지게 할 수 있다.

Uniform Scale같은 경우 소스의 @pscale의 값을 따라간다.
`,

  'Houdini/rbd-attribute': `---
title: RBD attribute
date: 2021-07-18
tags: DOP, RBD, VEX
---

> [!note]+ f@speedmax
> v의 length(speed) 를 가지고 객체의 최대 속력을 clamp 해준다

> [!note]+ v@w → anglea
>
> RBD Packed Object 에 Angular Velocity 에 해당 하는 attrib이다. 1초 동안 회전하는 값을 지정할 수 있음. v 처럼 매프레임마다 회전을 더해주게 된다.

> [!note]+ i@active
> dynamic의 활성 여부
>
> 0 = static

> [!note]+ i@animated
> 객체가 animated 되어 있는것을 반영 하느냐의 여부
>
> animated는 pack 된 후 transform과 같은 matrix가 통으로 움직이는것을 의미한다.
>
> pack이전의 움직임은, 각 포인트의 변환이며 deforming이라고 한다.
>

> [!note]+ i@deforming
>
> pack이전의 geo가 변화하는 상태는 각 포인트의 값들이 변하기 때문에 deforming상태라고 한다.
>
> 1 : 활성, 0 : 비활성
>

> [!note]+ f@bounce
> collision될때 튕기는 세기를 정한다.

> [!note]+ i@bullet_add_impact
> 해당 오브젝트에 impact정보를 추가해준다.
>
> RBD packed object 에도 포함 되어있는 설정

> [!note]+ i@bullet_ignore
> 0 일때 시뮬을 무시

> [!note]+ bullet_linear_angular_sleep
> f@bullet_linear_sleep_threshold
>
> f@bullet_angular_sleep_threshold
>
> active와는 조금 다르고, 동작을 멈출 뿐임
>
> 임계값 이하로 떨어지면 동작을 일시적으로 비활성화 해 준다.
>
> linear = 속력, angular = 회전력
>
`,

  'Houdini/remesh-와-uvr-original-geo': `---
title: remesh 와 UVR original GEO
date: 2023-05-11
tags: node, SOP, TIP, UV, RBD, texturing
---


fracture 단계 에서 Noise 를 적용 하기 위해 remesh를 적용 할 때 inside 와 outside 모서리 부분 normal이나 uv 가 고르게 적용 되지 않는 문제가 발생 할 수 있다.

# UV

위의 문제를 labs fast remesh의 3D and UV Connectivity 옵션을 이용 해서 해결 할 수 있다.

fast remesh 노드 안에 들어가 보면 uv를 기반으로 geo를 한번 쪼개 주고  리메쉬 해주는 모습을 볼 수 있다.

# Geo


모서리 부분도 따로 잡아 리메쉬 해줌

Normal


remesh 하기 전의 N 를 가져와 transfer 해준다
`,

  'Houdini/screendoor-samples': `---
title: Screendoor Samples
date: 2024-04-02
tags: Render, Volume, Solaris
---

불투명한 오브젝트가 레이를 받게 될때 확률적 샘플링을 이용해서 오브젝트의 노이즈를 줄여준다.

단, 간접적인 소스에 대해서는 영향을 미치지 않는다. ( 간접광을 말하는 듯. )

불투명도에 대한 노이즈만 개선 가능.

<!-- Column 1 -->


<!-- Column 2 -->


제한적인 상황에서 Pixel samples, Volume Step Rate, or Min and Max ray samples 값들을 조정해주는것 보다 빠르고 좋은 결과를 보여 준다.
`,

  'Houdini/uv-정리': `---
title: UV 정리
date: 2021-10-22
tags: UV, node, TIP
---

> [!note]+ Vertex Splite
>
> UV를 가지고 있는 객체를 remesh 할 때 UV 가정돈 되지않을 경우 vertexsplite 노드를 이용해서 정리해 줄 수 있다.
`,

  'Houdini/vellum-grain': `---
title: Vellum Grain
date: 2021-07-16
tags: vellum, DOP, node
---

> [!note] 🔥
> [vellum 의 기본 구성](/f9289a67b67342a6a4f0459e8155d9d2)을 먼저 알고 오자

<!-- Column 1 -->

<!-- Column 2 -->
Vellum grain의 기본 구조

vellum grain에서 포인트를뿌려주고 glue로 붙여주는 과정이 있다.


기본적으로 solid 를 가져와 내부에 포인트를 뿌려주고 시작할수도 있지만, 직접 포인트를 이용할 수도 있다.

<!-- Column 1 -->

<!-- Column 2 -->
Vellume Grain Parameters

Constraint는 glue로 되어있다.

Type 은 point

Cluste Attrib을 통해 덩어리를 표현해줄 수 있다.

constraint 를 생성할때 적용시킬 수 있는 파라미터들

Detach Point Chance : 랜덤으로 constraint가 낮은 값

Damping 값은 낮으면 찰랑 거리거나 튕기는  고무물성을 나타내고, 높으면 모래, 흙덩어리 처럼 묵직하고 정적인 느낌을 준다.
`,

  'Houdini/vellum-rest-blend': `---
title: Vellum Rest Blend
date: 2021-07-16
tags: vellum, SOP, node
---

> [!note] 🔥
> [vellum 의 기본 구성](/f9289a67b67342a6a4f0459e8155d9d2)을 먼저 알고 오자

Vellum Rest Blend : pt정보가 같은 객체들의 모양을 blend 시켜주는 기능

<!-- Column 1 -->

<!-- Column 2 -->
rest blend의 기본 구성

두가지 객체를 준비한다.

하나는 목표가 되는 객체(A), 하나는 변하는 객체(B)

==A는 numpt가 B와 같아야 한다. ==

ray 노드를 쓰거나 vex를 이용해서 모양을 만들어내는것이 관건인듯 하다.

Vellum solver 안에서의 rest blend 사용

dopnet 에서도 처리해줄 수 있다.
`,

  'Houdini/vellum-strut-soft-body': `---
title: Vellum Strut Soft Body
date: 2021-07-15
tags: vellum, node, SOP
---

> [!note] 👇
> 후디니 내에서 옷, 고무, 등 유연성을 가진 개체를 표현할때 쓰이는 속성                                 vellume solver, constraint, cloth grain등 다양한 노드들이 있다

기본적인 Vellum Constraint 노드에서 시작.

Constraint  Type은 Struts

중간에 Strut Search 에서

---

<!-- Column 1 -->

<!-- Column 2 -->

max Strut Length : 왼) 100 / 오) 0

<!-- Column 1 -->

<!-- Column 2 -->
Pressure 은 안에서 바깥으로 기압을 주는듯한 팽창이 일어나는 모습에 적합
`,

  'Houdini/vex-include-경로': `---
title: VEX include 경로
date: 2022-04-05
tags: VEX, TIP
---

문서/houdini버전/vex/include

파일 유형 : .h (C++ / 내부에선 vex문법으로 작성)
`,

  'Houdini/vex-에서-vop-noise-쓰기': `---
title: VEX 에서 VOP noise 쓰기
date: 2022-08-11
tags: VOP, VEX, code, texturing, TIP
---

[https://mrkunz.com/blog/03-04-2017_Using-noise-in-VEX.html](https://mrkunz.com/blog/03-04-2017_Using-noise-in-VEX.html)

vop 헤더 파일을 불러와서 vop에서 사용하는 노드들의 펑션을 쓸 수 있게 해준다.
`,

  'Houdini/volume-collision-수정': `---
title: Volume Collision 수정
date: 2021-10-22
tags: node, DOP, Volume, TIP
---

Volume Source를 이용 해서collision을 불러올때 이런식으로 구멍이 나면서 제대로 역할을 할 수 없을 때가 있다.

위의 방식 처럼 collision의 fill interior와 레졸루션, smoke oject의 레졸루션도 맞춰 가는 방식이 필요하다,.
`,

  'Houdini/volume-retime': `---
title: Volume Retime
date: 2022-09-06
tags: Volume, TIP
---

[https://youtu.be/m48ynuhEFKY](https://youtu.be/m48ynuhEFKY)

감속 후 $FF + 0.25 하면 프레임 중간중간에 생기는 플리커를 어느정도 보간이 가능 하다
`,

  'Houdini/white-water-tip': `---
title: White Water Tip
date: 2021-09-03
tags: DOP, Flip, Particle
---

물의 세부표현으로는 총 3가지 종류가 있는데

1. bubble : 물속에 있는 거품 입자들. (sdf 음수)
2. faom : 물표면에 있는 거품 입자들. (sdf 0)
3. spray(mist) : 물밖에 있는 거품 입자들.(sdf 양수)

화이트 워터 만드는 원리

dop 안의 계산된 fluid tank를 소스로 가져와 볼륨, 파티클들을 만들어 표현한다.

---

# Self Tool - White Water

Self Tool 에 있는 White Water의 노드들

> [!note]+ whitewater_source - ( DOP에 있는 flip tank를 소스로 가공하는 단계 )


> [!note]+ whitewater_sim - ( 가공된 소스로 파티클을 만드는 단계 )


> [!note]+ whitewater_import - ( 만들어진 파티클들로 볼륨을 만드는 단계 )
>
> 4. fluid tank를 소스로 하여 만든 파티클들을 가져온다.
> 5. depth와 age를 이용해서 density를 만든다.
> 6. density로 볼륨을 만든다.( fog )
> 7. denstiy 의 값을 반전시킨다. ( 내부 : - / 외부 : + )
> 8. 반전시킨 값을 토대로 gradiant( normal )을 구한다.
>     1. 볼륨의 normal을 구하는 이유는 렌더링시 반사가 일어나 실제같은 표현을 해주기 위함.
>

---

# Custom White Water

DOP 에서 만들어진 fluid를 속도(v), dot, depth를 조건들로 지오메트리 표면에 붙어있는 파티클들을 걸러준다.

> [!note]+ 파티클들의 V를 커스텀 하는법.
> > [!note]+ 1. volume의 vel을 이용해서 움직인다.
> >
> > 가져온 소스의 vel volume을 이용해서 파티클들을 움직인다. volume은 vdb로 변환후 vdbmerge 를 이용해서 가져온다.
> >
>
> > [!note]+ 2. volumegradiant를 이용해서 파티클들을 표면위로 붙여준다.
> >
> > 서로 모여서 선으로 보이는 형태가 된다.

## 영역 가공

popkill을 이용 일전에 boundary를 아용한 부분을 지워준다.


---

# Repellant_Point

SOP solver 로 repellantpoint를 만들고 POP wrangle 을 이용해서 파티클을 밀어주기.

> [!note]+ %%%%%%pointfromvolume이 작동 되지 않을 때.


surface volume 을 이용 해서 point 를 필터링 해줌

POP object 는 그룹을 가지고 있다. 이것을 이용해서 foam 파티클들만 뽑아낼 수 있음.

sop solver에서 생성한 repellant point를 기반으로 밀어주는 코드 작성.

퍼지는 넓이 모양을 랜덤, 노이즈를 이용해 바꿔 준다.

---

실제로 만들어 지는 geo는 소스보다 조금 두껍기 때문에 만들어진 폼 파티클들이 묻힐 수 있다. 그렇기 때문에 surface 값을 이용해서 offset을 해줘야. 보일 수 있다.
`,

  'Houdini/경로-vex': `---
title: 경로 vex
date: 2022-09-02
tags: VEX, TIP
---

\`\`\`
python
v@Cd = point('op:../color1',"Cd",7);
\`\`\`

vex에서 경로를 바로 써주는 방법

\`\`\`python
string srcpath = chs('srcpath');
string destpath = chs('destpath');
s@path = relativepath(srcpath, destpath);
\`\`\`

srcpath 부터 destpath의 상대 경로를 알아냄.

\`\`\`python
s@fullpath = opfullpath(s@path);
\`\`\`

상대경로의 절대경로를 알아냄
`,

  'Houdini/볼륨-렌더': `---
title: 볼륨 렌더
date: 2022-05-18
tags: Volume, Render, DOP
---

메테리얼에 있는 자동 인풋 값을 확인해보자. SOP 단계에서 해당 어트리뷰트를 만들어 적용하면 자동으로 파라미터에 있는 값과 연동하여 보여진다.

## 볼륨 소스 name point attrib

포인트에 볼륨 네이밍처럼 string 타입 어트리뷰트로 네이밍을 해주고 그걸 소싱할 수 있다.
`,

  'Houdini/쓸만한-노드들': `---
title: 쓸만한 노드들
date: 2022-10-07
tags: node, TIP
---

> [!note]+ # Point Relax
>
> > [!note]+ 스캐터 된 포인들 서페이스에 붙여서 정리, 간격 조절
>

> [!note]+ # enumerate
>
> 포인트, 프림 순서에 따른 integer나 string  값 부여
`,

  'Houdini/플립북에-정보-띄우는법': `---
title: 플립북에 정보 띄우는법
date: 2021-11-25
tags: TIP
---

파라미터 에서 Comment 를 추가 후 작성

줄을 많이 띄우면 글이 아래로 내려 온다.
`,

  'Markdown/Call-Out': `---
title: Call Out, Alert
date: 2026-04-16
tags: 
---


\`\`\`
> [!NOTE]  
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]  
> Crucial information necessary for users to succeed.

> [!WARNING]  
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.
\`\`\`

**출력 결과**
> [!NOTE]  
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]  
> Crucial information necessary for users to succeed.

> [!WARNING]  
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.


`,

  'Markdown/문자열-강조': `---
title: 텍스트 강조
date: 2026-04-16
tags: 
---

### 기본 텍스트 강조 문법

\`\`\`
인라인 : \`텍스트\`
볼드 : **텍스트**
이탤릭 : *텍스트*
취소선 : ~~텍스트~~
마크 : <mark>텍스트</mark>
인라인 볼드 : **\`텍스트\`**
\`\`\`
인라인 : \`텍스트\`
볼드 : **텍스트**
이탤릭 : *텍스트*
취소선 : ~~텍스트~~
마크 : <mark>텍스트</mark>
인라인 볼드 : **\`텍스트\`**

---

### 글자 색상, $\LaTeX$
\`\`\`
$\color{red}{텍스트\ Text}$
$\color{blue}{텍스트\ Text}$
$\color{#58A6FF}{텍스트\ Text}$
\`\`\`
$\color{red}{텍스트\ Text}$
$\color{blue}{텍스트\ Text}$
$\color{#58A6FF}{텍스트\ Text}$

---

### 코드 블록 색상 강조

diff 로 코드블럭을 시작.

\`\`\`diff
+ 이 줄은 초록색 배경으로 표시됩니다. (성공, 추가)
- 이 줄은 빨간색 배경으로 표시됩니다. (실패, 삭제)
! 이 줄은 주황색 계열로 보일 수 있음 (주의)
\`\`\`
`,

  'Markdown/페이지-참조': `---
title: 페이지 참조
date: 2026-04-16
tags: 
---



## md 링크

### 상대 경로
\`\`\`
./ 현재 폴더
../ 상위 폴더
\`\`\`

\`\`\`
a/b/README.md 일때
README.md 에서
./ = d/
../ = c/
\`\`\`

-  뒤에 #h 를 붙이면 헤더로 이동 가능. 단 띄어쓰기는 \`-\` 로 대체
\`\`\`
[참조](../../Houdini/camera-ndc/camera-ndc.md#활용-예시)
\`\`\`
**출력 결과**

[참조](../../Houdini/camera-ndc/camera-ndc.md#활용-예시)

---

## 페이지 링크

### 기본 형식
\`\`\`
[Google](https://google.com)
[Naver](https://naver.com "링크 설명")
구글 홈페이지: https://google.com
네이버 홈페이지: <https://naver.com>

\`\`\`
**출력 결과**

[GOOGLE](https://google.com)
[NAVER](https://naver.com "링크 설명")
구글 홈페이지: https://google.com
네이버 홈페이지: <https://naver.com>

---

### [참조] 형식
\`\`\`
[Google][GOOGLE]
[Naver][1]

---

[GOOGLE]: https://google.com
[1]:<https://naver.com>
\`\`\`
**출력 결과**

[Google][GOOGLE]
[Naver][1]

[GOOGLE]: https://google.com
[1]:<https://naver.com>
`,

  'Math/라디안': `---
title: 라디안(Radian)
date: 2021-07-17
---

프로그램에선 각도를 나타낼때 degree보단 radian을 이용한다.

후디니에서는 [cos, sin, tan](/4b39224626a7408480ab8b495942ae47)에서 사용된다.

위의 그림 처럼 원의== 호가 반지름과 1:1의 비율이 되는 각도==를 1radian이라고 한다.

---

# 라디안(radian)과 파이( $\pi$ )

파이는 기본적으로 원 지름이 1일때 원의 둘레를 말한다.

지름 1 ⇒ $\pi$

반지름 0.5 ⇒ $\pi$

반지름 1 ⇒ 2$\pi$

위의 이유처럼 반지름이 1인 경우 원의 둘레는 2$\pi$이고, 그렇다면 반원의 호는 $\pi$가 성립 된다.

곧 단위원에서 $\pi$는 180도를 나타내는 radian이 된다.

후디니에서의 파이는 <u>**$PI**</u> 로 표기된다.
`,

  'Math/삼각-함수': `---
title: 삼각 함수
date: 2021-07-17
---

후디니에서의 삼각함수는 패턴을 만들거나 움직임 또는 값을 자동화 시킬 수 있는 유용한 펑션으로 사용 된다.

위의 단위원과 그안에서의 직각삼각형으로 우리는 삼각함수를 이용해 그래프나 패턴을 구할 수 있다.

후디니 내에선 삼각함수값을 이용할때 [라디안](/cb8db1ed02fb44b88dca4ee88b2b8d27)을 사용한다.

---

> [!note]+ **Cos**
> 코사인 cos(radian) = 직각삼각형의 빗변과 밑변의 비율을 구한다.
>
> 위그림과 같을때
>
> cos(25) = 0.9... 이 나온다. 100m 와 밑변의 비율이 0.9라는 의미이므로 0.9 * 100 = 90 이라는 밑변의 길이도 구할 수 있는 식이 나온다.
>
> 식으로 표현 하자면 ==cos(==$\theta$==) = 빗변/밑변== 이 될 수 있다.
>
> 위와같은 단위원의 경우
>
> cos($\theta$)
>
> ⇒ x/r = 밑변
>
> ⇒ x/1 = x
>
> ⇒ cos($\theta$) = x가 성립 된다.
>
> 즉 P의 x값을 구할 수 있다는 이야기 이다.
>
> 이 값을 그래프로 적용 하자면,
>
> 여기서 세로축은 x를 뜻한다. x를 y값에 적용했다는 이야기
>
> 그래프 상에서 각도가 0( cos(0) )일때, y가 1 즉 x가 1이라는 말이고 시간에따라 각도가 변한다면 위와 같은 그래프가 그려진다.

> [!note]+ **Sin**
> 사인 sin(radian) = 직각삼각형의 빗변과 높이의 비율을 구한다.
>
> 위그림과 같을때
>
> 식으로 표현 하자면 ==sin(==$\theta$==) = 높이/빗변== 이 될 수 있다.
>
> 곧 sin($\theta$) * 100 = $x$( 높이 ) 가 되는 것이다.
>
> ## 단위 원에서의 sin
>
> 위와같은 단위원의 경우
>
> sin($\theta$)
>
> ⇒ y/r = 밑변
>
> ⇒ y/1 = x
>
> ⇒ sin($\theta$) = x가 성립 된다.
>
> 즉 P의 Y값을 구할 수 있다는 이야기 이다.
>
> 이 값을 그래프로 적용 하자면,
>
> 그래프 상에서 각도가 0( sin(0)) )일때, y가 0 이라는 말이고 시간에따라 각도가 변한다면 위와 같은 그래프가 그려진다.

> [!note]+ **Tan**
> 탄젠트 tan($\theta$) = 직각삼각형의 높이와 밑변의 비율을 구한다.
>
> 위그림과 같을때
>
> 식으로 표현 하자면  ==tan(==$\theta$==) = 높이/밑변== 이 될 수 있다.
>
> ## 단위 원에서의 sin
>
> 위와같은 단위원의 경우
>
> tan($\theta$) = 1이 나오며
>
> tan($\theta$) = y/x = y^/x^
>
> tan($\theta$) = y/x = y^/1
>
> ⇒ y^이 나오게 된다.
>
> 곧
>
> 위의 값이 성립 된다.
>
> tan의 값이 커지면서 y의 값도 커지지만, 삼각비에서 나오듯이 tan90의 값은 측정 할 수 없게 된다.

---

> [!note]+ 참고 링크
> [https://mathbang.net/509](https://mathbang.net/509)
>
> [http://lab.gamecodi.com/board/zboard.php?id=GAMECODILAB_Lecture_series&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=127](http://lab.gamecodi.com/board/zboard.php?id=GAMECODILAB_Lecture_series&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=127)
`,

  'Math/정사영-othogonal-projection': `---
title: 정사영 (Othogonal Projection)
date: 2022-08-14
---

[https://mrw0119.tistory.com/94](https://mrw0119.tistory.com/94)

<!-- Column 1 -->

<!-- Column 2 -->

투영 벡터를 구하는 방법은 다음과 같다

**여기서 N은 noramlized된 단위 벡터 이다.**


$(|V| * cos\theta)*N = Proj(V)$


내적 벡터로 구하기

$(V\bullet N) * N = Proj(V)$

$(|V| * |N| * cos\theta) * N = Proj(V)$ [******](/d2016b7c039448cdb2c09c809e1a1c3a)

$(|V| * cos\theta) * N = Proj(V)$

$|N|$는 단위 벡터 이기 때문에 생략


후디니 에서의 사용

\`\`\`python
int npt = npoints(1);
vector pos0 = point(1,"P",0);
vector pos1 = point(1,"P",npt - 1);

vector N = pos1 - pos0;
vector V = @P - pos0;

vector N_norm = normalize(N);
vector V_norm = normalize(V);

@P = dot(V, N_norm) * N_norm;  ##내적 으로 구하는 프로젝트 값
\`\`\`

이때 우리가 사용할 수 있는 값들


> [!note]+ ### (응용) 평면 projection
>
> \`\`\`python
> vector  pos_0 = prim(1,"P",0) ;                      // "___" 에 들어갈 코드를 채워 넣으세요
> vector  vec_A = @P - pos_0 ;                            // "___" 에 들어갈 코드를 채워 넣으세요
> vector  vec_B_norm = prim(1, "N", 0) ;                  // vec_B_norm을 어떻게 구할 수 있는지 HINT node를 확인해 보세요.
> vector  vec_B =  dot(vec_A, vec_B_norm) * vec_B_norm;   // "___" 에 들어갈 코드를 채워 넣으세요
>
> @P -= lerp({0,0,0}, vec_B, bias) ;
> \`\`\`
>
> primitive 의 P, N attridute를 사용해서 같은 수식을 정해 준다.
`,

  'Math/허수와-복소수': `---
title: 허수와 복소수(imaginary number & complex number)
date: 2021-02-17
---

> [!note] 👇
> quarternion(사원수)의 계산 이해를 위한 허수와 복소수의 개념 정리

허수를 설명 하기 전에는 ==음수==와 ==곱셈==의 의의에 대해 재조명할 필요가 있다.

아래 설명에는** 수는 방향성을 가진다는 사실**이 바탕이 되어 있음을 알고 있자.

## 먼저 음수에 대한 이야기이다.

17세기 전까지만 해도 음수의 존재를 사람들은 이해하지 못했으며, 필요성 또한 느끼지 못했다. 왜냐하면 0 이라는 '없음'을 의미하는 수보다 아래에 있는 보이지 않는 수 이기 때문이다.

가령 사과 1개는 있어도 사과 -1개는 있을 수 없는 것 처럼 말이다.

또한 음수는 수를 스칼라에서 **1차원의 벡터로 확장** 시켰다. 즉 전에는 양수만 존재하여 양의 방향만 표현할 수 있었지만, 음수의 등장으로 그 반대값을 가지게 하며 수는 양방향성을 띄게 된것이다. 예를 들어 4 이라는 양의 방향이 있다면, -4는 그만큼의 **반대 방향**을 의미 하게 된다.



## 다음은 곱셈.

 곱셈은 기본적으로 양수의 배를 의미한다. 즉 1 * 3 은 1만큼의 수를 가진 양의 방향을 3배 만큼 커지게 한다는 의미를 가진다.


## 허수 ( i^ = -1 )

- **허수는 존재하지 않는 값이다.**

허수는 제곱을 해서 -1이 되는 값을 뜻한다. 허나 이러한 성질을 가진 수는 존재하지 않으므로 $i$를 통해 실수 체계를 복소수 체계로 확장 시킬 수 있다.

- **수는 회전한다.**

제곱의 의미를 다시 보자. "제곱 = 같은 값을 두번 곱하는 식." 이라고 했을 때,  2^ = 2 * 2 = 4 와같은 식을 가진다. 그렇다면 이식은 어떨까 :  2^ = 1 * 2 * 2 = 4 (1의 존재는 방향의 이해를 돕기 위한 것이며 1의 방향으로 4배가 커지게 된다는 의미이다.) 이또한 같은 값이 나온다. 우리는 이것으로 한 제곱에 음수가 있을 수도 양수가 있을 수도 있다는 것을 알게된다.  그리고 우리는 실수를 가지고는 허수의 식을 풀 수 없다는걸 알 수 있다.

그렇다면 x^ = 1 * x * x = -1이 될려면 어떻게 해야할까? 실수의 체계에서는 불가능 하다. 이부분에서 수는 2차원의 벡터로 확장하게 된다. 1을 -1로 만들기 위해선 수가 회전을 해야 한다는 이론이다.

### 1의 값이 ==가상의 축 i==를 통해 2차원 까지 확장되어 회전하게 된다면...

i^ = -1의 식이 성립되기 위해서는 가상의 i 축이 필요 하다.

2^ = 4를 다시보자, 4의 값을 가지기 위해서는 +1이 2만큼의 움직이고, 다시 2만큼 움직이게 되면 4의 값을 가지게 된다.

즉 허수의 식도 마찬가지이다.  +1이 i 만큼 움직이고 또다시 i 만큼 움직인다면, -1로 갈 수 있다는 것이다.

이것은 아까의 제곱으로 다시 풀 수 있다. +1 * i * i = -1 즉, i^ = -1이 되는 것이다.

---

> [!note]+ 참고 링크
> [https://www.youtube.com/watch?v=INxpcSwbKMo](https://www.youtube.com/watch?v=INxpcSwbKMo)
>
> [https://angeloyeo.github.io/2019/06/15/imaginary_number.html#1-수의-발견](https://angeloyeo.github.io/2019/06/15/imaginary_number.html#1-%EC%88%98%EC%9D%98-%EB%B0%9C%EA%B2%AC)
`,

  'Python/class-str': `---
title: Class, __str__
date: 2022-10-19
tags: class
---
https://goodthings4me.tistory.com/m/59

Class 사용시 \`__str__\`을 사용하게되면 인스턴스를 프린트 할때 바로 str의 반환을 출력한다.
`,

  'Python/dict-value': `---
title: dict value 처리법
date: 2023-02-13
tags: dict
---
https://www.daleseo.com/python-collections-defaultdict/
`,

  'Python/ffmpeg-crop': `---
title: ffmpeg으로 영상 crop하기
date: 2023-02-23
tags: ffmpeg
---
\`\`\`python
def clipVideo(path, filename, start_time, end_time):
    
    temp_file = path + filename
    clip_filename = filename.replace('_temp','')

    ffmpeg_cmd = f'ffmpeg -ss {start_time} -t {end_time} -i {temp_file} -codec copy -avoid_negative_ts make_zero {path}{clip_filename}'
    subprocess.call(ffmpeg_cmd, shell=True)
    subprocess.call(f"rm \"{temp_file}\"", shell=True)
\`\`\`
`,

  'Python/hbatch-deadline': `---
title: hbatch deadline submiter
date: 2022-10-12
tags: HOM, deadline
---
배치 상태에서 데드라인에 rop을 던지려면 데드라인 에서 사용할 파라미터로 job, info 두가지가 필요하다. 둘다 텍스트 로 적용이 가능 하며 종류는 아래에 거진 있고 여기 없는 것들은 general이나 다른 부분에 분포 되어 있다.

\`\`\`python
import hou
import pyqt_houdini
import sys
import os
import subprocess

from collections import OrderedDict

class DeadlineController():
    def __init__(self, view):
        self.view = view
        self.model = self.view.model

    def changeFrame(self, nodeName):
        byStep = self.view.frameInterval_lineEdit.text()

        node = hou.node(nodeName)

        startFrame= node.parm('f1').eval()
        endFrame= node.parm('f2').eval()
        intervalFrame= node.parm('f3').eval()

        frame = str(int(startFrame))+"-"+str(int(endFrame))
        frame = '{0}-{1}step{2}'.format(str(int(startFrame)), str(int(endFrame)), str(int(intervalFrame)))
        # ...
        return frame

    def houdiniInfoCollect(self, nodeName, number):
        frame = self.changeFrame(nodeName)

        info = 'Plugin={0}\n'\
               'Name={1}\n'\
               'Frames={2}\n'\
               'ChunkSize={3}\n'.format(
                   self.model.getPlugin(),
                   nodeName,
                   frame,
                   str(self.view.getChunkSize())
               )

        saveInfoTemp = r'{}\houdini_deadline_info.job{}'.format(os.getenv('TEMP'), number)
        with open(saveInfoTemp, 'w') as infoFile:
            infoFile.write(info)

        return saveInfoTemp

    def submitDeadline(self):
        nodeList = self.model.renderNodes
        for i in range(len(nodeList)):
            info = self.houdiniInfoCollect(nodeList[i], i)
            job = self.houdiniJobCollect(i)

            submit_command = "C:\\PROGRA~1\\Thinkbox\\Deadline10\\bin\\deadlinecommand "+"\""+info+"\""+" \""+job+"\""
            deadline_command = subprocess.Popen(submit_command, shell=1)
\`\`\`

Job Info Parameters

\`\`\`
Plugin = 'Houdini'
Name = '힙네임 - 만트라 노드 네임'
Comment = ''
Pool = 'none'
MachineLimit = '머신 리밋'
Priority = "프로퍼티"
OnJobComplete = 'Nothing'
TaskTimeoutMinutes = '0'
LimitConcurrentTasksToNumberOfCpus = '0'
ConcurrentTasks = '1'
Department = ''
Group = 'houdini'
LimitGroups = ''
JobDependencies = ''
Frames = "프레임"
ChunkSize = "청크사이즈"
WhiteList = ''
PopupNotification = True
BatchName = ''
Blacklist = ''
InitialStatus = 'Active', 'Suspended'
\`\`\`

Plugin Info Parameters

\`\`\`
SceneFile = 힙파일 경로
IFD =''
Output = 아웃풋 경로
OutputDriver = 만트라 노드 경로
Version = 후디니 버전
Build = 프로퍼티랑 동일
\`\`\`

위의 두가지를 텍스트 형식의 .job 파일로 temp 경로에 저장한 후에 그것을 가져다 쓰는 방식으로 데드라인이 작동됨
`,

  'Python/houdini-widget-custom': `---
title: Houdini 에서 위젯 커스텀(stylesheet, QPixmap) 반영 하기
date: 2022-06-26
tags: PyQt
---
일반적인 Qt Designer의 사용으로는 후디니에서 반영이 안되는 것들이 종종 있다. hutil.Qt 라는 자체 내장 모듈에서 코드를 불러와서 그런게 아닌가 싶다.

https://doc.qt.io/qt-5/stylesheet-examples.html#customizing-qpushbutton

https://doc.qt.io/qt-5/stylesheet-reference.html#background-image-prop

# Style Sheet

stylesheet를 이용 해서 후디니에 반영 시키는 방법

\`\`\`python
QPushButton{
	border-radius : 10px;
	background-color : rgb(85,170,255);
}
\`\`\`

QPushButton 처럼 위젯 타입으로 한번 묶어 주고 코드를 작성해야 한다.

\`\`\`python
QPushButton{
	border-radius : 10px;
	background-color : rgb(85,170,255);
	color : rgb(200,200,200);
}

QPushButton:hover{
	background-color : rgb(85,255,80);
	color : rgb(200,0,0);
}

QPushButton:pressed{
	background-color : rgb(0,80,255);
	color : rgb(0,100,0);
}
\`\`\`

hover: 커서가 버튼 위에 올라갔을 때

pressed: 눌렸을 때

**' : ' 띄어 쓰기 하면 안먹힘;;**

# QPixmap

https://doc.qt.io/qtforpython/PySide6/QtGui/QPixmap.html

이미지는 대충 label에 넣는 다는 것을 가정

\`\`\`python
self.logoimage = QtGui.QPixmap()                           ## 이미지객체를 만들어줌
self.logoimage.load(BASE_DIR + '/mantra.svg')              ## 이미지 경로로 불러옴
self.logoimage = self.logoimage.scaled(self.MW.logo.sizeHint())     ## 사이즈 설정
self.MW.logo.setPixmap(self.logoimage)                              ## 원하는 위젯에 이미지 적용
\`\`\`
`,

  'Python/lambda': `---
title: lambda
date: 2022-12-22
tags: function
---
https://wikidocs.net/64
`,

  'Python/list-sort-by-index': `---
title: index로 list 정렬 하기
date: 2023-01-09
tags: Tip, list
---
https://connectionism.tistory.com/55

\`\`\`python
def _setCacheNodeDict(lvList):

    OrderList = sorted(range(len(lvList)), key=lambda k: lvList[k])
    newList = []
    
    for i, lv in enumerate(OrderList):
        newList.insert(i, lvList[lv]) 

    return newList
\`\`\`

인덱스로 순서를 변환해서 for문으로 걸러 준다.
`,

  'Python/map': `---
title: map 함수
date: 2022-05-05
tags: function
---
https://blockdmask.tistory.com/531
`,

  'Python/padzero': `---
title: Padzero
date: 2022-05-05
tags: Tip, formatting
---
\`\`\`python
print("%.6f" %0.01)
>> 0.010000

print("%6.f" %1)
>>     1
( 앞에 6칸 뜀 )

print("%10.5f" %1.2)
>>    1.20000
(앞에 10칸 뛰고 뒤에서 5칸 앞으로)

"%앞의 공간.뒤 공간f" 이라고 생각 하면 될듯
\`\`\`

추가로 houdini 에서 패딩

\`\`\`python
s@a = sprintf("%*0d",4,57);
->0057
(맨뒤 숫자가 4번째에 있게 0을 앞에 붙임)

s@a = sprintf("%*d",4,57);
->  57
(맨뒤 숫자가 4번째에 있게 앞을 두칸 띄움)

s@a = sprintf("%.*d",6,5.7101345247);
->5.71013
(뒤 6자리 까지 표기)

d를 f 로바꾸면 5.7같은 딱떨어지는 숫자도 000 붙힐 수 있음
\`\`\`
`,

  'Python/python-basic-functions': `---
title: Python 기초 펑션
date: 2022-02-28
tags: function
---
https://www.sidefx.com/docs/houdini/hom/hou/index.html

\`\`\`python
.setInput()
.setDisplayFlag(0) = off
.setRenderFlag(1) = on
.name() -> 이름을 string으로 받아냄
.layoutChildren() -> 레이아웃 정리

.eval()
open()
.writelines()
.close()
.glob(pattern, ignoer_case=False) = 해당 노드의 자식노드들을 튜플로 모두 불러옴( 패턴 매칭을 이용해서
원하는 결과를 도출 할 수 있다.)
.replace("find", "replaceswitch") = "find"를 찾아서 "replaceswitch"로 바꾼다.

for in 
----

노드 관련 ( = 타입은 hou.Objnode/Sopnode/... )

.createNode()
	- createNode('노드', node name = '노드 이름') 
.pwd() -> 현재 코드가 작동 되고 있는 장소(노드)
.node("경로") -> "경로" 노드 불러옴
.children() -> 해당 노드 안에 들어 있는 노드들을 리스트함
.inputs() -> 해당 노드의 인풋 노드들을 튜플로 불러옴
.setNextInput() -> merge같은 경우 순서대로 인풋을 정할 수 있음
.layoutChildren() -> 노드 레이아웃 정리
.moveToGoodPosiotion() -> 노드가 겹치지 않음
	:moveToGoodPosition(move_inputs=False) -> 인풋 노드는 움직이지 않음 ( 추측 )

----

파라미터 관련 명령어

.parms() -> 속해 있는 파라미터들을 list함
.parmInFolder(['폴더 이름']) -> '폴더 이름' 안에 있는 파라미터들을 list함
parm.deleteAllkeyframes() -> 파라미터에 걸려있는 키프레임을 전부 지운다.
.parm("파라미터 이름").set(X) -> "파라미터 이름"d 의 값을 X 로 set함
.setParms({'파라미터a' : 'a값', '파라미터b' : 'b값'}) -> 복수의 파라미터들을 동시에 설정
.isDisabled() -> 사용 불가 상태면 1 가능 상태면 0
.multiParmInstances() -> 멀티파라미터에서 생성된 파라미터들의 이름을 list함
.revertToDefaults() -> 해당 parm를 기본값으로 변경

.parm("이름").eval() -> "이름"parm의 값 불러옴
.evalParm("이름") -> "이름"parm의 값 불러옴 

---

지오메트리 

.inputGeometry(Index) -> Index의 인풋으로 들어오는 geo를 불러옴
.geometry() -> 하위 노드의 geo
.points() -> geo의 포인트정보를 불러옴
.pointAttribs() -> 해당 geo 포인트의 attrib들을 불러냄
.number() -> geo 넘버를 불러옴
.position() -> 위치값을 불러옴(벡터값으로)
.pos.x/y/z() -> x/y/z값을 불러냄 .position() 보다 좀 더 자세한 자릿수 까지 불러옴
.attribValue("어트리뷰트이름") -> "어트리뷰트이름" 의 값을 가져온다

-----

어트리뷰트

.addAttrib(hou.attribType.Point, 'pscale', 0.2) -> geo attrib추가 방법
.findPointAttrib()
.attribValue(attrib) -> 해당 geo의 어트리뷰트 값 불러옴

range(숫자) -> 숫자를 0부터 끝까지 리스트로 풀어 버린다.ex/ range(3) > [0,1,2]

import os
os.path.isdir("경로") -> "경로"와 같다면 1 아니면 0
os.listdir("경로") -> "경로"에 있는 파일 이름을 리스트화함

import json
\`\`\`

\`\`\`python
## 스트링 쪼개는 방법
path = "texture/glass/roughness/"
pathsplit = path.splite(glass)
print(pathsplit)
print(pathsplit[1])

=> ['texture/', 'roughness/']
=>/roughness/
## 중간의 동일한 스트링을 빼주고 각자 다른 개채로 이용 가능 하다.
\`\`\`

\`editor = hou.ui.paneTabOfType(hou.paneTabType.NetworkEditor)\`

\`editor.nodeShapes()\`

→ shape보는법
`,

  'Python/python-connected-nodes': `---
title: Python: make a list of all connected nodes to the node's inputs
date: 2022-12-21
tags: Tip, data
---
https://www.merlino3d.com/single-post/python-make-a-list-of-all-connected-nodes-to-the-node-s-inputs

\`\`\`python
#########################################################
# Recursive function to find all the inputs
def listInputs(node, nodeList):

    """
    node is class Node, nodeList is an empty list
    Take node object and an empty list and fill the list
    with all the node connected into the node's input
    """

    inputs = node.inputs()
    lenght = len(inputs)
    if lenght > 0:
        for input in inputs:
            nodeList.append(input)
            listInputs(input, list)
#########################################################

# select this node, can be any node
node = hou.pwd()
# declare the empty list we'll fill with all the input's nodes
list = []
# in houdini normally we have a touple with all the nodes as output so
# I declare a tuple and later I'll convert the list to tuple
tup = ()
# run the function, with a node (in this case this node itself)
# and an empyt list, can be a non-empty list but pay attention with that
listInputs(node, list)
tup = tuple(list)

#########################################################
# you can check the output uncommenting these lines

print('LIST: \n' + str(list) + '\n')
print('TUPLE \n' + str(tup) + '\n')
print('TOTAL NODES: ' + str(len(list)))
\`\`\`

def 펑션 안에 같은 펑션을 똑같이 씀..;; 심지어 마지막줄에 쓰인 list는 클래스로 쓰임 도대체 왜;

\`\`\`python
def treeList(node, nodeList):
    outputs = node.outputs()
    inputs = node.inputs()

    outputLen = len(outputs)
    inputLen = len(inputs)

    if inputLen > 0:
        for input in inputs:
            nodeList.append(input)
            treeList(input,list)

    if outputLen > 0:
        for output in outputs:
            if output in nodeList :
                nodeList.append(output)
                treeList(output,list)
\`\`\`

요거는 output까지 찾을 수 있나 한번 테스트 해본것인데 아웃풋의 아웃풋은 찾지 못한다.
`,

  'Python/python-formating': `---
title: Python formatting
date: 2022-04-16
tags: Tip, formatting, string
---
https://blockdmask.tistory.com/424

파이선 문자열 포매팅 하기

\`\`\`python
print("나는 %d살 입니다." %20)
>>> 나는 20살 입니다.
>>> %d - 정수, %s - 문자, 그외 모두, %c - 한글자

print("나는 %s색과 %s 색을 좋아해요." %("파란", "빨간"))
>>> 나는 파란색과 빨간 색을 좋아해요."
\`\`\`

\`\`\`python
print("나는 {}색과 {}색을 좋아해요.".format("파란", "빨간"))
>>> 나는 파란색과 빨간 색을 좋아해요.

print("나는 {0}색과 {1}색을 좋아해요.".format("파란", "빨간"))
print("나는 {1}색과 {0}색을 좋아해요.".format("빨간","파란"))
>>>나는 파란색과 빨간 색을 좋아해요.
>>>나는 파란색과 빨간 색을 좋아해요.

print("나는 {A}색과 {B}색을 좋아해요.".format(A = "파란", B = "빨간")
>>>나는 파란색과 빨간 색을 좋아해요.

A = "파란"
B = "빨간"
print(f"나는 {A}색과 {B}색을 좋아해요.")
>>>나는 파란색과 빨간 색을 좋아해요.
\`\`\`

문자열 포메팅시 r,f의 차이에 대해서 설명 되어 있다.

https://armin.tistory.com/entry/pythonstring
`,

  'Python/session-module': `---
title: Session Module
date: 2022-06-22
tags: HOM
---
https://www.sidefx.com/docs/houdini/hom/hou/session.html

파이선에서 후디니의 세션에 접근해 파일내에서 데이터를 저장 하거나. 가져와 사용할 수 있다.

이렇게 되면 만트라 매니저 처럼 각 hip파일 마다 생기게 되는 불필요한 데이터의 축적을 막을 수 있다.

\`\`\`python
>>> hou.setSessionModuleSource('a = ["a","b","c"]')
\`\`\`

hou.setSessionModuleSource 펑션을 이용해 hou.session module에 접근 하여 코드를 작성 할 수 있다.

이는 Reload를 눌러줘야만 적용이 된다. 하지만 Reload를 눌러주지 않는 다고 그값이 변하지 않은것은 아니다. 겉으로만 이전 데이터가 남아있을 뿐, 내부적으로 이미 적용 되어 있는 셈이다. 이것은 아래의 코드로 확인할 수 있다.

\`\`\`python
>>> hou.setSessionModuleSource('a = ["a","b","c"]')
>>> hou.sessionMouleSource()
'a = ["a","b","c"]'
\`\`\`

hou.sessionModuleSource()를 이용해서 모듈의 소스코드를 문자열 타입으로 받아올 수 있다.

다음은 변수를 가져오는 방법이다. 이로써 Reload 를 클릭 과 데이터는 무관하다고 볼 수 있다.

\`\`\`python
>>> hou.setSessionModuleSource('a = ["a","b","c"]')
>>> hou.sessionMouleSource()
'a = ["a","b","c"]'
>>> hou.session.a[2]
'c'
\`\`\`

hou.session모듈을 이용해 a라는 변수값을 가져왔다.

이외에도 hou.appendSessionModuleSource()를 이용해 모듈 전체를 바꾸지 않고 코드를 추가 할 수있다.
`,

  'Python/set': `---
title: Set 집합
date: 2022-10-20
tags: data, Tip, set
---
https://wikidocs.net/16044

set은 index가 존재 하지 않는 집합이며

교집합 합집합 등 다양한연산자들이 있다
`,

  'Python/tuple-unpacking': `---
title: Tuple Unpacking 튜플 언패킹
date: 2022-10-20
tags: Tip, Tuple
---
\`\`\`python
numbers = (1, 2, 3)
a, b, c = numbers
print(a)
print(b)
print(c)
\`\`\`

튜플의 인자를 언팩 하는법

\`\`\`python
a, b, *c, d = [1, 2, 3, 4, 5, 6, 7, 8, 9]

print(a)
print(b)
print(c)
print(d)
\`\`\`

\`*\`는 한번 밖에 쓸 수 없고 리스트를 반환한다.
`,

  'Python/weird-syntax': `---
title: 요상한 문법 모음
date: 2022-08-04
tags: Tip
---
## x := x/10 (walrus operator)

\`\`\`python
x = 24;
print(x := x/10);

>>> 2.4



x = 24;
print(x = x/10);

>>> 에러 출력
\`\`\`

\`:=\` 오른쪽을 왼쪽에 적용한 결과를 바로 출력할 수 있게 한다.

\`\`\`python
x = 24;
a = [x := x/10]
print(a)

>>> [2.4]


x = 24;
x := x/10

print(x)

>>> 에러 출력
\`\`\`

\`:=\` 문법은 단독으로 사용이 불가능 하고 값을 지정할 때만 쓰일 수 있는거 같다.
`,

  'Python/파이선 스크림트(.py) exe 파일 만들기': `---
title: 파이선 스크립트(.py) exe 변환
date: 2026-04-20
tags: 
---

\`\`\`
pip install pyinstaller
\`\`\`

\`\`\`
python -m PyInstaller --onefile --noconsole 스크립트.py
\`\`\`
--onefile : 하나의 파일로 만들기
--noconsole : 콘솔창 안뜨고 실행 `
};
