---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 戴尔服务器风扇调节
category: devops
tags: [iDRAC,dell,r510]
excerpt: 手动调节戴尔服务器风扇
keywords: IT超仔,carlme,superwang,superwangcarl,carl,linux,dell,风扇
---

## 简介

由于家中戴尔r510风扇声音比较大,

## 步骤

### 设置iDRAC远程卡

详见 => [戴尔IDRAC远程卡配置]({{site.url}}devops/2019/04/15/devops-dell-idarc.html)

### 下载安装远程调节工具

[qm下载]({{ site.cdn }}assets/download/OM-BMC-Dell-Web-WIN-9.0.2-2641_A00.exe) 

### 调节风扇

1. 关闭自动调节转速

   ```
   ipmitool -I lanplus -H 192.168.103.120 -U root -P wcaisj520 raw 0x30 0x30 0x01 0x00
   ```

2. 设置转速为31%（最后的1f为转速百分比，16进制）

   ```
   ipmitool -I lanplus -H 192.168.103.120 -U root -P wcaisj520 raw 0x30 0x30 0x02 0xff 0x1f
   ```

   > 十进制和十六进制的转换

   | 十进制  | 十六进制 |
   | ---- | ---- |
   | 10   | a   |
   | 15   | f    |
   | 20   | 14   |
   | 31   | 1f   |

3. 命令行 不同调节

   ![img]({{ site.cdn }}assets/images/blog/2021/20210125115419.png)

## 参考资料

[DELL服务器手动调整风扇转速](https://blog.csdn.net/a1561386524/article/details/105558343)

[DELL T630风扇转速太高](https://blog.csdn.net/albertshi12/article/details/83794368?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1.control)