---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: CAS客户端 集成 x5
category: sso
tags: [sso,x5,cas]
excerpt: 比较老的一个项目,集成CAS客户端
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,sso,单点登录客户端集成,cas,client
---

## 1. 简介

最近接触了一个比较老的x5系统继承Cas,由于源码丢失,所以折腾了一天,各种反编译,之后总算解决了,还有点瑕疵,会弹出一个登录页面,后续在优化吧.是在不想在解除这种老系统了,纯粹的是浪费时间.

## 2. 步骤

### 1. 集成jar包

![img]({{site.cdn}}assets/images/blog/2019/20190412144536.png)

### 2. web.xml中集成单点登录的配置

详细教程可以看我的另外一篇博客,里面有各种场景的案例.传送门

```xml
 <filter>
    <filter-name>CAS Single Sign Out Filter</filter-name>
    <filter-class>org.jasig.cas.client.session.SingleSignOutFilter</filter-class>
    <init-param>
        <param-name>casServerUrlPrefix</param-name>
        <!-- SSO 服务端地址 https://ip:port/cas -->
        <param-value>https://www.sso.com:9012/cas</param-value>
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
        <!-- SSO 服务端登录地址 https://ip:port/cas/login -->
        <param-value>https://www.sso.com:9012/cas/login</param-value>
    </init-param>
    <init-param>
        <param-name>serverName</param-name>
        <!-- SSO 客户端地址 -->
        <param-value>http://www.commonweb.com:8080</param-value>
    </init-param>
</filter>

<filter>
    <filter-name>CAS Validation Filter</filter-name>
    <filter-class>org.jasig.cas.client.validation.Cas30ProxyReceivingTicketValidationFilter</filter-class>
    <init-param>
        <param-name>casServerUrlPrefix</param-name>
        <!-- SSO 服务端地址 https://ip:port/cas -->
        <param-value>https://www.sso.com:9012/cas</param-value>
    </init-param>
    <init-param>
        <param-name>serverName</param-name>
        <!-- SSO 客户端地址 -->
        <param-value>http://www.commonweb.com:8080</param-value>
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

	  <filter>
    <filter-name>CAS httpervletRequest Wrapper Filter</filter-name>
    <filter-class>org.jasig.cas.client.util.HttpServletRequestWrapperFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>CAS httpervletRequest Wrapper Filter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

### 3. 修改login的登录认证

```java
private ActionResult ntLogin(String username,HttpServletRequest request){
	String language = "zh_CN";
	Action action = new Action();
	action.setProcess("/SA/OPM/system/systemProcess");
	action.setActivity("mainActivity");
	action.setName("ntLoginAction");
	action.setParameter("name", username);
	action.setParameter("loginDate", new java.sql.Date(System.currentTimeMillis()));
	action.setParameter("ip", "127.0.0.1");
	action.setParameter("options", new HashMap<String, Object>());
	action.setParameter("lang", language);
	
	String str2 = "123456";
	String str3 = "127.0.0.1";
	try {
		 ActionResult ar = ActionEngine.login3(username, ActionUtils.md5(str2), str3, "zh_CN", new java.sql.Date(System.currentTimeMillis()), getOptions(request), "application/json", null);
		//ActionResult ar = ActionEngine.invokeActions(JustepConfig.getBusinessServer() + "/login2", null, action.asXML().getBytes("UTF-8"), 
		//		null, ActionUtils.XML_CONTENT_TYPE, ActionUtils.XML_CONTENT_TYPE, 
		//		null, language, "post", null);
		if (ar.isSuccess()){
			return ar;
		}else{
			throw new RuntimeException(ar.getMessage());
		}
		
	} catch (Exception e) {
		//logger.error(e.getMessage()+"", e);
		throw new RuntimeException(e.getMessage()+"", e);
	}
	
}
	
private static HashMap<String, Object> getOptions(HttpServletRequest paramHttpServletRequest)
 {
   HashMap localHashMap = new HashMap();
   Enumeration localEnumeration = paramHttpServletRequest.getParameterNames();
   while (localEnumeration.hasMoreElements())
   {
     String str1 = (String)localEnumeration.nextElement();
     if (str1.startsWith("options["))
     {
       String str2 = str1.substring(str1.indexOf("[") + 1, str1.indexOf("]"));
       String str3 = paramHttpServletRequest.getParameter(str1);
       localHashMap.put(str2, str3);
     }
   }
   if (!localHashMap.containsKey("DeviceType"))
     localHashMap.put("DeviceType", NetUtils.getDeviceType(paramHttpServletRequest));
   if (!localHashMap.containsValue("OperatingSystem"))
     localHashMap.put("OperatingSystem", NetUtils.getOperatingSystem(paramHttpServletRequest).toString());
   return localHashMap;
 }
```

### 4. 将登录认证,改为我们写的代码

```java
//ActionResult result = LoginAction.execute(request);
ActionResult result = ntLogin("system",request);
```

### 5. 修改登录也的login.js

让页面加载后不用点击登录按钮直接跳转到首页

```}javascript
Model.prototype.modelLoad = function(event){
this.login();
}
```

## 3. 总结

代码虽然改的不多,但确实折腾了一天,总结下,还是这个老的系统不熟悉,里面各种初始化和认证的.网上的资料还是不全面的.虽然新知识接触多了但是老知识还是不能丢下.

里面用的cas客户端还是使用的`cas-client-core-3.4.1.jar`,没有使用参考资料中的`cas-client`因为参考资料中的jar包只支持`https`的请求,并不支持`http`的请求

## 4. 参考资料

[x5继承CAS](http://bbs.wex5.com/forum.php?mod=viewthread&tid=64607&page=1#pid165198442)

