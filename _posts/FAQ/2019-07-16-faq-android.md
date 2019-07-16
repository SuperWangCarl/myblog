---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: Android采坑总结(持续更新)
category: FAQ
tags: [Android,faq]
excerpt: Android采坑总结(持续更新)
keywords: carlme,superwang,superwangcarl,carl,卡尔米,Android,FAQ
---

## 简介

此篇主要介绍在平常工作中的有关Android遇到的问题

## 问题

## Android配置

...

## Android和H5

### webView无法回调js

**问题 :** js调用安卓的方法后,在安卓里面在调用js的方法无法调用

![img]({{site.cdn}}/assets/images/blog/2019/20190716183926.png)

**原因 :** 可能是线程问题

**参考链接 :** [解决WebView使用loadUrl回调javascript方法时报错的问题](https://blog.csdn.net/chenzhengfeng/article/details/85786749)

**解决 :** 

```java
 /**
 * 将会被js调用
 */
@JavascriptInterface
public void showcontacts() {
    Toast.makeText(JsCallJavaCallPhoneActivity.this, "...........", Toast.LENGTH_SHORT).show();
    webView.post(new Runnable() {
        @Override
        public void run() {
            String json = "[{\"name\":\"阿福\", \"phone\":\"18600012345\"}]";
            // 调用JS中的方法
            webView.loadUrl("javascript:show('" + json + "')");
        }
    });
}
```

