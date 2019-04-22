---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: CAS服务端 基于ip
category: sso
tags: [sso,x5,cas]
excerpt: CAS服务端基于ip的认证
keywords: carlme,superwang,superwangcarl,carl,卡尔米,sso,单点登录服务端,cas,client
---

## 1. 简介

之前做了一个关于cas的单点登录,后面上面要求将基于域名的改成基于ip的单点登录,因为在内网里面用域名不方便,如果搭建dns的话也太麻烦了

刚拿到这个需求的时候果断拒绝了,因为当初感觉sso是基于cookie认证的,而cookie是基于域名来绑定的.

后来查看了google浏览器的cookie的存储,发现以前的记忆是错误的.里面也可以基于ip来绑定cookie,于是就有了这篇文章

![img]({{site.cdn}}/assets/images/blog/2019/20190422185743.png)

## 2. 步骤

### 配置https

`当然不配置也是可以的,直接使用http,我这边做了http和https都支持的`

生成证书

```shell
#当前目录下生成keystore 需要填写正确的域名
keytool -genkey -alias hedian -keyalg RSA -keysize 1024 -keypass 123456 -storepass 123456  -dname "CN=192.168.1.172,OU=csoa,O=csoa,L=FZ,ST=FZ,C=CN" -ext san=ip:192.168.1.172 -validity 3600 -keystore ./sso.keystore
#通过 keystore生成cer
keytool -export -alias hedian -storepass 123456 -file ./sso.cer -keystore  ./sso.keystore
#将生成cer导入jdk中
keytool -import -alias hedian -keystore D:\Develop\jdk1.8.0_111\jre\lib\security\cacerts -file ./sso.cer -trustcacerts
```

将证书上传到tomcat更目录

![img]({{site.cdn}}/assets/images/blog/2019/20190422190321.png)

配置tomcat的server.xml

```xml
<!-- http -->
<Connector port="9013" protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="9012" URIEncoding="UTF-8"/>
<!-- https-->
<Connector port="9012" protocol="org.apache.coyote.http11.Http11NioProtocol"
           maxThreads="150" SSLEnabled="true">
<SSLHostConfig>
    <Certificate certificateKeystoreFile="/application/apps/tomcat_cas_server/sso.keystore"
                 certificateKeystorePassword="123456"
                 type="RSA"/>
</SSLHostConfig>
</Connector>
```

***

`那么客户端就可以直接使用http或者https访问了`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app version="2.4" xmlns="http://java.sun.com/xml/ns/j2ee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd">

    <filter>
        <filter-name>CAS Single Sign Out Filter</filter-name>
        <filter-class>org.jasig.cas.client.session.SingleSignOutFilter</filter-class>
        <init-param>
            <param-name>casServerUrlPrefix</param-name>
            <!-- SSO 服务端地址 http://ip:port/cas -->
            <param-value>http://192.168.1.172:9013/cas</param-value>
        </init-param>
    </filter>

    <listener>
        <listener-class>org.jasig.cas.client.session.SingleSignOutHttpSessionListener</listener-class>
    </listener>

    <filter>
        <filter-name>CAS Authentication Filter</filter-name>
        <filter-class>org.jasig.cas.client.authentication.AuthenticationFilter</filter-class>
        <init-param>
            <param-name>casServerLoginUrl</param-name>
            <!-- SSO 服务端登录地址 http://ip:port/cas/login -->
            <param-value>http://192.168.1.172:9013/cas/login</param-value>
        </init-param>
        <init-param>
            <param-name>serverName</param-name>
            <!-- SSO 客户端地址 -->
            <param-value>http://192.168.1.135:8012/8012</param-value>
        </init-param>
    </filter>

    <filter>
        <filter-name>CAS Validation Filter</filter-name>
        <filter-class>org.jasig.cas.client.validation.Cas30ProxyReceivingTicketValidationFilter</filter-class>
        <init-param>
            <param-name>casServerUrlPrefix</param-name>
            <!-- SSO 服务端地址 http://ip:port/cas -->
            <param-value>http://192.168.1.172:9013/cas</param-value>
        </init-param>
        <init-param>
            <param-name>serverName</param-name>
            <!-- SSO 客户端地址 -->
            <param-value>http://192.168.1.135:8012/8012</param-value>
        </init-param>
        <init-param>
            <param-name>redirectAfterValidation</param-name>
            <param-value>true</param-value>
        </init-param>
        <init-param>
            <param-name>useSession</param-name>
            <param-value>true</param-value>
        </init-param>
        <init-param>
            <param-name>authn_method</param-name>
            <param-value>mfa-duo</param-value>
        </init-param>
    </filter>

    <filter>
        <filter-name>CAS httpervletRequest Wrapper Filter</filter-name>
        <filter-class>org.jasig.cas.client.util.HttpServletRequestWrapperFilter</filter-class>
    </filter>

    <filter-mapping>
        <filter-name>CAS Single Sign Out Filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <filter-mapping>
        <filter-name>CAS Validation Filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <filter-mapping>
        <filter-name>CAS Authentication Filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <filter-mapping>
        <filter-name>CAS httpervletRequest Wrapper Filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <welcome-file-list>
        <welcome-file>
            index.jsp
        </welcome-file>
    </welcome-file-list>
</web-app>
```

> 另外提一句,配置https或者http我们直接在tomcat里面配置就可以了,不用在cas的properties中配置了,我们只需要将cas打成war包部署到tomcat里面就可以了

## 3. 总结

遇到问题不要`急于否定`,大部分可能是自己的认知不足,或者以前的认知有错误,即使以前的认知是对的,但是这个技术可能更新了.碰到问题应该多查些资料,查点比较新的资料

## 4. 参考资料

[cas 配置https改为ip而不是使用域名](https://blog.csdn.net/qq_33873431/article/details/79354148)

[IP地址开启https](https://blog.csdn.net/gui66497/article/details/79289047)