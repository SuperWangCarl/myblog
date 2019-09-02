---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 前端css压缩和webStrom配置
category: web
tags: [web,css]
excerpt: 前端css压缩和webStrom配置
keywords: carlme,superwang,superwangcarl,carl,git,license,卡尔米,web,css
---

## 简介

上篇博文介绍的压缩css的工具,这篇博文介绍下前端压缩css的工具csso,以前刚开始用的是一种yui的jar进行压缩js和css由于功能单一,只能单个文件的压缩,还有好多新特性不支持后面就逐渐放弃了.

## 安装

```shell
#先安装 node
#由于默认安装的是最新的3版本,经常失败,于是就换回了2版本
npm install -g csso@2
csso -V
```

## 简单使用

> 原始css

```css
body { margin: 20px 30px; padding: 100px; margin-left: 0px; } h1 { font: 200 36px / 1.5 sans-serif; } h1 { color: #ff6600; }
```

>  重构压缩后
>
>  csso默认会重构我们写的css,减小体积
>
>  CSSO删除了无关的空格，换行符和分号，并缩短#ff6600为#f60。CSSO还将margin和margin-left属性合并为一个声明（），并将我们单独的选择器块合并为一个。margin: 20px 30px 20px 0h1
>
>  如果您对CSSO如何重写CSS持怀疑态度，可以禁用其重构功能。只需使用–restructure-off或-off标志。例如，running 给出了以下内容：csso style.css style.min.css -off

```css
body{padding:100px;margin:20px 30px 20px 0}h1{font:200 36px/1.5
    ➥ sans-serif;color:#f60}
```

> 压缩不重构后
>
> 现在我们的CSS缩小了，但没有优化。禁用重组将使您的CSS文件尽可能小。除非遇到问题，否则请避免禁用重组。

```css
body{margin:20px 30px;padding:100px;margin-left:0}h1{font:200 36px/ ➥1.5 sans-serif}h1{color:#f60}
```

## 配置webstorm

此处我配置两个,一个合并压缩所有的css文件,一个合并压缩单个的css文件

![img]({{site.cdn}}/assets/images/blog/2019/20190901232442.jpg)

### 合并压缩所有

1. 配置监听

   ```
   -i $FileName$ -o ../dist/all.min.css
   ```

   ![img]({{site.cdn}}/assets/images/blog/2019/20190901232806.jpg)

2. 配置过滤器,监听哪些文件

   ![img]({{site.cdn}}/assets/images/blog/2019/20190901232858.jpg)

### 合并压缩单个

1. 配置 和过滤器

   ![img]({{site.cdn}}/assets/images/blog/2019/20190901233033.jpg)

## 参考资料

[CSS教程：CSSO调试和优化](https://www.simcf.cc/4093.html)