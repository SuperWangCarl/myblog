---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: Spring-session-data-redis采坑
category: FAQ
tags: [faq,springboot]
excerpt: Spring-session-data-redis在chrome跨域下的丢失cookie
keywords: carlme,superwang,superwangcarl,carl,卡尔米,FAQ,springboot
---

## 简介

近期在搞redis的session共享,以前用的都是tomcat的session共享,网上应该只有tomcat7的后来根据源码,修改城了tomcat8的源码实现了session共享,并完成了上限,日活100多万的UV下是没问题,

这次由于前后端分离了,没有使用tomcat所以就使用了spring-session-data-redis(以下简称`ssdr`)来实现sessiong共享,其实分布式下的session共享和单点登录还有好多方式,以后可以有空的时候在说说

![img]({{site.cdn}}assets/images/blog/2019/20190909175739.jpg)

写这篇博文主要记录下,此次遇到的问题和解决流程,为以后做下总结,毕竟折腾了大半个下午

## 解决方案

`先记录解决方案`

1. 配置后端允许跨域

   ```java
   @Configuration
   public class WebMvcConfig implements WebMvcConfigurer {

   	/**
   	 * 配置 可以跨域
   	 *
   	 * @param registry
   	 */
   	@Override
   	public void addCorsMappings(CorsRegistry registry) {
   		registry.addMapping("/**")
   				.allowedOrigins("*") //此处不是允许 * 而是允许指定的来访
   				.allowedMethods("GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS")
   				.allowCredentials(true)
   				.maxAge(3600);
   	}
   }
   ```

2. 配置前端允许跨域

   ```javascript
   xhr.withCredentials = true;
   ```

3. 配置cookie禁止`sameSite`

   ```java
   @Bean
   public CookieSerializer httpSessionIdResolver() {
   	DefaultCookieSerializer cookieSerializer = new DefaultCookieSerializer();
       //设置cookie名称,默认JSESSIONID
   	cookieSerializer.setCookieName("TOKEN");
   	//禁止客户端修改
   	cookieSerializer.setUseHttpOnlyCookie(false);
   	//不使用 sameSite
   	cookieSerializer.setSameSite(null);
   	return cookieSerializer;

   }
   ```

## 问题

`探索流程`

1. 非跨域下的 spring-session-data-redis

    在chrome和firefox下都会主动发送cookie

2. 跨域下的  spring-session-data-redis  

   在firefox可主动发送cookie 在chrome下不会主动发送cookie

### 探索流程1

开始认为是 ssdr的问题,毕竟第一印象不会认为是chrome和firefox浏览器的问题.

开始使用`fiddler`每次查看请求流程,发现每次的cookie的key都不相同,然后怀疑是ssdr每次生成的时候key不相同,所以重写了`org.springframework.session.web.http.DefaultCookieSerializer`这个类,之后发现还是没用

### 探索流程2

怀疑是chrome浏览器的问题,然后进行浏览器的设置

![img]({{site.cdn}}assets/images/blog/2019/20190911173722.jpg)

之后还是无效

### 探索流程3

无意中发现设置cookie的参数,有一个没见过

![img]({{site.cdn}}assets/images/blog/2019/20190911173943.jpg)

于是就进行了相关查询,范县果然是这个参数的问题,

![img]({{site.cdn}}assets/images/blog/2019/20190911174127.jpg)

取消掉就可以了,成功了~~~

1. 响应中让设置cookie

![img]({{site.cdn}}assets/images/blog/2019/20190911173802.jpg)

2. 请求头中携带cookie

   ![img]({{site.cdn}}assets/images/blog/2019/20190911173851.jpg)

## FQA

### session过期时间设置

spring boot autoconfig中有个类`RedisSessionConfiguration `

```java
@Configuration
@ConditionalOnMissingBean(SessionRepository.class)
@ConditionalOnBean({ RedisTemplate.class, RedisConnectionFactory.class })
@Conditional(SessionCondition.class)
class RedisSessionConfiguration {

   @Configuration
   public static class SpringBootRedisHttpSessionConfiguration
         extends RedisHttpSessionConfiguration {

      private SessionProperties sessionProperties;

      @Autowired
      public void customize(SessionProperties sessionProperties) {
         this.sessionProperties = sessionProperties;
         Integer timeout = this.sessionProperties.getTimeout();
         if (timeout != null) {
            setMaxInactiveIntervalInSeconds(timeout);
         }
         SessionProperties.Redis redis = this.sessionProperties.getRedis();
         setRedisNamespace(redis.getNamespace());
         setRedisFlushMode(redis.getFlushMode());
      }

   }

}
```

这个类在使用了@EnableRedisHttpSession之后不会加载 

可以去掉@EnableRedisHttpSession 然后配置server.session.timeout=3600断点 customize方法生效

@EnableRedisHttpSession 这个注解只读其中的属性maxInactiveIntervalInSeconds

## 参考资料

[jquery ajax withCredentials:true 在 Chrome 中不起作用](https://q.cnblogs.com/q/113339/)

[前后端分离Cookie sameSite坑 跨域之坑](https://blog.csdn.net/qq_37060233/article/details/86595102)

[set-cookie无效，不能保存到cookie的问题](https://blog.csdn.net/NumenJamila/article/details/84646917)

[再见，CSRF：讲解set-cookie中的SameSite属性](https://www.anquanke.com/post/id/83773)

[跨站请求伪造与 Same-Site Cookie](https://www.jianshu.com/p/66f77b8f1759)

[springboot动态设置spingsession过期时间](https://www.oschina.net/question/3516726_2284243)