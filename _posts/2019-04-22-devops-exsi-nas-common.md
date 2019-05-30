---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: NAS的常用套件
category: devops
tags: [devops]
excerpt: NAS的常用套件
keywords: carlme,superwang,superwangcarl,carl,卡尔米,nas,exsi
---

## 简介

本文主要介绍,nas安装完后一些常用的套件使用

## 常用套件

### *CloudSync

> 主要用于同步 百度云等的存储

安装

![img]({{site.cdn}}/assets/images/blog/2019/20190421191437.png)

之后需要到需要将文件放到百度云的这个目录下,才会自动同步,上传的文件默认也是到这个目录下

![img]({{site.cdn}}/assets/images/blog/2019/20190424113011.png)

### *Drive

> 和电脑的备份

![img]({{site.cdn}}/assets/images/blog/2019/20190421203313.png)

### *Snapshot Replication

> 快照

![img]({{site.cdn}}/assets/images/blog/2019/20190421205320.png)

### *video station

`使用的是5000 和 5001 的端口号`

> 网页看视频

### *photo station

> 照片

### *download station

> bt下载

### *virtual Machine

> 虚拟化

### *iscsi manager

> nas的存储 映射到电脑上

### *vpn server

> 远程链接内网nas共享文件夹

![img]({{site.cdn}}/assets/images/blog/2019/20190529122012.png)

#### 配置

![img]({{site.cdn}}/assets/images/blog/2019/20190529122127.png)

#### 路由器做外网映射

![img]({{site.cdn}}/assets/images/blog/2019/20190529122206.png)

#### 配置电脑vpn

![img]({{site.cdn}}/assets/images/blog/2019/20190529122300.png)

#### 添加vpn

![img]({{site.cdn}}/assets/images/blog/2019/20190529122345.png)

![img]({{site.cdn}}/assets/images/blog/2019/20190529122431.png)

#### 连接

![img]({{site.cdn}}/assets/images/blog/2019/20190529122500.png)

## FAQ

Cloud Statin Backup不可以修改

![img]({{site.cdn}}/assets/images/blog/2019/20190422231640.png)

重新连接之后可以设置

![img]({{site.cdn}}/assets/images/blog/2019/20190422231830.png)

## 参考资料

[Synology 服务使用哪些网络端口？](https://o.hiue.cn/41.html)
