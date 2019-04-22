---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: nas的常用配置
category: devops
tags: [devops]
excerpt: nas的常用配置
keywords: carlme,superwang,superwangcarl,carl,卡尔米,nas,的常用配置,exsi
---

## 简介

本文主要介绍,nas安装完后一些常用的配置

![img]({{site.cdn}}/assets/images/blog/2019/20190421222115.png)

## 配置

### 设置固定ip

控制面板->网络->网络界面->编辑

![img]({{site.cdn}}/assets/images/blog/2019/20190421183915.png)

ipv4->手动设置网络配置->ip地址

![img]({{site.cdn}}/assets/images/blog/2019/20190421184000.png)

保存

***

### 新增磁盘

打开存储空间管理员

![img]({{site.cdn}}/assets/images/blog/2019/20190421184936.png)

查看当前的物理磁盘情况

![img]({{site.cdn}}/assets/images/blog/2019/20190421185038.png)

#### 新增RAID GROUP

![img]({{site.cdn}}/assets/images/blog/2019/20190421185207.png)

选择单个,性能高点,如果磁盘多于24个择选择第二个

![img]({{site.cdn}}/assets/images/blog/2019/20190421185248.png)

选择`Basic`不设置raid,应为我底层服务器已经用阵列卡设置过了

![img]({{site.cdn}}/assets/images/blog/2019/20190421185354.png)

将磁盘拖入

![img]({{site.cdn}}/assets/images/blog/2019/20190421185453.png)

![img]({{site.cdn}}/assets/images/blog/2019/20190421185537.png)

选择是,磁盘过大不建议选

> 会提示 新添加硬盘的数据将被擦除-确定
>
> 磁盘检查选项按需；如以后将存放重要资料建议选择“是”，实测3T硬盘检查时间大概10小时 对磁盘IO影响非常严重，如果对硬盘足够方向则选择 “否”（不建议），达到“开箱即用”的效率

![img]({{site.cdn}}/assets/images/blog/2019/20190421185653.png)

应用

![img]({{site.cdn}}/assets/images/blog/2019/20190421185725.png)

#### 新增存储空间

![img]({{site.cdn}}/assets/images/blog/2019/20190421190243.png)

***

### 添加共享文件夹

控制面板->共享文件夹->新增

![img]({{site.cdn}}/assets/images/blog/2019/20190421192544.png)

添加

![img]({{site.cdn}}/assets/images/blog/2019/20190421192725.png)

按需选择是否需要加密,如需要填写密码

![img]({{site.cdn}}/assets/images/blog/2019/20190421192849.png)

配额

![img]({{site.cdn}}/assets/images/blog/2019/20190421193008.png)

完成

![img]({{site.cdn}}/assets/images/blog/2019/20190421193038.png)

按需选择

![img]({{site.cdn}}/assets/images/blog/2019/20190421193121.png)

***

### 删除共享文件夹

![img]({{site.cdn}}/assets/images/blog/2019/20190421203105.png)

***

### 文件上传

***方式一***

使用web的方式

![img]({{site.cdn}}/assets/images/blog/2019/20190421193947.png)

***方式二***

直接使用window自带的资源管理器

按下`win+R` ,输入nas的连接地址

![img]({{site.cdn}}/assets/images/blog/2019/20190421194203.png)

输入nas的帐号密码

....

windows配置启用发现

![img]({{site.cdn}}/assets/images/blog/2019/20190421194337.png)

显示

![img]({{site.cdn}}/assets/images/blog/2019/20190421195124.png)

***方式三***

使用ftp上传

设置ftp

![img]({{site.cdn}}/assets/images/blog/2019/20190421233657.png)

配置ftp

`注意相应的端口需要在路由器里面配置`

![img]({{site.cdn}}/assets/images/blog/2019/20190421235117.png)



***

### 设置个人邮箱

![img]({{site.cdn}}/assets/images/blog/2019/20190421190359.png)

***

### 通知设置

控制面板->通知设置

![img]({{site.cdn}}/assets/images/blog/2019/20190421190443.png)

设置邮箱并测试

![img]({{site.cdn}}/assets/images/blog/2019/220190421191042.png)

***

### 创建用户

控制面板->用户账户->新增

![img]({{site.cdn}}/assets/images/blog/2019/20190421184200.png)

添加用户(可以使用随机密码)

![img]({{site.cdn}}/assets/images/blog/2019/20190421192255.png)

选择用户组

![img]({{site.cdn}}/assets/images/blog/2019/20190421192335.png)

共享文件夹权限`不配置后面的权限,则使用前面的用户组权限`

![img]({{site.cdn}}/assets/images/blog/2019/20190421193408.png)

