---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 前后端分离项目域名端口相同集成cas客户端
category: sso
tags: [sso,springboot]
excerpt: 前后端分离项目域名端口相同集成cas客户端
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,单点登录客户端集成,cas,client,springboot,前后端分离
---

## 1. 简介

此篇介绍 前后端分离 域名端口相同的情况下集成CAS客户端,因为比较罕见,所以就说下大体流程,源码[传送门](https://github.com/SuperWangCarl/cas-client/tree/master/sso-client-springboot-back-web)

### 1. 配置hosts

由于CAS是基于cooke和session的所以我们需要配置域名映射

客户端集成分为五种情况 此篇介绍集成 `前后端分离项目集成CAS客户端`
测试时配置hosts

> 位置: C:\Windows\System32\drivers\etc

```shell
#统一认证地址
127.0.0.1 www.sso.com
#普通web项目的地址
127.0.0.1 www.commonweb.com
#maven项目的地址
127.0.0.1 www.mavenweb.com
#springboot一体(前后端未分离)项目地址
127.0.0.1 www.bootweb.com
#springboot后台地址
127.0.0.1 www.clientback.com
#前台地址
127.0.0.1 www.clientweb.com
```

### 2. 重写四个类

详见源码

![img]({{ site.cdn }}assets/images/blog/2019/20190412155847.png)

### 3. 参见上篇博文

`和前后端分离域名不同的项目结构 大体相同,说下差异`

![img]({{ site.cdn }}assets/images/blog/2019/20190412160143.png)

![img]({{ site.cdn }}assets/images/blog/2019/20190412160050.png)

## 3. 总结

