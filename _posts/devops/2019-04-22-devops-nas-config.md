---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: NAS的常用配置
category: devops
tags: [devops]
excerpt: NAS的常用配置
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,nas,exsi
---

## 简介

本文主要介绍,nas安装完后一些常用的配置

![img]({{ site.cdn }}assets/images/blog/2019/20190421222115.png)

## 配置

### 设置固定ip

控制面板->网络->网络界面->编辑

![img]({{ site.cdn }}assets/images/blog/2019/20190421183915.png)

ipv4->手动设置网络配置->ip地址

![img]({{ site.cdn }}assets/images/blog/2019/20190421184000.png)

保存

***

### 新增磁盘

打开存储空间管理员

![img]({{ site.cdn }}assets/images/blog/2019/20190421184936.png)

查看当前的物理磁盘情况

![img]({{ site.cdn }}assets/images/blog/2019/20190421185038.png)

#### 新增RAID GROUP

![img]({{ site.cdn }}assets/images/blog/2019/20190421185207.png)

选择单个,性能高点,如果磁盘多于24个择选择第二个

![img]({{ site.cdn }}assets/images/blog/2019/20190421185248.png)

选择`Basic`不设置raid,应为我底层服务器已经用阵列卡设置过了

![img]({{ site.cdn }}assets/images/blog/2019/20190421185354.png)

将磁盘拖入

![img]({{ site.cdn }}assets/images/blog/2019/20190421185453.png)

![img]({{ site.cdn }}assets/images/blog/2019/20190421185537.png)

选择是,磁盘过大不建议选

> 会提示 新添加硬盘的数据将被擦除-确定
>
> 磁盘检查选项按需；如以后将存放重要资料建议选择“是”，实测3T硬盘检查时间大概10小时 对磁盘IO影响非常严重，如果对硬盘足够方向则选择 “否”（不建议），达到“开箱即用”的效率

![img]({{ site.cdn }}assets/images/blog/2019/20190421185653.png)

应用

![img]({{ site.cdn }}assets/images/blog/2019/20190421185725.png)

#### 新增存储空间

![img]({{ site.cdn }}assets/images/blog/2019/20190421190243.png)

***

### 添加共享文件夹

控制面板->共享文件夹->新增

![img]({{ site.cdn }}assets/images/blog/2019/20190421192544.png)

添加

![img]({{ site.cdn }}assets/images/blog/2019/20190421192725.png)

按需选择是否需要加密,如需要填写密码

![img]({{ site.cdn }}assets/images/blog/2019/20190421192849.png)

配额

![img]({{ site.cdn }}assets/images/blog/2019/20190421193008.png)

完成

![img]({{ site.cdn }}assets/images/blog/2019/20190421193038.png)

按需选择

![img]({{ site.cdn }}assets/images/blog/2019/20190421193121.png)

***

### 删除共享文件夹

![img]({{ site.cdn }}assets/images/blog/2019/20190421203105.png)

***

### 文件上传

***方式一***

使用web的方式

![img]({{ site.cdn }}assets/images/blog/2019/20190421193947.png)

***方式二***

直接使用window自带的资源管理器

按下`win+R` ,输入nas的连接地址

![img]({{ site.cdn }}assets/images/blog/2019/20190421194203.png)

输入nas的帐号密码

....

windows配置启用发现

![img]({{ site.cdn }}assets/images/blog/2019/20190421194337.png)

显示

![img]({{ site.cdn }}assets/images/blog/2019/20190421195124.png)

***方式三***

使用ftp上传

设置ftp

![img]({{ site.cdn }}assets/images/blog/2019/20190421233657.png)

配置ftp

`注意相应的端口需要在路由器里面配置`

![img]({{ site.cdn }}assets/images/blog/2019/20190421235117.png)



***

### 设置个人邮箱

![img]({{ site.cdn }}assets/images/blog/2019/20190421190359.png)

***

### 通知设置

控制面板->通知设置

![img]({{ site.cdn }}assets/images/blog/2019/20190421190443.png)

设置邮箱并测试

