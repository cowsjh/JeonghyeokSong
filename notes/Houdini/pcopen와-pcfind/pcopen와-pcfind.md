---
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

```python
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
```


# pcfind로 min,maxpt 구하기

---

```python
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
```

⇒ 밀집 되어 있는 곳의 pt는 많은 포인트의 배열을 가지고, 적은 분포를 가진 곳의 pt는 처음에 구한 배열을 가지고 있다.

그리고 길이 또는 거리 함수 대신 항상 제곱 버전을 사용해야 한다. 값의 제곱근을 계산하는것을 피하기 위함 ## pow함수를 쓰는것 보단 값을 직접 곱해주는 것이 빠르다. 이 두개를 적용해서 수정 하면

```python
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
```

이와 같이 쓸 수 있다.

# pcfind_radius

---

[https://www.sidefx.com/docs/houdini/vex/functions/pcfind_radius.html](https://www.sidefx.com/docs/houdini/vex/functions/pcfind_radius.html)

pcfind에 부가적으로 radius가 달려있다. 찾는 대상의어트리뷰트를 이용해 찾을 수 있다.


# Unique Pair Matching

---

```python

int count = findattribvalcount(1,"point",'match', @ptnum);
## 중복된 포인트를 잡은 pt들을 걸러 낸다.
if(count != 0)
    i@group_notfound = 0;

```

```python
int pts[] = pcfind(1,"notfound","P",@P,1e15,1);
i@match = pts[0];
```

```python
int index = findattribval(0,"point","match", i@match,0);
if ( index == @ptnum)
    i@group_notfound = 0;
```

Stop Condition :  조건으로 반복을 멈춘다 ( 0이면 멈춤 )

pointlit : 포인트 그룹의 포인트들을 반환

argc : Hscript 타입의 리스트의 수를 반환

위의 코드는 notfound 그룹에 속해 있는 포인트 들이 없을때 반복을 중지 하겠다는 것.


# Camera Based Occlusion with Variable pscale

---

카메라 NDC를 이용하여 N방향을 정렬 시키거나, 겹쳐진 것들을 걸러낼 수 있다.

```python
if( @uv.x > 1 || @uv.x < 0.000001 || @uv.y > 1 || @uv.y < 0.000001)
		removepoint(0,@ptnum);
```

**uvtexture 노드를 카메라에 맵핑해서 uv값으로 카메라 밖의 포인트들을 지운다.**

```python
string cam = chs('cam');
vector p0 = fromNDC(cam, set(0.5, 0.5, 0));
vector p1 = fromNDC(cam, set(0.5,0.5,-1));    ## 카메라 전방, 중앙에 벡터 위치 생성
vector n = normalize( p1 - p0);               ## 카메라 방향의 법선벡터 생성

vector q = dot(p0 - @P, n) *n;    ## 카메라의 원점 위치와 자신의 위치를 내적해서 방향을 얻고
	@dist = length(q);              ## 카메라 법선 벡터 값을 곱해서 수직 거리값을 얻을 수 있음.

v@Q = @P + q;
v@N = n;
```

```python
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
```

reorder 쓰임

```python
i[]@list = {4,3,5,6,2,1};
i[]@argsort = argsort(@list);
i[]@reorder = reorder(@list ,argsort(@list));
```
