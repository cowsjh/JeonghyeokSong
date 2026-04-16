---
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

```python
int hedge1 = pointhedge(0,0,1);
int hedge2 = pointhedge(0,1,3);
i@hedge1 = hedge1;
i@hedge2 = hedge2;
```

<!-- Column 1 -->

<!-- Column 2 -->
`pointhedge(geometry, sourcepoint,dstpoint)`

펑션은 srcpt와 dstpt를 이용해 half-edge의 넘버를 가져온다.

srcpt와 dstpt가 올바른 순서나 짝을 이루지 못하면 -1을 출력한다.
