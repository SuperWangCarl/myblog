---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: gitlab常用总结
category: devops
tags: [git,gitlab,linux]
excerpt: gitlab全集
keywords: IT超仔,carlme,superwang,superwangcarl,carl,git,gitlab,linux,用户,devops,卡尔米,utils

---

# gitlab

## gitlab介绍

### GitLab基本介绍

GitLab是利用Ruby on Rails一个开源的版本管理系统，实现一个自托管的Git项目仓库，可通过Web界面进行访问公开的或者私人项目。

与Github类似，GitLab能够浏览源代码，管理缺陷和注释。可以管理团队对仓库的访问，它非常易于浏览提交过的版本并提供一个文件历史库。团队成员可以利用内置的简单聊天程序(Wall)进行交流。它还提供一个代码片段收集功能可以轻松实现代码复用，便于日后有需要的时候进行查找。本篇教程将教你如何安装部署及使用GitLab。

### **Git的家族成员**

**Git**：是一种版本控制系统，是一个命令，是一种工具。

**Gitlib**：是用于实现Git功能的开发库。

**Github**：是一个基于Git实现的在线代码托管仓库，包含一个网站界面，向互联网开放。

**GitLab**：是一个基于Git实现的在线代码仓库托管软件，你可以用gitlab自己搭建一个类似于Github一样的系统，一般用于在企业、学校等内部网络搭建git私服。

### **Gitlab的服务构成**

**Nginx**：静态web服务器。

**gitlab-shell**：用于处理Git命令和修改authorized keys列表。

**gitlab-workhorse**: 轻量级的反向代理服务器。

**logrotate**：日志文件管理工具。

**postgresql**：数据库。

**redis**：缓存数据库。

**sidekiq**：用于在后台执行队列任务（异步执行）。

**unicorn**：An HTTP server for Rack applications，GitLab Rails应用是托管在这个服务器上面的。

### **GitLab工作流程**

![GitLab]({{ site.cdn }}assets/images/blog/2021/gitlab/333.png)

#### **GitLab Shell**

GitLab Shell有两个作用：为GitLab处理Git命令、修改authorized keys列表。

当通过SSH访问GitLab Server时，GitLab Shell会：

- 限制执行预定义好的Git命令（git push, git pull, git annex）
- 调用GitLab Rails API 检查权限
- 执行pre-receive钩子（在GitLab企业版中叫做Git钩子）
- 执行你请求的动作 处理GitLab的post-receive动作
- 处理自定义的post-receive动作

当通过http(s)访问GitLab Server时，工作流程取决于你是从Git仓库拉取(pull)代码还是向git仓库推送(push)代码。

如果你是从Git仓库拉取(pull)代码，GitLab Rails应用会全权负责处理用户鉴权和执行Git命令的工作；

如果你是向Git仓库推送(push)代码，GitLab Rails应用既不会进行用户鉴权也不会执行Git命令，它会把以下工作交由GitLab Shell进行处理：

1. 调用GitLab Rails API 检查权限
2. 执行pre-receive钩子（在GitLab企业版中叫做Git钩子）
3. 执行你请求的动作
4. 处理GitLab的post-receive动作
5. 处理自定义的post-receive动作

#### GitLab Workhorse

GitLab Workhorse是一个敏捷的反向代理。它会处理一些大的HTTP请求，比如文件上传、文件下载、Git push/pull和Git包下载。其它请求会反向代理到GitLab Rails应用，即反向代理给后端的unicorn。

## **Gitlab环境部署**

ECS配置要求：**内存2G以上**

### **方法一：镜像部署**

点击购买，免费获得GitLab全套环境镜像。（点击查看：[镜像帮助文档](http://zy-res.oss-cn-hangzhou.aliyuncs.com/aliyun_Market_files/gitlab%E4%BB%A3%E7%A0%81%E7%AE%A1%E7%90%86%EF%BC%88centos%2064%E4%BD%8D%20%20gitlab%EF%BC%89.pdf)）

GitLab代码管理（Centos 64位 | GitLab）

GitLab 是一个用于仓库管理系统的开源项目。使用Git作为代码管理工具，并在此基础上搭建起来的web服务。

￥0/月  [立即购买](https://market.aliyun.com/products/55530001/jxsc000067.html?spm=a2c4e.11153940.blogcont74395.11.4de81cc2D9F5ao)

进入镜像详情页面，单击立即购买，按提示步骤购买 ECS 实例。

购买完成之后，登录“**ECS 管理控制台**”,在左边导航栏里，单击“**实例**”，进入 ECS 实例列表页,选择所购 ECS 实例所在的地域，并找到所购 ECS 实例，在“**IP 地址**”列获取该实例的公网 IP 地址。

注意：镜像部署好后默认是禁止远端访问的，所以直接访问ECS服务器的公网IP是不能访问到GitLab的登录界面的，请先运行**/alidata**目录下的**gitlab_opennet.sh**脚本，开启远程访问，然后再通过浏览器访问公网IP来访问GitLab的主页。





### 方法二:源码安装

#### 前期规划：

**1).操作系统Centos 6.7 Minimal**

```
#Distribution      : CentOS 6.7 Minimal
#GitLab version    : 6.3.1
#GitLab-shell      : 1.8.0
#Ruby version      : ruby 2.0.0p353(2013-11-22 revision 43784) [x86_64-linux]
#Gem version       : 2.0.14
#Redis-server      : Redis server version2.4.10 (00000000:0)
#Web Server        : Nginx/1.0.15
#Database          : MariaDB 10.0.21
```

**2).项目地址：**

https://github.com/gitlabhq/gitlabhq

参考文档：http://doc.gitlab.com/ce/install/installation.html#clone-the-source

​         	   https://github.com/lubia/gitlab-recipes/tree/master/install/centos

**3).主机名称及IP地址(测试主机IP地址)**

Moxiaokai     192.168.3.251

**4).同步主机系统时间**

```shell
/usr/sbin/ntpdate -us stdtime.gov.hk ntp.sjtu.edu.cn;hwclock -w;
```

#### **第一,配置yum源及安装依赖包:**

**1).安装epel源**

```shell
yum -y install epel-release
```

**2).安装puias源**

> PUIAS Linux是面向桌面和服务器的完整的操作系统，它靠编译Red Hat Enterprise Linux的源代码包来创建。除了这些上游的软件包外，该项目还提供一些其他的软件仓库：“Addons”包含了通常的Red Hat发行中未收入的额外软件包，“Computational”提供专门针对科学计算的软件，“Unsupported”则收入各种各样的测试性软件 包。该发行由美国普林斯顿 大学的高等研究所维护。

```shell
cat > /etc/yum.repos.d/puias-computational.repo <<EOF
[PUIAS_6_computational]
name=PUIAScomputational Base $releasever - $basearch
mirrorlist=http://puias.math.ias.edu/data/puias/computational/\$releasever/\$basearch/mirrorlist
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-puias
EOF
cd /etc/pki/rpm-gpg/
wget -q http://springdale.math.ias.edu/data/puias/6/x86_64/os/RPM-GPG-KEY-puias
#--import是导入密钥，这密钥是红帽公司提供的。
rpm --import RPM-GPG-KEY-puias

#刷新仓库
yum makecache
#查看
yum repolist
```

![img]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z9Gb_zUsAVAAA36XEqgOM371.png)

#### **第二,安装依赖包：**

**1).基础依赖包**

```shell
yum -y install gdbm-devel glibc-devel tcl-devel openssl-devel curl-develexpat-devel db4-devel byacc libyaml libyaml-devel libffi libffi-devel libxml2libxml2-devel libxslt libxslt-devel libicu libicu-devel sudo wget patchlogwatch logrotate perl-Time-HiRes cmake libcom_err-devel.i686libcom_err-devel.x86_64 nodejs python-docutils
```

**2).升级系统所有软件包到最新**

```shell
yum -y update
```

**3).安装postfix邮件服务器**

```shell
yum install postfix
```

#### **第三,安装git：**

**1).移除低版本git**

```
yum remove git -y
```

备注：默认centos的git版本是1.7.10，必须删除后，再下载源码进行安装

**2).安装git的依赖包**

```
yum -y install zlib-devel perl-CPAN gettext curl-devel expat-devel gettext-developenssl-devel
```

**3).编译安装git**

```shell
mkdir /tmp/git && cd /tmp/git 
curl  --progress https://www.kernel.org/pub/software/scm/git/git-2.5.1.tar.gz | tar xz
cd  git-2.5.1/ && ./configure --prefix=/usr/local/git  && make && make install
```

