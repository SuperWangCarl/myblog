---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 前端html压缩和webStrom配置
category: web
tags: [web,css]
excerpt: 前端html压缩和webStrom配置
keywords: carlme,superwang,superwangcarl,carl,git,license,卡尔米,web,css
---

## 简介

前面两篇讲了css和html的压缩,本篇讲下html文件的压缩,主要用的node插件是`html-minifier`,由于网上都是和node结合使用的,没有配置webstorm的教程,所以自己就瞎折腾了一样,搞出来了,碰到了一些坑记录下.

## 安装

```shell
#先安装 node
#安装 html-minifier
npm install -g html-minifier
```

## 配置工具类

1. 新建一个空目录

   ![img]({{site.cdn}}/assets/images/blog/2019/20190902114949.jpg)

2. 新建一个package.json文件,内容如下

   ```json
   {
     "name": "commpress",
     "version": "0.0.1",
     "dependencies": {
       "html-minifier": "^4.0.0"
     }
   }
   ```

   Shift加右键打开`cmd`,运行`npm install`

   ![img]({{site.cdn}}/assets/images/blog/2019/20190902115200.jpg)

3. 新建一个js文件内容如下

   ```javascript
   var fs = require('fs');
   var arguments = process.argv.splice(2);
   //获取第一个参数
   var inputPath = arguments[0];
   //获取第二个参数
   var outPath = arguments[1];
   var minify = require('html-minifier').minify;
   fs.readFile(inputPath, 'utf8', function (err, data) {
       if (err) {
          throw err;
       }
       fs.writeFile(outPath, minify(data,{removeComments: true,collapseWhitespace: true,minifyJS:true, minifyCSS:true}),function(){
          // console.log('success');
       });
   });
   ```

## 配置WebStorm

1. 自定义监听器

   ![img]({{site.cdn}}/assets/images/blog/2019/20190902115359.jpg)

2. 配置

   ```shell
   #
   D:\Tools\SmallTools\commpress\html\commpressHtml.js $FileDir$/$FileName$ $FileDir$/../dist/$FileNameWithoutExtension$.html
   #默认输出到同级的 dist文件夹下
   $FileDir$/../dist/$FileNameWithoutExtension$.html
   ```

   ![img]({{site.cdn}}/assets/images/blog/2019/20190902115853.jpg)

3. 效果如下

   ![img]({{site.cdn}}/assets/images/blog/2019/20190902120132.jpg)

## minify函数参数说明

第一个参数
data: String类型， 一段html代码

第二个参数 options
这里只列了几个常用的

- removeComments 默认值false；是否去掉注释
- collapseWhitespace 默认值false；是否去掉空格
- minifyJS 默认值false；是否压缩html里的js（使用uglify-js进行的压缩）
- minifyCSS 默认值false；是否压缩html里的css（使用clean-css进行的压缩）


## FAQ

### string的replace未定义

**问题 :** string的replace未定义

![img]({{site.cdn}}/assets/images/blog/2019/20190903113851.jpg)

**原因 :** 参数未指定决定路径找不到该文件

**参考链接 :** 

**解决 :** 

## 参考资料

[html压缩工具html-minifier -- nodejs常用模块](https://blog.csdn.net/larrywangsun/article/details/28363917)