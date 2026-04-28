---
title: 정사영 (Othogonal Projection)
date: 2022-08-14
---

[https://mrw0119.tistory.com/94](https://mrw0119.tistory.com/94)

<!-- Column 1 -->

<!-- Column 2 -->

투영 벡터를 구하는 방법은 다음과 같다

**여기서 N은 normalized된 단위 벡터이다.**


$(|V| * cos\theta)*N = Proj(V)$


내적 벡터로 구하기

$(V\bullet N) * N = Proj(V)$

$(|V| * |N| * cos\theta) * N = Proj(V)$ [******](/d2016b7c039448cdb2c09c809e1a1c3a)

$(|V| * cos\theta) * N = Proj(V)$

$|N|$는 단위 벡터 이기 때문에 생략


후디니 에서의 사용

```python
int npt = npoints(1);
vector pos0 = point(1,"P",0);
vector pos1 = point(1,"P",npt - 1);

vector N = pos1 - pos0;
vector V = @P - pos0;

vector N_norm = normalize(N);
vector V_norm = normalize(V);

@P = dot(V, N_norm) * N_norm;  ##내적 으로 구하는 프로젝트 값
```

이때 우리가 사용할 수 있는 값들


> [!note]+ ### (응용) 평면 projection
>
> ```python
> vector  pos_0 = prim(1,"P",0) ;                      // "___" 에 들어갈 코드를 채워 넣으세요
> vector  vec_A = @P - pos_0 ;                            // "___" 에 들어갈 코드를 채워 넣으세요
> vector  vec_B_norm = prim(1, "N", 0) ;                  // vec_B_norm을 어떻게 구할 수 있는지 HINT node를 확인해 보세요.
> vector  vec_B =  dot(vec_A, vec_B_norm) * vec_B_norm;   // "___" 에 들어갈 코드를 채워 넣으세요
>
> @P -= lerp({0,0,0}, vec_B, bias) ;
> ```
>
> primitive 의 P, N attridute를 사용해서 같은 수식을 정해 준다.
