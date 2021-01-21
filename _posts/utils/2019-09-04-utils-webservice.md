---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: webservice之axis
category: axis
tags: [utils,axis]
excerpt: webservice之axis根据wsdl生成客户端和服务端
keywords: carlme,superwang,superwangcarl,carl,卡尔米,axis,utils
---

## 简介

webSerivce虽然是一个比较老的跨语言交互接口,但是现在还是需要了解的,毕竟好多政府企业还在用,最早接触webService还是在2016那会和广电对接视频接口的时候用过axis1.4的webService,之后又和内蒙那边对接过2.x的axis,由于一直没有做总结,所以导致每次用的时候都需要去翻下以前的使用流程.毕竟这玩意也不是经常用到,而且使用的流程也是比较复杂,所以在此做下总结

## 前期准备

**工具** : SoapUI 5.3.0  

​	   axis1.4压缩包 官网下载  [直接下载]({{site.downcdn}}/download/axis-bin-1_4.zip)

**文档** : 所需的wsdl文件

## 项目代码

[**Axis_Client_Server_Generate**](https://github.com/SuperWangCarl/Axis_Client_Server_Generate)

## 生成

- 根据wsdl创建项目

  ![img](../../assets/images/blog/2019/20190904174629.jpg)

- 关联axis工具

  ![img](../../assets/images/blog/2019/20190904181731.jpg)

### 生成客户端

- 选择生成客户端

  ![img](../../assets/images/blog/2019/20190904181826.jpg)

- 查看

  ![img](../../assets/images/blog/2019/20190904181925.jpg)

### 生成传统服务端

- 选择生成服务端

  ![img](../../assets/images/blog/2019/20190904182026.jpg)

- 查看

  此处包含`deploy.wsdd`和`undeploy.wsdd`后面要用到

  ![img](../../assets/images/blog/2019/20190904182154.jpg)

- 使用eclipse创建一个空的Web项目

  - 创建项目

    ![img](../../assets/images/blog/2019/20190905130438.jpg)

  - 指定项目名

    ![img](../../assets/images/blog/2019/20190905130513.jpg)

  - 指定class编译输出目录 `WebContent\WEB-INF\classes`

    ![img](../../assets/images/blog/2019/20190905130607.jpg)

  - 完成

    ![img](../../assets/images/blog/2019/20190905130721.jpg)

  - 导入依赖axis的lib包

    ![img](../../assets/images/blog/2019/20190905141537.jpg)

  - 导入用soapui生成的java文件`包名错误时修改成一致即可`

    ![img](../../assets/images/blog/2019/20190905141911.jpg)

  - 修改deploy.wsdd的包名

    ![img](../../assets/images/blog/2019/20190905144515.jpg)

  - 拷贝axis中的web.xml文件到项目目录下

    ![img](../../assets/images/blog/2019/20190905143221.jpg)

  - 发布项目到tomcat

    ![img](../../assets/images/blog/2019/20190905143246.jpg)

  - 成功

    ![img](../../assets/images/blog/2019/20190905143330.jpg)

  - 截至为此完成基础的服务端,下面需要根据wsdl生成web.xml

- 生成server-config文件

  - 编写bat脚本

    ```bat
    @echo off
    echo "正在根据deploy.wsdd发布服务..."
    set AXIS_HOME=D:/OpenSource/axis1.4
    set AXIS_LIB=%AXIS_HOME%\lib
    set AXISCLASSPATH=%AXIS_LIB%\axis.jar;%AXIS_LIB%\commons-discovery-0.2.jar;%AXIS_LIB%\commons-logging-1.0.4.jar;%AXIS_LIB%\jaxrpc.jar;%AXIS_LIB%\saaj.jar;%AXIS_LIB%\log4j-1.2.8.jar;%AXIS_LIB%\wsdl4j-1.5.1.jar
    :: 访问wsdl  
    :: http://localhost:8080/admin_education/servlet/AxisServlet  
    :: 之后跳转到 --> http://localhost:8080/admin_education/services/notifyReq?wsdl
    java -cp %AXISCLASSPATH% org.apache.axis.client.AdminClient -lhttp://localhost:8080/notify/services deploy.wsdd
    pause
    ```

  - 运行bat脚本

    将`deploy.wdss`和`undeploy.wsdd`拷贝到WEB-INF目录下

    将上面的代码写入新建文件`generate-config.bat`,双击运行该文件

    ![img](../../assets/images/blog/2019/20190905144750.jpg)

  - 查看生成的server-config.wsdd文件

    ![img](../../assets/images/blog/2019/20190905144831.jpg)

  - 刷新可以可以查看到生成的服务端

    ![img](../../assets/images/blog/2019/20190905144900.jpg)

### 生成springboot服务端

- 新建springboot的web项目

  直接下一步,此处不细说

  ![img](../../assets/images/blog/2019/20190905150148.jpg)

- 在pom.xml文件中导入依赖

  ```xml
  <dependency>
  	<groupId>org.apache.axis</groupId>
  	<artifactId>axis</artifactId>
  	<version>1.4</version>
  </dependency>

  <dependency>
  	<groupId>axis</groupId>
  	<artifactId>axis-jaxrpc</artifactId>
  	<version>1.4</version>
  </dependency>

  <dependency>
  	<groupId>commons-discovery</groupId>
  	<artifactId>commons-discovery</artifactId>
  	<version>0.2</version>
  </dependency>
  <dependency>
  	<groupId>wsdl4j</groupId>
  	<artifactId>wsdl4j</artifactId>
  	<version>1.6.3</version>
  </dependency>
  ```

- 导入上一步生成的代码到该项目中

- 在resources下新建WEB-INF,将上一步生成的`server-config.wsdd`文件拷贝到其中

  ![img](../../assets/images/blog/2019/20190905150932.jpg)

- 用jar启动需要手动编写 EngineConfigurationFactoryServlet.java类

  ![img](../../assets/images/blog/2019/20190905150953.jpg)

- controller使用注册配置的方式

  ![img](../../assets/images/blog/2019/20190905151041.jpg)

- 访问后效果相同

  ![img](../../assets/images/blog/2019/20190905151324.jpg)

## 使用

### 客户端

创建对象调用即可

![img](../../assets/images/blog/2019/20190905153200.jpg)

`example`

```java
CSPRequestService service = new CSPRequestServiceLocator();
					CtmsSoapBindingStub stub =(CtmsSoapBindingStub) service.getctms();
					//CtmsSoapBindingStub stub = (CtmsSoapBindingStub) service.getctms(url);
					CSPResult csp=stub.execCmd(Constants.CPID, Constants.LSPID, item_id, Constants.LOCAL_URL + "injectXML/" + item_id+"_"+action+ ".xml");
```

### 服务端

只需在这个`CtmsSoapBindingImpl`类中编写我们的业务逻辑即可

![img](../../assets/images/blog/2019/20190905153108.jpg)



## 参考资料

[[Java] Webservice之定制发布WSDD教程 （二）](https://blog.csdn.net/qq_14852397/article/details/46385713?locationNum=7&fps=1)

[根据wsdl反向生成webservice服务端](https://www.cnblogs.com/xijin-wu/p/6890116.html)

[根据wsdl 利用axis1.4的WSDL2Java工具生成服务端和客户端代码](https://blog.csdn.net/kdpujie/article/details/8445261)