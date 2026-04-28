---
title: hbatch deadline submiter
date: 2022-10-12
tags: HOM, deadline
---
배치 상태에서 데드라인에 rop을 던지려면 데드라인에서 사용할 파라미터로 job, info 두가지가 필요하다. 둘 다 텍스트로 적용이 가능하며 종류는 아래에 거진 있고 여기 없는 것들은 general이나 다른 부분에 분포 되어 있다.

```python
import hou
import pyqt_houdini
import sys
import os
import subprocess

from collections import OrderedDict

class DeadlineController():
    def __init__(self, view):
        self.view = view
        self.model = self.view.model

    def changeFrame(self, nodeName):
        byStep = self.view.frameInterval_lineEdit.text()

        node = hou.node(nodeName)

        startFrame= node.parm('f1').eval()
        endFrame= node.parm('f2').eval()
        intervalFrame= node.parm('f3').eval()

        frame = str(int(startFrame))+"-"+str(int(endFrame))
        frame = '{0}-{1}step{2}'.format(str(int(startFrame)), str(int(endFrame)), str(int(intervalFrame)))
        # ...
        return frame

    def houdiniInfoCollect(self, nodeName, number):
        frame = self.changeFrame(nodeName)

        info = 'Plugin={0}\n'\
               'Name={1}\n'\
               'Frames={2}\n'\
               'ChunkSize={3}\n'.format(
                   self.model.getPlugin(),
                   nodeName,
                   frame,
                   str(self.view.getChunkSize())
               )

        saveInfoTemp = r'{}\houdini_deadline_info.job{}'.format(os.getenv('TEMP'), number)
        with open(saveInfoTemp, 'w') as infoFile:
            infoFile.write(info)

        return saveInfoTemp

    def submitDeadline(self):
        nodeList = self.model.renderNodes
        for i in range(len(nodeList)):
            info = self.houdiniInfoCollect(nodeList[i], i)
            job = self.houdiniJobCollect(i)

            submit_command = "C:\\PROGRA~1\\Thinkbox\\Deadline10\\bin\\deadlinecommand "+"\""+info+"\""+" \""+job+"\""
            deadline_command = subprocess.Popen(submit_command, shell=1)
```

Job Info Parameters

```
Plugin = 'Houdini'
Name = '힙네임 - 만트라 노드 네임'
Comment = ''
Pool = 'none'
MachineLimit = '머신 리밋'
Priority = "프로퍼티"
OnJobComplete = 'Nothing'
TaskTimeoutMinutes = '0'
LimitConcurrentTasksToNumberOfCpus = '0'
ConcurrentTasks = '1'
Department = ''
Group = 'houdini'
LimitGroups = ''
JobDependencies = ''
Frames = "프레임"
ChunkSize = "청크사이즈"
WhiteList = ''
PopupNotification = True
BatchName = ''
Blacklist = ''
InitialStatus = 'Active', 'Suspended'
```

Plugin Info Parameters

```
SceneFile = 힙파일 경로
IFD =''
Output = 아웃풋 경로
OutputDriver = 만트라 노드 경로
Version = 후디니 버전
Build = 프로퍼티랑 동일
```

위의 두가지를 텍스트 형식의 .job 파일로 temp 경로에 저장한 후에 그것을 가져다 쓰는 방식으로 데드라인이 작동됨
