---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: NAS的共享文件夹外网映射
category: devops
tags: [devops]
excerpt: NAS的共享文件夹外网映射
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,nas,exsi
---

## 简介

本文主要介绍,nas配合vpn server实现共享文件夹的外网的磁盘映射,并可以被everything扫描到

## vpn server

### 安装打开

![img]({{site.cdn}}assets/images/blog/2019/20190529122012.png)

### 配置

![img]({{site.cdn}}assets/images/blog/2019/20190529122127.png)

### 修改下默认的网关地址

`防止和本机的内网ip地址冲突,因为默认的10.0.0.1使用的还是太多了`

![img]({{site.cdn}}assets/images/blog/2019/20190531011047.png)

### 路由器做外网映射

![img]({{site.cdn}}assets/images/blog/2019/20190529122206.png)

### 配置电脑vpn

![img]({{site.cdn}}assets/images/blog/2019/20190529122300.png)

### 添加vpn

![img]({{site.cdn}}assets/images/blog/2019/20190529122345.png)

![img]({{site.cdn}}assets/images/blog/2019/20190529122431.png)

### 连接

![img]({{site.cdn}}assets/images/blog/2019/20190529122500.png)

## 配置vpn

> 此时所有的链接都走的vpn的网关,即我们访问任何网站,比如百度时,都需要经过我们的nas,这是不需要的,我们需要的结果是访问nas共享文件夹才走vpn的网关,访问外网的时候仍然走我们以前的网关,不经过我们的nas,此时需要配置一些参数

> **第一次查看路由表**
>
> cmd命令行下执行
>
> ```
> route print
> ```
>
> 可以查看到
>
> `此时任何网络都是走的vpn网关`
>
> ![img]({{site.cdn}}assets/images/blog/2019/20190531005635.png)

### 配置所有请求都不走vpn网关

1. 点击适配器属性

   ![img]({{site.cdn}}assets/images/blog/2019/20190531004002.png)

2. 双击ipv4

   ![img]({{site.cdn}}assets/images/blog/2019/20190531004050.png)

3. 点击高级

   ![img]({{site.cdn}}assets/images/blog/2019/20190531004129.png)

4. 取消在远程网络上使用默认网关的勾选 之后点击保存

   ![img]({{site.cdn}}assets/images/blog/2019/20190531004154.png)

> **第二次查看路由表**
>
> cmd命令行下执行
>
> ```
> route print
> ```
>
> 可以查看到
>
> `此时任何网络都是走的非vpn网关`
>
> ![img]({{site.cdn}}assets/images/blog/2019/20190531005005.png)

### 配置访问nas的走vpn网关

#### cmd命令行下执行 

路由表添加

```
route add 192.168.1.150 mask 255.255.255.255 10.103.45.1
```

> 第三次查看路由表
>
> ```
> route print
> ```
>
> `此时只有访问192.168.1.150是走的vpn网关`
>
> ![img]({{site.cdn}}assets/images/blog/2019/20190531005213.png)

### 编写一键bat脚本

`自动链接 VPN 自动添加网关`

`需要右键已管理员的身份运行`

```
@echo off
::链接名为 FTP的vpn上
rasdial FTP wangc wangc2017
::让访问 192.168.1.150 的路由 都走10.103.45.1的vpn网关
::可以添加参数-p 使之创建个永久的路由链接 关机也不会丢失
route add 192.168.1.150 mask 255.255.255.255 10.103.45.1
::退出
exit
```

## 将共享文件映射问本地磁盘

1. 打开`Win+R`输入我们的nas地址`\\192.168.1.150`

   ![img]({{site.cdn}}assets/images/blog/2019/20190531010509.png)

   ![img]({{site.cdn}}assets/images/blog/2019/20190531010609.png)

2. 选中共享文件 右键将之映射为网络驱动器

   ![img]({{site.cdn}}assets/images/blog/2019/20190531010714.png)

3. 查看

   ![img]({{site.cdn}}assets/images/blog/2019/20190531010811.png)

## 使EveryThing可以搜网络驱动器

此时我们可以在我们的本地电脑上,方便的查看和使用nas的共享文件夹里面的文件了.但是还有个缺点是,我们没办法使用everything去搜索里面的文件,因为默认everything只能搜索本地磁盘里面的.

在这里我们要下载个高点版本(1.4.1.895)的everything并配置一下就可以搜索了

[下载地址]({{site.cdn}}assets/download/everythingportable32w64w.zip)

1. 下载后使用任意版本即可

   ![img]({{site.cdn}}assets/images/blog/2019/20190531011308.png)

2. 双击打开

   ![img]({{site.cdn}}assets/images/blog/2019/20190531013325.png)

3. 点击运行

   ![img]({{site.cdn}}assets/images/blog/2019/20190531013404.png)

4. 如果弹出此界面选择`安装"Everything"服务`,否则将看不到映射的磁盘（共享文件）

   ![img]({{site.cdn}}assets/images/blog/2019/20190531014102.png)

5. 打开 工具->选项

   ![img]({{site.cdn}}assets/images/blog/2019/20190531011420.png)

6. 选中需要添加的点击确定即可

   ![img]({{site.cdn}}assets/images/blog/2019/20190531011716.png)

   ![img]({{site.cdn}}assets/images/blog/2019/20190531014209.png)

7. 搜索(可以看到是可以搜索到映射的磁盘中的文件的)

   ![img]({{site.cdn}}assets/images/blog/2019/20190531014347.png)

## FAQ

### 外网不可访问445,139

**问题 :** 

未配置VPN,在路由器做了139 和445的端口映射后

![img]({{site.cdn}}assets/images/blog/2019/20190531002929.png)

在内网的情况下(即可以直接通过内网ip可以ping通nas服务器)通过域名,访问共享文件夹可以访问,如图

![img]({{site.cdn}}assets/images/blog/2019/20190531003128.png)

![img]({{site.cdn}}assets/images/blog/2019/20190531003223.png)

但是在外网直接通过域名访问共享文件夹不可以访问,如图

![img]({{site.cdn}}assets/images/blog/2019/20190531003128.png)

![img]({{site.cdn}}assets/images/blog/2019/20190531003551.png)

**原因 :** 内部跳转nas的时候可能有转换城了内网的ip,比如 本机通过域名访问nas的445端口后,nas主机又要求本机 访问139端口,但是此时nas可是识别到本机只是个内网ip比如192.168.1.111,然后让本机访问192.168.1.111的139端口,此时自然是访问不到的 ***(猜测)***

**参考连接 :** 无

**解决 :** 未解决,配置vpn server实现外网访问内部文件夹

***

### everything无法识别网络驱动器

**问题 :** everything无法识别网络驱动器

![img]({{site.cdn}}assets/images/blog/2019/20190531013156.png)

**原因 :** 主要有这几个原因 版本过低,使用了已管理员运行的模式

**参考连接 :** 

**解决 :** 

## 参考资料

[快速搜索NAS文件、快速搜索共享文件、使用everything搜索实现。](https://yq.aliyun.com/articles/617769)