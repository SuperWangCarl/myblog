---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 博客添加简单的安全加固
category: myblog
tags: [myblog,linux]
excerpt: 给博客服务器添加简单的安全,防止恶意访问
keywords: carlme,superwang,superwangcarl,carl,卡尔米,linux,nginx,myblog
---



## 1. 简介

最近发现好多的错误日志都是访问我,项目中没有的文件,所以考虑加点安全措施

![img](../../assets/images/blog/2019/20190410223514.png)

## 2. 措施

### 1. nginx禁止GET,HEAD以外的请求

> 由于我使用的都是静态文件,所以我就禁止了GET|HEAD以外的其他请求

直接在http模块中添加

```conf
if ($request_method !~ ^(GET|HEAD)$) {
	return 444;
}
```

![img](../../assets/images/blog/2019/20190410165724.png)

### 2. nginx封禁频繁访问错误文件的ip

**1、查找服务器所有访问者ip方法：**

```
awk -F "client: |, server" '{print $2}' error.log |sort |uniq -c|sort -n
```

nginx.access.log 为nginx访问日志文件所在路径

会到如下结果，前面是ip的访问次数，后面是ip，很明显我们需要把访问次数多的ip并且不是蜘蛛的ip屏蔽掉，如下面结果， 
若 66.249.79.84 不为蜘蛛则需要屏蔽：

```
 171 106.12.223.232
 224 106.12.223.231
 329 106.12.223.230
2405 106.12.223.198
3002 106.12.223.199
4671 106.12.223.195
```

**2、屏蔽IP的方法：** 
在nginx的安装目录下面,新建屏蔽ip文件，命名为guolv_ip.conf，以后新增加屏蔽ip只需编辑这个文件即可。 
加入如下内容并保存：

```
deny 66.249.79.84 ; 
```

在nginx的配置文件nginx.conf中加入如下配置，可以放到http, server, location, limit_except语句块，需要注意相对路径，本例当中nginx.conf，guolv_ip.conf在同一个目录中。

```
include guolv_ip.conf; 
```

保存nginx.conf文件，然后测试现在的nginx配置文件是否是合法的：

```
 nginx -t
```

如果配置没有问题，就会输出：

```
the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
configuration file /usr/local/nginx/conf/nginx.conf test is successful
```

如果配置有问题就需要检查下哪儿有语法问题，如果没有问题，需要执行下面命令，重载 nginx 配置文件：

```
service nginx  reload
```

**3、注意：**

屏蔽ip的配置文件既可以屏蔽单个ip，也可以屏蔽ip段，或者只允许某个ip或者某个ip段访问。

```javascript
//屏蔽单个ip访问
deny IP; 
//允许单个ip访问
allow IP; 
//屏蔽所有ip访问
deny all; 
//允许所有ip访问
allow all; 
//屏蔽整个段即从123.0.0.1到123.255.255.254访问的命令
deny 123.0.0.0/8
//屏蔽IP段即从123.45.0.1到123.45.255.254访问的命令
deny 124.45.0.0/16
//屏蔽IP段即从123.45.6.1到123.45.6.254访问的命令
deny 123.45.6.0/24
//如果你想实现这样的应用，除了几个IP外，其他全部拒绝，
//那需要你在guolv_ip.conf中这样写
allow 1.1.1.1; 
allow 1.1.1.2;
deny all;
```

单独网站屏蔽IP的方法，把include guolv_ip.conf; 放到网址对应的在server{}语句块，
所有网站屏蔽IP的方法，把include guolv_ip.conf; 放到http {}语句块。

### 3. 禁止直接非指定域名访问并重定向

> 原因 : 在Nginx上设置禁止通过IP访问服务器，只能通过域名访问，这样做是为了避免别人把未备案的域名解析到自己的服务器IP而导致服务器被断网，

`而且我的域名使用了https,所以其他域名来访问都会提示不安全,即使忽略了,真正访问的时候,浏览器还重定向到我的域名`

因为我用的是https的所以所以要配置两个

80端口的配置

```
server {
    listen 80;
    server_name www.carlme.com;
	return 301 https://$server_name$request_uri;
}
```

443端口的配置

```shell
server { 
	listen 443 default ssl; 
    ssl_certificate   xxx/xxx.pem;
    ssl_certificate_key  xxx/xxx.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
	
	#return 和rewrite 任意选一个都行
	#return 301 https://xxx.xxx.xxx$request_uri;
	rewrite ^/(.*) https://xxx.xxxx.xxx/$1;
} 
```

效果:

`http 会转到https,不是www.carlme.com的域名最后都会转到www.carlme.com的域名`

![img](../../assets/images/blog/2019/20190410223304.gif)

### 4.防盗链

> 和第三步差不多

好多教程都说要配置这个

