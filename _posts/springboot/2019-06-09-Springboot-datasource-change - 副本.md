---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 多数据源切换--Springboot
category: java
tags: [java]
excerpt: 多数据源切换--Springboot
keywords: carlme,superwang,superwangcarl,carl,卡尔米,springboot,java
---

## 简介

多数据源切换--Springboot--mybatis.本文介绍两种数据源的配置方式. 分包和基于aop的方式

## 代码地址

AOP : [GitHub代码地址](https://github.com/SuperWangCarl/spring-boot-examples/tree/master/data-multidatasources/data-multi-mybatis-aop)

分包 : [GitHub代码地址](https://github.com/SuperWangCarl/spring-boot-examples/tree/master/data-multidatasources/data-multi-mybatis-package)

## mybatis Aop

`和spring的多数据源配置原理一样不过就是把xml配置改为的java配置`

1. 配置pom.xml

2. 添加测试数据

   ![img]({{site.cdn}}/assets/images/blog/2019/20190606133122.png)

3. 配置properties

   ![img]({{site.cdn}}/assets/images/blog/2019/20190610153505.png)

4. 配置数据源

   ![img]({{site.cdn}}/assets/images/blog/2019/20190610175603.png)

5. 配置数据源的切换获取类`DbContextHolder`

   ![img]({{site.cdn}}/assets/images/blog/2019/20190606103544.png)

6. 扩展Spring的`AbstractRoutingDataSource`抽象类，实现动态数据源。

   ![img]({{site.cdn}}/assets/images/blog/2019/20190606103237.png)

7. 配置 使用哪个数据源的注解 和AOP

   ![img]({{site.cdn}}/assets/images/blog/2019/20190610185705.png)

8. 在mapper上添加注解

   ![img]({{site.cdn}}/assets/images/blog/2019/20190610185906.png)

9. 测试

   ![img]({{site.cdn}}/assets/images/blog/2019/20190610185939.png)

## mybatis 分包

1. pom.xml

   ![img]({{site.cdn}}/assets/images/blog/2019/20190610153447.png)

2. 添加测试数据

   ![img]({{site.cdn}}/assets/images/blog/2019/20190606133122.png)

3. 配置properties

   ![img]({{site.cdn}}/assets/images/blog/2019/20190610153505.png)

4. 配置数据源01

   ![img]({{site.cdn}}/assets/images/blog/2019/20190610153528.png)

5. 配置数据源02

   ![img]({{site.cdn}}/assets/images/blog/2019/20190610153557.png)

6. 配置mapper01 接口 和 xml

   ![img]({{site.cdn}}/assets/images/blog/2019/20190610153626.png)

7. 配置mapper02 接口 和 xml

   ![img]({{site.cdn}}/assets/images/blog/2019/20190610153650.png)

8. 配置测试service

   ![img]({{site.cdn}}/assets/images/blog/2019/20190610153716.png)

9. 测试

   ![img]({{site.cdn}}/assets/images/blog/2019/20190610153756.png)

10. 查看插入结果

## FAQ

在整理问题前,先总结下mybatis数据源注入的流程

1. sping加载时通过`MapperScan`注解扫描,需要注入的接口bean,然后通过动态代理的方式实例化接口bean
2. 在实例化接口bean时,会通过`Maperscan`中配置的`sqlSessionFactoryRef`来确定使用那个sessionfacory,如果没有配置则会寻找sessionFactory的工厂bean,如果此时存在多或者不存在则报错,`存在多个时需要通过@Primary注解来定义使用哪个factory`

***

**问题 :** 

![img]({{site.cdn}}/assets/images/blog/2019/20190610150114.png)

**原因 :** 找到了两个`sqlSessionFactory`

**参考链接 :** 

**解决 :** 添加`Primary`注解

![img]({{site.cdn}}/assets/images/blog/2019/20190610150147.png)

***

**问题 :** 

![img]({{site.cdn}}/assets/images/blog/2019/20190610150315.png)

**原因 :** xml文件没有添加到,相应的解析路径,或者包名配置错误

**参考链接 :** 

**解决 :** 

![img]({{site.cdn}}/assets/images/blog/2019/20190610150705.png)

***

无法获取到方法上自定义的注解

**问题 :** 使用自定义注解getAnnotation无法获取到

**原因 :** 创建注解时没有添加元注解

**参考链接 :** 

**解决 :** 

![img]({{site.cdn}}/assets/images/blog/2019/20190610174837.png)

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD,ElementType.TYPE})
@Documented
```

## 参考链接

[springboot-mybatis多数据源的两种整合方法](https://blog.csdn.net/tuesdayma/article/details/81081666)

[springboot + mybatis + druid + 多数据源](https://blog.csdn.net/qq_35206261/article/details/81778224#t7)

[Spring Boot多数据源配置与使用](http://blog.didispace.com/springbootmultidatasource/)

[spring aop获取目标对象的方法对象（包括方法上的注解）](https://www.cnblogs.com/qiumingcheng/p/5923928.html)

[解决 getAnnotation为null的坑](https://blog.csdn.net/qq_20960159/article/details/86600146)

