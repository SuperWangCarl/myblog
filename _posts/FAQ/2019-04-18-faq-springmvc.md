---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: SpringMVC采坑总结(持续更新)
category: FAQ
tags: [springboot,faq]
excerpt: SpringMVC采坑总结(持续更新)
keywords: carlme,superwang,superwangcarl,carl,卡尔米,SpringMVC,FAQ
---

## 简介

此篇主要介绍在平常工作中的有关SpringMVC遇到的问题

## 问题

### springmvc两个参数实体的封装

#### 默认封装 (可以)

***请求url*** : localhost:8080/mytest/mytest?outputcode=1243&id&netweight=321

***后台代码***

![img]({{site.cdn}}/assets/images/blog/2019/20190419144417.png)

***结果***

![img]({{site.cdn}}/assets/images/blog/2019/20190419144518.png)

#### @RequestBody封装 (不可以)

***结果***

![img]({{site.cdn}}/assets/images/blog/2019/20190419144615.png)

***

