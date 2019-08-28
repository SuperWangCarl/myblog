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

**问题 :** 配置后出错

![img]({{site.cdn}}/assets/images/blog/2019/20190819105351.png)

**原因 :** 添加了无法解析的属性,删除即可

![img]({{site.cdn}}/assets/images/blog/2019/20190819105452.png)

**参考链接 :** 

**解决 :** 

![img]({{site.cdn}}/assets/images/blog/2019/20190819105520.png)



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

## Android调试

### failed to copy ... Read-only file system

**问题 :** 遇到需要将jar和so push到设备的情况，某些没有调整文件权限的设备可能会遇到

failed to copy ... Read-only file system 类似的提示。

**原因 :** 权限不够

**参考链接 :** [android设备调试遇到failed to copy ... Read-only file sys](https://ifoggy.iteye.com/blog/1889226)

**解决 :** 

1. 用 adb shell 命令进入到设备的文件系统；
2. 用 su 命令切换到root用户（设备需要root）；
3. 用 mount -o remount,rw -t yaffs2 /dev/block/mtdblock0 /system 重新挂载文件系统（如果没有这一步，即使修改了system文件夹的权限，也不能push成功）；
4. 用 chmod 777 /system 修改相关文件夹权限。

