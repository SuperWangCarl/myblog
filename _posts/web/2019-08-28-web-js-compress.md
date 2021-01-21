---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 前端js批量压缩和webStrom配置
category: web
tags: [web,javascript]
excerpt: 前端js批量压缩和webStrom配置
keywords: carlme,superwang,superwangcarl,carl,git,license,卡尔米,web,javascript
---

## 简介

前端编程比不可少,现在比较流程vue等主流框架,笔者最近由于维护了一些老的项目,里面的js文件好多,好多都是基于java的yui的压缩,只会写单文件的压缩.这就会多次请求服务器获取文件,在网上找了个可以将多个js文件批量压缩成一个文件的node插件`uglifyjs`

## 安装

```shell
#先安装 node
npm install uglify-js -g
uglifyjs -V
```

其中的升级和错误,暂且不说

![img](../../assets/images/blog/2019/20190828112931.jpg)

## 简单使用

- `-o` 输出的文件名称
- `-c` clean，清理代码
- `-m` 混淆代码，简单的变量名替换
- `--source-map` 输出map文件

处理一个`js.js`文件，输出为`min.js`。

```
uglifyjs js.js -o min.js
```

处理一个`js.js`文件，压缩输出为`min.js`。

```
uglifyjs js.js -o min.js -c
```

处理一个`js.js`文件，压缩并且混淆输出为`min.js`。

```
uglifyjs js.js -o min.js -c -m
```

处理一个`js.js`文件，压缩并且混淆输出为`min.js`，同时输出`min.js.map`文件。

```
uglifyjs js.js -o min.js -c -m --source-map
```

合并处理`1.js`和`2.js`文件，压缩并且混淆输出为`min.js`，同时输出`min.js.map`文件。

```
uglifyjs 1.js 2.js -o min.js -c -m --source-map
```

## 配置webstorm

此处我配置两个,一个合并压缩所有的js文件,一个合并压缩单个的js文件

![img](../../assets/images/blog/2019/20190828114832.jpg)

### 合并压缩所有

> 注意需要按照 加载js的顺序进行合并,否则会导致有的文件无法引用
>

1. 配置监听


![img](../../assets/images/blog/2019/20190828115143.jpg)

2. 参数值

   > $FileName$  -o ../dist/all.min.js -c -m

   > uglifyjs config.js simple-jquery.js slide.js log.js common.js  -o ../dist/all.min.js -c -m

   ![img](../../assets/images/blog/2019/20190901232624.jpg)

3. 配置过滤

![img](../../assets/images/blog/2019/20190828115235.jpg)

### 合并压缩单个

1. 配置

   ![img](../../assets/images/blog/2019/20190828115659.jpg)

## 参考资料

[标签 uglifyjs 下的文章](https://newsn.net/tag/uglifyjs/)