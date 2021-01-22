---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 博客持续集成
category: myblog
tags: [git,jenkins,devops]
excerpt: github和jenkins持续集成
keywords: IT超仔,carlme,superwang,superwangcarl,carl,git,jenkins,myblog,jdk安装,devops,卡尔米,software
---

## 1. 简介

使用github 和 jenkins持续集成实现,提交到github上的代码,自动触发jenkins之后进行构建操作实现自动化.

## 2. 软件版本

- jdk-8u121-linux-x64.tar.gz 
- apache-tomcat-8.5.28.tar.gz
- jenkins-2.164.1
- github-2019-04-07

## 3. 软件安装

### 1. jdk

```shell
#删除源文件
rm -rf /application/jdk1.8.0
#创建目录
mkdir /application/jdk1.8.0 -p
#进入软件目录
cd /root/tools
#拷贝文件
#cp /mnt/hgfs/WinLinuxShare/software/jdk-8u121-linux-x64.tar.gz ./
#解压jdk
tar xf jdk-8u121-linux-x64.tar.gz
#将jdk移动到安装目录
mv jdk1.8.0_121/* /application/jdk1.8.0
#环境变量配置 二选一
#环境变量配置1
ln -sf /application/jdk1.8.0/bin/* /usr/bin
java -version
#环境变量配置2
echo 'JAVA_HOME=/application/jdk1.8.0' >> /etc/profile
echo 'export PATH=$PATH:$JAVA_HOME/bin' >> /etc/profile
source /etc/profile
java -version
```

### 2. tomcat

```shell
#删除源文件
rm -rf /application/apps
#创建目录
mkdir -p /application/apps/tomcat_xxx_7101
#创建用户(之后可以使用tomcat用户启动tomcat)
useradd tomcat -M -d /application/apps -s /sbin/nologin
#进入软件目录
cd /root/tools
#拷贝文件
#cp /mnt/hgfs/WinLinuxShare/software/apache-tomcat-8.5.28.tar.gz ./
#解压
tar xf apache-tomcat-8.5.28.tar.gz
#将软件移动到安装目录
mv apache-tomcat-8.5.28/* /application/apps/tomcat_xxx_7101
```

### 3. jenkins

