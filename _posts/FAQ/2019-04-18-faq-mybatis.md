---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: mybatis采坑总结(持续更新)
category: FAQ
tags: [mybatis,faq]
excerpt: mybatis采坑总结(持续更新)
keywords: carlme,superwang,superwangcarl,carl,卡尔米,mybatis,FAQ
---



## 简介

此篇主要介绍在平常工作中的有关mybatis遇到的问题

## 问题

### mybatis参数

**问题 :** 接口中参数为String类型,xml文件中不可以直接引用,要添加`@Param`注解

**原因 :** String不是基本类型,如果直接使用的话,mybatis会去执行get方法,所以报错,要是int等基本类型可以不添加`@Param`注解

**解决 :** 添加`@Param`注解

***

### plus的批量插入和更新异常

**问题 :** mybatisplus 使用 insertOrUpdateBatch时提示重复主键

**原因 :** 我配置了逻辑删除,然后这条数据是被逻辑删除了,但是数据库中还有,所以mybatisplus更新后为0,然后就执行了插入操作提示了重复主键

**解决 :** 取消逻辑删除 `或者` 自己在xml文件中写更新逻辑

***

### Invalid bound statement (not found)

[参考](https://www.cnblogs.com/liaojie970/p/8034525.html)

**问题 :** Invalid bound statement (not found)错误的可能原因

**原因 :** 无法加载到该接口对应的mapper文件,或者该mapper文件中没有时间接口中的该方法

**解决 :** 

1. mapper文件没有编译到class中

   ```xml
   <build>
       <resources>
           <!-- 若不添加,则非java文件不会编译入项 -->
           <resource>
               <directory>${basedir}/src/main/docker</directory>
           </resource>
           <resource>
               <directory>${basedir}/src/main/java</directory>
               <includes>
                   <include>**/*.properties</include>
                   <include>**/*.xml</include>
               </includes>
           </resource>
           <resource>
               <directory>${basedir}/src/main/resources</directory>
           </resource>
       </resources>
   </build>
   ```

2. 检查xml文件所在package名称是否和Mapper interface所在的包名

   ```xml
   <!-- mapper的namespace写的不对！！！注意系修改。 -->
   <mapper namespace="me.tspace.pm.dao.UserDao">
   ```

3. UserDao的方法在UserDao.xml中没有，然后执行UserDao的方法会报此错

4. UserDao的方法返回值是List<User>,而select元素没有正确配置ResultMap,或者只配置ResultType!

5. 如果你确认没有以上问题,请任意修改下对应的xml文件,比如删除一个空行,保存.问题解决

6. 看下mapper的XML配置路径是否正确

   ```properties
   mybatis-plus.mapper-locations[0]=classpath*:/com/hedian/zhenjiang/persistence/mapper/xml/*Mapper.xml
   mybatis-plus.mapper-locations[1]=classpath*:/com/hedian/platform/persistence/mapper/xml/*Mapper.xml
   ```

   ![img](../../assets/images/blog/2019/20190419132545.png)

***

## 技巧

### mybatisplus的and

mybatisplus的之间的条件连接不添加and也可以

```java
.eq("","")
.eq("","")
.eq("","")
```

### Mybatis 需要查询返回List

```xml
<select id="getByIds"  parameterType="java.lang.String"  resultType="java.util.List">
  SELECT l.label_name FROM label l WHERE l.id IN(#{labelIds})
</select>
<!-- 返回值定义为 resultType="java.util.List"会报错，需要将返回值改为：　　resultType="java.lang.String"<br><br>为啥一直没搞清楚
 -->
```



