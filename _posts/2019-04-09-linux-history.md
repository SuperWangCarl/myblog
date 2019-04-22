---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: Linux的history
category: linux
tags: [linux,history,time]
excerpt: Linux的history的命令介绍和配置
keywords: carlme,superwang,superwangcarl,carl,history,操作时间,操作历史,卡尔米
---



## 1. 简介

由于最近买了一台百度云服务器,后来使用history命令时发现带有时间,开始以为百度云是在`/etc/profile`文件中进行配置的,后来发现并不是,然后又查找了,`bash_profile、bashrc`发现都没有,比较纳闷,结果发现百度云的是放在`/etc/profile.d/`这个目录下的,所以写篇博客总结下,history的各种操作配置,存储等,

## 2. linux中环境变量的配置

配置文件有关的`/etc/profile、/etc/profile.d/bcc-hist.sh、~/.bash_profile、~/.bashrc、和~/.bash_logout `等

### profile文件

1. profile文件的作用

   1. profile(/etc/profile)，用于设置系统级的环境变量和启动程序，在这个文件下配置会对所有用户生效。
   2. 当用户登录(login)时，文件会被执行，并从/etc/profile.d目录的配置文件中查找shell设置。

2. 在profile中添加环境变量

   1. 一般不建议在/etc/profile文件中添加环境变量，因为在这个文件中添加的设置会对所有用户起作用。

      ```
      当必须添加时，我们可以按以下方式添加：
      如，添加一个HOST值为linuxprobe.com的环境变量：
      export HOST=linuxprobe.com
      添加时，可以在行尾使用;号，也可以不使用。
      一个变量名可以对应多个变量值，多个变量值需要使用:进行分隔。
      添加环境变量后，需要重新登录才能生效，也可以使用source命令强制立即生效：
      source /etc/profile
      查看是否生效可以使用echo命令：
      $ echo $HOST
      linuxprobe.com
      ```

### bashrc文件

bashrc文件用于配置函数或别名。bashrc文件有两种级别：
系统级的位于`/etc/bashrc`、用户级的位于`~/.bashrc`，两者分别会对所有用户和当前用户生效。
bashrc文件只会对指定的shell类型起作用，bashrc只会被bash shell调用。

### bash_profile文件

bash_profile只对单一用户有效，文件存储位于~/.bash_profile，该文件是一个用户级的设置，可以理解为某一个用户的profile目录下。
这个文件同样也可以用于配置环境变量和启动程序，但只针对单个用户有效。和profile文件类似，bash_profile也会在用户登录(login)时生效，也可以用于设置环境变量
但与profile不同，bash_profile只会对`当前用户生效`

### 差异总结

1. 首先读入全局环境变量设定档/etc/profile，然后根据其内容读取额外的设定的文档，如/etc/profile.d和/etc/inputrc;
2. 根据不同使用者帐号，于其家目录内读取~/.bash_profile;
   1. 读取失败则会读取~/.bash_login;
   2. 再次失败则读取~/.profile(这三个文档设定基本上无差别，仅读取上有优先关系);
3. 最后，根据用户帐号读取~/.bashrc。
4. 至于~/.profile与~/.bashrc都具有个性化定制功能，但~/.profile可以设定本用户专有的路径、环境变量等，它只能登入的时候执行一次。~/.bashrc也是某用户专有设定文档，可以设定路径、命令别名，每次shell script的执行都会使用它一次。

这三种文件类型的差异用一句话表述就是：

/etc/profile，/etc/bashrc 是系统全局环境变量设定;~/.profile，~/.bashrc用户家目录下的私有环境变量设定。

当登入系统时候获得一个shell进程时，其读取环境设定档如下：

![img]({{site.cdn}}/assets/images/blog/2019/20190409143544.png)

## 3. history的配置

### 常用变量定义

- HISTFILESIZE 定义了在 .bash_history 中保存命令的记录总数.
- HISTSIZE 定义了 history 命令输出的记录数.
- HISTTIMEFORMAT 则定义了执行命令的时间格式, 典型的配置是 '<%F %T>: ',就是我们中history命令后,界面也是的样式,也可以在这条命令中添加用户和ip
- HISTFILE 定义了操作命令的存储位置,默认`~/.bash_history`
- LOGNAME当前的用户名

### 给history添加时间,用户名,ip

#### 方式一

```shell
HISTFILESIZE=4000  #默认保存命令是1000条，这里修改为4000条
HISTSIZE=4000
USER_IP=`who -u am i 2>/dev/null| awk '{print $NF}'|sed -e 's/[()]//g'` #取得登录客户端的IP
if [ -z $USER_IP ]
then
  USER_IP=`hostname`
fi
HISTTIMEFORMAT="%F %T $USER_IP:`whoami` "     #设置新的显示history的格式
export HISTTIMEFORMAT
```

效果

![img]({{site.cdn}}/assets/images/blog/2019/20190409145458.png)

#### 方式二

```shell
export HISTTIMEFORMAT="`whoami` %Y/%m/%d %T "
if ! echo "$PROMPT_COMMAND" | grep -q "history -a"; then
    export PROMPT_COMMAND="history -a;$PROMPT_COMMAND"
fi
export HISTSIZE=1000
export HISTFILESIZE=10000
unset HISTCONTROL
```

效果

![img]({{site.cdn}}/assets/images/blog/2019/20190409145312.png)

### 将日志存储到指定的位置

```shell
if [ ! -d /var/log/operation ]
then
mkdir /var/log/operation
chmod 777 /var/log/operation
fi
if [ ! -d /var/log/operation/${LOGNAME} ]
then
mkdir /var/log/operation/${LOGNAME}
chmod 300 /var/log/operation/${LOGNAME}
fi
#export HISTTIMEFORMAT="%F %T `whoami` "
#export HISTTIMEFORMAT='%Y/%m/%d %H-%M-%S '  
DT=`date "+%Y-%m-%d_%H:%M:%S"`
export HISTFILE="/var/log/operation/${LOGNAME}/${LOGNAME}_${USER_IP}.log"
chmod 600 /var/log/operation/${LOGNAME}/*.log 2>/dev/null
```

## 4. 操作的路径显示

![img]({{site.cdn}}/assets/images/blog/2019/20190409143806.png)

可以修改环境变量中`/etc/bashrc`的`PS1`实现

* 只显示当前简介路径，不显示全路径，显示#号

  > PS1="[\u@\h \W]"#

- 2)只显示当前简介路径，不显示全路径，显示$号

  > PS1="[\u@\h \W]\$" 

## 5. 参考资料

[profile、bash_profile、bashrc的用途与区别](https://jingyan.baidu.com/article/f25ef254a8f4a6482d1b8261.html)