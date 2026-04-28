---
title: Python: make a list of all connected nodes to the node's inputs
date: 2022-12-21
tags: Tip, data
---
https://www.merlino3d.com/single-post/python-make-a-list-of-all-connected-nodes-to-the-node-s-inputs

```python
#########################################################
# Recursive function to find all the inputs
def listInputs(node, nodeList):

    """
    node is class Node, nodeList is an empty list
    Take node object and an empty list and fill the list
    with all the node connected into the node's input
    """

    inputs = node.inputs()
    length = len(inputs)
    if lenght > 0:
        for input in inputs:
            nodeList.append(input)
            listInputs(input, list)
#########################################################

# select this node, can be any node
node = hou.pwd()
# declare the empty list we'll fill with all the input's nodes
list = []
# in houdini normally we have a touple with all the nodes as output so
# I declare a tuple and later I'll convert the list to tuple
tup = ()
# run the function, with a node (in this case this node itself)
# and an empyt list, can be a non-empty list but pay attention with that
listInputs(node, list)
tup = tuple(list)

#########################################################
# you can check the output uncommenting these lines

print('LIST: \n' + str(list) + '\n')
print('TUPLE \n' + str(tup) + '\n')
print('TOTAL NODES: ' + str(len(list)))
```

def 펑션 안에 같은 펑션을 똑같이 씀..;; 심지어 마지막줄에 쓰인 list는 클래스로 쓰임 도대체 왜;

```python
def treeList(node, nodeList):
    outputs = node.outputs()
    inputs = node.inputs()

    outputLen = len(outputs)
    inputLen = len(inputs)

    if inputLen > 0:
        for input in inputs:
            nodeList.append(input)
            treeList(input,list)

    if outputLen > 0:
        for output in outputs:
            if output in nodeList :
                nodeList.append(output)
                treeList(output,list)
```

요거는 output까지 찾을 수 있나 한번 테스트 해본것인데 아웃풋의 아웃풋은 찾지 못한다.