**4).配置换变量**

```shell
echo "export PATH=/usr/local/git/bin:\$PATH" >> /etc/profile
source /etc/profile
```

**5).验证程序**

```
which git
git --version
```

![wKioL1Z9GnCBr2mNAAAZ1BT6fIc072.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z9GnCBr2mNAAAZ1BT6fIc072.png)

#### **第四,安装ruby**

**1).移除低版本ruby**

ruby版本需要2.0+，所以先卸载系统已存在的

```shell
yum remove ruby
```

\#如果是源码安装的

```shell
cd (your-ruby-source-path) && make uninstall
```

**2).编译安装ruby**

```shell
mkdir /tmp/ruby && cd /tmp/ruby
curl --progress https://cache.ruby-lang.org/pub/ruby/2.0/ruby-2.0.0-p353.tar.gz |tar xz
cd ruby-2.0.0-p353 && ./configure --prefix=/usr/local/ruby--disable-install-rdoc && make && make install
```

**3).配置换变量**

```shell
echo "export PATH=/usr/local/ruby/bin:\$PATH" >> /etc/profile
source /etc/profile
```

**4).验证程序**

```shell
which ruby
ruby --version
```

![wKiom1Z9GqvQX1atAAAj2OVhVKk749.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9GqvQX1atAAAj2OVhVKk749.png)

**5).安装bundler**

删除官方源使用淘宝的镜像

```shell
gem sources --add https://ruby.taobao.org/ --remove https://rubygems.org/ 
gem sources -l
```

![wKiom1Z9GwDwbQQ-AAAYF-uFIaw471.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9GwDwbQQ-AAAYF-uFIaw471.png)

```shell
gem install bundler --no-rdoc
```

![wKioL1Z9GyXTI5WEAAAnlbLDWBI672.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z9GyXTI5WEAAAnlbLDWBI672.png)

```shell
gem install charlock_holmes
```

​     ![wKiom1Z9GzWSdxVfAAAzd3T3Faw204.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9GzWSdxVfAAAzd3T3Faw204.png)

#### **第五,创建系统用户(git)**

```shell
adduser --system --shell /bin/bash--comment 'GitLab' --create-home --home-dir /home/git/ git
```

#### **第六,配置MariaDB**

创建数据库用户并授权

```shell
#mysql -u root -p 
mysql> create database gitlabhq_production character set utf8;
mysql> grant all privileges on gitlabhq_production.*to git@localhost identified by '123456';
mysql> flushprivileges;
```

#### 第七,配置redis

**1).安装redis**

```shell
yum install redis
```

验证redis版本：

 ![wKiom1Z9HQDQ3AxAAAAa0AEaMr8371.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9HQDQ3AxAAAAa0AEaMr8371.png)**

**2).修改redis.conf配置文件**

​   (2.1).备份配置文件

```shell
cp /etc/redis.conf /etc/redis.conf.bak
```

  (2.2).修改/tmp/redis.sock为/var/run/redis/redis.sock

​      ![wKiom1Z9HUuSIZV5AAAaTpNd0E4599.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9HUuSIZV5AAAaTpNd0E4599.png)

  (2.3).修改/var/var/run/redis/redis.sock的权限为755

```shell
chmod  -R 755 /var/run/redis/
```

**3).配置redis自启动**

```shell
chkconfig --level 35 redis on
```

**4).启动redis并验证**

```shell
/etc/init.d/redis restart
/etc/init.d/redis status
```

![wKioL1Z9HYThqUjWAAAg_k_1KIo687.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z9HYThqUjWAAAg_k_1KIo687.png)

**5).附加git到redis组**

```shell
usermod -aG redis git
```

#### **第八,安装gitlab**

**1).取gitlab源代码:**

```shell
# su - git
git clone https://github.com/gitlabhq/gitlabhq.git gitlab
```

检查远程分支并切换到对应分支

```shell
cd gitlab
git branch -a ##查看远程分支
git checkout 6-3-stable
```

  ![wKiom1Z9HbLgT8nRAAAcGKKz_JE865.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9HbLgT8nRAAAcGKKz_JE865.png)

```shell
cat VERSION
#    6.3.1
```

**2).修改配置gitlab.yml**

 (2.1).修改18行(版本不同行数不同)的host为IP地址或者域名

```shell
cp config/gitlab.yml.example config/gitlab.yml
vim config/gitlab.yml
```

![wKioL1Z9HhzSW-hTAAAYXRjdkjI983.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z9HhzSW-hTAAAYXRjdkjI983.png)

  (2.2).修正184行(版本不同行数不同)的bin_path为正确的git命令位置![wKiom1Z9HlORbG_TAAA0a2fUH28008.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9HlORbG_TAAA0a2fUH28008.png)

​    **(3).检查创建目录及权限**

```shell
mkdir -p /home/git/gitlab-satellites
cd /home/git/gitlab
mkdir -p tmp/pids
mkdir -p tmp/sockets
mkdir -p public/uploads
```

**3).配置unicorn.rb文件**

(3.1).修改配置

```shell
cp config/unicorn.rb.example config/unicorn.rb
```

\#查看系统核心数

```shell
nproc
#2
```

(3.2).修改自定义配置

```shell
vim config/unicorn.rb

#注意config/unicorn.rb的内容：
#working_directory	"/home/git/gitlab"
#listen	"/home/git/gitlab/tmp/sockets/gitlab.socket"
#pid	"/home/git/gitlab/tmp/pids/unicorn.pid"
```

![wKioL1Z9HqbSI9tKAABgjNdgc0c025.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z9HqbSI9tKAABgjNdgc0c025.png)

**4).配置resque.yml文件，(redis文件)**

```shell
cp config/resque.yml.example config/resque.yml
```

\#连接redis配置，默认配置，最终修改结果如下

```shell
cat config/resque.yml
```

![wKiom1Z9HwjjvlA-AAAcJ864zVU748.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9HwjjvlA-AAAcJ864zVU748.png)

**5).配置database.yml文件(MariaDB)，只配置production环境**

```shell
cp config/database.yml.mysql config/database.yml
vim config/database.yml
```

![wKiom1Z9H0DQnXMaAAAmwEXbDYE623.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z9HzmRhcYwAAAhLwU0J0M968.png)

#### **第九，安装gem**

>  RubyGems软件允许您轻松下载、安装和使用ruby在您的系统软件包。 这个软件包被称为“Gem”和包含一个Ruby包应用程序或库.
>
>  Gem可以用来扩展或修改在Ruby应用程序功能。 通常他们用于分发可重用的功能,与其他ruby爱好者们用于共享他们的应用程序和库。 一些Gem提供命令行实用工具来帮助自动化任务,加快你的工作。

**1).修改gemfile源为淘宝源**

```shell
# su - git
cd /home/git/gitlab
vim Gemfile
```

![wKioL1Z9H3eDR7vGAAAq7fA8p_g974.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z9H3eDR7vGAAAq7fA8p_g974.png)

修改文件Gemfile 的143行中gem"modernizr","2.6.2"为：gem"modernizr-rails","2.7.1"

![wKioL1Z9H7rTt9h_AAA0IbC7DLE145.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z9H7rTt9h_AAA0IbC7DLE145.png)

修改文件Gemfile.lock 的279行modernizr(2.6.2)为modernizr-rails (2.7.1)

![wKioL1Z9H92zDaflAAAtuISGRf0781.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z9H92zDaflAAAtuISGRf0781.png)

修改文件Gemfile.lock 的605行modernizr(= 2.6.2)为modernizr-rails (= 2.7.1)

![wKiom1Z9H9eQVQndAAAizIJcqd0362.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9H9eQVQndAAAizIJcqd0362.png)

**2).执行gem安装**

```shell
bundle install --deployment --without development test postgres aws
```

![wKioL1Z9IAah5WIUAABexezhCJE796.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z9IAah5WIUAABexezhCJE796.png)

#### **第十,安装gitlab-shell**

**1).安装gitlab-shell**

```shell
# su - git
git clone https://github.com/gitlabhq/gitlab-shell.git gitlab-shell
cd gitlab-shell
git checkout v1.8.0
```

![wKiom1Z9IEbjoLajAAA81zZj4Ys273.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9IEbjoLajAAA81zZj4Ys273.png)

**2).配置config.yml**

