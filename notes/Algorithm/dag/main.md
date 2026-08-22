---
title: DAG (Directed Acyclic Graph)
date: 2026-08-13
tags: data-structure, algorism
order: 
featured: false
draft: false
---

# DAG (Directed Acyclic Graph)

DAG(Directed Acyclic Graph, 방향성 비순환 그래프) — 아래 두 조건을 동시에 만족하는 그래프.

- **방향성**: 모든 edge에 방향이 있다. `A → B`는 "A가 B보다 먼저"라는 순서 관계.
- **비순환**: 화살표를 따라가도 출발점으로 돌아오는 cycle이 없다. cycle이 있으면 어느 쪽이 먼저인지 정할 수 없어 순서를 매길 수 없다.

이 두 조건이 성립해야 **위상정렬(topological sort)**로 전체 순서를 정할 수 있다. [colcon build](../../ROS2/colcon-build/main.md)가 각 패키지 `package.xml`의 `<depend>` 관계를 DAG로 보고 위상정렬해서 빌드 순서를 정하는 게 실제 예시.

git 커밋 히스토리, task scheduler, make/bazel 같은 빌드 시스템도 전부 같은 구조.
