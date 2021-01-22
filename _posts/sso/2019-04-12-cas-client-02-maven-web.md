---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: maven项目集成cas客户端
category: sso
tags: [sso,maven]
excerpt: maven项目集成cas客户端
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,单点登录客户端集成,cas,client
---

## 1. 简介

此篇介绍普通maven项目集成CAS客户端,源码[传送门](https://github.com/SuperWangCarl/cas-client/tree/master/sso-client-maven-web)

## 2. 步骤

### 1. 配置hosts

由于CAS是基于cooke和session的所以我们需要配置域名映射

客户端集成分为五种情况 此篇介绍集成 `maven项目集成CAS客户端`
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

### 2. 在pom.xml中引入配置

```xml
<dependencies>
    <dependency>
        <groupId>commons-logging</groupId>
        <artifactId>commons-logging</artifactId>
        <version>1.1.1</version>
    </dependency>

    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.17</version>
    </dependency>

    <dependency>
        <groupId>org.jasig.cas.client</groupId>
        <artifactId>cas-client-core</artifactId>
        <version>3.4.1</version>
        <exclusions>
            <exclusion>
                <groupId>javax.servlet</groupId>
                <artifactId>servlet-api</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
</dependencies>
```

### 3. 在web.xml中添加相应配置

详见代码 `web.xml`

### 4. 启动项目访问测试

```
www.mavenweb.com:8011
```

## 3. 总结

暂无