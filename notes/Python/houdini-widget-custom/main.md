---
title: Houdini 에서 위젯 커스텀(stylesheet, QPixmap) 반영 하기
date: 2022-06-26
tags: PyQt
---
일반적인 Qt Designer의 사용으로는 후디니에서 반영이 안되는 것들이 종종 있다. hutil.Qt 라는 자체 내장 모듈에서 코드를 불러와서 그런게 아닌가 싶다.

https://doc.qt.io/qt-5/stylesheet-examples.html#customizing-qpushbutton

https://doc.qt.io/qt-5/stylesheet-reference.html#background-image-prop

# Style Sheet

stylesheet를 이용 해서 후디니에 반영 시키는 방법

```python
QPushButton{
	border-radius : 10px;
	background-color : rgb(85,170,255);
}
```

QPushButton 처럼 위젯 타입으로 한번 묶어 주고 코드를 작성해야 한다.

```python
QPushButton{
	border-radius : 10px;
	background-color : rgb(85,170,255);
	color : rgb(200,200,200);
}

QPushButton:hover{
	background-color : rgb(85,255,80);
	color : rgb(200,0,0);
}

QPushButton:pressed{
	background-color : rgb(0,80,255);
	color : rgb(0,100,0);
}
```

hover: 커서가 버튼 위에 올라갔을 때

pressed: 눌렸을 때

**':' 띄어쓰기하면 안 먹힘;;**

# QPixmap

https://doc.qt.io/qtforpython/PySide6/QtGui/QPixmap.html

이미지는 대충 label에 넣는 다는 것을 가정

```python
self.logoimage = QtGui.QPixmap()                           ## 이미지객체를 만들어줌
self.logoimage.load(BASE_DIR + '/mantra.svg')              ## 이미지 경로로 불러옴
self.logoimage = self.logoimage.scaled(self.MW.logo.sizeHint())     ## 사이즈 설정
self.MW.logo.setPixmap(self.logoimage)                              ## 원하는 위젯에 이미지 적용
```
