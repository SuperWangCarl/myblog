---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 普通web项目集成cas客户端
category: sso
tags: [sso,web]
excerpt: 普通web项目集成cas客户端
keywords: carlme,superwang,superwangcarl,carl,卡尔米,单点登录客户端集成,cas,client
---

## 1. 简介

此篇介绍普通web项目集成CAS客户端,源码[传送门](https://github.com/SuperWangCarl/cas-client/tree/master/sso-client-common-web)

## 2. 步骤

### 1. 配置hosts

由于CAS是基于cooke和session的所以我们需要配置域名映射

客户端集成分为五种情况 此篇介绍集成 `普通的web项目`
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

### 2. 在webapp/WEB-INF/lib中导入jar包

![img]({{site.cdn}}/assets/images/blog/2019/20190412144536.png)

### 3. 在web.xml中添加相应配置

详见代码 `web.xml`

### 4. 启动项目访问测试

```
www.commonweb.com:8011
```

## 3. 总结

暂无