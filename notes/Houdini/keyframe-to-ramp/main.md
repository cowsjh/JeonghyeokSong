---
title: KeyFrame To Ramp
date: 2022-10-10
tags: TIP, VEX
---

Curveu

Vex Code

```python
float u = fit01(f@curveu,0,10000);
float ramp = chf('ramp',u*@TimeInc);
f@u = u;
@P += @N * ramp;
```

chf의 두 번째 인풋에 프레임 * @TimeInc를 넣어주면 해당 프레임의 값을 받아 올 수 있는 특징을 이용하여 키프레임을 ramp처럼 이용 더욱 세밀한 값을 조절해줄 수 있다.
