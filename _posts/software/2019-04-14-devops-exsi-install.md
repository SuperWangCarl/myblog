---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 物理机上安装exsi的简单使用
category: devops
tags: [devops,exsi]
excerpt: exsi的简单安装和使用
keywords: carlme,superwang,superwangcarl,carl,卡尔米,exsi,ssh,linux,software
---

## 简介

在物理机上安装EXSI前,先介绍下Vmware([官网](https://my.vmware.com/cn/web/vmware/login))家族中有哪些成员,分别是做什么的

### 服务端软件

- workstation

  > 单机级，用在个人桌面系统中，需要操作系统支持
  >
  > 主要是个人开发使用的虚拟化,需要依赖OS系统

- server

  > 工作组级，用于服务器，需要操作系统支持
  >
  > 面向企业的 workstation 需要依赖OS系统
  >
  > PS: `workstation、server`：是Windows或者Linux上的一种应用程序，必须先安装主机操作系统才能安装workstaion或server，之后才能安装虚拟机

- vSphere/EXSI

  > 是独立的虚拟机，可在一台裸机上安装，然后安装虚拟机。
  >
  > `esxi本身就是一个OS`，可以直接安装，不需要其他的OS做低层系统，而server和workstation都需要一个操作系统做支持
  >
  > ---
  >
  > - 现在来讲vSphere就是ESXI，只是两种叫法而已，我们来看看VMware服务器虚拟化产品的历程。
  > - Vmware 服务器虚拟化第一个产品叫ESX，该产品只有60天测试，没有官方认可的免费版。后来Vmware在4版本的时候推出了ESXI，ESXI和ESX的版本最大的技术区别是内核的变化，ESXI更小，更安全，从其他方面来说ESXI可以在网上申请永久免费的license，但是两个版本的收费版功能是完全一样的。
  > - 从4版本开始VMware把ESX及ESXi产品统称为vSphere，但是VMware从5版本开始以后取消了原来的ESX版本，所以现在来讲的话vSphere就是ESXI，只是两种叫法而已。一般官方文档中以称呼vSphere为主。
  > - vSphere是可以装在直接装在X86机器上，使这台机器完全虚拟化。
  > - vSphere主要使企业级别的用户，里面包括很多其他的东西，vsphere client，vCenter，database，active directory domain。
  > - 你可以在window 上安装VMware workstation，在VMware workstation上安装 vsphere，然后使得这个东西成为ESX，然后在在ESX上装虚拟机，至少要两台机器，因为要做HA和Vmotion等操作。

- vsan  

  > 一种依赖EXSI的存储方案
  >
  > VMware VSAN，全称VMware Virtual SAN，简称VSAN(注意V是大写)。我们可以把VSAN看成是一种vSphere Storage，是vSphere虚拟机后端的企业级高性能存储

### 客户端软件

- vCenter Server

  > 一套用于EXSI集群的客户端解决方案
  >
  > 提供了一个可伸缩、可扩展的平台，为虚拟化管理奠定了基础。可集中管理VMware vSphere环境，与其他管理平台相比，极大地提高了 IT 管理员对虚拟环境的控制。
  >
  > 提高在虚拟基础架构每个级别上的集中控制和可见性，通过主动管理发挥 vSphere 潜能，是一个具有广泛合作伙伴体系支持的可伸缩、可扩展平台。
  >
  > 集中管理整个集群和数据中心,也可以管理vSan

- vSphere Client

  > 适用于EXSI单机的解决方案
  >
  > 只是一个客户端只能管理一台机器,也可以使用该客户端链接`vCenter Server`之后操作多个主机
  >
  > `从vSphere 6.5开始，vSphere客户端不再可用。`[详见](https://kb.vmware.com/articleview?docid=2147929&lang=zh_CN)

- vSphere web client

  > 一款基于浏览器的客户端

### 总结

- 服务端
  - workstation是给开发者使用的，性能一般
  - server是给企业级用户使用的，性能针对workstation有很大的提升
  - esxi是针对电信级企业使用的，性能是最好的
  - vsan是存储的方案
- 客户端
  - vCenter Server
  - vSphere Client
  - vSphere web client

## 安装

### 服务端安装

1. 去DELL官方[下载](https://www.dell.com/support/article/cn/zh/cndhs1/sln290857/dell%E5%AE%9A%E5%88%B6%E7%9A%84esxi-%E7%B3%BB%E7%BB%9F%E4%B8%8B%E8%BD%BD%E5%8F%8A%E7%89%88%E6%9C%AC%E8%AF%B4%E6%98%8E?lang=zh)专用的EXSI,当然你也可以去VMware的官网

   1. DELL官方的下载如下:

      ![img]({{site.cdn}}/assets/images/blog/2019/20190414222640.png)

   2. VMware的官网下载如下[所有产品下载链接](https://my.vmware.com/zh/group/vmware/info/slug/datacenter_cloud_infrastructure/vmware_vsphere/6_7)

      1. 进入官方网站注册帐号[传送门](https://my.vmware.com/cn/web/vmware/login)

      2. 登录后点击这里的注册 

         ![img]({{site.cdn}}/assets/images/blog/2019/20190414225524.png)

      3. 评估之后可以下载试用版,不过只有60天的有效期

2. 制作u盘启动,和windows启动盘制作差不多,就不细讲了

3. 服务器开机,会逐个扫描硬盘,直到有启动项的,此时只有我们的u盘有启动项,所以会扫描到我们的u盘

4. 进入EXSI的安装页面,在引导过程中，可以看到机器的CPU、内存的基本信息

   ![img]({{site.cdn}}/assets/images/blog/2019/20190414230052.png)

5. 单击“回车”键确认，确定安装

   ![img]({{site.cdn}}/assets/images/blog/2019/20190414230130.png)

6. 按`F11`接受协议

   ![img]({{site.cdn}}/assets/images/blog/2019/20190414230156.png)

7. 此界面选择安装位置，单击“回车”键确认，安装到本地磁盘中

   ![img]({{site.cdn}}/assets/images/blog/2019/20190414230238.png)

8. 键盘类型，默认美式键盘，单击“回车”键确认

   ![img]({{site.cdn}}/assets/images/blog/2019/20190414230311.png)

9. 输入root密码，密码要求7位以上，单击“回车”键确认

   ![img]({{site.cdn}}/assets/images/blog/2019/20190414230332.png)

10. 单击“F11”键确认安装

  ![img]({{site.cdn}}/assets/images/blog/2019/20190414230418.png)

11. 安装进行中

    ![img]({{site.cdn}}/assets/images/blog/2019/20190414230449.png)

12. 几分钟后安装完成，提示取出光盘，单击“回车”键重启

    ![img]({{site.cdn}}/assets/images/blog/2019/20190414230510.png)

13. 安装完成后，进入控制台，通过控制台可以看到服务器的基本信息以及IP地址

    ![img]({{site.cdn}}/assets/images/blog/2019/20190414230534.png)

### 客户端安装

此时在我们的电脑中安装操作的客户端,我使用`vSphere Client`[传送门](http://vsphereclient.vmware.com/vsphereclient/2/5/0/2/2/2/2/VMware-viclient-all-6.0.0-2502222.exe)

1. 各版本[下载地址](https://segmentfault.com/a/1190000010139229?utm_source=tag-newest),此处我下载的是`VMware-viclient-all-6.0.0-2502222.exe`

2. 双击安装,自动解压

   ![img]({{site.cdn}}/assets/images/blog/2019/20190414231813.png)

   ![img]({{site.cdn}}/assets/images/blog/2019/20190414232320.png)

3. 提示升级,点确定

   ![img]({{site.cdn}}/assets/images/blog/2019/20190414232238.png)

4. 直接下一步,同意协议

   ![img]({{site.cdn}}/assets/images/blog/2019/20190414232401.png)

5. 更改路径,安装,完成

   ![img]({{site.cdn}}/assets/images/blog/2019/20190414232525.png)

### 客户端使用

1. 输入相关信息进行登录,(可以控制单个主机或者连接vCenter Server控制多个主机,此处我只控制一个)

   ![img]({{site.cdn}}/assets/images/blog/2019/20190415213436.png)

2. 忽略

   ![img]({{site.cdn}}/assets/images/blog/2019/20190415090611.png)

3. 进入菜单配置

   ![img]({{site.cdn}}/assets/images/blog/2019/20190415091113.png)


## FAQ

### vSphere Client 连接服务器

问题: 无法从服务器'0.0.0.0'检索到必须的客户端支持文件,如图

![img]({{site.cdn}}/assets/images/blog/2019/20190416165948.png)

原因: 服务器和客户端的版本不一致,`exsi 6.5之后不再支持 vSphere Client`

解决: 更换服务器版本为6.0,或者使用web客户端`web客户端的功能也很全`

***



## 参考资料

[**DELL服务器（工作站）安装ESXi**](https://blog.csdn.net/qq_35428201/article/details/80933733)

