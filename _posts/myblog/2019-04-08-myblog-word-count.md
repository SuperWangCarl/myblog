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
keywords: IT超仔,carlme,superwang,superwangcarl,carl,myblog,卡尔米
---

## 1. 简介

给每篇博文添加一个字数统计的功能,直接使用`jekyll`自带的统计功能.

## 2. 步骤

在`copyright.html`中添加

1. 英文字数统计
   - jekyll中有内置的英文字数统计方法`number_of_words`，直接在需要显示的文章中添加代码`{{ page.content | number_of_words }}`，我是直接在`post.html`中添加，注意`{{ page.content | number_of_words }}`显示出来的只是字数，你需要加一些文字说明。
2. 中文字数统计
   - 添加代码`{{ content | strip_html | strip_newlines | split: "" | size }}`，操作同上

## 3. 效果展示

![img]({{ site.cdn }}assets/images/blog/2019/20190408233039.png)

***

## 参考资料

[为Jekyll博客添加小功能](https://blog.csdn.net/ds19991999/article/details/81293467)