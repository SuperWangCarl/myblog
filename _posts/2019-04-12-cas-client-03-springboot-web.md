---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: springboot项目集成cas客户端
category: sso
tags: [sso,springboot]
excerpt: springboot项目集成cas客户端
keywords: carlme,superwang,superwangcarl,carl,卡尔米,单点登录客户端集成,cas,client,springboot
---

## 1. 简介

此篇介绍springboot项目集成CAS客户端,源码[传送门](https://github.com/SuperWangCarl/cas-client/tree/master/sso-client-springboot-web)

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

### 2. 在springboot的pom.xml添加配置

```xml
<dependency>
	<groupId>org.jasig.cas.client</groupId>
	<artifactId>cas-client-core</artifactId>
	<version>3.4.1</version>
</dependency>
```

### 3. 配置application.properties

在应用的配置文件中（application.properties）添加如下配置

```properties
server.port=8013

# 填CAS服务器的前缀
cas.server-url-prefix=http://www.sso.com:8443/cas
# 填CAS服务器的登录地址
cas.server-login-url=http://www.sso.com:8443/cas/login
# 填客户端的访问前缀 www.crm.com是在host文件中配置的映射,映射到127.0.0.1
cas.client-host-url=http://www.bootweb.com:8013

```

### 4. 添加配置类

详见代码`com.hedian.platform.bean.CasConfig`

### 5. 配置过滤器 监听器

详见代码`com.hedian.platform.config.ServerConfig`

`注: 如果 ServerConfig不再springboot的基类扫描中,需要在META-INF/spring.factories中配置`

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
cn.hedian.config.ServerConfig
```

### 6. 启动项目访问

```
www.bootweb.com:8013/hello
```

## 3. 总结

暂无