套间权限配置

![img]({{site.cdn}}/assets/images/blog/2019/20190421193501.png)

限速配置`0不限速`

![img]({{site.cdn}}/assets/images/blog/2019/20190421193621.png)

应用

![img]({{site.cdn}}/assets/images/blog/2019/20190421193658.png)

***

### 安全配置

***启用https 修改默认端口***

> 尽量使用HTTPs访问，避免中间人攻击。设置方法是：首先禁用掉黑群晖的HTTP访问，并把所有HTTP访问重定向到HTTPS上来，开启HTTP/2加速访问

控制面板->网络->DSM设置

![img]({{site.cdn}}/assets/images/blog/2019/20190421195432.png)

***修改常用端口***

> 修改DSM以及套件的端口。DSM的端口见上图，套件的端口在控制面板->Synology 应用程序门户中进行一一修改

![img]({{site.cdn}}/assets/images/blog/2019/20190421200416.png)

***启用DSM防火墙 未用***

![img]({{site.cdn}}/assets/images/blog/2019/20190421200737.png)

***启用2部验证***

> 启用2部验证，对于新设备的登陆，要求用户提供一个动态的OTP码（通过安装google的Authenticator获得OTP）

![img]({{site.cdn}}/assets/images/blog/2019/20190421201143.png)

去 `App Store`下载 `google Authenticator`

![img]({{site.cdn}}/assets/images/blog/2019/20190421201322.png)

之后用 `google Authenticator`扫描会有验证码,输入即可

***

### 取消更新

控制面板->计划任务

![img]({{site.cdn}}/assets/images/blog/2019/20190421191241.png)

右键删除计划

![img]({{site.cdn}}/assets/images/blog/2019/20190421191315.png)

***

### *初始化密钥管理器

暂无

***

### *磁盘映射本地

暂无

***

### 关闭声音

应为是装到exsi里面的,声音也没什么用,所以关了

![img]({{site.cdn}}/assets/images/blog/2019/20190421192042.png)

## 备份

### raid备份

无,详见上方新增磁盘

### *电脑和nas备份

***nas端安装 :*** `Drive`

***PC端安装 :*** `Cloud Station Drive`

服务端的`drive`默认端口为6690,需要在路由器中做相应的映射

服务端代开 Drive管理控制台

![img]({{site.cdn}}/assets/images/blog/2019/20190421204411.png)

配置团队文件夹

![img]({{site.cdn}}/assets/images/blog/2019/20190421235345.png)

客户端输入地址和帐号密码

![img]({{site.cdn}}/assets/images/blog/2019/20190421235504.png)

编辑服务器上的位置

![img]({{site.cdn}}/assets/images/blog/2019/20190422090705.png)

创建个文件夹

![img]({{site.cdn}}/assets/images/blog/2019/20190422090744.png)

选择本地需要同步的位置

![img]({{site.cdn}}/assets/images/blog/2019/20190422090902.png)

选中文件夹,不可不创建空的`SynologyDrive`

![img]({{site.cdn}}/assets/images/blog/2019/20190422091000.png)

完成

![img]({{site.cdn}}/assets/images/blog/2019/20190422091058.png)

***配置策略***

一般用来备份的话,可以配置单向上传,这样本地删除了,还可以去服务器上取

![img]({{site.cdn}}/assets/images/blog/2019/20190422091443.png)

默认的图标样式是这样的

![img]({{site.cdn}}/assets/images/blog/2019/20190422092234.png)

可以取消这些选中,则不显示样式

![img]({{site.cdn}}/assets/images/blog/2019/20190422092308.png)

![img]({{site.cdn}}/assets/images/blog/2019/20190422092340.png)

## 常用套件

### *CloudSync

> 主要用于同步 百度云等的存储

安装

![img]({{site.cdn}}/assets/images/blog/2019/20190421191437.png)

### *Drive

> 和电脑的备份

![img]({{site.cdn}}/assets/images/blog/2019/20190421203313.png)

### *Snapshot Replication

> 快照

![img]({{site.cdn}}/assets/images/blog/2019/20190421205320.png)

### *video station

> 网页看视频

### *photo station

> 照片

### *download station

> bt下载

### *virtual Machine

> 虚拟化

### *iscsi manager

> nas的存储 映射到电脑上

## 常用端口

### 设置实用程序

| **类型**             | **端口号码**       | **协议** |
| ------------------ | -------------- | ------ |
| Synology Assistant | 9999、9998、9997 | UDP    |

### 备份

