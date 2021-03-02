---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 博客图片和文件
category: myblog
tags: [myblog,linux]
excerpt: 博客图片和文件
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,linux,nginx,myblog
---

## 1. 简介

由于服务器一直使用的是阿里云的最低配置的虚拟机,带宽只有1M,所以图片加载了比较慢,所在在自己家里搞了个物理机,使用了阿里云的ddns让域名和ip绑定,本地图片和文件直接通过rsync上传到家里的物理机,文档通过git上传到github之后通过钩子触发jenkins进行持续集成

## 2. 步骤

### 服务端配置linux版的rsync服务端

```conf
uid = root
gid = root
port = 803
use chroot = no
max connections = 30
timeout = 600
log file = /var/rsyncd.log
pid file = /tmp/rsync/rsyncd.pid
lock file = /tmp/rsync/rsync.lock
log format = %t %a %m %f %b
syslog facility = local3
read only = no
hosts allow = *
auth users = rsync
secrets file = /etc/rsync/rsyncd.password
[online]
comment = online by superwang 21:18 2017-9-15
path = /data/resource
```

### 本地安装windos版的rsync客户端

[下载地址]({{ site.cdn }}assets/download/cwRsync_4.1.0_Installer.exe)

### 本地编写bat脚本

图片和大文件直接上传到自己的物理机服务器,文档上传github

```bat
@echo off
::进入目录
E:
cd Develop/myblog
::本地向rsync服务端上传图片
rsync -avPz --progress /cygdrive/e/myblog/assets rsync_backup@rsync.superang.xin::online --delete --password-file=/cygdrive/e/rsync/rsync.password --port=803 --delete
::本地向rsync服务端上传文件
rsync -avPz --progress /cygdrive/e/myblog/download rsync_backup@rsync.superang.xin::online --delete --password-file=/cygdrive/e/rsync/rsync.password --port=803 --delete
::向git提交
git add .
git commit -m 'blogupdate' 
git push
exit 
```



