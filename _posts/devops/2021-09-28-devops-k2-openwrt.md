---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 斐讯k2刷openwrt
category: devops
tags: [devops,nas,rsync]
excerpt: 在斐讯k2中刷openwrt
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,k2,openwrt
---

## 简介

特殊需求需要刷个openwrt的软路由

## 01开启telnet

控制面板中开启telnet

![img]({{ site.cdn }}assets/images/blog/2021/20210928150422.png)

## 02刷入breed

1. [下载breed和openwrt需要的工具]({{site.cdn}}assets/download/k2-openwrt.rar)

2. 打开路由器刷breed_Web控制台助手v5.9版本

   ![img]({{ site.cdn }}assets/images/blog/2021/20210928143947.png)

3. 刷入成功后进入进入breed方法：

   路由WAN口的网线拔掉，电脑网线连接路由LAN口，电脑网卡设置为自动获取IP:

   路由断电3秒----按住复位键不要松手----插入电源----等待5秒松手----浏览器输入192.168.1.1

4. 固件备份

   ![img]({{ site.cdn }}assets/images/blog/2021/20210928110038.png)

   恢复出厂设置

   ![img]({{ site.cdn }}assets/images/blog/2021/20210928113701.png)

## 03刷入Openwrt

![img]({{ site.cdn }}assets/images/blog/2021/20210928113828.png)

### 设置中文包

`路由器wan口联网`

1.语言设置的位置在：System-System- System Properties- Language and Style- Language 通过下拉菜单选择。

2.刚刷完固件只有英语可以选。

3.opkg update

4.下载中文语言包的方法：System-Software–Software-Actions，在Download and install package右边的文本框里输入：luci-i18n-chinese或者luci-i18n-base-zh-cn，点击OK，系统即会自动下载并安装。

5.安装完后到语言设置的位置选择chinese，然后刷新页面即可。

## 参考资料

[固件地址](https://openwrt.org/toh/views/toh_fwdownload)