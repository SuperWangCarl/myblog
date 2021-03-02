---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 博客增加图片缩放
category: myblog
tags: [myblog,image]
excerpt: 博客增加图片缩放
keywords: IT超仔,carlme,superwang,superwangcarl,carl,图片缩放,卡尔米
---

## 1. 简介

由于有的屏幕比较小或者图片比较模糊,无法看清图片,增加图片缩放功能

## 2. 操作步骤

### 1. 在head中引入css

```css
<!-- 点击图片放大 -->
<link rel="stylesheet" href="/assets/css/bootstrap-grid.min.css">
<link rel="stylesheet" href="/assets/css/zoomify.min.css">
```

![img]({{ site.cdn }}assets/images/blog/2019/20190408002547.jpg)

### 2. 在footer中引入js

```javascript
<!-- 点击图片放大 -->
<script type="text/javascript" src="/assets/js/zoomify.min.js"></script>
<script type="text/javascript">
    $('img').zoomify();
</script>
```

![img]({{ site.cdn }}assets/images/blog/2019/20190408002636.jpg)

## 3. 效果展示

![img]({{ site.cdn }}assets/images/blog/2019/20190409001833.png)