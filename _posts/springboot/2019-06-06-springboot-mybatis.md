---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: Springboot集成Mybatis
category: java
tags: [springboot]
excerpt: Springboot集成Mybatis
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,springboot,java,Mybatisplus
---

## 简介

使用springboot可以方便的集成mybatis

## 代码地址

[GitHub代码地址](https://github.com/SuperWangCarl/spring-boot-examples/tree/master//data-mybatis)

## 集成Mybatis-Plus

1. 导入pom.xml

   ![img]({{site.cdn}}assets/images/blog/2019/20190606163506.png)

2. 配置propeties

   ![img]({{site.cdn}}assets/images/blog/2019/20190606163607.png)

3. 配置数据源

   ![img]({{site.cdn}}assets/images/blog/2019/20190606163916.png)

4. 配置mybatis全局配置文件

   两种方式(`xml配置`,`注解配置`)

   ![img]({{site.cdn}}assets/images/blog/2019/20190606164038.png)

5. 配置bean

   ![img]({{site.cdn}}assets/images/blog/2019/20190606164109.png)

6. 配置mapper

   ![img]({{site.cdn}}assets/images/blog/2019/20190606164206.png)

7. 配置映射xml(使用注解写sql语句折不需要)

   ![img]({{site.cdn}}assets/images/blog/2019/20190606164235.png)

8. 启动类上配置MapperScan,扫描mapper的bean

   两种方式(`在每个mapper上写@Mapper注解`,`springboot启动类上统一配置`)

   ![img]({{site.cdn}}assets/images/blog/2019/20190606163642.png)

9. 数据库中导入数据

   ![img]({{site.cdn}}assets/images/blog/2019/20190606151718.png)

10. 测试

  ![img]({{site.cdn}}assets/images/blog/2019/20190606164335.png)

11. 结果

    ![img]({{site.cdn}}assets/images/blog/2019/20190606164410.png)


## 参考链接