[下载地址](http://mirrors.jenkins.io/war-stable/)

将`jenkins.war`移动到 tomcat的webapp目录下即可

### 4. github

略

## 4. 配置

### 1. tomcat配置

#### 1. catalina.sh修改

```shell
#!/bin/sh
export JENKINS_HOME=/application/jenkins/.jenkins
```

#### 2. server.xml修改

`按需修改下端口`

```xml
 <Connector port="7111" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />
```

### 2. github配置

​	1. 生成token

​	     ![img]({{site.cdn}}assets/images/blog/2019/20190407200436.jpg)

![img]({{site.cdn}}assets/images/blog/2019/20190407200556.jpg)

![img]({{site.cdn}}assets/images/blog/2019/20190407200629.jpg)

​	2. 配置保存即可
![img]({{site.cdn}}assets/images/blog/2019/20190407170617.jpg)

### 3. jenkins配置

上述tomcat配置完后启动tomcat,访问`http://ip:8080/jenkins`即可.

1. 显示如下

![img]({{site.cdn}}assets/images/blog/2019/201947163319.jpg)

2. 安装插件(推荐或者自己选择)

   ![img]({{site.cdn}}assets/images/blog/2019/20190407164659.jpg)

   1. 选择需要的插件

   ![img]({{site.cdn}}assets/images/blog/2019/20190407164914.jpg)

   2. 安装中(需要等待一会,如果不能下载,可以跳过之后选择离线安装)

   ![img]({{site.cdn}}assets/images/blog/2019/20190407164951.jpg)

3. 用户

   ![img]({{site.cdn}}assets/images/blog/2019/20190407165322.jpg)

4. 实例配置,开始使用

   ![img]({{site.cdn}}assets/images/blog/2019/20190407165428.jpg)

   ![img]({{site.cdn}}assets/images/blog/2019/20190407165507.jpg)

5. 配置全局的github的token

   ![img]({{site.cdn}}assets/images/blog/2019/20190407200859.jpg)

   1. 配置github服务器

   ![img]({{site.cdn}}assets/images/blog/2019/20190407201106.jpg)

   ![img]({{site.cdn}}assets/images/blog/2019/20190407201229.jpg)

6. 创建视图

   `因为我这个项目是一个jekyll的项目,并且大部分操作都是通过脚本进行的,所以我的jenkins中就不配置,maven,jdk..了,如果需要可以参考网上的教程或者我之后的博客`

   ![img]({{site.cdn}}assets/images/blog/2019/20190407165548.jpg)

   ![img]({{site.cdn}}assets/images/blog/2019/20190407165643.jpg)

   1. General

   ![img]({{site.cdn}}assets/images/blog/2019/20190407165900.jpg)

   2. 源码管理

   ![img]({{site.cdn}}assets/images/blog/2019/20190407202142.jpg)

   3. 构建触发器

   ![img]({{site.cdn}}assets/images/blog/2019/20190407165933.jpg)

   4. 构建环境

   ![img]({{site.cdn}}assets/images/blog/2019/20190407202259.jpg)

   ![img]({{site.cdn}}assets/images/blog/2019/20190407202236.jpg)

   5. 执行shell 

   ![img]({{site.cdn}}assets/images/blog/2019/20190407170043.jpg)

   ![img]({{site.cdn}}assets/images/blog/2019/20190407170115.jpg)

   6. 保存

   ![img]({{site.cdn}}assets/images/blog/2019/20190407170231.jpg)

## 5.流程分析和最小化配置

### 流程分析

本地push到github-->触发github的webhooks连接-->已post请求的方式发送到jenkins中-->jenkins会根据改post请求的消息体等查看是哪个视图,并查看该视图是否符合触发要求,符合的话就会触发配置

### 最小化配置

看了网上很多教程,发现都说是需要配置github的token才可以触发钩子,其实是`不需要的`,

也就是说 上面配置步骤的`4.2.1;4.3.5;4.3.4`其实都是可以省略的;

可以看下jenkins的这个说明

![img]({{site.cdn}}assets/images/blog/2019/20190407204431.jpg)

就是说如果不做些更新类的操作什么的是不需要这个认证的

`也就是说最简单的配置就是 jenkins中配置这个`

![img]({{site.cdn}}assets/images/blog/2019/20190407205639.jpg)

`github中配置这个`

![img]({{site.cdn}}assets/images/blog/2019/20190407205738.jpg)

就可以触发构建了

## 6. FAQ

### 无法安装jekyll

**问题 :** 

问题1:

![img]({{site.cdn}}assets/images/blog/2019/20190927145235.jpg)

问题2:

![img]({{site.cdn}}assets/images/blog/2019/20190927145437.jpg)

**原因 :** 

1. jekyll所需的某个依赖安装失败 安装其他版本的依赖
2. gem需要更新

**参考链接 :** 

**解决 :** 

```
gem update --system
gem install sassc --version=2.1.0
```

![img]({{site.cdn}}assets/images/blog/2019/20190927145342.jpg)

***

### bundle构建失败

**问题 :**  

![img]({{site.cdn}}assets/images/blog/2019/20190927145630.jpg)

**原因 :** gemfile.lock里面的依赖没有安装

**参考链接 :** 

**解决 :**  进入该文件所在的目录下 运行 `bundle update`

![img]({{site.cdn}}assets/images/blog/2019/20190927145749.jpg)

***

### 无法触发构建

使用jenkins构建触发器的token,在github的hooks配置的url为token的url显示认证失败无法触发构建

![img]({{site.cdn}}assets/images/blog/2019/20190407195755.jpg)

```
因为jenkins触发后期需要认证,后来采用了
http://ip:port/jenkins/github-webhook/
的方式解决了
```

---

### google卡死

问题:google打开F12,点击Elements-->点击head -->在刷新会卡死

原因: 开始将tomcat的bin目录下的catalina.sh中的所有内容都复制到了4.1.1里面会导致卡死,应该是里面的某条语句,有待后续分析

```
删除catalina.sh的内容
```

***

### jenkins构建bundle异常

`Liquid Exception: no implicit conversion of nil into String in pages/about.md`

原因:将tomcat启动放入的/etc/rc.local中,重启后启动的tomcat中jenkins部分组件没有初始化完成

解决:

- 将tomcat从开机启动中移除,手动启动tomcat,后续看看是否有优化的办法,
- 将tomcat开机放倒后台启动也不能解决这个问题
- 和tomcat启动是否绝对路径也没有关系,只和开机启动有关


***

### 开启iptables 导致

fatal: unable to access 'https://github.com/xxxx/xxx/': Failed connect to github.com:443; Operation now in progress

Liquid Exception: Failed to open TCP connection to api.github.com:443 (Connection timed out - connect(2) for "api.github.com" port 443) in pages/about.md

原因: 防火墙设置错误 未打开tcp链接

解决: 增加tcp连接(`相当于防火墙失效不可行`)

```
-A INPUT -p tcp -j ACCEPT
```

PS: `但是使用此方法会放行所有的tcp请求`

解决: 使用ssh的方式进行拉取

```shell
#进入当前用户的家目录
cd ~
#删除.ssh 目录
rm -rvf .ssh
#运行命令生成.ssh 密钥目录
ssh-keygen -t rsa
#[注意： 这里-C 这个参数是大写的 C]
#进入.ssh 目录查看文件列表
cd .ssh
ls -l
#查看 id_rsa.pub 文件内容
cat id_rsa.pub
#复制 id_rsa.pub 文件内容， 登录 GitHub， 点击用户头像→Settings→SSH and GPG keys->New SSH Key
#输入复制的密钥信息
#回到 Git bash 创建远程地址别名
#拉取文件进行测试
git clone git@github.com:xxx/xxx.git
```






