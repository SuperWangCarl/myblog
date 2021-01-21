---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: Springboot集成Mybatisplus
category: java
tags: [springboot]
excerpt: Springboot集成Mybatisplus
keywords: carlme,superwang,superwangcarl,carl,卡尔米,springboot,java,Mybatisplus
---

## 简介

mybatisplus操作数据库还是比较方便的,性能也没有什么损耗.此篇讲解mybatisplus的集成和MP代码生成器

## 代码地址

[GitHub代码地址](https://github.com/SuperWangCarl/spring-boot-examples/tree/master/data-mybatis-plus)

## 集成Mybatis-Plus

1. 导入pom.xml

   ![img]({{site.cdn}}assets/images/blog/2019/20190606150331.png)

2. 配置propeties

   ![img]({{site.cdn}}assets/images/blog/2019/20190606150408.png)

3. 启动类上配置MapperScan

   ![img]({{site.cdn}}assets/images/blog/2019/20190606150434.png)

4. 导入自动生成代码模版(自己写的,可省略)

   ![img]({{site.cdn}}assets/images/blog/2019/20190606150533.png)

5. mybatis-plus自动生成代码(`MP`)

   ![img]({{site.cdn}}assets/images/blog/2019/20190606151525.png)

6. 将模版导入项目中

   ![img]({{site.cdn}}assets/images/blog/2019/20190606151631.png)

7. 数据库中导入数据

   ![img]({{site.cdn}}assets/images/blog/2019/20190606151718.png)

8. 配置maven将xml可编译带class中

   ![img]({{site.cdn}}assets/images/blog/2019/20190606152630.png)

9. 测试

   ![img]({{site.cdn}}assets/images/blog/2019/20190606151735.png)

## 引用

### MP 和MBG 生成器的对比

- MP 提供了大量的自定义设置，生成的代码完全能够满足各类型的需求

- MP 的代码生成器 和 Mybatis MBG 代码生成器

  MP 的代码生成器都是基于 java 代码来生成。 MBG 基于 xml 文件进行代码生成

  MyBatis 的代码生成器可生成: 实体类、 Mapper 接口、 Mapper 映射文件

  MP 的代码生成器可生成: 实体类(可以选择是否支持 AR)、 Mapper 接口、 Mapper 映射

  文件、 Service 层、 Controller 层.

- 表及字段命名策略选择

  在 MP 中，我们建议数据库表名 和 表字段名采用驼峰命名方式， 如果采用下划
  线命名方式 请开启全局下划线开关，如果表名字段名命名方式不一致请注解指定，我
  们建议最好保持一致。
  这么做的原因是为了避免在对应实体类时产生的性能损耗，这样字段不用做映射就能直
  接和实体类对应。当然如果项目里不用考虑这点性能损耗，那么你采用下滑线也是没问
  题的，只需要在生成代码时配置 dbColumnUnderline 属性就可以 

