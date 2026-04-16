---
title: index로 list 정렬 하기
date: 2023-01-09
tags: Tip, list
---
https://connectionism.tistory.com/55

```python
def _setCacheNodeDict(lvList):

    OrderList = sorted(range(len(lvList)), key=lambda k: lvList[k])
    newList = []
    
    for i, lv in enumerate(OrderList):
        newList.insert(i, lvList[lv]) 

    return newList
```

인덱스로 순서를 변환해서 for문으로 걸러 준다.
