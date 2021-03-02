---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 物理机上安装exsi的常用配置
category: devops
tags: [devops,exsi]
excerpt: 物理机上安装exsi的常用配置
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,exsi,ssh,linux
---



## 简介

本来打算常用配置和安装放到一起的,可是感觉有点多所以分下来了

## 配置

> 在服务器上,根据左下角提示，单击“F2”进入配置菜单。提示输入root的密码，单击“回车”键确认，进入ESXI控制台

### 菜单解释

| 英文                          | 中文           |
| --------------------------- | ------------ |
| ConfigurePassword           | 配置root密码     |
| ConfigureLockdown           | 配置锁定模式[^1]   |
| ConfigureManagement Network | 配置网络         |
| RestartManagement Network   | 重启网络         |
| TestManagement Network      | 使用Ping命令测试网络 |
| NetworkRestore Options      | 还原网络配置       |
| ConfigureKeyboard           | 配置键盘布局       |
| TroubleshootingOptions      | 故障排除设置       |
| ViewSystem Logs             | 查看系统日志       |
| ViewSupport Information     | 查看支持信息       |

[^1]: 配置锁定模式。启用锁定模式后，除vpxuser以外的任何用户都没有身份验证权限，也无法直接对ESXi执行操作。锁定模式将强制所有操作都通过vCenter Server执行。 

***

### 密码修改

选中Configure Password，单击“回车”键确认，提示输入老密码和二次新密码，按“回车”，密码修改完成。

![img]({{ site.cdn }}assets/images/blog/2019/20190414233808.png)

***

### 网络配置

> 设置静态IP地址由于IP地址默认是DHCP获取的，企业环境中都要配置静态IP地址，选中Configure Management Network按“回车”键确认，选择IPV4

| 中文                 | 英文       |
| ------------------ | -------- |
| NetworkAdapters    | 网卡选择     |
| VLAN（optional）     | 设置VLan   |
| IPv4Configuration  | 设置IPv4地址 |
| IPv6Configuration  | 设置IPv4地址 |
| DNSConfiguration   | 设置DNS地址  |
| CustomDNS Suffixes | 自定义DNS后缀 |

NetworkAdapters : 此处可以选择多块网卡

------

选中ipv4

![img]({{ site.cdn }}assets/images/blog/2019/20190414234105.png)

按空格键选中第三项，设置静态IP地址、掩码、网关的信息

DisableIPv4 configuration for management network        禁用IPv4地址 

Usedynamic IPv4 address and network configuration       配置动态IPv4地址 

Setstatic IPv4 address and network configuration        配置静态IPv4地址

![img]({{ site.cdn }}assets/images/blog/2019/20190414234253.png)

***

### DNS配置

选中dns

![img]({{ site.cdn }}assets/images/blog/2019/20190414234314.png)

配置dns

![img]({{ site.cdn }}assets/images/blog/2019/20190414234342.png)

***

### 密码设置为空

选择重置我们的系统

![img]({{ site.cdn }}assets/images/blog/2019/20190415000313.png)

重启结束后,我们在按`F2`登录就不用密码了

***

### 开启ssh和shell

`可以在服务端配置,也可以在客户端配置`

#### 服务端配置

![img]({{ site.cdn }}assets/images/blog/2019/20190414234413.png)

![img]({{ site.cdn }}assets/images/blog/2019/20190414234518.png)

#### 网页客户端配置

![img]({{ site.cdn }}assets/images/blog/2019/20190415001230.png)

***

### 注册激活

此时我们可以看到还是未激活的状态

![img]({{ site.cdn }}assets/images/blog/2019/20190414224305.png)

下面进行激活,输入激活码(可以在网上随便找个)

![img]({{ site.cdn }}assets/images/blog/2019/20190414224357.png)

此时在回到主机里面看下,就是激活的状态了

![img]({{ site.cdn }}assets/images/blog/2019/20190414224452.png)

***

### *修改登录端口

暂无

***

### 硬盘配置

用于配置我们的硬盘策略

1. 首先点击导航栏的存储

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415222112.png)

2. 可以看到此时我们的数据存储中有一块硬盘,而设备里面有两块硬盘`我们要把设备里面的硬盘添加到数据存储里面`

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415222149.png)

3. 选择`新建数据存储`

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415222313.png)

4. 选中`创建新的`下一步

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415222847.png)

5. 起个名字创建新的 下一步

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415222949.png)

