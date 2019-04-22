---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 博客https的认证配置 
category: myblog
tags: [myblog,https]
excerpt: 给博客配上https的安全认证
keywords: carlme,superwang,superwangcarl,carl,https,myblog,blog,nginx,认证,卡尔米
---

## 1. 简介

由于默认的请求都是http现在主流的浏览器都会提示不安全,所以我们可以申请一个证书,将我们的域名配置城https的.步骤也很简单.

## 2. 操作步骤

### 1. 证书申请

我购买的是阿里云的域名,其他厂商的步骤应该差不多

1. 在阿里云域名控制台申请免费的ssl证书

![img]({{site.cdn}}/assets/images/blog/2019/20190407223445.jpg)

2. 选择免费的并填写信息

![img]({{site.cdn}}/assets/images/blog/2019/20190407223700.jpg)

3. 提交审核

![img]({{site.cdn}}/assets/images/blog/2019/20190407223843.jpg)

![img]({{site.cdn}}/assets/images/blog/2019/20190407223928.jpg)

4. 签发成功

![img]({{site.cdn}}/assets/images/blog/2019/20190407224119.jpg)

5. 下载证书

   ![img]({{site.cdn}}/assets/images/blog/2019/20190407224341.jpg)

6. 也可以直接在控制台搜索`ssl`进行购买

### 2. nginx配置

1. 在nginx的conf目录下创建 cert文件夹

   ```shell
   mkdir conf/cert
   ```


2. 将上方下载下的压缩文件解压后上传到cert文件夹中并改名

   ```shell
   mv xxx.pem  carl.pem
   mv xxx.key  carl.key
   ```


3. 修改nginx配置

   ```conf
   		listen 443;
   		server_name localhost;
   		ssl on;
   		ssl_certificate   cert/carl.pem;
   		ssl_certificate_key  cert/carl.key;
   		ssl_session_timeout 5m;
   		ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
   		ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
   		ssl_prefer_server_ciphers on;
   ```

![img]({{site.cdn}}/assets/images/blog/2019/20190407230831.jpg)

## 3. 其他

### 重定向HTTP请求到HTTPS

有的用户还会在浏览器中直接使用http://ip:port的方式访问我们的nginx这个时候,浏览器就会提示无法连接,不友好,我们可以在nginx中配置,让http请求全部转发到https的请求中

在添加一个server模块

```conf
server {
		listen 80;
		server_name carlme.com;
		return 301 https://$server_name$request_uri;	    
}
```

## 4. FAQ

### ssl配置nginx后,启动出错

nginx: [emerg] unknown directive "ssl"

```
由于编译安装的时候没有添加ssl模块,重新编译安装即可,添加  --with-http_ssl_module 这个模块
```

***

### 重新编译出错

./configure: error: SSL modules require the OpenSSL library.

服务器缺少openssl直接yum安装即可

```shell
yum install -y openssl-devel
```

## 5. 参考资料

[如何将.pem转换为.crt和.key？](https://vimsky.com/article/3608.html)