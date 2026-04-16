---
title: pcopen / pcfilter
date: 2021-02-08
tags: VOP, node
---

어느 point의 attrib을 기준으로 하여 주변의 point들을 가져온다. pcfilter와 항상 같이 쓰인다.

## pcopen 파라미터

file : input

P : 기준이 되는 pt의 position값

radius : 탐색 범위

maxpoints : 탐색 최대 pt

handle : 찾은 pt 뭉치들을 다룬다.

## pcfilter 파라미터

pcopen의 handle을 받아 탐색한 pc의 attribute를 가져온다.

handle : 찾은 pt cloud를 뭉치로 가져온다.

signature : attribute의 type

Channel : 가져올 attribute

value : 출력
