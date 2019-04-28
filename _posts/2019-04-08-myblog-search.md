---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 博客搜索
category: myblog
tags: [search,myblog,nginx跨域]
excerpt: 给博客添加搜索功能
keywords: carlme,superwang,superwangcarl,carl,blog,search,搜索,卡尔米,nginx跨域
---

## 1. 简介

博客一般都需要一个搜索的功能,因为这个是静态的博客,所以没办法使用es或者solr之类的动态搜索,当然也可以写一个es的后台搜索接口,不过有点麻烦,并且我那个服务器配置比较低,每次es构建的时候也比较慢,所以现在网上找了一个静态的搜索,数据都是在构建静态页面的时候生成的,没办法全文检索,比较蛋疼.

## 2. 操作步骤

### 1. 引入css

```css
<!-- 搜索 -->
<link rel="stylesheet" href="/assets/css/simple-jekyll-search.min.css">
```

### 2. 引入js

```javascript
<!-- 实现搜索 -->
<script type="text/javascript" src="/assets/js/simple-jekyll-search.min.js"></script>

<script>
//这边由于后期数据量可能比较大,所以我把生成的json放倒cdn里面,页面加载快点
    window.simpleJekyllSearch = new SimpleJekyllSearch({
        searchInput: document.getElementById('search-input'),
        resultsContainer: document.getElementById('results-container'),
        json: '{{ site.cdn }}/assets/json/search.json',
        searchResultTemplate: '<li><a href="{url}?query={query}" title="{desc}">{title}</a></li>',
        noResultsText: 'No results found',
        limit: 10,
        fuzzy: false,
      /*  exclude: ['Welcome']*/
    })
</script>
```

### 3. 页面修改

```html
<!-- 搜索框 -->
<div id="search-container" class="search">
    <input type="text" id="search-input" placeholder="search...">
    <ul id="results-container" ></ul>
</div>
```

### 4.search.json

```json
见图
```

![img]({{site.cdn}}/assets/images/blog/2019/20190411085852.png)

### 5. 跨域的nginx设置

`如果json直接放倒项目里引用,就不存在跨域问题不用配置,因为我将json放倒cdn里面了,所以需要在后台给这个cdn配置一个允许跨域`

json: '/assets/json/search.json',

`这个配置是在cdn的nginx中配置的,不是在我们的博客的nginx中配置的`

```conf
location / {
	set $cors '';
	//允许以carlme.com结尾的域名跨域
	if ($http_origin ~* '.*.carlme.com?') {
			set $cors 'true';
	}
	
	if ($cors = 'true') {
			add_header 'Access-Control-Allow-Origin' "$http_origin";
			add_header 'Access-Control-Allow-Credentials' 'true';
			add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
			add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Mx-ReqToken,X-Requested-With';
	}
	
	if ($request_method = 'OPTIONS') {
			return 204;
	}
}
```

## 3. 优缺点

### 优点

- 静态数据搜索比较快

### 缺点

- 后期json文件过大加载会慢
- 后期文件过大时,浏览器解析会慢
- 进行全文检索时,json会很大,所以无法进行全文检索

### 解决

- 暂时将json文件放入cdn中,提交加载速度

## 4.效果展示

![img]({{site.cdn}}/assets/images/blog/2019/20190408233208.png)

## 5. 参考资料

[nginx通过CORS实现跨域](https://www.cnblogs.com/sunmmi/articles/5956554.html)

[Jekyll 静态博客实现搜索功能](https://www.jianshu.com/p/064e2422f7c7)

[内容同步指南](https://ziyuan.baidu.com/college/articleinfo?id=2280)

## 6. FAQ

- 开始想将json文件配置到cdn中,但是由于我的cdn是`http协议的`所以就先将cdn增加配置https了,具体教程可以搜索我以前的博文,直接搜`https`即可.
- 后来发现存在跨域问题,一直在折腾用,jsonp解决,搞了一两个小时,发现很麻烦,后来忽然想到,nginx中可以配置跨域的,然后就在网上搜索了一篇nginx的跨域配置.
- 配置nginx跨域的时候,开始配置单域名很简单,后来因为可能存在多个域名,所以又折腾了一会,加了一个if判断,只要是我的域名结尾的都允许跨域.