```shell
cp config.yml.example config.yml
vim config.yml
```

**在正式环境中将gitlan_url换成gitbal访问域名**

![wKiom1Z9IHGytC4tAABwbXRNkos186.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9IHGytC4tAABwbXRNkos186.png)

**3).执行安装命令,创建对应目录和文件**

```shell
./bin/install
```

#### **第十一，初始化数据库并激活高级功能**

```shell
cd /home/git/gitlab
bundle exec rake gitlab:setup RAILS_ENV=production
```

这步完成后，会生一个默认的管理员账号：

>  root
>
>  5iveL!fe

![wKioL1Z9IU-TUX4FAAAjz-b9Hg0478.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z9IU-TUX4FAAAjz-b9Hg0478.png)

![wKiom1Z9IUXx3NeQAAAnGdY-xpo182.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9IUXx3NeQAAAnGdY-xpo182.png)

#### **十二，下载gitlab启动服务脚本**

```shell
wget -O /etc/init.d/gitlab https://gitlab.com/gitlab-org/gitlab-recipes/raw/master/init/sysvinit/centos/gitlab-unicorn
```

![wKiom1Z9IXbjU9njAAA-jLM-gPE110.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9IXbjU9njAAA-jLM-gPE110.png)

```shell
chmod +x /etc/init.d/gitlab
chkconfig --add gitlab
chkconfig --level 35 gitlab on 
# 设置logrotate(可选操作)
cp /home/git/gitlab/lib/support/logrotate/gitlab /etc/logrotate.d/gitlab
```

#### **十三，检测应用状态**

**1).检查基础环境**

```shell
#su - git
cd gitlab
bundle exec rake gitlab:env:info RAILS_ENV=production
```

![wKioL1Z9IcSgankJAABL0MJWMjc544.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z9IcSgankJAABL0MJWMjc544.png)

**2).检查编译环境**

```shell
bundle exec rake assets:precompile RAILS_ENV=production
```

**3).查看应用详细信息**

```shell
bundle exec rake gitlab:check RAILS_ENV=production
```

**4).启动服务，并验证**

```shell
service gitlab start
```

![wKiom1Z9Ig3Sb8_vAAAfW5zpDqM164.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9Ig3Sb8_vAAAfW5zpDqM164.png)

**5).错误**

> 如果报错：bash: bin/web: No such file or directory和bash:bin/background_jobs: No such file or directory

解决办法为：

```shell
vi /etc/init.d/gitlab
#修改/etc/init.d/gitlab中的 bin/web 路径为 script/web
#修改/etc/init.d/gitlab中的 bin/background_jobs 路径为 script/background_jobs
```

![wKiom1Z9IjaiO6X8AABbXbgLimg425.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9IjaiO6X8AABbXbgLimg425.png)

#### **十四，配置web服务**

**1).编辑nginx.conf文件**

​    修改/usr/local/nginx/conf/nginx.conf (编译安装的nginx)

​	(1.1).在include  mine.types;这一行上添加：

```
 passenger_root /usr/local/ruby/lib/ruby/gems/2.0.0/gems/passenger-5.0.23;
 passenger_ruby /usr/local/ruby/bin/ruby;

```

![wKioL1Z-VEKRDDHCAAAyZTIFlHk825.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z-VEKRDDHCAAAyZTIFlHk825.png)

​	(1.2).修改##访问方式为:http://ip/目录名为：

```
server {
	listen 80;
	server_name localhost;
	location / {
		root   /home/git/gitlab/public/;
		index  index.html index.htm;
		passenger_enabled on;
	}
}
```

![wKioL1Z-VFLQFsEZAAArVfgCc4o549.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKioL1Z-VFLQFsEZAAArVfgCc4o549.png)

**2).访问http://192.168.3.251/登录**

​    用户名：root

​    密码：5iveL!fe

![wKiom1Z9I_XS64w0AACzyTvFfFg387.png]({{ site.cdn }}assets/images/blog/2021/gitlab/wKiom1Z9I_XS64w0AACzyTvFfFg387.png)

***

###  方法三:yum安装

#### 1、配置yum源

```shell
cat > /etc/yum.repos.d/gitlab-ce.repo <<EOF
[gitlab-ce]
name=Gitlab CE Repository
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el\$releasever/
gpgcheck=0
enabled=1
EOF
```

#### 2、更新本地yum缓存

```shell
yum clean all
yum makecache
```

![GitLab]({{ site.cdn }}assets/images/blog/2021/gitlab/222.png)

#### 3、安装GitLab社区版

```shell
yum -y install gitlab-ce        #自动安装最新版
yum install gitlab-ce-x.x.x    #安装指定版本
```

![GitLab]({{ site.cdn }}assets/images/blog/2021/gitlab/111.png)

#### 4、启动

```shell
gitlab-ctl reconfigure 	#初始化
gitlab-ctl start    # 启动所有 gitlab 组件
```

#### 5、GitLab常用命令

```shell
gitlab-ctl start    # 启动所有 gitlab 组件；
gitlab-ctl stop        # 停止所有 gitlab 组件；
gitlab-ctl restart        # 重启所有 gitlab 组件；
gitlab-ctl status        # 查看服务状态；
gitlab-ctl reconfigure        # 重新检查设置；
vim /etc/gitlab/gitlab.rb        # 修改默认的配置文件；
gitlab-rake gitlab:check SANITIZE=true --trace    # 检查gitlab；
gitlab-ctl tail        # 查看日志；
```
### 方式四: 一键脚本

```shell
#!/bin/bash
## gitlab_yum 2018-05-20
## http://www.aqzt.com
##email: ppabc@qq.com
##robert yu
##centos 6和centos 7

yum install -y curl policycoreutils-python openssh-server
systemctl enable sshd
systemctl start sshd

yum install -y postfix
systemctl enable postfix
systemctl start postfix

cat >/etc/yum.repos.d/gitlab-ce.repo<<EOF
[gitlab-ce]
name=Gitlab CE Repository
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7
gpgcheck=0
enabled=1
EOF

yum makecache
yum install -y gitlab-ce


cat >>/etc/yum.repos.d/gitlab-ce.repo<<EOF
[gitlab-ci-multi-runner]
name=gitlab-ci-multi-runner
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ci-multi-runner/yum/el7
repo_gpgcheck=0
gpgcheck=0
enabled=1
gpgkey=https://packages.gitlab.com/gpg.key
EOF

yum makecache
yum install -y gitlab-ci-multi-runner
echo ok
```

### 方式五:rpm包

```shell
F:\WinLinuxShare\yumsource\centos6\gitlab-ce\Packages\gitlab-ce-11.1.4-ce.0.el6.x86_64.rpm
```

```shell
gitlab-ctl start    # 启动所有 gitlab 组件；
gitlab-ctl stop        # 停止所有 gitlab 组件；
gitlab-ctl restart        # 重启所有 gitlab 组件；
gitlab-ctl status        # 查看服务状态；
gitlab-ctl reconfigure        # 重新检查设置；
```

# CentOS7上简单安装部署GitLab

## 安装：

在安装gitlab之前，记得要安装postfix来作为发送邮件通知的邮件服务：

```
yum install postfix
systemctl enable postfix
systemctl start postfix
```

GitLab-CE 可以用脚本一键安装repo文件：

```
curl -s https://packages.gitlab.com/install/repositories/runner/gitlab-ci-multi-runner/script.rpm.sh | bash
```

也可以手动编写repo文件：

`vim /etc/yum.repos.d/gitlab-ce.repo`

```
[gitlab-ce]
name=Gitlab CE Repository
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7/
gpgcheck=0
enabled=1
```

之后yum安装即可：

```
yum install gitlab-ce
```

## 简单配置启动

