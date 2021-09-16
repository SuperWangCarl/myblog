---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: NAS中的rsync配置
category: devops
tags: [devops,nas,rsync]
excerpt: NAS中的rsync配置和备份
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,nas,exsi
---

## 简介

工作电脑中的文件每天晚上十点定时备份到nas中

## rsync安装和配置

- 控制面板开启rsync并配置同步用户

  ![img]({{ site.cdn }}assets/images/blog/2021/20210916105612.png)

- 打开ssh登录

  ![img]({{ site.cdn }}assets/images/blog/2021/images/20210916105644.png)

- 打开xshell登录nas命令行界面 配置rsync

  ```shell

  #配置配置文件
  root@CarlMe:~# cat /etc/rsyncd.conf 
  #motd file = /etc/rsyncd.motd
  #log file = /var/log/rsyncd.log
  uid = root
  gid = root
  pid file = /var/run/rsyncd.pid
  lock file = /var/run/rsync.lock
  use chroot = no
  port = 2421
  hosts allow = *
  auth users = username
  secrets file = /etc/rsync.password
  read only = no
  [backup]
  path = /volume2/path
  read only = false
  ignore errors

  #配置同步目录 并修改权限
  root@CarlMe:~# mkdir /volume2/path
  root@CarlMe:~# chown -R username:username /volume2/path
  root@CarlMe:~# chmod 755 /volume2/BackUP/path
  #配置密码文件
  root@CarlMe:~# cat /etc/rsync.password 
  username:password
  root@CarlMe:~# chown 600 /etc/rsync.password 
  -rw------- 1 root root 22 Sep 15 10:39 /etc/rsync.password

  #重启rsync
  root@CarlMe:~# pkill rsync
  root@CarlMe:~# rsync --daemon

  ```

- 客户端同步rsync

  ```shell
  cat rsync.password
  password
  #win10本地文件同步到nas
  rsync -aqz /cygdrive/d/Tools username@www.xxx.com::backup --password-file=/cygdrive/e/rsync.password --port=2421
  ```

  ​

  ​

