---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 博客整体架构和标识
category: myblog
tags: [myblog]
excerpt: 介绍下博客的大体架构,和常用的关键标识
keywords: carlme,superwang,superwangcarl,carl,字段标识,卡尔米
---

## 1. 简介

本篇介绍博客的整体模块的划分和一些标识表示的意思

## 2.模块

![img](../../assets/images/blog/2019/20190408223512.png)

![img](../../assets/images/blog/2019/20190408223939.png)

![img](../../assets/images/blog/2019/20190408224044.png)

## 3.标识

```
layout: page  		---引用的_layouts的格式
title: About Me		---此系列文章的标题
titlebar: About   ---title的标题
menu: about			---用户class的高亮显示 暂时没用
subtitle:  <span class="mega-octicon octicon-person"></span>&nbsp;&nbsp; I am a programmer    ---此系列文章标题下方的样式     
css: ['about.css', 'sidebar-popular-repo.css']
permalink: /about  ---访问的链接

layout: post
title: Java 核心知识点整理   ---显示的标题
no-post-nav: true  ---是否不添加导航栏 为true时不添加
copyright: java   ---添加不同的微信公众号
category: java 	  ---所属的类别
tags: [java]
excerpt: 听说你在面试   ---首页文章显示的字  meta的描述
keywords: Spring Boot,WebFlux,响应式编程,反应式编程
original: 是否原创(me) 否的话添加连接
comments 是否添加评论 默认可以 指定false为不可以添加
```

