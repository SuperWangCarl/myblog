---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: NAS中的docker配置
category: devops
tags: [devops,nas,docker]
excerpt: NAS中的docker配置 和 映射NFS 并将映射后的NFS 在服务器上开启ftp
keywords: carlme,superwang,superwangcarl,carl,卡尔米,nas,exsi
---

## 简介

最近由于需要配置个域名映射的动态ip,本来考虑安装个虚拟机用的,后来感觉有点浪费,所以就直接在nas中安装dokcer进行配置了

## Docker安装和配置

- 在套件中心安装docker,输入docker,选择安装套件,等待安装完毕

  ![img]({{site.cdn}}assets/images/blog/2019/20191119180559.jpg)

- 选择注册表, 选择centos进行双击安装,

  ![img]({{site.cdn}}assets/images/blog/2019/20191119180654.jpg)

- 选择映像,选中后点击启动然后进行配置

  ![img]({{site.cdn}}assets/images/blog/2019/20191119180754.jpg)

- 点击高级设置进行配置

  ![img]({{site.cdn}}assets/images/blog/2019/20191119180852.jpg)

- 配置卷映射,将 nas的共享文件夹docker映射给容器中的`/app`目录

  ![img]({{site.cdn}}assets/images/blog/2019/20191119180937.jpg)

- 选择使用和nas相同的网络,这样方便外部使用ssh登录,不用在nas总做映射了

  ![img]({{site.cdn}}assets/images/blog/2019/20191119181100.jpg)

- 点击完成进行安装

- 启动容器

  ![img]({{site.cdn}}assets/images/blog/2019/20191119181220.jpg)

## NAS映射NFS

### NAS操作

- NAS开启NFS服务

  ![img]({{site.cdn}}assets/images/blog/2019/20191119184508.jpg)


- 新增共享文件夹

  ![img]({{site.cdn}}assets/images/blog/2019/20191119184235.jpg)

- 编辑NFS权限

  ![img]({{site.cdn}}assets/images/blog/2019/20191119184341.jpg)

  ![img]({{site.cdn}}assets/images/blog/2019/20191119184410.jpg)

### 路由器端口映射

由于NFS会用到 `111/2049/892` 三个端口,在路由器中做下端口映射

![img]({{site.cdn}}assets/images/blog/2019/20191119184602.jpg)

### NFS客户端操作

- 安装客户端

  ```shell
  #1.查看系统版本
  cat /etc/redhat-release
  uname -r
  uname -m
  #2.安装rpc服务并检查
  rpm -qa nfs-utils portmap rpcbind
  yum install nfs-utils rpcbind -y
  #3.启动rpc服务并检查
  /etc/init.d/rpcbind start 
  /etc/init.d/rpcbind status
  #4.设置开机自启动并检查
  chkconfig rpcbind --level 3 on
  chkconfig --list rpcbind
  ```

- 挂载 `/volume1/SDInject`为下图显示的地hi

  ![img]({{site.cdn}}assets/images/blog/2019/20191119184909.jpg)

  ```
   mount -t nfs xxx.xxx.com:/volume1/SDInject /mnt/nas
  ```

## 搭建FTP

`上一步中我们已经挂在好了 /mnt/nas`,在服务器上基于这个路劲搭建个ftp

- FTP搭建过程`略`

- 权限开启

  - 在NAS的NFS中配置该路径的权限

    ![img]({{site.cdn}}assets/images/blog/2019/20191121153125.jpg)

  - 在linux服务器上新建`admin`用户

    ```shell
    useradd -d /mnt/nas -s /sbin/nologin admin
    ```

- 开启ftp

## 参考资料

[使用 Synology(群晖) NAS + Docker 搭建个人私有云](https://www.ituring.com.cn/article/507426)

[nas使用分享 篇二：nas使用分享 篇三：NAS中Docker安装Aria2简明教程](https://post.smzdm.com/p/a6lnx9oe/)

[NAS挂载到Linux系统](https://blog.csdn.net/y_f_raquelle/article/details/95344324)

[DiskStation管理器](https://www.synology.com/en-us/knowledgebase/DSM/tutorial/File_Sharing/How_to_access_files_on_Synology_NAS_within_the_local_network_NFS)