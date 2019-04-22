---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 博客让搜索引擎主动爬取
category: myblog
tags: [myblog,robots]
excerpt: 让搜索引擎主动来爬取你的博客
keywords: carlme,superwang,superwangcarl,carl,blog,myblog,robots,搜索引擎,百度,谷歌,卡尔米
---

## 1. 简介

新建好的个人博客,需要主动通知搜索引擎来爬取,否则在浩如烟海的互联网中得等到何年何月.

## 2. 方案

### 1. 方案1--提交sitemap文件

1. jekyll插件配置

   1. 在我们的项目文件`Gemfile`中添加`gem 'jekyll-sitemap'`

      ![img]({{site.cdn}}/assets/images/blog/2019/20190409134601.png)

   2. 在`_config.yml`中添加`- jekyll-sitemap`

      ![img]({{site.cdn}}/assets/images/blog/2019/20190409134823.png)

   3. 在项目根目录下执行`bundle install`安装插件,如果本地没有环境可以在服务器上安装.如果直接在使用的github Page那么直接忽略本篇博文,因为gitpage中的内容百度无法爬取

   4. 执行命令`bundle exec jekyll build`生成静态文件,可以看到目录下出现了`sitemap.xml`文件

      ![img]({{site.cdn}}/assets/images/blog/2019/20190409135606.png)

2. 提交给百度搜索 平台

   1. 需要注册百度的熊掌id,注册后大概有2-5个工作日的审核

      ![img]({{site.cdn}}/assets/images/blog/2019/20190409135223.png)

   2. 右上角显示已认证,点击`搜索资源`

      ![img]({{site.cdn}}/assets/images/blog/2019/20190410211531.png)

   3. 点击`内容设置` -> `绑定设置`

      ![img]({{site.cdn}}/assets/images/blog/2019/20190410211803.png)

   4. 绑定新站点

      ![img]({{site.cdn}}/assets/images/blog/2019/20190410211854.png)

   5. 添加站点

      ![img]({{site.cdn}}/assets/images/blog/2019/20190410211941.png)

   6. 点击添加联系方式

      ![img]({{site.cdn}}/assets/images/blog/2019/20190410212211.png)

   7. 输入需要绑定的网站

      ![img]({{site.cdn}}/assets/images/blog/2019/20190410212027.png)

   8. 认证

      ![img]({{site.cdn}}/assets/images/blog/2019/20190410212610.png)

   9. 回到我们的内容源设置 选择我们刚才设置的域名

      ![img]({{site.cdn}}/assets/images/blog/2019/20190410212653.png)

   10. 内容同步设置

      ![img]({{site.cdn}}/assets/images/blog/2019/20190410230234.png)

   11. 提交资源

       ![img]({{site.cdn}}/assets/images/blog/2019/20190410230324.png)

       ![img]({{site.cdn}}/assets/images/blog/2019/20190410230424.png)

   12. PS:` 我也不知道有没有用....`

3. 如果不希望某篇博文被提交可以配置`sitemap=false`

   ![img]({{site.cdn}}/assets/images/blog/2019/20190409001353.png)

### 2. 方案2

在页面中添加 meta

```html
<meta name="keywords" content="{% if page.keywords %}{{ page.keywords | escape }}{% else %}{{ site.keywords }}{% endif %}">
<meta name="description"
          content="{% if page.excerpt %}{{ page.excerpt | escape }}{% else %}{{ site.description }}{% endif %}">
```

## 3. 参考资料

[Jekyll建站之搜索引擎收录小技巧](https://blog.csdn.net/wanf425/article/details/80847191#_blank)