6. 分配容量 下一步

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415223036.png)

7. 完成

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415223110.png)

8. 点击`是` 之后可以查看分配后的容量

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415223146.png)

***

### 硬盘直通

1. 获取需要挂在的硬盘的设备和名称

   ![img]({{ site.cdn }}assets/images/blog/2019/20190421150718.png)

   ![img]({{ site.cdn }}assets/images/blog/2019/20190421150600.png)

2. 获取被挂在点的路径

   ![img]({{ site.cdn }}assets/images/blog/2019/20190421150753.png)

   ![img]({{ site.cdn }}assets/images/blog/2019/20190421150435.png)

3. 在shell命令行中进行挂在

   > vmkfstools -z /vmfs/devices/disks/未格式化硬盘标识符 /vmfs/volumes/ESXI系统盘路径/自定义名称.vmdk

   ```shell
   #实例
   vmkfstools -z /vmfs/devices/disks/naa.6d4ae5209bca9200244f3c071b330270 /vmfs/volumes/5cbc81e9-f174644f-646b-d4ae52a7720b/NAS.vmdk
   ```

   `注意此处要写个名字`

   ![img]({{ site.cdn }}assets/images/blog/2019/20190421150955.png)


4. 查看

   ![img]({{ site.cdn }}assets/images/blog/2019/20190421151039.png)

5. 使用

   添加虚拟机的时候删除默认硬盘

   ![img]({{ site.cdn }}assets/images/blog/2019/20190421151259.png)

   添加现有硬盘

   ![img]({{ site.cdn }}assets/images/blog/2019/20190421151355.png)

   选中我们创建的即可

   ![img]({{ site.cdn }}assets/images/blog/2019/20190421151426.png)

***

### 网卡配置

***如图***'

![img]({{ site.cdn }}assets/images/blog/2019/20190419164708.png)

***端口组***

> VM Network - 用于所有虚拟网路卡连接的端口，相当于物理交换机的下行端口组

添加端口组时,需要依赖虚拟交换机,好比我们的电脑网口要连接路由器.

![img]({{ site.cdn }}assets/images/blog/2019/20190419170216.png)

***虚拟交换机***

- 添加虚拟交换机需要依赖 上行链路(`就是物理网卡`),可以和外网通信


- 如果没有上行链路,那么这个交换机就不能和外网通信,那么连接到这个虚拟交换机上的端口组也不能和外网通信.就是个内网模式

![img]({{ site.cdn }}assets/images/blog/2019/20190419170325.png)

***物理网卡***

就是我们安装exsi物理机的物理网口

图中的全双工

![img]({{ site.cdn }}assets/images/blog/2019/20190419170546.png)

