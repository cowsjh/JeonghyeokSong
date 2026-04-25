---
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
