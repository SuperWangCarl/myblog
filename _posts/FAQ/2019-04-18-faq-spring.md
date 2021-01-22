---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: Spring采坑总结(持续更新)
category: FAQ
tags: [spring,faq]
excerpt: Spring总结(持续更新)
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,Spring,FAQ
---

## 简介

此篇主要介绍在平常工作中的有关Spring遇到的问题

## 问题

### 在springboot的test中解析xml文件报null

**问题 :** 在springboot的test中解析xml文件报null

![img]({{site.cdn}}assets/images/blog/2019/20190606143218.png)

**原因 :** 配置文件解析错误

**参考连接 :**无

**解决 :** 

方式一:

加载正确的配置文件

![img]({{site.cdn}}assets/images/blog/2019/20190606143333.png)

将spirngboot的test启动方式修改为spring的

方式二:

使用@ImportResource 注解

***

