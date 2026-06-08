---
title: 최적화시 유용한 커멘드
date: 2026-06-08
tags: Unreal Engine, optimization
featured: false
order: 
draft: false
series: 
---

```
stat Unit
stat FPS
```

```
FreezeRendering
r.VisualizePrimitives 1
profileGPU

abtest r.Nanite.MaxPixelsPerEdge 1 5
abtest stop
```