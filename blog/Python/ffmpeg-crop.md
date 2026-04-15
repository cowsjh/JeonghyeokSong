---
title: ffmpeg으로 영상 crop하기
date: 2023-02-23
tags: ffmpeg
---
```python
def clipVideo(path, filename, start_time, end_time):
    
    temp_file = path + filename
    clip_filename = filename.replace('_temp','')

    ffmpeg_cmd = f'ffmpeg -ss {start_time} -t {end_time} -i {temp_file} -codec copy -avoid_negative_ts make_zero {path}{clip_filename}'
    subprocess.call(ffmpeg_cmd, shell=True)
    subprocess.call(f"rm \"{temp_file}\"", shell=True)
```
