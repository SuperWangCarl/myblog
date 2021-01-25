---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 戴尔IDRAC远程卡配置
category: devops
tags: [iDRAC,dell,r510]
excerpt: 给戴尔服务器配置上远程卡
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,linux,dell,r510,iDRAC
---



## 简介

> iDRAC又称为Integrated Dell Remote Access Controller，也就是集成戴尔远程控制卡，iDRAC卡相当于是附加在服务器上的一台小电脑，通过与服务器主板上的管理芯片BMC进行通信，监控与管理服务器的硬件状态信息。它拥有自己的系统和IP地址，与服务器上的OS无关。是管理员进行远程访问和管理的利器。在戴尔第12代服务器中，iDRAC的版本升级到了iDRAC 7。iDRAC 7卡与生命周期管理控制器Lifecycle Controller 集成在一起，提供简化服务器生命周期管理。

> 远程管理卡是安装在服务器上的硬件设备，提供一个以太网接口，使它可以连接到局域网内，提供远程访问。这种远程管理基于BMC（底板管理控制器），由集成在管理卡上的系统微处理器负责监测和管理操作系统之外的服务器环境和状态。它既不会占用服务器系统的资源，也不会影响服务器系统的运行。

## 功能

IDRAC卡的功能

1. 在较少服务器管理的环境中，iDRAC7可以实现一对一的服务器远程管理与监控。服务器硬件一般都放置在数据中心，不容易被访问到。使用iDRAC可以非常容易实现远程访问服务器，进行配置、部署、监控以及后续的维护

   > 利用浏览器可以直接访问iDRAC的IP，非常容易地实现远程硬件、电源的管理和监控。
   > 使用远程控制台重定向与远程介质等功能，将服务器的鼠标键盘，光驱等介质重定向到管理员的管理工作站上，就能实现对服务器的远程操作。
   > 当特定事件发生时，可以进行告警，发送email、SNMP/IPMI告警或者执行某些特定动作。

2. 在使用管理软件进行多台服务器管理的环境中，iDRAC 7可以实现无代理（Agent Free）的管理与监控。

   > 在中、大型的数据中心中，常常需要部署”管理站点”软件（Management Station）来实现统一的监控与管理。
   > 在传统服务器上，相应的需要在操作系统中安装”被管理节点”软件（Managed Node，也即代理-Agent）。
   > 而在第12代服务器中，iDRAC 7本身就可以作为一个”被管理节点”，替代Agent绝大部分的功能。
   > 因此可以不需要在OS上安装Agent，实现Agent Free的管理，简化了OS的复杂程度和部署时间。

## 使用场景

1. 远程安装操作系统

   登录远程管理卡管理界面，用控制卡上的虚拟介质映射功能把自己电脑上的ISO文件或者物理光驱投递给机房里服务器。

2. 电源控制功能

   远程登录管理界面，进行开机、关机、重启

3. 检查服务器硬件状态

   监控电池、风扇、CPU、内存、磁盘等硬件设备的状态

### **实际应用举例：**

云装机系统：系统需要通过PXE启动进行开机，可以通过管理卡控制台进行，设置下次引导为“PXE”, 设置电源为“重设系统（热引导）”，开始从PXE启动，实现无人值守远程装机

## 实战

### 配置IDRAC卡

通过IDRAC卡安装Centos 7操作系统过程

1. 在服务器启动时按`Ctrl + E`配置好 iDRAC卡的地址

   ![img]({{ site.cdn }}/assets/images/blog/2021/20210125104902.png)

2. 进入 iDRAC6卡的配置界面，如下图 2 所示 

   ![img]({{ site.cdn }}/assets/images/blog/2021/20210125104941.png)

3. 在上图的界面中将光标移动至 LAN Parameters 选项

   ![img]({{ site.cdn }}/assets/images/blog/2021/20210125105058.png)

   ![img]({{ site.cdn }}/assets/images/blog/2021/20210125105117.png)

   使用 向下的方向键 继续移动光标至 IPv4 Settings 位置 , 在此处配置一个 IPv4 的地址
   配置修改的键盘使用方法 :
   a. 上下方向键选择需要修改的位置
   b. 上下方向键选定位置后，按回车键表示修改
   c. IPv4 Address 、 Subnet Mask 、 Default Gateway 修改完成后，按 ESC 键表示修改完毕并
   退出 LAN Parameters 选项配置； 

   ![img]({{ site.cdn }}/assets/images/blog/2021/20210125105354.png)

