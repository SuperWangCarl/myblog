---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: Windows Server安装配置
category: devops
tags: [devops]
excerpt: Windows Server安装配置
keywords: carlme,superwang,superwangcarl,carl,卡尔米,windos服务器安装配置
---

## 简介

由于最近做了比较多的是企业政府项目,用到了windows服务器比较多,所以就记录下windows的服务器的安装和常用配置

## 安装

### 下载

[下载地址](https://msdn.itellyou.cn/)

- 选择需要下载的内容

  ![img]({{site.cdn}}/assets/images/blog/2019/20190522003200.png)

- 获取下载路径(可以使用电驴下载)

  ![img]({{site.cdn}}/assets/images/blog/2019/20190522003134.png)

### 安装版本

- cn_windows_server_2016_x64_dvd_9718765.iso

- 各版本差异

  ![img]({{site.cdn}}/assets/images/blog/2019/20190522003354.png)

`基本和安装windows系统差不多`

### 安装程序

![img]({{site.cdn}}/assets/images/blog/2019/20190522002229.png)

![img]({{site.cdn}}/assets/images/blog/2019/20190522002250.png)

### 选择我没有产品密钥

![img]({{site.cdn}}/assets/images/blog/2019/20190522002349.png)

### 选择版本

`windows server一般在系统镜像里集成了standard和data center两种版本，这两种版本又可以分别选择桌面体验和不带桌面体验的，选择桌面体验安装即是带gui的`

![img]({{site.cdn}}/assets/images/blog/2019/20190522002504.png)

### 接受协议

![img]({{site.cdn}}/assets/images/blog/2019/20190522002601.png)

### 选择自定义类型

![img]({{site.cdn}}/assets/images/blog/2019/20190522002623.png)

### 选择硬盘并开始安装

![img]({{site.cdn}}/assets/images/blog/2019/20190522002704.png)

### 配置密码后按Ctrl+Alt+Delete

`在 EXSI 中如下操作`

![img]({{site.cdn}}/assets/images/blog/2019/20190522003719.png)

## 配置

### 配置固定ip

- 打开网络中心

  ![img]({{site.cdn}}/assets/images/blog/2019/20190522004136.png)

- 更改适配器

  ![img]({{site.cdn}}/assets/images/blog/2019/20190522004307.png)

- 点击网卡属性

  ![img]({{site.cdn}}/assets/images/blog/2019/20190522004340.png)

- 双击配置

  ![img]({{site.cdn}}/assets/images/blog/2019/20190522004408.png)

- 配置

  ![img]({{site.cdn}}/assets/images/blog/2019/20190522004505.png)

### 远程登录用户配置

### 多用户配置

### 远程登录端口号修改

## 参考资料

[server2016的安装及配置](https://jingyan.baidu.com/article/e5c39bf5d910c139d76033e6.html)

[windows server 2016 介绍与安装](https://cloud.tencent.com/developer/news/317279)

[Windows Server 2016 Essentials 介绍](http://blog.sina.com.cn/s/blog_a0c06a350102z44o.html)

[Windows Server2012远程桌面服务配置和授权激活](https://jingyan.baidu.com/article/9f7e7ec0f5a8686f281554d9.html)

[windows 2008服务器修改3389远程登陆端口号](https://jingyan.baidu.com/article/f7ff0bfc1c512c2e26bb13d0.html)