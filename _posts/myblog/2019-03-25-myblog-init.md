---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 博客安装
category: myblog
tags: [blog,myblog]
excerpt: 自建博客介绍和初始安装
keywords: carlme,superwang,superwangcarl,carl,卡尔米
---

## 1. 简介

显示开源的博客框架蛮多的,具体我了解的有这几个:

- wordpress
- Hexo
- Halo
- Jekyll + gitpage



wordpress虽然功能强大,各种插件也很多,使用的范围很广泛,但是wordpress是用 php开发的,我也不是很熟悉php,所以自己搭建个demo之后就放弃了.

hexo是使用的nodejs,在本机写md博客生成静态页面,然后放倒github上,效果还可以,但是由于我了解他是在jekyll之后了解的,而且gitpage不会直接编译所以就也没使用了.我喜欢那中在本机 写好博客之后不用什么操作,直接丢到github上就可以了.

halo是我的一个同事告诉我的.看了下功能什么的还是蛮全的用的springboot和bootstrap开发的.好像是一个刚毕业的大学生的毕业设计,个人感觉蛮厉害的.可以使用docker进行直接部署,也是因为是之后了解的所以一直没用.

jekyll是我目前在用的,也是参考或者说直接复制了这位大佬的[纯洁的微笑](http://www.ityouknow.com/)他的博客,他的博客里面也有具体的教程,我在他的基础上加了些后台的改动

## 2. 安装

可以参考下方的参考资料

## 3. 目前使用流程

目前博客使用,我只需在本地,按照规定的格式要求写好markdown格式的博客,提交到github上,会触发github的hooks钩子,去调取我服务器上的jenkins钩子,然后执行脚本,通过git拉取代码之后生成静态页面.之后就可以直接访问了,当然我还通过了rsync会推送到国内的一台服务器,增加访问的速度.

相关的两个脚本如下,具体操作流程可以参考:

`拉取git代码生成静态页面`

```shell
#!/bin/bash
cd /xxx/blog
#将本地的更新取消
git reset --hard
#拉取服务器代码
git pull
#生成静态页面(bundel 需要安装ruby)
bundle exec jekyll build --source /xxx/blog --destination /xxx/online
#修改权限
chmod -R 755 /xxx
#修改所属者
chown -R nginx:rsync /xxx/online
exit
```

`将新生成的静态页面推送到国内服务器中`

```shell
#!/bin/bash
sudo ssh -n -p xxxx root@xxx.xxx.xxx.xxx "sh /xxx/scripts/rsync/rsync_hk.sh"
exit;
```

`国内服务的rsync代码`

```shell
#!/bin/bash
rsync -avz rsync_backup@xxx.xxx.xxx.xxx::online /xxx/online --password-file=/xxx/scripts/rsync/rsync.password --port=xxxx --delete
chmod -R 755 /xxx/online
chown -R nginx:rsync /xxx/online
exit;
```

## 4. 目前完成的功能

- [github + jenkins的持续集成]({{site.url}}/myblog/2019/04/07/myblog-github-jenkins.html)
- [域名增加https]({{site.url}}/myblog/2019/04/07/myblog-https.html)
- [实现图片点击缩放的效果]({{site.url}}/myblog/2019/04/08/myblog-img.html)
- [搜索--后期需优化]({{site.url}}/myblog/2019/04/08/myblog-search.html)
- [博文的字数统计]({{site.url}}/myblog/2019/04/08/myblog-word-count.html)
- [访问量统计]({{site.url}}/myblog/2019/04/09/myblog-statistic-analysis.html)
- [爬虫主动爬取]({{site.url}}/myblog/2019/04/09/myblog-robots.html)
- [评论]({{site.url}}/myblog/2019/04/10/myblog-comment.html)
- [安全加固]({{site.url}}/myblog/2019/04/10/myblog-safe.html)
- [增加流程图解析]({{site.url}}/myblog/2019/04/12/myblog-flow.html)
- 添加订阅
- [图片加速]({{site.url}}/myblog/2019/04/25/myblog-file-image.html)
- [文件服务器]({{site.url}}/myblog/2019/04/25/myblog-file-image.html)

## 5. 后期规划

- 开发微信公众号
- jenkins邮箱配置
- 增加浏览次数
- 添加模版动画


## 6. 参考资料

[技术人如何搭建自己的技术博客](http://www.ityouknow.com/other/2018/09/16/create-blog.html?_blank)

[评论功能--jekyll-theme-H2O 配置 gitalk](https://weijunzii.github.io/2018/06/29/Add-Gitalk-In-Jekyll-Theme-H2O.html?_blank)

[评论功能--jekyll 的使用](https://www.cnblogs.com/mo-wang/p/5117408.html?_blank)

[评论功能--disque](http://wp.huangshiyang.com/hexo%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88?_blank)

[Jekyll博客添加RSS feed订阅功能](https://www.jianshu.com/p/da39860bb5f5?_blank)

[Jekyll建站之搜索引擎收录小技巧](https://blog.csdn.net/wanf425/article/details/80847191?_blank)

[使用Jekyll在Github上搭建个人博客（分页实现）](https://segmentfault.com/a/1190000000406015?_blank)

[如何快速给自己构建一个温馨的"家"——用Jekyll搭建静态博客](https://www.jianshu.com/p/9a6bc31d329d?_blank)

[Github+Jekyll 搭建个人网站详细教程](https://www.jianshu.com/p/9f71e260925d?_blank)

[jekyll博客搭建之艰辛之路](https://segmentfault.com/a/1190000012468796?_blank)

[使用Jekyll搭建自己的博客-全教程](https://www.jianshu.com/p/c04475ba80e4?_blank)

## 7. FAQ

碰到的一些问题

1. 刚开始把域名和github绑定时,取消时无法取消,即使修改了域名的映射后,直接访问username.github.io还是无法访问

   ```
   将 项目更目录下的CNAME文件删除,或者给这个文件改个名字
   ```

2. 域名和github绑定后,直接访问域名无法访问,github

   ```
   域名映射出错,将二级域名的@和www别名映射,最后username.github.io最后要加个点,即 username.github.io.
   ```

   ​