---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: bat常用
category: Bat
tags: [language,bat]
excerpt: windows bat 目录跳转 注释 脚本
keywords: carlme,superwang,superwangcarl,carl,卡尔米,Bat,language
---



## 简介

简单的介绍下`bat`中的命令对应的结果

## 脚本

`切片当前目录下的所有MP4结尾的文件`

```powershell
@echo off 
for /R "./" %%s in (*.mp4) do (
:: ns 遍历所有文件不带带后缀
md %%~ns
:: nxs 遍历所有文件带后缀
echo %%~nxs
ffmpeg -i %%s -map 0 -c copy -f ssegment -segment_list %%~ns/%%~ns.m3u8 -segment_list_type m3u8  -segment_time 10  %%~ns/ezjzw01_%%01d.ts
) 
pause
```

## 注释

在批处理中，段注释有一种比较常用的方法：

```
goto start
  = 可以是多行文本，可以是命令
  = 可以包含重定向符号和其他特殊字符
  = 只要不包含 :start 这一行，就都是注释
 :start
```


另外，还有其他各种注释形式，比如：

1. :: 注释内容（第一个冒号后也可以跟任何一个非字母数字的字符）
2. rem 注释内容（不能出现重定向符号和管道符号）
3. echo 注释内容（不能出现重定向符号和管道符号）〉nul
4. if not exist nul 注释内容（不能出现重定向符号和管道符号）
5. :注释内容（注释文本不能与已有标签重名）
6. %注释内容%（可以用作行间注释，不能出现重定向符号和管道符号）
7. goto 标签 注释内容（可以用作说明goto的条件和执行内容）
8. :标签 注释内容（可以用作标签下方段的执行内容）

  ## 目录的命令

在【”D:\jijs\bin\Test.bat” 】文件中测试以下命令，对应的输出如下表：

| 命令           | 描述              | 输出结果                                     |
| ------------ | --------------- | ---------------------------------------- |
| %0           | bin文件自身         | D:\jijs\bin\Test.bat                     |
| %~0          | 全路径             | D:\jijs\bin\Test.bat                     |
| %~f0         | （file）全路径       | D:\jijs\bin\Test.bat                     |
| %~d0         | （dir）盘符         | D:                                       |
| %~p0         | （path）路径-无盘符    | \jijs\bin\                               |
| %~n0         | （name）文件名称      | Test                                     |
| %~x0         | （exe）后缀名        | .bat                                     |
| %~s0         | （Short）全路径      | D:\jijs\bin\Test.bat                     |
| %~a0         | （attribute）文件属性 | –a——                                     |
| %~t0         | （time）文件修改日期    | 2016-06-23 17:10                         |
| %~z0         | （Size）文件大小      | 696                                      |
| %~$PATH:0    | 全路径             | D:\jijs\bin\Test.bat                     |
| %~dp0        | 所在文件夹           | D:\jijs\bin\                             |
| %~nx0        | 文件全称            | Test.bat                                 |
| %~fs0        | 全路径             | D:\jijs\bin\Test.bat                     |
| %~dp$PATH:0  | 文件夹             | D:\jijs\bin\                             |
| %~ftza0      | 文件所有信息          | –a—— 2016-06-23 17:10 696 D:\jijs\bin\Test.bat |
| %1           | 第一个附加参数         |                                          |
| %2           | 第二个附加参数         |                                          |
| cd /d [path] | 可直接跳转到其他盘符      |                                          |

## 参考资料

[bat 进入或跳转到其它目录命令](https://blog.csdn.net/jijianshuai/article/details/78833101)

[批处理脚本遍历指定文件夹下的文件](https://www.cnblogs.com/liangblog/p/9835940.html)