4. 在图 2 界面中将光标移动至 LAN User configuration 选项，按回车键进入配置 

   ![img]({{ site.cdn }}/assets/images/blog/2021/20210125105420.png)

   ![img]({{ site.cdn }}/assets/images/blog/2021/20210125105443.png)

   默认用户名为 root 将密码设置为 !power
   配置密码时的键盘使用方法 :
   a. 上下方向键选择两处输入密码的位置
   b. 确认密码输入后，按回车键表示保存
   注意保存的时候一定要先按回车键保存，然后在按 ESC键退出回到图 2 界面； 

5. 4 中最后一步回到图 2 界面后，继续按 ESC键后，如下图界面 

   ![img]({{ site.cdn }}/assets/images/blog/2021/20210125105522.png)

6. 前面 5 步配置完成后， iDRAC6卡的网线连接至如下面所示 IDRAC6卡网口 处 :
   Dell R510 设备后端 iDRAC6 卡+4 块 NIC 的位置图示 

   ![img]({{ site.cdn }}/assets/images/blog/2021/20210125105603.png)

### 安装linux系统

1. 通过浏览器访问远程管理卡的IP地址，默认是192.168.0.120

   ![img]({{site.cdn}}assets/images/blog/2019/20190414194107.png)

2. 提示更改密码，可以设置新密码或本次不更改密码

   ![img]({{site.cdn}}assets/images/blog/2019/20190414194132.png)

3. 跳过更改密码步骤

   ![img]({{site.cdn}}assets/images/blog/2019/20190414194202.png)

4. 点击启动

   ![img]({{site.cdn}}assets/images/blog/2019/20190414194237.png)

5. 下载一个文件

   ![img]({{site.cdn}}assets/images/blog/2019/20190414194336.png)

6. 更改使用java打开

   ![img]({{site.cdn}}assets/images/blog/2019/20190414194404.png)

7. 使用java打开

   ![img]({{site.cdn}}assets/images/blog/2019/20190414194428.png)

8. 点击继续

   ![img]({{site.cdn}}assets/images/blog/2019/20190414194454.png)

9. 点击运行

   ![img]({{site.cdn}}assets/images/blog/2019/20190414194520.png)

   ![img]({{site.cdn}}assets/images/blog/2019/20190414194540.png)

10. 连接成功之后的界面

   ![img]({{site.cdn}}assets/images/blog/2019/20190414194605.png)

11. 连接到虚拟介质，类似于给服务器做一个远程的虚拟光驱

    ![img]({{site.cdn}}assets/images/blog/2019/20190414194635.png)

12. 关联到本地iso镜像

    ![img]({{site.cdn}}assets/images/blog/2019/20190414194701.png)

13. 选择iso并关联

    ![img]({{site.cdn}}assets/images/blog/2019/20190414194733.png)

14. 验证映射成功

    ![img]({{site.cdn}}assets/images/blog/2019/20190414194757.png)

15. 更改下次引导方式

    ![img]({{site.cdn}}assets/images/blog/2019/20190414194824.png)

16. 确认更改下次因此方式为虚拟ISO

    ![img]({{site.cdn}}assets/images/blog/2019/20190414194914.png)

17. 热重启服务器

    ![img]({{site.cdn}}assets/images/blog/2019/20190414194938.png)

18. 重启

    ![img]({{site.cdn}}assets/images/blog/2019/20190414194956.png)

19. 传递内存参数给网卡命名

    ![img]({{site.cdn}}assets/images/blog/2019/20190414195100.png)

### 系统开关机

1. 启动服务器，在启动过程中会出现相应提示，按下某某键进入远程管理卡配置界面。登录进去为它配置一个正确的IP地址。接着，在局域网内任意一台电脑的访问上面配置的IP地址，就能够显示远程管理卡的登录界面。如下图。

   ![img]({{site.cdn}}assets/images/blog/2019/20190414194107.png)

2. 输入账号，密码登陆系统，如下图：

   ![img]({{site.cdn}}assets/images/blog/2019/20190414194237.png)

3. 点击启动按钮->下载可执行文件->执行文件（需要java运行环境）->进入控制台 如下图所示：

   ![img]({{site.cdn}}assets/images/blog/2019/20190414194605.png)

4. 通过控制台，可以进行机器开机、关机、重启操作；配置下次引导方式； 如下图所示
   ![img]({{site.cdn}}assets/images/blog/2019/20190415004653.png)

## 参考资料

[Dell-R510服务器iDRAC6卡配置和各网卡网线的连接操作文档](https://wenku.baidu.com/view/80fd253ea417866fb94a8e1e.html)

[通过iDRAC卡远程安装Centos 7系统](http://blogs.studylinux.net/?p=4609)





