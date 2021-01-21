---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: SpringCloud采坑总结(持续更新)
category: FAQ
tags: [springcloud,faq]
excerpt: SpringCloud采坑总结(持续更新)
keywords: carlme,superwang,superwangcarl,carl,卡尔米,SpringCloud,FAQ
---

## 简介

此篇主要介绍在平常工作中的有关SpringCloud遇到的问题

## 问题

### RestTemplate 相关问题

**问题 :** no suitable HttpMessageConverter found for response type [class java.lang.Object] and content type [application/json;charset=UTF-8]

![img]({{site.cdn}}assets/images/blog/2019/20190522105745.png)

**原因 :** MediaType类型不支持

**参考连接 :**无

**解决 :** 配置下封装参数

 [RestTemplateConfig.java]({{site.cdn}}download/java/RestTemplateConfig.java)

```xml
 <dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.6</version>
</dependency>
  <!--web-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>5.0.4.RELEASE</version>
    <scope>compile</scope>
</dependency>
```

