---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 博客字数统计
category: myblog
tags: [myblog,word,count]
excerpt: 给每篇博文添加一个字数统计
keywords: carlme,superwang,superwangcarl,carl,myblog,卡尔米
---

## 1. 简介

给每篇博文添加一个字数统计的功能,直接使用`jekyll`自带的统计功能.

## 2. 步骤

在`copyright.html`中添加

```html
<p align="center" style="margin-top: 15px; font-size: 25px;color: #843534;">
    <strong>（本篇博文完结,一共:<span style="color: #cc0000;">{{ page.content | number_of_words }} </span>字）</strong>
</p>
```

## 3. 效果展示

![img]({{site.cdn}}assets/images/blog/2019/20190408233039.png)

***