| **类型**                                   | **端口号码**                                | **协议** |
| ---------------------------------------- | --------------------------------------- | ------ |
| Data Replicator、Data Replicator II、Data Replicator III | 9999、9998、9997、137、138、139、445          | TCP    |
| DSM 5.2 数据备份、rsync、共享文件夹同步、远程 Time Backup | 873、22（如果通过 SSH 加密）                     | TCP    |
| Hyper Backup（目标）                         | 6281（多版本备份）、22（如果通过 SSH 加密）、873（远程数据复制） | TCP    |
| Hyper Backup Vault、DSM 5.2 Archiving Backup | 6281                                    | TCP    |
| LUN 备份                                   | 3260 (iSCSI)、873、22（如果通过 SSH 加密）        | TCP    |
| Snapshot Replication                     | 3261 (iSCSI LUN)、5566（共享文件夹）            | TCP    |

### 下载

| **类型** | **端口号码**                                 | **协议**  |
| ------ | ---------------------------------------- | ------- |
| BT     | 6890 ~ 6999（用于固件版本早于 v2.0.1-3.0401 的型号）；16881（用于 DSM 版本 v2.0.1 及以上的型号） | TCP/UDP |
| eMule  | 4662 (TCP)、4672 (UDP)                    | TCP/UDP |

### Web 应用程序

| **类型**       | **端口号码**                               | **协议** |
| ------------ | -------------------------------------- | ------ |
| DSM          | 5000 (HTTP)、5001 (HTTPS)               | TCP    |
| File Station | 5000（HTTP，可添加其它端口）、5001（HTTPS，可添加其它端口） | TCP    |

### Mail Server

| **类型**            | **端口号码** | **协议** |
| ----------------- | -------- | ------ |
| IMAP              | 143      | TCP    |
| 通过 SSL/TLS 的 IMAP | 993      | TCP    |
| POP3              | 110      | TCP    |
| 通过 SSL/TLS 的 POP3 | 995      | TCP    |

### 文件传输

| **类型**                        | **端口号码**                                 | **协议**  |
| ----------------------------- | ---------------------------------------- | ------- |
| AFP                           | 548                                      | TCP     |
| CIFS                          | smbd：139 (netbios-ssn) 与 445 (microsoft-ds) | TCP/UDP |
| Nmbd：137、138                  | UDP                                      |         |
| FTP、通过 SSL 的 FTP、通过 TLS 的 FTP | 21（命令）、20（主动模式的数据连接）、1025-65535（被动模式的数据连接；但默认范围因型号而异） | TCP     |
| iSCSI                         | 3260                                     | TCP     |
| NFS                           | 111、892、2049                             | TCP/UDP |
| TFTP                          | 69                                       | UDP     |
| WebDAV、CalDAV                 | 5005、5006 (HTTPS)                        | TCP     |

### 套件

| **类型**                    | **端口号码**                                 | **协议**  |
| ------------------------- | ---------------------------------------- | ------- |
| Audio Station             | 1900 (UDP)、5000（HTTP，可添加其它端口）、5001（HTTPS，可添加其它端口）、5353（Bonjour 服务）、6001-6010（AirPlay 控制/定时） | TCP/UDP |
| 日历                        | 38008、38443                              | CalDAV  |
| CardDAV                   | 8008 (HTTP)、8443 (HTTPS)                 | TCP     |
| 集中化管理系统 (CMS)             | 5000 (HTTP)、5001 (HTTPS)                 | TCP     |
| CIFS 向外延展集群               | 49152-49252仅 TCP：17909、17913、19998、24007、24008、24009-24045、38465-38501、4379 | TCP/UDP |
| Cloud Station             | 6690                                     | TCP     |
| DHCP Server               | 67、68                                    | UDP     |
| Directory Server          | 389 (LDAP)、636（LDAP 含 SSL）               | TCP     |
| Download Station          | 5000                                     | TCP     |
| Drive                     | 5000 (HTTP)、5001 (HTTPS)、6690            | TCP     |
| iTunes Server             | 3689                                     | TCP     |
| Logitech® Media Server    | 3483、9002                                | TCP     |
| Mail Station              | 80 (HTTP)、443 (HTTPS)                    | TCP     |
| 媒体服务器                     | 1900 (UPnP)、50001（内容浏览）、50002（内容串流）      | TCP/UDP |
| Moments                   | 5000 (HTTP)、5001 (HTTPS)                 | TCP     |
| Note Station              | 5000 (HTTP)、5001 (HTTPS)                 | TCP     |
| Photo Station、Web Station | 80（可添加其它端口）、443 (HTTPS)                  | TCP     |
| Presto File Server        | 3360 (TCP/UDP)、3361 (TCP/UDP)            | TCP/UDP |
| 代理服务器                     | 3128                                     | TCP     |
| Surveillance Station      | 9900 (HTTP)、9901 (HTTPS)                 | TCP     |
| Syslog Server             | 514（可添加其它端口）                             | TCP/UDP |
| Video Station             | 1900 (UDP)、5000 (HTTP)、5001 (HTTPS)、9025-9040、5002、5004、65001（使用 HDHomeRun 网络调谐器的机型） | TCP/UDP |
| Virtual Machine Manager   | 2379-2382（集群网络）、3260-3264 (iSCSI)、16509、16514、30200-30300 | TCP     |
| VPN Server (OpenVPN)      | 1194                                     | UDP     |
| VPN Server (PPTP)         | 1723                                     | TCP     |
| VPN Server (L2TP/IPSec)   | 500、1701、4500                            | UDP     |

