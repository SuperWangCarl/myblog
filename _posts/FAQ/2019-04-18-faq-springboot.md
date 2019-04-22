---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: SpringBoot采坑总结(持续更新)
category: FAQ
tags: [springboot,faq]
excerpt: SpringBoot采坑总结(持续更新)
keywords: carlme,superwang,superwangcarl,carl,卡尔米,springboot,FAQ
---

## 简介

此篇主要介绍在平常工作中的有关springboot遇到的问题

## 问题

### 启动后直接exit code

**问题 :** 启动了直接关闭了没有任何打印日志,如图

![img]({{site.cdn}}/assets/images/blog/2019/20190418222940.png)

**原因 :** 配置了`logback.xml`里面没有配置打印到控制台的模块

**解决 :** 修改`logback.xml`添加打印到控制台的

```xml
<appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
        <!--格式化输出：%d表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度%msg：日志消息，%n是换行符 -->
        <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%L] %-5level %logger{50} - %msg%n</pattern>
    </encoder>
</appender>
<!-- 日志输出级别 -->
<root level="DEBUG">
    <appender-ref ref="STDOUT" />
</root>
```

***

### 属性注入失败

**问题 :** yml中的属性无法注入到bean中

![img]({{site.cdn}}/assets/images/blog/2019/20190418223641.png)

**原因 :** yml中的属性大写了

**解决 :** 使用`aliyun-vo`替换`aliyunVo`

***

### restful访问异常

**问题 :** java.lang.IllegalStateException: Ambiguous handler methods mapped for '/zhenjiang/address/town/query/1'

**原因 :** 但若出现方法重载的情况，则可能会出问题，及两条url链接相同

**解决 :** 修改url的连接

***

### 无法加载配置类

**问题 :** 配置了`@Configuration`无法生效

**原因 :** 不再springboot的基包中

**解决 :** 

1. 如果 ServerConfig不再springboot的基类包扫描中,需要在META-INF/spring.factories中配置

   ```properties
   org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
     com.hedian.cas.config.SpringConfig
   ```

`META-INF/spring.factories 和configration 区别`

>  `@Configuration`需要在springbootapplication的基类包下  

> `META-INF/spring.factories`  不需要在springbootapplication的基类包下

***



## 常用

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