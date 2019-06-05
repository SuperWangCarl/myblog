---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 博客评论功能
category: myblog
tags: [myblog,disqus,gitment,gitalk]
excerpt: 分析下主流评论模块并添加
keywords: carlme,superwang,superwangcarl,carl,卡尔米,disqus,gitment,gitalk
---

## 1. 简介

给博客添加评论功能,目前主流的一些评论软件有`disqus,gitment,gitalk`,

- disqus 在国内无法访问,所以暂时不用了
- gitment 只能手动初始化所有文章的评论或者一个一个点开界面,很麻烦
- gitalk 只能手动初始化所有文章的评论或者一个一个点开界面,很麻烦

后期准备参考[这篇](https://draveness.me/git-comments-initialize)博文自行自动化配置

以下的几种三种配置方式可以自选一种合适的

## 2. gitalk安装

### 1. 注册 GitHub Application

> https://github.com/settings/applications/new

![img]({{site.cdn}}/assets/images/blog/2019/20190410105436.png)

### 2. 获取 Client ID 和 Client Secret

![img]({{site.cdn}}/assets/images/blog/2019/20190410105548.png)

### 3. 创建一个用于评论的github的项目

![img]({{site.cdn}}/assets/images/blog/2019/20190410105629.png)

### 4. 配置_config.yml

```yaml
gitalk:
    owner: SuperWangCarl
    repo: blog-comments
    clientID: a38b1cd19g12fde6c8d2
    clientSecret: bc98ebfee54e38b4aa97ee561dcd833a34b70b5c
```

### 5. 在合适的位置写入代码

```html
<!-- 评论 -->
<link rel="stylesheet" href="/assets/css/gitalk.min.css">
<div id="gitalk-container"></div>
<script src="/assets/js/gitalk.min.js"></script>
<script>
var gitalk = new Gitalk({
    id: '{{ page.url }}',
    clientID: '{{ site.gitalk.clientID }}',
    clientSecret: '{{ site.gitalk.clientSecret }}',
    repo: '{{ site.gitalk.repo }}',
    owner: '{{ site.gitalk.owner }}',
    admin: ['{{ site.gitalk.owner }}'],
    labels: ['gitalk'],
    perPage: 50,
})
gitalk.render('gitalk-container')
</script>
```

## 3. gitment安装

`步骤1.2.3 和gitalk的相同`

### 4. 配置_config.yml

```yaml
gitment:
    owner: SuperWangCarl
    repo: blog-comments
    oauth:
        client_id: a38b1cd19e12fde6c8d2
        client_secret: bc985bfee54e38b4589722561dcd833a34b70b5c

```

### 5. 在合适的位置写入代码

```html
<div id="container"></div>
<link rel="stylesheet" href="https://imsun.github.io/gitment/style/default.css">
<script src="https://imsun.github.io/gitment/dist/gitment.browser.js"></script>
<script>
var gitment = new Gitment({
    id: '{{ page.url }}',
    owner: '{{ site.gitment.owner }}',
    repo: '{{ site.gitment.repo }}',
    oauth: {
        client_id: '{{ site.gitment.oauth.client_id }}',
        client_secret: '{{ site.gitment.oauth.client_secret }}',
    },
})
gitment.render('container')
</script>
```

## 4. 自动初始化gitalk和gitment

`该脚本只适用于批量初始化评论的,只可以运行一次,否则同一个文章会创建多个 issues`

### 1. 在github创建一个token

1. 具体可以[参考github和jenkins继承的博文]({{site.url}}/myblog/2019/04/07/myblog-github-jenkins.html)

2. 选中repo

   ![img]({{site.cdn}}/assets/images/blog/2019/20190410111717.png)


3. 获取token

![img]({{site.cdn}}/assets/images/blog/2019/20190410111744.png)

### 2. 自动化脚本

安装ruby依赖

```shell
gem install faraday activesupport sitemap-parser
```

### 3. 使用 sitemap 文件

具体可以参考[爬虫主动爬取]({{site.url}}/myblog/2019/04/09/myblog-robots.html)这篇博文

### 4. 编写 comments.rb脚本

```ruby
username = "SuperWangCarl" # GitHub 用户名
token = "0bcf16111fa01b74c6a0329ae4e6e58dfcc44978"  # GitHub Token
repo_name = "blog-comments" # 存放 issues
sitemap_url = "https://www.carlme.com/sitemap.xml" # sitemap
kind = "Gitalk" # "Gitalk" or "gitment"

require 'open-uri'
require 'faraday'
require 'active_support'
require 'active_support/core_ext'
require 'sitemap-parser'

sitemap = SitemapParser.new sitemap_url
urls = sitemap.to_a

conn = Faraday.new(:url => "https://api.github.com/repos/#{username}/#{repo_name}/issues") do |conn|
  conn.basic_auth(username, token)
  conn.adapter  Faraday.default_adapter
end

urls.each_with_index do |url, index|
  title = open(url).read.scan(/<title>(.*?)<\/title>/).first.first.force_encoding('UTF-8')
  urlArr = url.split("carlme.com")
print(url)
printf("-----------")
  response = conn.post do |req|
    req.body = { body: url, labels: [kind, urlArr[1]], title: title }.to_json
  end
  puts response.body
  sleep 15 if index % 20 == 0
end
```

### 5. 运行脚本

```shell
ruby comments.rb
```

## 5. FAQ

### 点击github等重定向到首页

![img]({{site.cdn}}/assets/images/blog/2019/20190410105203.png)

原因: 本地调试的域名和 注册github授权的域名不一样,导致github重定向了

解决: 将项目发布到域名下

***

### 运行comments.rb脚本报错

`{"message":"Validation Failed","errors":[{"value":"https://www.carlme.com/myblog/2019/03/25/myblog-init.html","resource":"Label","field":"name","code":"invalid"}],"documentation_url":"https://developer.github.com/v3/issues/#create-an-issue"}`

![img]({{site.cdn}}/assets/images/blog/2019/20190410133546.png)

原因 : url字符长度超过50个,github不允许

解决: 修改ruby脚本,将url按照域名分割,取域名后的数据

```ruby
urlArr = url.split("carlme.com")
response = conn.post do |req|
  req.body = { body: url, labels: [kind, urlArr[1]], title: title }.to_json
end
```

***

### 运行comments.rb报错

`open_http': 404 Not Found (OpenURI::HTTPError)`

![img]({{site.cdn}}/assets/images/blog/2019/20190410134056.png)

原因: 主页面中我都每天加 .html

解决: 在每个 `permalink: /life` 添加 .html

***

### Error: Validation Failed.

原因: issuse长度有限制(不能超过50)

解决: 将路径限制50个之内

```javascript
 function subStr(str) {
    var max = 48;
    if(str.length > max){
        str = str.substring(0,max);
    }
    return str;
}
```

## 6. 参考资料

[Gitment：使用 GitHub Issues 搭建评论系统](https://imsun.net/posts/gitment-introduction/)

[disqus](https://disqus.com/)

[gitlak](https://github.com/gitalk/gitalk#install)

[自动初始化 Gitalk 和 Gitment 评论](https://draveness.me/git-comments-initialize)

[Hello Gitment](http://amonxu.com/2018/05/10/Hello-Gitment/)