### 移动应用程序

| **类型**      | **端口号码**                 | **协议** |
| ----------- | ------------------------ | ------ |
| Drive       | 5000 (HTTP)、5001 (HTTPS) | TCP    |
| DS audio    | 5000、5001 (HTTPS)        | TCP    |
| DS cam      | 5000、5001 (HTTPS)        | TCP    |
| DS cloud    | 6690                     | TCP    |
| DS download | 5000 (HTTP)、5001 (HTTPS) | TCP    |

## PC端常用客户端

### **Synology Assistant（安装DSM系统工具）**

> Synology Assistant 是在局域网络内安装并管理 Synology DiskStation 的工具，尤其当您同时有多台 DiskStation 时在局域网络内工作时。您也可以使用 Synology Assistant 为 DiskStation 安装 DSM、设置 WOL、设置打印机，以及监控 Synology DiskStation 的资源。
> [PC端程序下载](https://cndl.synology.cn/download/Tools/Assistant/6.1-15163/Windows/synology-assistant-6.1-15163.exe)                    [MAC程序下载](https://cndl.synology.cn/download/Tools/Assistant/6.1-15163/Mac/synology-assistant-6.1-15163.dmg)

------

### Cloud Station Backup （文件备份工具）

> Cloud Station Backup 是一个备份服务，可让您从多个客户端计算机的文件备份到集中化的 Synology NAS。
> [PC端程序下载](https://cndl.synology.cn/download/Tools/CloudStationBackup/4.2.6-4408/Windows/Installer/Synology%20Cloud%20Station%20Backup-4.2.6-4408.exe)                   [MAC程序下载](https://cndl.synology.cn/download/Tools/CloudStationBackup/4.2.6-4408/Mac/Installer/synology-cloud-station-backup-4408.dmg)

------

### Cloud Station Drive （文件同步工具）

> Cloud Station Drive 这款应用程序旨在让您通过 Internet 即可在 Synology NAS 和 PC 之间同步文件，不仅能确保数据始终保持最新状态，还能让您轻松访问文件。即便在没有 Internet 连接的情况下，您仍可离线查看及编辑文件，且所有更改都会在重新连上 Internet 后自动同步至您的 Synology NAS 及 PC。
> [PC端程序下载](https://cndl.synology.cn/download/Tools/CloudStationDrive/4.2.6-4408/Windows/Installer/Synology%20Cloud%20Station%20Drive-4.2.6-4408.exe)                   [MAC程序下载](https://cndl.synology.cn/download/Tools/CloudStationDrive/4.2.6-4408/Mac/Installer/synology-cloud-station-drive-4408.dmg)

------

### Drive Client （更像云盘的工具-支持6.1系统）

> 桌面版 Drive 是 DSM 附加套件 Drive 的桌面实用程序，让您可以在集中化的 Synology NAS 与多台客户端计算机之间，同步和共享您拥有的文件或他人与您共享的文件。
> [PC端程序下载](https://cndl.synology.cn/download/Tools/SynologyDriveClient/1.0.3-10281/Windows/Installer/Synology%20Drive-1.0.3-10281.exe)                   [MAC程序下载](https://cndl.synology.cn/download/Tools/SynologyDriveClient/1.0.3-10281/Mac/Installer/synology-drive-10281.dmg)

------

### Photo Station Uploader （专门上传照片和视频）

> Photo Station Uploader 是将计算机中照片和视频批量上传到 Photo Station 的应用程序。它可使用计算机的处理能力来创建缩略图并将视频转换为高质量格式，而无需消耗 NAS 的系统资源。只需选择 Windows 文件资源管理器或 Mac Finder 中的文件并右键单击可上传。
> [PC端程序下载](https://cndl.synology.cn/download/Tools/PhotoStationUploader/1.4.3-087/Windows/Synology-PhotoStationUploader-Setup-087.exe)                   [MAC程序下载](https://cndl.synology.cn/download/Tools/PhotoStationUploader/1.4.3-087/Mac/PhotoStationUploader-087-Mac-Installer.dmg)

## 手机端常用客户端

在这里仅仅可以下载到安卓平台的程序，Iphone端请到app store中下载，直接搜索“synology”即可展现所有APP。

------

### **Drive（群晖云工具-支持6.1系统）**

> Android Drive 让您不论身在何处，都能轻松存取与管理 Synology Drive 内的档案。除了一般类型的档案，如文件、影像、影片与音乐外，您亦可在Drive 提供的易用浏览器中开启Synology Office 的文件、试算表及简报；此外，Android 也提供档案搜寻、分享、移动和套用标签等功能，让使用者随时随地都能以高效率完成任务。
> [安卓端程序下载](https://cndl.synology.cn/download/Mobile/Android-Drive/1.1.1-113/Android-DSdrive.1.1.1-113.apk)

------

### DS file （文件管理工具）

> DS file 可让您通过 Android 设备来安全地浏览 DiskStation 上的文件夹及文件，并在设备及 DiskStation 间传输文件。当您出门在外时，只要有网络联机皆能管理文件，您的 Android 设备将成为名符其实的数字公文包。此外，在网络联机受限时，可将文件下载至您的设备、于本地端进行存取；也可在 DiskStation 上启动 Cloud Station 功能，直接将文件同步至您的 PC 或 MAC 电脑。
> [安卓端程序下载](https://cndl.synology.cn/download/Mobile/Android-DSfile/4.10.5-287/Android-DSfile.4.10.5-287.apk)

------

### DS cloud （老的云工具）

> DS cloud 是 Cloud Station 在 Android 设备上的对应版本。它能让您选择 DiskStation 上要同步至移动设备的文件夹，并提供离线检视。DS cloud 亦提供同步条件的完整控制功能：您可为每个文件夹配置文件案大小上限及要同步的文件类型。
> [安卓端程序下载](https://cndl.synology.cn/download/Mobile/Android-DScloud/2.7.3-292/Android-DScloud.2.7.3-292.apk)

------

### Moments （新版云相册-支持6.1系统）

> Synology Moments 让您能随时随地使用 Android 设备查看 Synology Drive 中存储的照片/视频。您的所有照片将按时间顺序显示，并智能归类到主题相册,让刷新您生活中的独特时光变得趣致便捷。
> [安卓端程序下载](https://cndl.synology.cn/download/Mobile/Android-Moments/1.1.1-162/Android-Moments.1.1.1-162.china.apk)

------

### DS video （影视频管理工具）

> DS video 可让您在 Android 设备上串流 DiskStation 的 Video Station 视频库。DS video 会依电影、电视影集、家庭视频及节目录像来为您的视频进行分类，您可更轻松地浏览视频库。DS video 亦会自动取得并显示在线电影信息。如果您在 DiskStation 上插入数字电视棒，您便能录制、检视电视节目以远程管理录像排程。
> [安卓端程序下载](https://cndl.synology.cn/download/Mobile/Android-DSvideo/3.3.3-263/Android-DSvideo.3.3.3-263.apk)

------

### DS photo （老版本云相册）

> DS photo 可让您随时随地轻松浏览 Photo Station 中的相片及视频，并能通过相片、视频留言功能与好友实时交互。当您开启相簿，相片收藏会以缩图方式呈现：只要在屏幕上滑动便能在相片间进行移动。您可拍摄照片并直接上传到 Photo Station，或将照片存储到您的 Android 设备，随时随地进行重放。
> [安卓端程序下载](https://cndl.synology.cn/download/Mobile/Android-DSphoto/3.11.6-412/Android-DSphoto.3.11.6-412.apk)

------

### DS note （云笔记）

> 无论是创建每周执行工作列表、与团队成员共享项目信息或只是描述您的最佳假日回忆，DS note 的编辑功能能够随时随地 (甚至在没有网络的情况下) 轻松愉快地记录所需的任何事情。使用标签、记事本和快捷方式组成所有的便签，并立即与所需的任何人共享。而且始终安全，因为 DS note 将所有数据与您 Synology NAS 服务器、个人云中的便签库保持同步。
> [安卓端程序下载](https://cndl.synology.cn/download/Mobile/Android-DSnote/1.9.0-210/Android-DSnote.1.9.0-210.apk)

## 参考资料

[黑群晖 Lede路由的外网访问方案](http://www.360doc.com/content/19/0126/09/21435004_811362278.shtml)

[Synology 服务使用哪些网络端口？](https://o.hiue.cn/41.html)