> - [全双工](https://baike.baidu.com/item/%E5%85%A8%E5%8F%8C%E5%B7%A5/310007?fr=aladdin#2)（Full Duplex）是通讯传输的一个术语。通信允许数据在两个方向上同时传输，它在能力上相当于两个单工通信方式的结合。全双工指可以同时（瞬时）进行信号的双向传输（A→B且B→A）。指A→B的同时B→A，是瞬时同步的。
> - [半双工](https://baike.baidu.com/item/%E5%8D%8A%E5%8F%8C%E5%B7%A5)（Half Duplex），所谓半双工就是指一个时间段内只有一个动作发生，举个简单例子，一条窄窄的马路，同时只能有一辆车通过，当目前有两辆车对开，这种情况下就只能一辆先过，等到头儿后另一辆再开，这个例子就形象的说明了半双工的原理。早期的[对讲机](https://baike.baidu.com/item/%E5%AF%B9%E8%AE%B2%E6%9C%BA)、以及早期[集线器](https://baike.baidu.com/item/%E9%9B%86%E7%BA%BF%E5%99%A8)等设备都是基于半双工的产品。随着技术的不断进步，半双工会逐渐退出历史舞台
> - [单工](https://baike.baidu.com/item/%E5%8D%95%E5%B7%A5/8605636)就是在只允许甲方向乙方传送信息，而乙方不能向甲方传送 。（比喻汽车的单行道。）

***VMkernel网卡***

一般情况下个人使用的话,可以不用配置

`如图`

![img]({{ site.cdn }}assets/images/blog/2019/20190419170718.png)

[参考](http://blog.sina.com.cn/s/blog_6ceed3280101gj91.html)

VMkernel 包含多个子接口，分别是：`Management Traffic`、`vMotion`、`Fault Tolerance`和`IP Storage`；

> 默认情况下，VMkernel下的4个子接口的IP地址，都可以用于vSphere Client或命令行登录管理，那么，区别究竟体现在哪里呢？

- Management Traffic - 这个接口主要用于配置vSphere HA时，管理网路心跳传输时用，如果不勾选，则意味着，没有vSphere HA没有心跳网路，将配置失败；
- vMotion - 这个接口则用于支持将虚拟机从A ESXi主机在线迁移到B ESXi主机，如果没有这个接口，将无法迁移；
- Fault Tolerance - 这个接口则用于支持虚拟机容错；
- IP Storage - 这个接口被用于连接IP存储用，包括iSCSI和NFS存储，都可以；

> 默认情况下，可以把所有选项都勾选上，但是，这样一来，所有流量都将走同一个通道，容易形成相互干扰，进而导致对应的功能失败。因此，在生产环境中，建议独立划分不同的VMkernel子接口，以便完全保障对应业务的成功性。

***TCP/IP堆栈***

***防火墙规则***

***

### *网卡直通 

暂无

***

### ssl配置

1. 获取https的证书

2. 将证书传到根目录中

   ![img]({{ site.cdn }}assets/images/blog/2019/20190416003742.png)

3. 获取到的证书是已`.pem 和 .key结尾的`

   改名后,找台linux服务器,将`.pem`转换为`.crt`,之后在下载下来

   ```shell
   #备份之前的
   mv rui.crt rui.crt.bak
   mv rui.key rui.key.bak
   #将pem转换为crt
   openssl x509 -inform PEM -in 2060789_exsi.carlme.com.pem  -out rui.crt
   #移动 crt 和key 到/etc/vmware/ssl中
   mv 2060789_exsi.carlme.com.key /etc/vmware/ssl/rui.key
   mv rui.crt /etc/vmware/ssl
   #重启服务
   services.sh restart

   ```

4. 效果

   ![img]({{ site.cdn }}assets/images/blog/2019/20190416004221.png)

***

### 虚拟机自动启动

1. 选中需要自动启动的虚拟机,右键

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415001605.png)

2. 选中自动启动

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415001702.png)

3. 配置EXSI

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415001801.png)

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415001836.png)

4. 之后会在下载看到,开机自动启动的设备

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415001909.png)

***

### ssh登陆

## 添加虚拟机

1. 创建新的虚拟机

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415235245.png)

2. 起个名称选系统

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415235344.png)

3. 此处我们先选系统盘`等虚拟机创建好了,再选数据盘`

   ![img]({{ site.cdn }}assets/images/blog/2019/20190415235428.png)

4. 选择合适的配置

   ![img]({{ site.cdn }}assets/images/blog/2019/20190416005412.png)

5. 最后看下配置点完成

   ![img]({{ site.cdn }}assets/images/blog/2019/20190416005451.png)

6. 配置完成点击虚拟机,之后打开电源,开始安装

   ![img]({{ site.cdn }}assets/images/blog/2019/20190416005536.png)

7. 安装完成后,将网卡的网段,设置为和exsi同一个网段即可

   ![img]({{ site.cdn }}assets/images/blog/2019/20190416005953.png)

### 为虚拟机分配数据盘

1. 点击`编辑`

   ![img]({{ site.cdn }}assets/images/blog/2019/20190416171105.png)

2. 点击`添加硬盘->新硬盘->再点击出现的新硬盘`为它分配机械硬盘

   ![img]({{ site.cdn }}assets/images/blog/2019/20190416171157.png)

3. 在数据盘中创建`data/main-centos`目录将磁盘挂到这里面

   ![img]({{ site.cdn }}assets/images/blog/2019/20190416171256.png)

4. 无需重启直接登录服务器查看

   ![img]({{ site.cdn }}assets/images/blog/2019/20190416171352.png)

### 三类磁盘的区别

![img]({{ site.cdn }}assets/images/blog/2019/20190416171413.png)

1. 厚置备延迟置零（zeroed thick）

   > 以默认的厚格式创建虚拟磁盘。创建过程中为虚拟磁盘分配所需空间。创建时不会擦除物理设备上保留的任何数据，但是以后从虚拟机首次执行写操作时会按需要将其置零。
   >
   > 简单的说就是立刻分配指定大小的空间，空间内数据暂时不清空，以后按需清空。

