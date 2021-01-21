---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: NAS的备份
category: devops
tags: [devops]
excerpt: NAS的备份和磁盘映射
keywords: carlme,superwang,superwangcarl,carl,卡尔米,nas,exsi
---

## 简介

本文主要介绍,nas安装完后的备份

## 备份

### raid备份

无,详见[上篇博文](https://www.expreview.com/25412-all.html)

### 电脑和nas备份

> 比较小号cpu资源慎用

***nas端安装 :*** `Drive` 端口 `6690`

***PC端安装 :*** `Cloud Station Drive` 或者 `Cloud Station Backup`

服务端的`drive`默认端口为6690,需要在路由器中做相应的映射

服务端代开 `Drive管理控制台`

![img](../../assets/images/blog/2019/20190421204411.png)

配置团队文件夹

![img](../../assets/images/blog/2019/20190421235345.png)

客户端输入地址和帐号密码

![img](../../assets/images/blog/2019/20190421235504.png)

编辑服务器上的位置

![img](../../assets/images/blog/2019/20190422090705.png)

创建个文件夹

![img](../../assets/images/blog/2019/20190422090744.png)

选择本地需要同步的位置

![img](../../assets/images/blog/2019/20190422090902.png)

选中文件夹,不可不创建空的`SynologyDrive`

![img](../../assets/images/blog/2019/20190422091000.png)

完成

![img](../../assets/images/blog/2019/20190422091058.png)

***配置策略***

一般用来备份的话,可以配置单向上传,这样本地删除了,还可以去服务器上取

![img](../../assets/images/blog/2019/20190422091443.png)

默认的图标样式是这样的

![img](../../assets/images/blog/2019/20190422092234.png)

可以取消这些选中,则不显示样式

![img](../../assets/images/blog/2019/20190422092308.png)

![img](../../assets/images/blog/2019/20190422092340.png)
