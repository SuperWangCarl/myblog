---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 前后端分离项目域名端口不同集成cas客户端
category: sso
tags: [sso,springboot]
excerpt: 前后端分离域名端口不同集成cas客户端
keywords: carlme,superwang,superwangcarl,carl,卡尔米,单点登录客户端集成,cas,client,springboot,前后端分离
---

## 1. 简介

此篇介绍前后端分离项目集成CAS客户端,源码[前端地址](https://github.com/SuperWangCarl/cas-clie,nt/tree/master/sso-client-springbook-head),[后端地址](https://github.com/SuperWangCarl/cas-client/tree/master/sso-client-springboot-back)

## 2. 步骤

### 1. 配置hosts

由于CAS是基于cooke和session的所以我们需要配置域名映射

客户端集成分为五种情况 此篇介绍集成 `前后端分离项目集成CAS客户端`
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

### 2. 先看个流程图

![img](../../assets/images/blog/2019/20190412152817.png)

### 3. 前端设置

`需要设置前后端允许跨域,并且设置 withCredentials = true 保证sessionid的唯一性`

#### 1. 前端代码 (Jquery 仅供参考)

```javascript
$(function () {
    $.ajax({
        type: "GET",
        url: "http://www.clientback.com:8014/user/gettoken",
        dataType: "json",
		//需要配置 withCredentials = true
		xhrFields: {withCredentials: true},
        success: function(data){
			console.log(JSON.stringify(data));
			if(data.urlToRedirectTo){
			window.location.href=data.urlToRedirectTo
			}
        }
    });
});
```

### 4. 后端设置

#### 1. 后端springboot配置 允许跨域

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

	/**
	 * 配置 可以跨域
	 * @param registry
	 */
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedOrigins("*")
				.allowedMethods("GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS")
				.allowCredentials(true).maxAge(3600);
	}
}
```

#### 2.在springboot的pom.xml添加配置

```xml
<!-- CAS 客户端-->
<dependency>
    <groupId>org.jasig.cas.client</groupId>
    <artifactId>cas-client-core</artifactId>
    <version>3.4.1</version>
</dependency>
<!--json库-->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.54</version>
</dependency>
```

#### 3.配置properties

在应用的配置文件中（application.properties）添加如下配置：

```properties
server.port=8014

# 填CAS服务器的前缀
cas.server-url-prefix=http://www.sso.com:8443/cas
# 填CAS服务器的登录地址
cas.server-login-url=http://www.sso.com:8443/cas/login
# 填客户端的后台地址
cas.client-host-url=http://www.clientback.com:8014
# 前台地址
cas.client-web-url=http://www.clientweb.com:8080
```

#### 4. 添加配置类,配置过滤器 监听器

详见代码`com.hedian.platform.bean.CasConfig`,`com.hedian.platform.config.ServerConfig`

#### 5. 添加过滤器

详见代码,此处讲些关键点

`这代码是复制了源码的验证过滤器稍微的改了下,将原来的重定向,改为向前台发送json数据,让前台重定向了.`

![img](../../assets/images/blog/2019/20190412154044.png)

![img](../../assets/images/blog/2019/20190412154650.png)

#### 6. 添加认证controller

`可有可无,看你们前端是否还需要token,其实应该不需要了`

```java
/**
 * 获取token用于前后端校验
 */
@GetMapping("/gettoken")
public Map<String, String> GetToken(HttpServletRequest  request) {
	HashMap<String, String> map = new HashMap<>();
	//获取登录的用户名
	String remoteUser = request.getRemoteUser();
	//取出登录的时间作为加密 密钥
	AttributePrincipal principal = (AttributePrincipal) request.getUserPrincipal();
	final Map attributes = principal.getAttributes();
	Object authenticationDate = attributes.get("authenticationDate");
	//使用登录的时间加密
	String dataTime = authenticationDate.toString();
	//给用户设置token
	map.put("token", "token加密后 自己实现");
	//向前端返回token
	return map;
}
```

## 3. 总结

前后端分离流程:

用户在浏览器中输入前端地址如:`www.example.com` 之后通过ajax想后台发送一个请求 如:`www.houtai.com/platform/user/login` 之后后台会返回一个json数据用于前端重定向

{

"flag":"redict",

"urlToRedirectTo":"`http://www.sso.com:8443/cas/login?service=http%3A%2F%2Fwww.zj.com%3A9015%2Fplatform%2Fuser%2Flogin`"

}

前端通过 urlToRedirectTo重定向到 SSO统一登录的地址

统一认证成功后会让浏览器携带ST重定向到后端的地址

后端地址中的过滤器验证回合SSO统一认证中心 一起验证ST时候有效

如果有效会重定向到我们在properties中配置的前端地址中