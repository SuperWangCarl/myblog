---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: SpringMVC采坑总结(持续更新)
category: FAQ
tags: [springboot,faq]
excerpt: SpringMVC采坑总结(持续更新)
keywords: carlme,superwang,superwangcarl,carl,卡尔米,SpringMVC,FAQ
---

## 简介

此篇主要介绍在平常工作中的有关SpringMVC遇到的问题

## 问题

### springmvc两个参数实体的封装

#### 默认封装 (可以)

***请求url*** : localhost:8080/mytest/mytest?outputcode=1243&id&netweight=321

***后台代码***

![img]({{site.cdn}}/assets/images/blog/2019/20190419144417.png)

***结果***

![img]({{site.cdn}}/assets/images/blog/2019/20190419144518.png)

#### @RequestBody封装 (不可以)

***结果***

![img]({{site.cdn}}/assets/images/blog/2019/20190419144615.png)

***

### contentType为form-data时无法接收参数

**问题 :** contentType为form-data时无法接收参数

**原因 :** 如果不是文件类型请求，我们使用request.getParameter("");方法是可以获取到参数内容的，如果是文件类型的请求即请求的头部信息为“multipart/form-data”，时，需要如下处理：

**参考链接 :** [[过滤器中处理multipart/form-data头部的post请求request.getParamete](https://www.cnblogs.com/fengwenzhee/p/9804628.html)](https://www.cnblogs.com/fengwenzhee/p/9804628.html)

**解决 :** 

```java
HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) resp;
        String contentType = req.getContentType();
        if (contentType != null && contentType.contains("multipart/form-data")) {
            MultipartResolver resolver = new CommonsMultipartResolver(request.getSession().getServletContext());
            MultipartHttpServletRequest multipartRequest = resolver.resolveMultipart(request);
            // 将转化后的 request 放入过滤链中
            request = multipartRequest;
        }
```

通过spring的轮子，实现request的转换，然后使用request.getParameter("");

```java
 @Bean(name = "multipartResolver")
    public MultipartResolver multipartResolver() {
        CommonsMultipartResolver resolver = new CommonsMultipartResolver();
        resolver.setDefaultEncoding("UTF-8");
        //resolveLazily属性启用是为了推迟文件解析，以在在UploadAction中捕获文件大小异常
        resolver.setResolveLazily(true);
        resolver.setMaxInMemorySize(40960);
        //上传文件大小 5M 5*1024*1024
        resolver.setMaxUploadSize(5 * 1024 * 1024);
        return resolver;
    }
```

方式一

方式二

方式三