根据提示来配置：
[![img](http://www.yulongjun.com/{{ site.cdn }}assets/images/blog/2021/gitlab/15081222033853.jpg)]({{ site.cdn }}assets/images/blog/2021/gitlab/15081222033853.jpg)

`vim /etc/gitlab/gitlab.rb`

找到external_url那项，改为可用的主机名(我的是gitlab.yulongjun.com，并且已做好解析）：

```
external_url gitlab.yulongjun.com
```

> tips：可以使用sed替换 —— `sed -i.bak "s#external_url 'http://gitlab.example.com'#external_url 'http://gitlab.yulongjun.com'#g" /etc/gitlab/gitlab.rb`

修改完后，启动gitlab实例：

```
gitlab-ctl reconfigure
```

设置下次开机自启动：

```
systemctl enable gitlab-runsvdir.service
```

## 登录

浏览器输入[gitlab.yulongjun.com](http://www.yulongjun.com/cloud/20170922-gitlab/gitlab.yulongjun.com)。

第一次登录需要更改密码：

[![img](http://www.yulongjun.com/{{ site.cdn }}assets/images/blog/2021/gitlab/15081257852736.jpg)]({{ site.cdn }}assets/images/blog/2021/gitlab/15081257852736.jpg)

然后使用新密码登录，用户名为`root`：

[![img](http://www.yulongjun.com/{{ site.cdn }}assets/images/blog/2021/gitlab/15081258868290.jpg)]({{ site.cdn }}assets/images/blog/2021/gitlab/15081258868290.jpg)

登录成功后的界面：

[![img](http://www.yulongjun.com/{{ site.cdn }}assets/images/blog/2021/gitlab/15081347179163.jpg)]({{ site.cdn }}assets/images/blog/2021/gitlab/15081347179163.jpg)

## 设置禁止注册

一般公司内部使用的话，是禁止注册的，用的话单独开设账号。

root登录后，在Admin area里可以关掉注册：

[![img](http://www.yulongjun.com/{{ site.cdn }}assets/images/blog/2021/gitlab/15081577540266.jpg)]({{ site.cdn }}assets/images/blog/2021/gitlab/15081577540266.jpg)

去掉勾选 `Sign-up enabled`：

[![img](http://www.yulongjun.com/{{ site.cdn }}assets/images/blog/2021/gitlab/15081581457110.jpg)]({{ site.cdn }}assets/images/blog/2021/gitlab/15081581457110.jpg)

> 如果需要注册很多人，而且都是一个公司的邮箱后缀，可以开启邮箱验证功能，并且设置白名单区域，只允许本公司的邮箱后缀的人注册。

[![img](http://www.yulongjun.com/{{ site.cdn }}assets/images/blog/2021/gitlab/15081581307672.jpg)]({{ site.cdn }}assets/images/blog/2021/gitlab/15081581307672.jpg)

## 详细设置

### 1. 设置时区

修改时区为`Asia/Shanghai`

```
sed -i "s@# gitlab_rails['time_zone'] = 'UTC'@gitlab_rails['time_zone'] = 'Asia/Shanghai'@g" /etc/gitlab/gitlab.rb
```

验证是否修改成功：

[![img](http://www.yulongjun.com/{{ site.cdn }}assets/images/blog/2021/gitlab/15081655187732.jpg)]({{ site.cdn }}assets/images/blog/2021/gitlab/15081655187732.jpg)

### 2. 设置

# CentOS8上简单安装部署GitLab

```shell
#下载命令：
wget https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el8/gitlab-ce-12.10.1-ce.0.el8.x86_64.rpm
#安装依赖
yum install -y policycoreutils-python-utils 
#安装gitlab:
rpm -i gitlab-ce-12.10.1-ce.0.el8.x86_64.rpm

```



# GitLab日常使用和维护

## GitLab日常使用

### **登录GitLab**

1、在浏览器的地址栏中输入ECS服务器的公网IP即可登录GitLab的界面，第一次登录使用的用户名和密码为 root 和 5iveL!fe。

![GitLab的安装及使用教程]({{ site.cdn }}assets/images/blog/2021/gitlab/123.png)

2、首次登录会强制用户修改密码。密码修改成功后，输入新密码进行登录。

### **创建Project**

1、安装Git工具linux：安装Git，使用自带的源安装。

```shell
#源码安装折不需要
yum install git
```

![GitLab的安装及使用教程]({{ site.cdn }}assets/images/blog/2021/gitlab/1234.png)

2、生成密钥文件：使用**ssh-keygen**生成密钥文件**.ssh/id_rsa.pub**。

![GitLab的安装及使用教程]({{ site.cdn }}assets/images/blog/2021/gitlab/4444.png)

![GitLab的安装及使用教程]({{ site.cdn }}assets/images/blog/2021/gitlab/5555.png)

3.在GitLab的主页中新建一个Project

![GitLab的安装及使用教程]({{ site.cdn }}assets/images/blog/2021/gitlab/6666.png)

![GitLab的安装及使用教程]({{ site.cdn }}assets/images/blog/2021/gitlab/8720.png)

4.添加ssh key导入步骤2中生成的密钥文件内容：

![GitLab的安装及使用教程]({{ site.cdn }}assets/images/blog/2021/gitlab/8721.png)

![GitLab的安装及使用教程]({{ site.cdn }}assets/images/blog/2021/gitlab/8722.png)

ssh key添加完成：

![GitLab的安装及使用教程]({{ site.cdn }}assets/images/blog/2021/gitlab/8723.png)

项目地址，该地址在进行clone操作时需要用到:

![GitLab的安装及使用教程]({{ site.cdn }}assets/images/blog/2021/gitlab/8724.png)

### **简单配置**

1、配置使用Git仓库的人员姓名（以上海驻云为例）

```shell
git config --global user.name "上海驻云" 
```

```shell
git config --global user.email "support@jiagouyun.com" 
```

```shell
git clone git@iZbp1h7fx16gkr9u4gk8v3Z:root/test.git
```

![GitLab的安装及使用教程]({{ site.cdn }}assets/images/blog/2021/gitlab/8725.png)

### **上传文件**

1、进入到项目目录

```shell
cd test/ 
echo “test” >  /root/test.sh
cp /root/test.sh ./  
```

![GitLab的安装及使用教程]({{ site.cdn }}assets/images/blog/2021/gitlab/8726.png)

4、将test.sh文件加入到索引中

```
git add test.sh 
git commit -m “test.sh”
git push -u origin master 
```

![GitLab的安装及使用教程]({{ site.cdn }}assets/images/blog/2021/gitlab/8727.png)

7、在网页中查看上传的test.sh文件已经同步到GitLab中

![GitLab的安装及使用教程]({{ site.cdn }}assets/images/blog/2021/gitlab/8728.png)

## GitLab日常维护

### Gitlab服务命令

```shell
#启动所有 gitlab 组件；
sudo gitlab-ctl start
#停止所有 gitlab 组件；
sudo gitlab-ctl stop
#重启所有 gitlab 组件；
sudo gitlab-ctl restart
#查看服务状态；
sudo gitlab-ctl status
#启动服务(再次加载配置)；
sudo gitlab-ctl reconfigure
#修改默认的配置文件；
sudo vim /etc/gitlab/gitlab.rb
#检查gitlab；
gitlab-rake gitlab:check SANITIZE=true --trace
#查看日志；
sudo gitlab-ctl tail
```

### 重置管理员的密码(新)

由于 root 账户用的很少，所以我们容易忘记它的密码，但不代表它不重要，类似 linux 的 root 账户；一旦我们忘记了 root 账号的密码，我们需要知道重置的方法，方法如下

1. 进入 GitLab 控制台

   ```shell
   [root@localhost ~]# gitlab-rails console -e production
   ```

   > GitLab 版本不同，命令会有所不同（网上说的而基本都是`gitlab-rails console production` ），推荐大家直接上 GitLab 官网去找对应版本的命令

   我测是使用gitlab-rails console production是进不去GitLab 控制台的

   > ```
   > [git@localhost~]$ gitlab-rails console production
   > Traceback (most recent call last):
   >     8: from bin/rails:4:in `<main>'
   >     7: from bin/rails:4:in `require'
   >     6: from /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/railties-6.0.3.3/lib/rails/commands.rb:18:in `<top (required)>'
   >     5: from /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/railties-6.0.3.3/lib/rails/command.rb:46:in `invoke'
   >     4: from /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/railties-6.0.3.3/lib/rails/command/base.rb:69:in `perform'
   >     3: from /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/thor-0.20.3/lib/thor.rb:387:in `dispatch'
   >     2: from /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/thor-0.20.3/lib/thor/invocation.rb:126:in `invoke_command'
   >     1: from /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/thor-0.20.3/lib/thor/command.rb:27:in `run'
   > /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/railties-6.0.3.3/lib/rails/commands/console/console_command.rb:95:in `perform': wrong number of arguments (given 1, expected 0) (ArgumentError)
   >     9: from bin/rails:4:in `<main>'
   >     8: from bin/rails:4:in `require'
   >     7: from /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/railties-6.0.3.3/lib/rails/commands.rb:18:in `<top (required)>'
   >     6: from /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/railties-6.0.3.3/lib/rails/command.rb:46:in `invoke'
   >     5: from /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/railties-6.0.3.3/lib/rails/command/base.rb:69:in `perform'
   >     4: from /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/thor-0.20.3/lib/thor.rb:387:in `dispatch'
   >     3: from /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/thor-0.20.3/lib/thor/invocation.rb:126:in `invoke_command'
   >     2: from /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/thor-0.20.3/lib/thor/command.rb:20:in `run'
   >     1: from /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/thor-0.20.3/lib/thor/command.rb:34:in `rescue in run'
   > /opt/gitlab/embedded/lib/ruby/gems/2.7.0/gems/thor-0.20.3/lib/thor/base.rb:506:in `handle_argument_error': ERROR: "rails console" was called with arguments ["production"] (Thor::InvocationError)
   > Usage: "rails console [options]"
   > ```

   当出现如下信息表示我们成功登入控制台

   > ```
   > [root@localhost ~]# gitlab-rails console -e production
   > --------------------------------------------------------------------------------
   >  GitLab:       12.8.7 (b679f55a199) FOSS
   >  GitLab Shell: 11.0.0
   >  PostgreSQL:   10.12
   > --------------------------------------------------------------------------------
   > Loading production environment (Rails 6.0.2)
   > irb(main)
   > ```

2. 执行命令： user = User.where(id: 1).first，此 user 则表示 root 用户

3. 修改密码

   ```
   执行命令：user.password = 'secret_pass'修改密码， user.password_confirmation = 'secret_pass' 确认密码
   ```

4. 保存密码

   ```
   执行命令： user.save!
   ```

5. 退出控制台

   ```
   exit
   ```

完整过程类似如下：

![im]({{ site.cdn }}assets/images/blog/2021/gitlab/20211109150541.png)


官方示例：How to reset your root password

重置成功后，我们就可以用新密码来登录 root 账号了

###  重制其他用户密码(新)

1. 登陆控制台

   ```shell
   root@gitlab:/# gitlab-rails console -e production
   Loading production environment (Rails 4.2.10)
   ```

2. 通过邮箱找到用户

   ```shell
   irb(main):003:0> user=User.where(email:'jenkins@domian.com').first
   => #<User id:12 @jenkins>
   ```

3. 重置密码并保存

   ```
   irb(main):005:0> user.password=12345678
   => 12345678
   irb(main):006:0> user.password_confirmation=12345678
   => 12345678
   irb(main):007:0> user.save!
   Enqueued ActionMailer::DeliveryJob (Job ID: 53d8c7ea-c523-43a1-a5e6-032c836f4870) to Sidekiq(mailers) with arguments: "DeviseMailer", "password_change", "deliver_now", gid://gitlab/User/22
   => true
   ```

完整过程类似如下：

![img]({{ site.cdn }}assets/images/blog/2021/gitlab/20211109150731.png)

### 设置中文

![img]({{ site.cdn }}assets/images/blog/2021/gitlab/20211109151135.gif)

### 添加账号

 root 账号来关闭注册功能

取消 `Sign-up enabled`前的复选框勾选,保存

退出登录后可以发现，登录页的注册功能没了，既然不能注册了，那么就需要通过 root 用户来添加账号了

![img]({{ site.cdn }}assets/images/blog/2021/gitlab/20211109151214.gif)

添加单个账号的话，可以直接通过管理中心来添加，具体如下图

![img]({{ site.cdn }}assets/images/blog/2021/gitlab/20211109151344.gif)

### 取消开机启动

>  将文件移除
>
>  centos6
>
>  ```
>  /etc/init/gitlab-runsvdir.conf
>  ```
>
>  centos7
>
>  ```
>   rm -f /etc/systemd/system/basic.target.wants/gitlab-runsvdir.service
>  ```
>

###  * 仓库位置修改

```shell
mkdir -p /application/gitlab/repositories/
vim /etc/gitlab/gitlab.rb 
#修改path
git_data_dirs
 #重新加载配置
 gitlab-ctl reconfigure
```

![img]({{ site.cdn }}assets/images/blog/2021/gitlab/52.png)

### * 修改密码,默认域名



### * 允许本地连接webhook

![img]({{ site.cdn }}assets/images/blog/2021/gitlab/53.png)

### Gitlab Prometheus容量过大

[Gitlab磁盘空间问题 针对Prometheus](https://blog.csdn.net/johnchensz/article/details/106414335)

1. 先查看磁盘空间大小。确定是prometheus占用空间

   ```shell
   du -h --max-depth=1 /var/opt/gitlab/
   ```

2. 修改gitlab中prometheus配置  vi /etc/gitlab/gitlab.rb

   ```shell
   ################################################################################
   ## Prometheus
   ##! Docs: https://docs.gitlab.com/ee/administration/monitoring/prometheus/
   ################################################################################

   ###! **To enable only Monitoring service in this machine, uncomment
   ###!   the line below.**
   ###! Docs: https://docs.gitlab.com/ee/administration/high_availability
   # monitoring_role['enable'] = true

   # prometheus['enable'] = true
   # prometheus['monitor_kubernetes'] = true
   # prometheus['username'] = 'gitlab-prometheus'
   # prometheus['group'] = 'gitlab-prometheus'
   # prometheus['uid'] = nil
   # prometheus['gid'] = nil
   # prometheus['shell'] = '/bin/sh'
   # prometheus['home'] = '/var/opt/gitlab/prometheus'
   # prometheus['log_directory'] = '/var/log/gitlab/prometheus'
   # prometheus['rules_files'] = ['/var/opt/gitlab/prometheus/rules/*.rules']
   # prometheus['scrape_interval'] = 15
   # prometheus['scrape_timeout'] = 15
   # prometheus['env_directory'] = '/opt/gitlab/etc/prometheus/env'
   # prometheus['env'] = {undefined
   #   'SSL_CERT_DIR' => "/opt/gitlab/embedded/ssl/certs/"
   # }
   #
   ### Custom Prometheus flags
   #
   # prometheus['flags'] = {undefined
   #   'storage.tsdb.path' => "/var/opt/gitlab/prometheus/data",
   #   'storage.tsdb.retention.time' => "15d",
   #   'config.file' => "/var/opt/gitlab/prometheus/prometheus.yml"
   # }
   ```

   > 找到如上配置项，有3个办法，
   >
   > 1）关掉prometheus 。这个是系统监控收集信息的工具。prometheus_monitoring['enable'] = false
   >
   > 2）修改data路径，改为磁盘空间更大的路径。 'storage.tsdb.path' => "/var/opt/gitlab/prometheus/data"
   >
   > 3）修改data保存时间。改小天数prometheus会自动清除过期的data。  'storage.tsdb.retention.time' => "15d"
   > ————————————————
   > 版权声明：本文为CSDN博主「深圳陈建军」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
   > 原文链接：https://blog.csdn.net/johnchensz/article/details/106414335


3. 保存配置修改，重启gitlab

```
gitlab-ctl stop
gitlab-ctl reconfigure
gitlab-ctl start
```

### 上传本地配置文件

```
rz E:\Develop\Information\XmindPictureData\JavaSE\工具\version,integra\git\gitlab.rb
```

### 查看版本号

```
cat /opt/gitlab/embedded/service/gitlab-rails/VERSION
```

### gitlab-ctl清除数据和用户

gitlab-ctl

```
[azuo1228@Server ~]$ gitlab-ctl
I don't know that command.
/opt/gitlab/embedded/bin/omnibus-ctl: command (subcommand)
deploy-page
 Put up the deploy page
remove-accounts
 Delete *all* users and groups used by this package
upgrade
 Run migrations after a package upgrade

```

General Commands:

```
 cleanse
  Delete *all* gitlab data, and start from scratch.
 help
  Print this help message.
 reconfigure
  Reconfigure the application.
 show-config
  Show the configuration that would be generated by reconfigure.
 uninstall
  Kill all processes and uninstall the process supervisor (data will be preserved).

```

Service Management Commands:

```
 graceful-kill
  Attempt a graceful stop, then SIGKILL the entire process group.
 hup
  Send the services a HUP.
 int
  Send the services an INT.
 kill
  Send the services a KILL.
 once
  Start the services if they are down. Do not restart them if they stop.
 restart
  Stop the services if they are running, then start them again.
 service-list
  List all the services (enabled services appear with a *.)
 start
  Start services if they are down, and restart them if they stop.
 status
  Show the status of all the services.
 stop
  Stop the services, and do not restart them.
 tail
  Watch the service logs of all enabled services.
 term
  Send the services a TERM.

```

Database Commands:

```
 pg-upgrade
  Upgrade the PostgreSQL DB to the latest supported version
 revert-pg-upgrade
  Run this to revert to the previous version of the database

```

Container Registry Commands:

```
 registry-garbage-collect
  Run Container Registry garbage collection.

```

### Gitlab使用系统的nginx

**修改/etc/gitlab/gitlab.rb**

本地修改很简单,修改一下几处：

```
external_url 'http://git.tbqsj.com'
web_server['external_users'] = ['nginx']
nginx['enable'] = false


```

\1. external url并不是替换nginx需要的，这个是会影响到打开git repo的时候显示的clone路径的

\2. external user，必须是系统存在的nginx的用户，ubuntu和debian里面的nginx的用户名叫www-data, 而centos和rhel里面叫做nginx

3.把nginx的全局控制设置为false，保证gitlab启用的时候不会runsv 开启nginx

重新配置和启用gitlab：

```
[azuo1228@MyServer Meanjs-MMM]$ sudo gitlab-ctl reconfigure
[azuo1228@MyServer Meanjs-MMM]$ sudo gitlab-ctl restart


```

**Warning**

To ensure that user uploads are accessible your Nginx user (usually www-data) should be added to the gitlab-www group. This can be done using the following command:

要确保用户的上传文件都能被ngnix访问，nginx user要添加到gitlab-www用户组里面，如下操作：

```
【ubuntu】
sudo usermod -aG gitlab-www www-data
【Centos/RHEL】
sudo usermod -aG gitlab-www nginx


```

**配置ngnix**

然后，把gitlab之前生成的http.conf复制到nginx的config目录下面的，这里centos和ubuntu/debian版本不一样，所以文件夹也不一样，debian下面有一个site-available/site-enable， centos下面都是放在conf.d

```
[azuo1228@MyServer Meanjs-MMM]$ sudo cp /var/opt/gitlab/nginx/conf/gitlab-http.conf /etc/nginx/conf.d/


```

打开这个文件，

```
[azuo1228@MyServer Meanjs-MMM]$ sudo vim /etc/nginx/conf.d/gitlab-http.conf


```

修改一些地方：

```
server_name MyServer;  ->
server_name git.tbqsj.com;

access_log /var/log/gitlab/nginx/gitlab_access.log gitlab_access; --> 因为gitlab_access是centos版本的nginx不认识的版本，所以去掉
access_log /var/log/gitlab/nginx/gitlab_access.log;


```

然后，如果nginx已经运行，就：

```
[azuo1228@MyServer Meanjs-MMM]$ sudo service nginx reload


```

没有运行就：

```
[azuo1228@MyServer Meanjs-MMM]$ sudo service nginx start


```

这样，从网页打开：

![img]({{ site.cdn }}assets/images/blog/2021/gitlab/1.png)

就可以了。

但是，因为，gitlab-http.conf里面指定了逆向代理server_name，所以，网页打开只能用这个网址打开。

本地局域网打开，就在windows的hosts或者linux的hosts里面设置一个alias就好了。

### 禁止自己的gitlab库用户注册

> 实现最大用户数自己控制

就是用root登录，然后，在setttings里面找到：![img]({{ site.cdn }}assets/images/blog/2021/gitlab/2.png)

把sign-up enabled 前面的勾选去掉，防止用户注册。

### Gitlab开机启动所有服务的方式和原理

gitlab开机启动是一个systemd的脚本：

```
/et/systemd/system/basic.target.wants/gitlab-runsvdir.service
```

内容很简单，就是执行一条命令:

```
[Unit]
Description=GitLab Runit supervision process
After=basic.target
[Service]
ExecStart=/opt/gitlab/embedded/bin/runsvdir-start
Restart=always
[Install]
WantedBy=basic.target
```

而，**/opt/gitlab/embedded/bin/runsvdir-start** 这个脚本是干什么的呢？看看内容，最主要的一句就是：

```
exec env - PATH=$PATH \
runsvdir -P /opt/gitlab/service 'log: ............
```

runsvdir就是执行一个文件夹下面的所有的子文件夹的服务，而/opt/gitlab/service这个下面的服务有：

```
pi@raspberrypi:/opt/gitlab/sv $ ll
total 28
drwxr-xr-x 4 root root 4096 Nov 25 21:06 gitlab-workhorse
drwxr-xr-x 5 root root 4096 Nov 25 21:06 logrotate
drwxr-xr-x 4 root root 4096 Nov 25 21:06 nginx
drwxr-xr-x 5 root root 4096 Nov 25 21:06 postgresql
drwxr-xr-x 4 root root 4096 Nov 25 21:06 redis
drwxr-xr-x 4 root root 4096 Nov 25 21:06 sidekiq
drwxr-xr-x 5 root root 4096 Nov 25 21:06 unicorn
```

这样有一个好处，就是，自己启动自己的定制服务，而不需要系统层面也安装这些，比如nginx和unicorn。

再来看看系统启动的这些服务：

```
pi@raspberrypi:~ $ ps aux | grep runsv
root    542 0.0 0.0  1836  924 ?    Ss  22:21  0:00 runsvdir -P /opt/gitlab/service log: -----
root    702 0.0 0.0  1692  356 ?    Ss  22:21  0:00 runsv sidekiq
root    703 0.0 0.0  1692  364 ?    Ss  22:21  0:00 runsv unicorn
root    704 0.0 0.0  1692  340 ?    Ss  22:21  0:00 runsv logrotate
root    705 0.0 0.0  1692  356 ?    Ss  22:21  0:00 runsv nginx
root    706 0.0 0.0  1692  320 ?    Ss  22:21  0:00 runsv redis
root    707 0.0 0.0  1692  324 ?    Ss  22:21  0:00 runsv gitlab-workhorse
root    708 0.0 0.0  1692  308 ?    Ss  22:21  0:00 runsv postgresql
pi    3334 0.0 0.1  4280 1912 pts/0  S+  22:50  0:00 grep --color=auto runsv
```

可见，runsvdir把指定的子目录都运行了，而且要求生成log。

### Gitlab设置用户的最大创建工程数量

**1.全局设置**

参考网址：<https://git.idea-source.net/help/api/settings.md>

首选登录root账号，然后在Access Tokens里面生产一个私有的token：g8FqysDL-ZX2-46_zsg5

先查看全局设定：

```
pi@raspberrypi:/var/opt/gitlab $ curl -H "PRIVATE-TOKEN: g8FqysDL-ZX2-46_zsg5" http://192.168.11.149/api/v3/application/settings
```

得到

```
{"id":5,"default_projects_limit":10,"signup_enabled":true,"signin_enabled":true,"gravatar_enabled":true,"sign_in_text":null,"after_sign_up_text":null,"created_at":"2016-11-12T06:13:40.718Z","updated_at":"2016-11-12T06:13:40.718Z","home_page_url":null,"default_branch_protection":2,"restricted_visibility_levels":[],"max_attachment_size":10,"session_expire_delay":10080,"default_project_visibility":0,"default_snippet_visibility":0,"default_group_visibility":null,"domain_whitelist":[],"domain_blacklist_enabled":false,"domain_blacklist":[],"user_oauth_applications":true,"after_sign_out_path":null,"container_registry_token_expire_delay":5,"repository_storage":"default","koding_enabled":false,"koding_url":null}pi@raspberrypi:/var/opt/gitlab $
```

可以看到默认的每个人的projects 数量限制是10

限制修改为100：

```
pi@raspberrypi:/var/opt/gitlab $ curl -X PUT -H "PRIVATE-TOKEN: g8FqysDL-ZX2-46_zsg5" http://192.168.11.149/api/v3/application/settings?default_projects_limit=100
```

会有返回值：

```
{"id":5,"default_projects_limit":100,"signup_enabled":true,"signin_enabled":true,"gravatar_enabled":true,"sign_in_text":null,"after_sign_up_text":null,"created_at":"2016-11-12T06:13:40.718Z","updated_at":"2016-11-15T14:14:49.463Z","home_page_url":null,"default_branch_protection":2,"restricted_visibility_levels":[],"max_attachment_size":10,"session_expire_delay":10080,"default_project_visibility":0,"default_snippet_visibility":0,"default_group_visibility":null,"domain_whitelist":[],"domain_blacklist_enabled":false,"domain_blacklist":[],"user_oauth_applications":true,"after_sign_out_path":null,"container_registry_token_expire_delay":5,"repository_storage":"default","koding_enabled":false,"koding_url":null}pi@raspberrypi:/var/opt/gitlab $
```

**注：**

*这种方法只对以后新建的用户起效，对已经存在的用户无效，需要对现有用户单独修改，如下第二步操作。*

**2. 针对每个用户设置**

必须用root登录，然后管理工具里面，打开用户属性：

![img]({{ site.cdn }}assets/images/blog/2021/gitlab/6.png)

然后，就可以修改“Personal projects limit" :

![img]({{ site.cdn }}assets/images/blog/2021/gitlab/7.png)

### Gitlab 同时支持http和https

默认情况下支持http，如果按照：

[3. 树莓派的gitlab配置开启https](http://www.doocr.com/articles/58b153aaf8694d05da412c84)

开启了https，那么http就被转发到了https,也就是无法配置支持两者，但是有办法。

1.首先，安装好树莓派之后，配置https，然后备份一下：

```
/var/opt/gitlab/nginx/conf/gitlab-http.conf
```

这个是nginx的配置文件，里面有443端口的配置。保证能https正常工作。

2.然后，回退配置，到仅仅支持http，重新配置，restart。

3.然后，把刚才备份的关于443的配置的那段复制到gitlab-http.conf里面，保存。

4.最后，restart（千万不要reconfig，没有修改gitlab.rb，不要reconfig）。就可以看到http和https都可以了。

### Gitlab启动所有服务的方式

gitlab开机启动是一个systemd的脚本：

```
/et/systemd/system/basic.target.wants/gitlab-runsvdir.service
```

内容很简单，就是执行一条命令:

```
[Unit]
Description=GitLab Runit supervision process
After=basic.target
[Service]
ExecStart=/opt/gitlab/embedded/bin/runsvdir-start
Restart=always
[Install]
WantedBy=basic.target
```

而，**/opt/gitlab/embedded/bin/runsvdir-start** 这个脚本是干什么的呢？看看内容，最主要的一句就是：

exec env - PATH=$PATH \

runsvdir -P /opt/gitlab/service 'log: ............

runsvdir就是执行一个文件夹下面的所有的子文件夹的服务，而/opt/gitlab/service这个下面的服务有：

```
pi@raspberrypi:/opt/gitlab/sv $ ll
total 28
drwxr-xr-x 4 root root 4096 Nov 25 21:06 gitlab-workhorse
drwxr-xr-x 5 root root 4096 Nov 25 21:06 logrotate
drwxr-xr-x 4 root root 4096 Nov 25 21:06 nginx
drwxr-xr-x 5 root root 4096 Nov 25 21:06 postgresql
drwxr-xr-x 4 root root 4096 Nov 25 21:06 redis
drwxr-xr-x 4 root root 4096 Nov 25 21:06 sidekiq
drwxr-xr-x 5 root root 4096 Nov 25 21:06 unicorn
```

这样有一个好处，就是，自己启动自己的定制服务，而不需要系统层面也安装这些，比如nginx和unicorn。

再来看看系统启动的这些服务：

```
pi@raspberrypi:~ $ ps aux | grep runsv
root    542 0.0 0.0  1836  924 ?    Ss  22:21  0:00 runsvdir -P /opt/gitlab/service log:
root    702 0.0 0.0  1692  356 ?    Ss  22:21  0:00 runsv sidekiq
root    703 0.0 0.0  1692  364 ?    Ss  22:21  0:00 runsv unicorn
root    704 0.0 0.0  1692  340 ?    Ss  22:21  0:00 runsv logrotate
root    705 0.0 0.0  1692  356 ?    Ss  22:21  0:00 runsv nginx
root    706 0.0 0.0  1692  320 ?    Ss  22:21  0:00 runsv redis
root    707 0.0 0.0  1692  324 ?    Ss  22:21  0:00 runsv gitlab-workhorse
root    708 0.0 0.0  1692  308 ?    Ss  22:21  0:00 runsv postgresql
pi    3334 0.0 0.1  4280 1912 pts/0  S+  22:50  0:00 grep --color=auto runsv
```

可见，runsvdir把指定的子目录都运行了，而且要求生成log。

### 修改Gitlab后台进程数量

暂时因为树莓派的能力有限，所以需要修改一下参数。

`修改文件：`

```
pi@raspberrypi:/etc/gitlab $ sudo vim gitlab.rb
```

这个是和cpu core对应的

```
# unicorn['worker_processes'] = 2
# nginx['worker_processes'] = 4
# mattermost_nginx['worker_processes'] = 4
```

修改为：

```
# unicorn['worker_processes'] = 1
# nginx['worker_processes'] = 2
# mattermost_nginx['worker_processes'] = 2
```

最后：

```
pi@raspberrypi:/etc/gitlab $ sudo gitlab-ctl reconfigure
pi@raspberrypi:/etc/gitlab $ sudo gitlab-ctl restart
```

## gitlab备份

### 备份

```shell
mkdir -p /application/gitlab/backup/
#备份命令
gitlab-rake gitlab:backup:create
#/var/opt/gitlab/backups 文件在该目录下
# vim gitlab_rails['backup_path'] #
#设置定时任务
0 2 * * * /opt/gitlab/bin/gitlab-rake gitlab:backup:create

#获取备份文件
#scp root@172.28.17.155:/var/opt/gitlab/backups/1502357536_2017_08_10_9.4.3_gitlab_backup.tar /var/opt/gitlab/backups/
#修改权限
chmod 777 1502357536_2017_08_10_9.4.3_gitlab_backup.tar 
#第二步，执行命令停止相关数据连接服务
# 停止相关数据连接服务
gitlab-ctl stop unicorn
gitlab-ctl stop sidekiq
#执行命令从备份文件中恢复Gitlab
#gitlab-rake gitlab:backup:restore BACKUP=备份文件编号
gitlab-rake gitlab:backup:restore BACKUP=1502357536_2017_08_10_9.4.3

#敲完命令后，出现第一个交互页面，
#输入 两次 “yes”继续。 

#重启
gitlab-ctl restart
```

### 备份恢复与迁移

[git学习------> Gitlab如何进行备份恢复与迁移？](https://blog.csdn.net/ouyang_peng/article/details/77070977/)

`见pdf` 

### GitLab CE 备份与还原

官方文档链接：

数据备份：

<https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/raketasks/backup_restore.md>

配置备份：

<https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/settings/backups.md#backup-and-restore-omnibus-gitlab-configuration>

另外，修改配置文件gitlab.rb的时候这行不要动：

\# gitlab_rails['manage_backup_path'] = true

这个在这里：

<https://docs.gitlab.com/omnibus/settings/backups.html>

不管这个值是什么的时候，都可以修改备份路径，这个值只是影响备份目录的权限，这个值默认为true，也就是说用户可以修改的，但是，

当manage_backup_path为true的时候，gitlab会设置

gitlab_rails['backup_path']

为gitlab运行用户所有，运行就是在gitlab.rb里面指定的：

\# user['username'] = "git"

\# user['group'] = "git"

当为false的时候，这个指定的路径，必须由用户自行保证gitlab.rb里面指定的用户字段拥有这个路径的完全权限。

另外，备份的文件，复制到其他电脑上之后，放在备份文件夹下面，恢复的时候也要保证权限为该主机的gitlab运行用户。

本文以[通过 Omnibus 包安装的 GitLab CE](https://about.gitlab.com/downloads/) 为例，记录了备份还原 GitLab 数据及配置过程中的一些事项。

**备份还原数据**

**备份数据**

通过以下命令可以备份 GitLab 的数据库、代码仓库（如使用了 lfs，也会包含通过 lfs 存储的文件）和所有附件，并打包为一个 tar 压缩包。

```
sudo gitlab-rake gitlab:backup:create
```

具体备份的目录可以在 `/etc/gitlab/gitlab.rb` 文件的 `gitlab_rails['backup_path']` 项中进行设置，默认为 `/var/opt/gitlab/backups`。

备份后的 tar 包的目录结构大致如下所示：

> [z@zzz.buzz 1459620009_gitlab_backup]$ tree .
> .
> ├── artifacts.tar.gz
> ├── backup_information.yml
> ├── builds.tar.gz
> ├── db
> │   └── database.sql.gz
> ├── lfs.tar.gz
> ├── repositories
> │   ├── user1
> │   │   ├── repo1.bundle
> │   │   └── repo2.bundle
> │   └── user2
> │       ├── repo3.bundle
> │       ├── repo4.bundle
> │       └── repo5.bundle
> └── uploads.tar.gz

此外，还可以为 GitLab 配置[](http://doc.gitlab.com/ce/raketasks/backup_restore.html#configure-cron-to-make-daily-backups)、[备份自动上传](http://doc.gitlab.com/ce/raketasks/backup_restore.html#upload-backups-to-remote-cloud-storage)等， 这里设定每天晚上两点自动备份:

`0 2 * * * /opt/gitlab/bin/gitlab-rake gitlab:backup:create CRON=1`

**还原数据**

还原数据时，首先需要将原先备份的压缩包拷贝到 `/etc/gitlab/gitlab.rb` 中 `gitlab_rails['backup_path']` 里指定的目录下，默认为 `/var/opt/gitlab/backups`，如：

```shell
sudo cp 1459620009_gitlab_backup.tar /var/opt/gitlab/backups/
```

随后，执行以下命令进行数据恢复：

```shell
# 停止需要连接数据库的服务
sudo gitlab-ctl stop unicorn
sudo gitlab-ctl stop sidekiq
# 恢复备份的数据，重写数据库内容
sudo gitlab-rake gitlab:backup:restore BACKUP=1459620009
# 启动 GitLab
sudo gitlab-ctl start
# 检查 GitLab 是否正常运行
sudo gitlab-rake gitlab:check SANITIZE=true
```

注意，上述命令中的 `1459620009` 应该替换为备份文件的实际时间戳。

此外，恢复备份时所用的 GitLab 版本应该与备份时所用的 GitLab 版本相同。否则，恢复过程会报错。

> 备份还原配置

> 备份配置

出于安全考虑，在上述的备份命令中，只会备份 GitLab 的应用数据，而不会备份 GitLab 的配置。

通过 Omnibus 包安装的 GitLab 的配置存储在 `/etc/gitlab/` 目录下，可以通过以下命令进行备份：

```
sudo sh -c 'umask 0077; tar -cf $(date "+etc-gitlab-%s.tar") -C / etc/gitlab'
```

此外，还应注意备份服务器 ssh 服务的私钥，以避免客户端在连接新恢复的服务器时返回 ssh 相关的警告。

如果服务器启用了 SSL，则相关证书及密钥也应一并备份。

> 还原配置

还原之前备份的配置时，可以使用以下命令：

```
# 还原配置前，先备份当前配置
sudo mv /etc/gitlab /etc/gitlab.$(date +%s)# 解压包含了所备份配置的压缩包
sudo tar -xf etc-gitlab-1399948539.tar -C /
```

注意，上述命令中的 `1399948539` 应换为实际备份文件的时间戳。

> 错误解决

- 如果使用了 lfs，且在恢复时报错，则需保证存放 lfs 的目录，`git` 用户有写权限。
- ​
- 如果使用了 ssl，则在恢复 GitLab 配置文件时，需要一并恢复 ssl 的证书及私钥，否则 nginx 服务将会无法启动。
- nginx 相关的日志，可以通过 `sudo gitlab-ctl tail nginx` 来查看。

### Git备份与还原版本不对的处理

但是，有时候源与目的gitlab版本不对，比如我的树莓派是：

```
pi@raspberrypi:~ $ sudo apt list | grep gitlab
WARNING: apt does not have a stable CLI interface yet. Use with caution in scripts.
gitlab-ce/jessie,now 8.13.3-ce.0 armhf [installed]

```

而，centos 7上面是8.14.5，如果低版本的无法升级，那么就把高版本的降级，在centos上面：

```
sudo yum install gitlab-ce-8.13.3-ce.0.el7.x86_64

```

安装老版本，然后再倒入，之后再更新版本。

卸载当前版本，然后指定低版本安装之后，就可以查看到：

```
[azuo1228@MyServer gitlab]$
[azuo1228@MyServer gitlab]$ sudo yum list | grep gitlab
gitlab-ce.x86_64            8.13.3-ce.0.el7        installed
gitlab-ce.x86_64            8.14.5-ce.0.el7        gitlab_gitlab-ce

```

也就是可以安装更新的。

在备份之后，再系统更新，就可以从8.13.3更新到8.14.5了，如下：

```
[azuo1228@MyServer ~]$ sudo yum upgrade
--> Running transaction check
---> Package gitlab-ce.x86_64 0:8.13.3-ce.0.el7 will be updated
---> Package gitlab-ce.x86_64 0:8.14.5-ce.0.el7 will be an update
--> Finished Dependency Resolution
Dependencies Resolved
==========================================================================================================================================================================================================================================================================================
 Package                              Arch                              Version                                 Repository                                Size
==========================================================================================================================================================================================================================================================================================
Updating:
 gitlab-ce                             x86_64                             8.14.5-ce.0.el7                             gitlab_gitlab-ce                             301 M
Transaction Summary
==========================================================================================================================================================================================================================================================================================
Upgrade 1 Package
Total download size: 301 M
Is this ok [y/d/N]: y
Downloading packages:
```

### 设置gitlab默认访问协议

*发表于 2017-02-25 18:06*

**转载请注明文章：设置gitlab默认访问协议 出处：多客博图**

用root登录, 然后，在settings里面点开：

![img]({{ site.cdn }}assets/images/blog/2021/gitlab/3.png)

然后，找到这个地方设置就行了：

![img]({{ site.cdn }}assets/images/blog/2021/gitlab/4.png)

然后保存,退出重新登录的效果：

![img]({{ site.cdn }}assets/images/blog/2021/gitlab/5.png)

## FAQ

### 502错误

![]({{ site.cdn }}assets/images/blog/2021/gitlab/12435.png)

原因1：GitLab 所需内存最低为 4G，若服务器配置太低会出现 502 错误
原因2：`端口冲突8080端口被tomcat占用`，场景2：未安装tomcat，ss -ntlp查看nginx监听80端口但还是不能访问尝试变更端口：
修改下unicorn的默认端口，vim打开/etc/gitlab/gitlab.rb配置文件

```shell
external_url 'http://gitlab.xxx.com:8090'
unicorn['port'] = 8090
```

原因3：`端口冲突80端口niginx未开启代理`（问题2解决后是直接访问的gitlab，现在启动nginx进行代理，隐藏gitlab端口，更新的配置文档如下：）

```shell
################################################################################
## GitLab NGINX
##! Docs: https://docs.gitlab.com/omnibus/settings/nginx.html
################################################################################

nginx['enable'] = true
nginx['client_max_body_size'] = '250m'

nginx['listen_port'] = 80
```

设置完后重启服务:

```shell
gitlab-ctl reconfigure
gitlab-ctl stop
gitlab-ctl start
```

### GitLab 新装或重启后，需要等待 1 分钟才能使用

### 不可以放开注释

```shell
# 更改端口号
# unicorn['port'] = 7011
```

### 无法启动postgresql

```shell
#查看日志 一般是磁盘空间不足
cat /var/log/gitlab/postgresql/current 
```
### 安装卡住

这基本是内存不足导致

### LoadError: cannot load such file -- active_record/version

```shell
无法解决的话重装  数据都保存在其他地方不会丢失的
rpm -e ...
rpm -ivh 
gitlab-ctl reconfigure 	#初始化
gitlab-ctl start    # 启动所有 gitlab 组件
```

### centos-8 reate memberlist: Failed to get final advertise address

```
在/etc/gitlab/gitlab.rb最后增加

```

```
alertmanager['flags'] = {
  'cluster.advertise-address' => "127.0.0.1:9093",
  'web.listen-address' => "#{node['gitlab']['alertmanager']['listen_address']}",
  'storage.path' => "#{node['gitlab']['alertmanager']['home']}/data",
  'config.file' => "#{node['gitlab']['alertmanager']['home']}/alertmanager.yml"
}

```

## 参考资料

[GitLab → 搭建中常遇的问题与日常维护](https://blog.csdn.net/A___LEi/article/details/110476531)

[GitLab 部署及管理员账号初始化](https://blog.csdn.net/hnmpf/article/details/80518460)

[GitLab学习之旅](https://blog.csdn.net/ouyang_peng/category_9277732.html)

[Git学习进阶之旅](https://blog.csdn.net/ouyang_peng/category_9269712.html)