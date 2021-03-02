---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: NAS的常用端口 软件
category: devops
tags: [devops]
excerpt: NAS的常用端口 软件
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,nas,exsi
---

## 简介

本文主要介绍,nas安装完后一些常用的端口和软件

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
>
> 群晖有两个套件可用于NAS到PC的备份与同步，`其中Cloud Station BackuP是电脑端向NAS端的单向备份`，`Cloud Station Drive是电脑端和NAS端的双向同步`，所以要注意这二者之间的区别使用。
>
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

## FAQ

Cloud Statin Backup不可以修改

![img]({{ site.cdn }}assets/images/blog/2019/20190422231640.png)

重新连接之后可以设置

![img]({{ site.cdn }}assets/images/blog/2019/20190422231830.png)

## 参考资料

[Synology 服务使用哪些网络端口？](https://o.hiue.cn/41.html)