```
location ~*\.(gif|jpg|jpeg|png|bmp|swf|js|css|htm|html)${
  valid_referes none blocked www.test.com *.test.com;#如果不是通过指定的这个网站过来的，则跳转
  if($invalid){
  	rewrite ^/(.*) http://www.test.com/block.html;
  }
}
```

不过如果配置了第三步的,那么这个就可以省略了

### 5. 隐藏nginx的版本号

> 给conf添加配置

```
http{
  server_tokens off;
}
```

![img](../../assets/images/blog/2019/20190410222408.png)

### 6. iptables

> 添加防火墙

```shell
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [105:12820]
-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT 
-A INPUT -p icmp -j ACCEPT 
-A INPUT -i lo -j ACCEPT 
-A INPUT -p gre -j ACCEPT 
-A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
#22,80,xx,xx为端口 按需添加
-A INPUT -p tcp -m state --state NEW -m multiport --dports 22,80,xxx,xxx -j ACCEPT 
-A INPUT -j REJECT --reject-with icmp-host-prohibited 
-A FORWARD -j REJECT --reject-with icmp-host-prohibited 
COMMIT
```

### 7. 服务器禁ping

部分人员会通过ping携带大量的流量包请求我们的服务器,倒是我们的服务器网络变慢,所以可以给我们服务器设置禁止ping请求,

**1. 内核参数设置**

永久禁止PING配置方法: **/etc/sysctl.conf** 中增加一行

```
net.ipv4.icmp_echo_ignore_all=1
```

运行`sysctl -p`使配置生效

**2. 防火墙设置**

>  这里以Iptables防火墙为例，其他防火墙操作方法可参考防火墙的官方文档。

```
-A INPUT -p icmp --icmp-type 8 -j REJECT
-A OUTPUT -p icmp --icmp-type 0 -j REJECT
```

重启防火墙

```shell
service iptables restart
```

## 3.FAQ

配置 `return` 和 `rewrite` 导致nginx都无法提供任何服务,包括我们自己的域名也无法访问;

返回如下:

![img](../../assets/images/blog/2019/20190411090010.png)

看网上说配置 server_name _ 的不过我试了没有用.

原因: 因为我用的是https的协议,所以我们要早 重定向的前面配上我们的证书,否则会直接拒绝

解决:

```conf
server { 
	listen 80 default ssl; 
    ssl_certificate   xxx/xxx.pem;
    ssl_certificate_key  xxx/xxx.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
	
	#return 和rewrite 任意选一个都行
	#return 301 https://xxx.xxx.xxx$request_uri;
	rewrite ^/(.*) https://xxx.xxxx.xxx/$1;
} 
```

***



## 4. 总结

当然还有其他许多安全措施,这里只是一些比较简单的,对于个人博客应该也够用了,其他的以后有空在一一介绍.

## 5. 附录(nginx常用变量)

```
$args                         请求中的参数，如www.123.com/1.php?a=1&b=2的$args就是a=1&b=2|
$comtent_length               HTTP请求信息里的“Content-Length”  
$conten_type			      HTTP请求信息里的“Content-Type”
$document_root		          Nginx虚拟主机配置文件中的root参数对应的值
$document_uri			      当前请求中不包含指令的URI，如www.123.com/1.php?a=1&b=2的document_uri就是1.php，不包含后面的参数
$host						  主机头，也就是域名
$http_user_agent              客户端的详细信息，也就是浏览器的标识，用curl -A可以指定
$http_cookie			   	  客户端的cookie信息
$limit_rate					  如果Nginx服务器使用limit_rate配置了显示网络速率，则会显示，如果没有设置，则显示0
$remote_addr  			      客户端的公网IP
$remote_port			      客户端的端口
$remote_user			      如果Nginx有配置认证，该变量代表客户端认证的用户名
$request_body_file	          做反向代理时发给后端服务器的本地资源的名称
$request_method		          请求资源的方式，GET/PUT/DELETE等
$request_filename	          当前请求的资源文件的路径名称，相当于是$document_root/$document_uri的组合
$request_uri				  请求的链接，包括$document_uri和$args
$scheme						  请求的协议，如ftp、http、https
$server_protocol		      客户端请求资源使用的协议的版本，如HTTP/1.0，HTTP/1.1，HTTP/2.0等
$server_addr				  服务器IP地址
$server_name			      服务器的主机名 			
$server_port 				  服务器的端口号
$uri						  和$document_uri相同
$http_referer				  客户端请求时的referer，通俗讲就是该请求是通过哪个链接跳过来的，用curl -e可以指定

常用:$http_referer	
     $request_uri  
     $http_user_agent  
```



## 6.参考资料

[记一次配置rewrite和return的经历](https://blog.51cto.com/chenx1242/2059740)

[nginx 的 default_server 定义及匹配规则](https://segmentfault.com/a/1190000015681272)

[Nginx优化教程 实现突破十万并发](http://down.chinaz.com/server/201202/1615_1.htm)

[nginx全局变量](https://blog.csdn.net/chunyang315/article/details/82821476)