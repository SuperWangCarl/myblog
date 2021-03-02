---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: gitlab常用总结
category: devops
tags: [git,gitlab,linux]
excerpt: gitlab常用总结
keywords: IT超仔,carlme,superwang,superwangcarl,carl,git,gitlab,linux,用户,devops,卡尔米,utils
---

# Gitlab

## 常用操作

### 用户的创建(管理员)

使用`root`用户登录gitlab 默认密码***12345678***

1. 点击settings

   ![img]({{ site.cdn }}assets/images/blog/2019/SuperWang_2019-04-04_165026_007.png)

2. 点击Overvies->Users->New user

   ![img]({{ site.cdn }}assets/images/blog/2019/SuperWang_2019-04-04_165231_008.png)

3. 点击填写Name,Username,Email相关内容,创建用户

   ![img]({{ site.cdn }}assets/images/blog/2019/SuperWang_2019-04-04_170213_010.png)

4. 编辑用户给用户初始化密码

   ![img]({{ site.cdn }}assets/images/blog/2019/SuperWang_2019-04-04_170548_011.png)

   ![img]({{ site.cdn }}assets/images/blog/2019/SuperWang_2019-04-04_170725_012.png)

5. 用户登录

   ![img]({{ site.cdn }}assets/images/blog/2019/SuperWang_2019-04-04_170800_013.png)

6. 自动跳到用户密码重置界面

   ![img]({{ site.cdn }}assets/images/blog/2019/SuperWang_2019-04-04_170922_014.png)


### 用户注册

![img]({{ site.cdn }}assets/images/blog/2019/20190408190011.png)

### 项目创建

1. 点击Create a project

   ![img]({{ site.cdn }}assets/images/blog/2019/20190408190217.png)

2. 创建项目

   ![img]({{ site.cdn }}assets/images/blog/2019/20190408190402.png)

3. 克隆到本地

   ![img]({{ site.cdn }}assets/images/blog/2019/20190408190809.png)

   git add . 时 注意最后的一个小 `.`

   ![img]({{ site.cdn }}assets/images/blog/2019/20190408191308.png)

### 协同开发(用户授权)

![img]({{ site.cdn }}assets/images/blog/2019/20190408191529.png)

### 仓库目录位置

![img]({{ site.cdn }}assets/images/blog/2019/SuperWang_2019-04-04_164347_006.png)

### 定时备份和迁移

使用命令行进行备份操作

```shell
gitlab-rake gitlab:backup:create
```

使用该命令,备份后的文件会默认存放在`/var/opt/gitlab/backups`下

关于gitlab**备份和迁移**可以参考

- [https://blog.csdn.net/ouyang_peng/article/details/77070977](https://blog.csdn.net/ouyang_peng/article/details/77070977)