---
title: Python formatting
date: 2022-04-16
tags: Tip, formatting, string
---
https://blockdmask.tistory.com/424

파이선 문자열 포매팅 하기

```python
print("나는 %d살 입니다." %20)
>>> 나는 20살 입니다.
>>> %d - 정수, %s - 문자, 그외 모두, %c - 한글자

print("나는 %s색과 %s 색을 좋아해요." %("파란", "빨간"))
>>> 나는 파란색과 빨간 색을 좋아해요."
```

```python
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
```

문자열 포메팅시 r,f의 차이에 대해서 설명 되어 있다.

https://armin.tistory.com/entry/pythonstring