2. 厚置备置零（eager zeroed thick)

   > 创建支持群集功能（如 FaultTolerance）的厚磁盘。在创建时为虚拟磁盘分配所需的空间。与平面格式相反，在创建过程中会将物理设备上保留的数据置零。创建这种格式的磁盘所需的时间可能会比创建其他类型的磁盘长。
   >
   > 简单的说就是立刻分配指定大小的空间，并将该空间内所有数据清空。

3. 精简置备（thin）

   > 使用精简置备格式。最初，精简置备的磁盘只使用该磁盘最初所需要的数据存储空间。如果以后精简磁盘需要更多空间，则它可以增长到为其分配的最大容量。
   >
   > 简单的说就是为该磁盘文件指定增长的最大空间，需要增长的时候检查是否超过限额。

## FAQ

### SSD显示为非SSD

问题: 硬盘为SSD但是在EXSI中的控制台显示为不是SSD

原因: 在使用固态硬盘时，不要使用服务器的RAID卡配置程序将硬盘用RAID配置(`还是得配置一下,防止数据丢失`)，因为在启用了RAID配置之后，在VMware ESXi中将不能正确的识别出固态硬盘，此时只会将固态硬盘作为普通磁盘使用。如下图固态硬盘被识别成“非SSD”

![img]({{ site.cdn }}assets/images/blog/2019/20190414235143.png)

而固态硬盘未使用RAID卡配置时，就是将固态硬盘直接装在服务器上，不进行配置，在ESXi中是可以被正确识别的

解决:

```shell
#人工定义一下： 
#用root登录进ESXi控制台：
#列出储存清单
esxcli storage nmp device list        
#执行指令，将未识别的SSD设备设置为SSD
esxcli storage nmp satp rule add -s VMW_SATP_LOCAL --device naa.xxxxxxxxxxxxxxxxx --option="enable_ssd" 
#经过测试，如果数据存储中有数据的情况下执行此步骤进行转换，对存储内的数据不影响
#之后重启服务器
reboot
```

修改过后可以看到为`SSD`了

![img]({{ site.cdn }}assets/images/blog/2019/20190415221133.png)

> 追问:
>
> 请问，执行完这个命令后，“驱动器类型”会更改为SSD，但实际上软件是否已经识别了这个SSD吗？ 或者说，我要是再加载一块SSD的话，是否还要执行这个命令？
> 追答:
> 识别不出就改一下，SSD主要区别是能做cache，如果只做datastore的话，不改也一样

------

### 6.5版本SSD速度慢

问题:6.5版本SSD速度慢

原因:6.5更新了`vmw-ahci `的磁盘驱动

解决:

```shell
#登录SSH。先查看一下加载的驱动。
esxcli software vib list | grep ahci

#若加载了vmw-ahci，则形如：
sata–ahci 3.0–22vmw.650.0.0.4564106 VMW VMwareCertified 2016–11–16
vmw–ahci 1.0.0–32vmw.650.0.0.4564106 VMW VMwareCertified 2016–11–16

#则： 禁用 vmw_ahci
esxcli system module set --enabled=false --module="vmw_ahci"
#重启
reboot
```

***

### Authentication Denied

问题: 在服务器主机登录出现`Authenication Denied`,如图

![img]({{ site.cdn }}assets/images/blog/2019/20190416001509.png)

原因: 可能是配置ssl之后重启出错

解决:

```shell
#在shell模式下执行
services.sh restart
```

***

### 登录出现 503

问题: 503 Service Unavailable

原因: 暂无

解决: 刷新后可解决

---

### EXSI 添加VMware tools

问题: 出现失败:当前情况不允许此操作

原因: 电源在开启的状态下不可以添加

解决: 关闭电源在添加

## 参考资料

[VLOG丨玩转虚拟机之ESXI6.7小白超详细安装基础设置教程及网卡不支持手动添加驱动教学](https://www.vediotalk.com/?p=2356)

[VMware vSphere Client(4.1/5.0/5.1/5.5/6.0) 客户端下载地址](https://segmentfault.com/a/1190000010139229?utm_source=tag-newest)

[VMware vSphere Client客户端安装图解教程 ,系统运维](http://www.360doc.com/content/17/1129/14/9824753_708289980.shtml)

[ESXI下挂的SSD，读写速度都成这样了](https://www.chiphell.com/thread-1711679-1-1.html)

[VMware厚置备延迟置零 、 厚置备置零、精简置备 区别](https://www.cnblogs.com/jinanxiaolaohu/p/9685744.html)