`此处密码应该输入 授权码(去网页163上面配置) 不可以直接使用密码`

![img]({{ site.cdn }}assets/images/blog/2019/20190421191042.png)

***

### 创建用户

控制面板->用户账户->新增

![img]({{ site.cdn }}assets/images/blog/2019/20190421184200.png)

添加用户(可以使用随机密码)

![img]({{ site.cdn }}assets/images/blog/2019/20190421192255.png)

选择用户组

![img]({{ site.cdn }}assets/images/blog/2019/20190421192335.png)

共享文件夹权限`不配置后面的权限,则使用前面的用户组权限`

![img]({{ site.cdn }}assets/images/blog/2019/20190421193408.png)

套间权限配置

![img]({{ site.cdn }}assets/images/blog/2019/20190421193501.png)

限速配置`0不限速`

![img]({{ site.cdn }}assets/images/blog/2019/20190421193621.png)

应用

![img]({{ site.cdn }}assets/images/blog/2019/20190421193658.png)

***

### 安全配置

***启用https 修改默认端口***

> 尽量使用HTTPs访问，避免中间人攻击。设置方法是：首先禁用掉黑群晖的HTTP访问，并把所有HTTP访问重定向到HTTPS上来，开启HTTP/2加速访问

控制面板->网络->DSM设置

![img]({{ site.cdn }}assets/images/blog/2019/20190421195432.png)

***修改常用端口***

> 修改DSM以及套件的端口。DSM的端口见上图，套件的端口在控制面板->Synology 应用程序门户中进行一一修改

![img]({{ site.cdn }}assets/images/blog/2019/20190421200416.png)

***启用DSM防火墙 未用***

![img]({{ site.cdn }}assets/images/blog/2019/20190421200737.png)

***启用2部验证***

> 启用2部验证，对于新设备的登陆，要求用户提供一个动态的OTP码（通过安装google的Authenticator获得OTP）

![img]({{ site.cdn }}assets/images/blog/2019/20190421201143.png)

去 `App Store`下载 `google Authenticator`

![img]({{ site.cdn }}assets/images/blog/2019/20190421201322.png)

之后用 `google Authenticator`扫描会有验证码,输入即可

***

### 取消更新

控制面板->计划任务

![img]({{ site.cdn }}assets/images/blog/2019/20190421191241.png)

右键删除计划

![img]({{ site.cdn }}assets/images/blog/2019/20190421191315.png)

***

### 配置域名https

第一步

控制面板->安全性

![img]({{ site.cdn }}assets/images/blog/2019/20190430195334.png)

第二步

替换证书

![img]({{ site.cdn }}assets/images/blog/2019/20190430195400.png)

![img]({{ site.cdn }}assets/images/blog/2019/20190430195449.png)

具体私钥和证书可以查看我给博客配置https的那边[博文]({{site.url}}/myblog/2019/04/07/myblog-https.html),需要去阿里云申请

![img]({{ site.cdn }}assets/images/blog/2019/20190430195518.png)

***

### *初始化密钥管理器

暂无

***

### 关闭声音

应为是装到exsi里面的,声音也没什么用,所以关了

![img]({{ site.cdn }}assets/images/blog/2019/20190421192042.png)

***

### 配置ssh登录

启用ssh

![img]({{ site.cdn }}assets/images/blog/2019/20190521075008.png)

xshell连接

`只有admin群组的帐号才可以登录`

![img]({{ site.cdn }}assets/images/blog/2019/20190521075139.png)

***

### 配置rsync

`需要指定 ssh,因为nas的rsync传输是通过ssh加密的`

```shell
rsync -e "/usr/bin/ssh" -avzl /home/wwwroot/bugging/ dms账号@群晖IP::NetBackup
```



***

### 配置ftp

在路由器上做相应的映射

![img]({{ site.cdn }}assets/images/blog/2019/20190521075452.png)

***



## 参考资料

[黑群晖 Lede路由的外网访问方案](http://www.360doc.com/content/19/0126/09/21435004_811362278.shtml)