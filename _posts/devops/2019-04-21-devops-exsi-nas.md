---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: exsi中安装nas
category: devops
tags: [devops,nas,exsi]
excerpt: 在exsi中安装nas
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米
---



## 简介

nas主要用来做存储的配置的,由于文件都比较重要所以使用nas可以很好的实现存储和热备之类的

## 前提([转](http://www.myxzy.com/post-462.html))

**系统环境：**

ESXI 6.5（安装过程略过，版本号6.5.0,Build 4564106）

黑群6.1引导由xpenology的大神Jun提供（这边已经转化成vmdk模式）[6.1引导点击下载](http://d.myxzy.com/462/synoboot.zip) [6.2引导点击下载](http://d.myxzy.com/462/ds3617_6.2.zip)

PAT系统固件文件由群晖官方下载 [点击前往](https://www.synology.cn/zh-cn/support/download/DS3617xs#utilities)

[点击进入下载页面](http://pan.myxzy.com/download.php?id=462)

by 2018-8-24

1、6.2引导，可以使用最新版本的pat

2、不修改SN和MAC的话，不能使用转码缩略图。

3、引导镜像需要使用SATA控制器才能被发现，ESXi使用webui才能看到sata控制器

## 步骤

### 创建虚拟机

选择操作名称和操作系统

![img]({{site.cdn}}assets/images/blog/2019/20190421164937.png)

随便选个位置,后面会删除

![img]({{site.cdn}}assets/images/blog/2019/20190421165019.png)

删除不需要的组件

![img]({{site.cdn}}assets/images/blog/2019/20190421165108.png)

添加硬盘

![img]({{site.cdn}}assets/images/blog/2019/20190421165146.png)

选择我们上传上来的硬盘

![img]({{site.cdn}}assets/images/blog/2019/20190421165212.png)

在添加一块10G的硬盘用来安装系统固件`pat`

![img]({{site.cdn}}assets/images/blog/2019/20190421165317.png)

注意：需要删除“SATA控制器0”，不然会出现无法找到硬盘的情况

![img]({{site.cdn}}assets/images/blog/2019/20190421171343.png)

完成

![img]({{site.cdn}}assets/images/blog/2019/20190421165357.png)

### 安装NAS

开启虚拟机

![img]({{site.cdn}}assets/images/blog/2019/20190421171202.png)

通过局域网的其他电脑，[访问](http://find.synology.com/)，找到该DSM，点击“设置”

![img]({{site.cdn}}assets/images/blog/2019/20190421172247.png)

固件如图

![img]({{site.cdn}}assets/images/blog/2019/20190421225543.png)

选择我们下载好的固件,进行安装

![img]({{site.cdn}}assets/images/blog/2019/20190421172709.png)

![img]({{site.cdn}}assets/images/blog/2019/20190421173028.png)

清空数据

![img]({{site.cdn}}assets/images/blog/2019/20190421172842.png)

安装中

![img]({{site.cdn}}assets/images/blog/2019/20190421173056.png)

重启

![img]({{site.cdn}}assets/images/blog/2019/20190421173235.png)

## 配置NAS

创建用户名密码等

![img]({{site.cdn}}assets/images/blog/2019/20190421173313.png)

DSM维护和更新，选择“下载DSM更新并进行手动安装下载计划”，因为是虚拟机下面2个勾可以全部去掉，点击“下一步”

![img]({{site.cdn}}assets/images/blog/2019/20190421173501.png)

QuickConnect现在已经无法设置了，点击“跳过步骤” - “是”

![img]({{site.cdn}}assets/images/blog/2019/20190421173620.png)

完成

![img]({{site.cdn}}assets/images/blog/2019/20190421173647.png)

## FAQ

### 访问[搜索](http://find.synology.com/)无结果

**问题 :** 访问[搜索](http://find.synology.com/)无结果,显示`局域网内未找到DiskStation`,如图

![img]({{site.cdn}}assets/images/blog/2019/20190421172431.png)

**原因 :** 可能不再同一个网段,或者使用的版本错误`我就是开始使用了6.2的引导盘,导致一直找不到`,其他原因

**解决 :** 更换一个版本或者直接登录路由器的界面,查找出一个`DiskStation`的直接通过ip访问即可

![img]({{site.cdn}}assets/images/blog/2019/20190421172558.png)

***

### nas的开始的50M引导不可删除

**问题 :** 无

**原因 :** 无

**解决 :** 无

## 参考资料

[ESXi虚拟机搭建私有云NAS-黑群晖DSM](http://www.myxzy.com/post-462.html)

[DiskStation Manager](https://www.synology.com/zh-cn/knowledgebase/DSM/video)