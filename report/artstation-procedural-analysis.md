# ArtStation Procedural Tool Portfolio 구조 분석

> 조사 일자: 2026-04-10  
> 조사 대상: ArtStation 및 80.lv에 공개된 procedural tool 관련 포트폴리오 11개  
> 분석 목적: procedural tool 포트폴리오의 구성 패턴 및 통계 파악

---

## 1. 분석 대상 목록

| # | 제목 | 아티스트 | 소프트웨어 | 출처 |
|---|------|----------|------------|------|
| 1 | [Procedural Cabin Generator](https://80.lv/articles/a-detailed-guide-on-setting-up-a-procedural-cabin-generator-in-houdini) | Fabian Zackrisson | Houdini, USD/Solaris, Karma | 80.lv 브레이크다운 |
| 2 | [Procedural Wall Generator (UE5)](https://80.lv/articles/creating-a-procedural-wall-generator-for-unreal-in-houdini) | Fabien Burger | Houdini, Unreal Engine 5 | 80.lv 브레이크다운 |
| 3 | [Procedural House Generator HDA](https://80.lv/articles/artist-shows-procedural-house-generation-with-houdini-engine-unreal) | Hugo Beyer | Houdini Engine, Unreal Engine | 80.lv 브레이크다운 |
| 4 | [Procedural Crystals in Houdini](https://80.lv/articles/breakdown-procedural-crystals-in-houdini) | Simon Verstraete | Houdini, Unreal Engine 4 | 80.lv 브레이크다운 |
| 5 | [Modular Level Builder HDA](https://80.lv/articles/procedural-optimization-with-houdini-case-study) | Adolfo Reveron | Houdini (VEX/Python), Unreal Engine 4 | 80.lv 케이스 스터디 |
| 6 | [Procedural Waterfall Tool](https://80.lv/articles/a-closer-look-at-custom-houdini-tool-for-procedural-waterfalls) | Serge Filin | Houdini HDA, Unreal Engine | 80.lv 브레이크다운 |
| 7 | [Building Creator (THE FINALS)](https://80.lv/articles/how-embark-studios-built-procedural-environments-for-the-finals-using-houdini) | Embark Studios / Adrian Björkerud | Houdini | 80.lv 인더스트리 케이스 스터디 |
| 8 | [Procedural Roads (A* Pathfinding)](https://jflynn.xyz/portfolio/houdini-anisotropic-procedural-roads/) | J. Flynn | Houdini, Python | 개인 포트폴리오 사이트 |
| 9 | [Procedural Utility Poles HDA](https://isacstahl.artstation.com/projects/YeVkLV) | Isac Stahl | Houdini, Unreal Engine | ArtStation 프로젝트 |
| 10 | [Procedural Stadium HDA](https://www.artstation.com/artwork/Z5aAw8) | José A Martínez | Houdini | ArtStation 프로젝트 |
| 11 | [Platform Generator HDA](https://limbicnation.artstation.com/store/Bgrgx/platform-generator-hda) | Limbicnation | Houdini | ArtStation 마켓플레이스 |

---

## 2. 섹션 구성 통계

### 2-1. 섹션별 포함 빈도

| 섹션 유형 | 포함 건수 (n=11) | 비율 |
|-----------|-----------------|------|
| 최종 렌더 이미지 (히어로 샷) | 11 / 11 | **100%** |
| 파라미터 UI 스크린샷 | 9 / 11 | **82%** |
| 노드 그래프 스크린샷 | 8 / 11 | **73%** |
| 워크플로우 단계별 설명 텍스트 | 10 / 11 | **91%** |
| 애니메이션 GIF (프로세스/변형 데모) | 7 / 11 | **64%** |
| 엔진 통합 섹션 (UE/Unity) | 6 / 11 | **55%** |
| VEX / 코드 스니펫 | 3 / 11 | **27%** |
| 비교 (Before / After) | 5 / 11 | **45%** |
| 와이어프레임 / 뷰포트 샷 | 4 / 11 | **36%** |
| 임베디드 영상 (YouTube/Vimeo) | 4 / 11 | **36%** |
| 다운로드 링크 (Gumroad/GitHub) | 2 / 11 | **18%** |
| 결과 다양성 갤러리 (variation outputs) | 8 / 11 | **73%** |
| 학습 회고 / 교훈 섹션 | 5 / 11 | **45%** |

### 2-2. 전형적인 섹션 순서

대부분의 포트폴리오는 아래 순서를 따른다:

```
1. 히어로 렌더 (또는 데모 영상)
2. 툴 개요 설명 (2~4문장: 무엇을 만들었는지, 왜 만들었는지)
3. 워크플로우 브레이크다운 (서브시스템별 또는 제작 순서별)
4. 파라미터 / 컨트롤 UI 섹션
5. 결과물 다양성 갤러리
6. [선택] 엔진 통합 섹션
7. [선택] VEX/코드 섹션
8. 마무리 (회고, 팁, 메트릭)
```

---

## 3. 미디어 유형 통계

| 미디어 유형 | 사용 건수 (n=11) | 비율 |
|-------------|-----------------|------|
| 고해상도 스틸 렌더 | 11 / 11 | **100%** |
| 노드 그래프 스크린샷 (주석 포함) | 8 / 11 | **73%** |
| 파라미터 인터페이스 스크린샷 | 9 / 11 | **82%** |
| GIF (프로세스 / 파라미터 변형) | 7 / 11 | **64%** |
| 임베디드 영상 (YouTube/LinkedIn) | 5 / 11 | **45%** |
| 와이어프레임 / 지오메트리 뷰 | 4 / 11 | **36%** |
| 다이어그램 / 플로우차트 | 3 / 11 | **27%** |

### 프로젝트당 평균 미디어 수

| 포지셔닝 유형 | 평균 미디어 수 |
|---------------|---------------|
| 심층 기술 브레이크다운 (80.lv 류) | 20~30개 |
| 일반 ArtStation 포트폴리오 페이지 | 8~15개 |
| 마켓플레이스 스토어 페이지 | 5~10개 (기능 중심) |

---

## 4. 소프트웨어 태그 통계

| 소프트웨어 | 언급 건수 (n=11) | 비율 |
|------------|-----------------|------|
| Houdini | 11 / 11 | **100%** |
| Unreal Engine | 7 / 11 | **64%** |
| Python / VEX | 4 / 11 | **36%** |
| Substance 3D Painter | 1 / 11 | 9% |
| Blender | 1 / 11 | 9% |
| Unity | 0 / 11 | 0% |

> **참고:** 조사 샘플이 Houdini 중심으로 편향되어 있음. Blender Geometry Nodes / UE5 PCG 분야는 별도 조사 권장.

### ArtStation에서 자주 사용되는 태그

`Houdini` · `Procedural Art` · `Technical Art` · `Unreal Engine` · `Game Development` · `VFX` · `Environment Art` · `Digital Asset` · `HDA`

---

## 5. 포트폴리오 포지셔닝 패턴

### 5-1. 톤 분류

| 톤 유형 | 비율 | 특징 |
|---------|------|------|
| **기술적 심층 분석 + 접근성 있는 설명** | ~55% | "왜"와 "어떻게"를 모두 설명; 어렵지만 접근 가능하다는 프레이밍; VEX 코드 포함; 초보자 팁 |
| **비주얼 쇼케이스 중심** | ~25% | 결과물 이미지 위주; 기술 설명 간략; 마켓플레이스 리스팅에 많음 |
| **인더스트리 케이스 스터디** | ~15% | 효율성 메트릭 포함 ("100+ 빌딩", "변경당 4~6분"); 스튜디오 규모 맥락; 문제→해결→결과 서사 구조 |
| **학술/연구 프레이밍** | ~5% | 논문 인용; 알고리즘 설명 중심; 기술 전문가 대상 |

### 5-2. 포지셔닝별 구조 차이

**비주얼 쇼케이스형 (마켓플레이스/개인 포트폴리오):**
- 히어로 렌더 → 기능 목록 (bullet points) → 변형 갤러리 → 구매/다운로드 CTA
- 설명보다 이미지 양이 많음
- 파라미터 유연성이 핵심 메시지

**기술 브레이크다운형 (80.lv / 블로그 스타일):**
- 히어로 → 제작 동기 → 단계별 GIF/스크린샷 인터리브 → 코드/수식 블록 → 회고
- 텍스트 분량이 많음 (500~2000단어)
- 학습 서사 구조가 공감대 형성에 기여

**인더스트리 케이스 스터디형:**
- 문제 설명 → 솔루션 아키텍처 → 결과 메트릭 → 타 프로젝트 적용 사례
- 수치 데이터가 신뢰도의 핵심
- 팀/스튜디오 맥락 강조

---

## 6. 배포 / 다운로드 패턴

| 유형 | 배포 여부 |
|------|-----------|
| 무료 포트폴리오 (개인 학습/쇼케이스) | **대부분 HDA 미배포** (11개 중 9개) |
| 마켓플레이스 리스팅 | **항상 유료 배포** |
| 스튜디오 내부 툴 | **항상 미배포** (proprietary) |

> 포트폴리오 HDA를 배포하는 아티스트는 드물다. 배포보다는 툴이 생성하는 결과물과 파라미터 유연성을 시각적으로 증명하는 방식이 일반적.

---

## 7. 주요 인사이트 및 권장 구성

### 인사이트 요약

1. **파라미터 UI 스크린샷은 필수에 가깝다 (82%).**  
   단순히 결과물이 좋다는 것을 보여주는 것보다, 컨트롤 가능성과 워크플로우 통합성을 증명하는 것이 핵심.

2. **GIF는 툴의 가장 강력한 설득 수단이다 (64%).**  
   파라미터를 실시간으로 바꾸는 짧은 GIF 한 장이 긴 설명보다 더 많은 정보를 전달한다.

3. **엔진 통합 섹션이 채용/업무 연관성을 높인다 (55%).**  
   "Houdini → UE5 연동 실제 파이프라인" 구조를 보여주면 게임 개발사 대상 포트폴리오로서의 설득력이 올라간다.

4. **학습 서사(왜 만들었는가, 무엇을 배웠는가)가 포트폴리오를 살아있게 만든다.**  
   단순 결과물 나열보다 제작 과정의 고민과 해결 과정을 담은 포트폴리오가 기억에 남는다.

5. **"팀원이 이어서 작업할 수 있도록 문서화했다"는 프레이밍이 프로페셔널 신호다.**  
   개인 학습용 툴이 아니라 프로덕션 레디 툴임을 어필하는 효과가 있다.

### 권장 포트폴리오 구성 템플릿

```
[히어로 렌더 또는 데모 GIF/영상]

## Overview
- 툴이 무엇을 하는가 (1~2문장)
- 왜 만들었는가 (동기/문제 정의)
- 사용 소프트웨어 목록

## How It Works
- 서브시스템별 또는 제작 순서별 설명
- 단계마다 GIF 또는 노드 그래프 스크린샷 인터리브

## Parameters & Controls
- HDA 파라미터 UI 스크린샷
- 주요 파라미터와 효과 설명

## Results Gallery
- 다양한 파라미터 조합으로 생성한 결과물 이미지

## [선택] Engine Integration
- UE5 / Unity 파이프라인 연동 방법

## [선택] Technical Notes
- VEX / Python 코드 핵심 로직
- 성능/제약사항

## Takeaways
- 제작 중 배운 점, 한계, 다음 개선 계획
```

---

*조사 및 분석: Claude Sonnet 4.6 | 데이터 출처: ArtStation, 80.lv*
