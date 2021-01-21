---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 博客jekyll新增支持流程图
category: myblog
tags: [myblog]
excerpt: 给博客添加支持流程图的功能
keywords: carlme,superwang,superwangcarl,carl,卡尔米,流程图,jekyll
---



## 1. 简介

由于我喜欢平常画些流程图,所以准备给博客增加个流程图的功能

## 2. 步骤

### 1. 在footer中引入js

```html
<!-- 流程图 -->
    <script type="text/javascript"  src="{{site.cdn}}/assets/js/raphael.min.js"></script>
    <script type="text/javascript"  src="{{site.cdn}}/assets/js/flowchart.min.js"></script>
    <script type="text/javascript"  src="{{site.cdn}}/assets/js/flow.min.js"></script>
```

### 2. 其中flow.min.js是自己改的代码

修改的如下,也比较简单

```javascript
$(function () {
    $(".language-flow").each(function (index) {
        let f = $(this);
        let text = f.text();
        var canvas = "canvas" + index;
        f.html("<div id=\"" + canvas + "\"></div>");
        flow(canvas, text);
        //将流程图居中
        $("#"+canvas).css("text-align","center");
        //是否 去除背后的阴影,如果使用 unwrap这去除(将父节点去除,保留子节点)
        // f.unwrap();
    })
})
```

## 3. 使用

```
start		开始
end			结束
operation	方法
subroutine	子程序
condition	条件
inputoutput	输入
```

## 4. 效果

### 代码样式

`注意每行开始不可以有空格`

```
st=>start: Start
e=>end
ldata=>operation: 进入csdn
c=>condition: 是否进入lindexi_gd
l=>operation: 访问
st->ldata->c
c(yes)->l->e
c(no)->e
```

### 效果如下

```flow
st=>start: 开始
e=>end: 结束
op=>operation: 操作
sub1=>subroutine: 子程序
cond=>condition: Yes or No?
io=>inputoutput: 输入/输出
st->op->cond
cond(yes)->io->e
cond(no)->sub1(right)->op
```

## 5. 参考资料

[jekyll 在博客添加流程图](https://cloud.tencent.com/developer/article/1341629)