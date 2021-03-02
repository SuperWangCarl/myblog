---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 多数据源切换--Spring
category: java
tags: [java]
excerpt: 多数据源切换--Spring
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,springboot,java
---

## 简介

多数据源切换--Spring

## 代码地址

[GitHub代码地址](https://github.com/SuperWangCarl/spring-boot-examples/tree/master/data-multidatasources/data-multi-spring)

## 配置多数据源

1. 添加测试数据

   ![img]({{ site.cdn }}assets/images/blog/2019/20190606133122.png)

2. 配置properties

   ```properties
   cpool.initialPoolSize=20
   cpool.minPoolSize=20
   cpool.maxPoolSize=200
   cpool.acquireIncrement=20
   cpool.maxStatements=100
   cpool.idleConnectionTestPeriod=120
           
   jdbc.driver=com.mysql.jdbc.Driver
   #数据库01
   jdbc.master.url=jdbc:mysql://localhost:3306/test01?useUnicode=true&amp;characterEncoding=utf-8
   jdbc.master.username=root
   jdbc.master.password=123456

   #数据库02
   jdbc.slave.url=jdbc:mysql://localhost:3306/test02?useUnicode=true&amp;characterEncoding=utf-8
   jdbc.slave.username=root
   jdbc.slave.password=123456
   ```

3. 配置两个数据源

   ![img]({{ site.cdn }}assets/images/blog/2019/20190606103815.png)

4. 配置数据源的切换获取类`DbContextHolder`

   ![img]({{ site.cdn }}assets/images/blog/2019/20190606103544.png)

5. 扩展Spring的`AbstractRoutingDataSource`抽象类，实现动态数据源。

   ![img]({{ site.cdn }}assets/images/blog/2019/20190606103237.png)

6. 配置多数据源

   ![img]({{ site.cdn }}assets/images/blog/2019/20190606103831.png)

7. 使用动态数据源

   >  例子中DynamicDataSource是继承与AbstractRoutingDataSource，而AbstractRoutingDataSource又是继承于org.springframework.jdbc.datasource.AbstractDataSource，AbstractDataSource实现了统一的DataSource接口，所以DynamicDataSource同样可以当一个DataSource使用。

    在Spring的JdbcTemplate使用动态数据源的配置示例`此处报红是应为dao中没有写setter方法`

   ![img]({{ site.cdn }}assets/images/blog/2019/20190606104917.png)

   在ORM框架Hibernate中的使用配置示例:

   ![img]({{ site.cdn }}assets/images/blog/2019/20190606104944.png)

8. 事务管理

   > 使用动态数据源的时候，可以看出和使用单数据源的时候相比，在使用配置上几乎没有差别，在进行性事务管理配置的时候也没有差别

   使用Spring的JdbcTemplate的事务管理配置示例

   ![img]({{ site.cdn }}assets/images/blog/2019/20190606105938.png)

   使用Hibernate时的事务管理配置示例

   ![img]({{ site.cdn }}assets/images/blog/2019/20190606105957.png)

9. 动态数据源的管理控制

   手动控制：

   ![img]({{ site.cdn }}assets/images/blog/2019/20190606132633.png)

   AOP的控制方式：

   ![img]({{ site.cdn }}assets/images/blog/2019/20190606134901.png)

   hibernateSessionFactory方式:

   ![img]({{ site.cdn }}assets/images/blog/2019/20190606132813.png)

## 总结

 通过扩展Spring的AbstractRoutingDataSource可以很好的实现多数据源的rout效果，而且对扩展更多的数据源有良好的伸缩性，只要增加数据源和修改DynamicDataSource的targetDataSources属性配置就好。在数据源选择控制上，可以采用手动控制(业务逻辑并不多的时候)，也可以很好的用AOP的@Aspect在Service的入口加入一个切面@Pointcut，在@Before里判断JoinPoint的类容选定特定的数据源。

## 参考链接

[Spring多数据源的配置和使用](https://blog.csdn.net/rj042/article/details/21654627)

[Spring整合Hibernate的时候使用hibernate.cfg.xml](https://www.cnblogs.com/JamKong/p/4548785.html)

[spring中使用@Resource进行注入为什么可以不用set方法](https://q.cnblogs.com/q/80710/)