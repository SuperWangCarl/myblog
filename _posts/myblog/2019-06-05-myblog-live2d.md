---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 博客jekyll添加模版动画
category: myblog
tags: [myblog]
excerpt: 博客jekyll添加模版动画
keywords: carlme,superwang,superwangcarl,carl,卡尔米,live2d-widget,jekyll
---

## 1. 简介

感觉这个动画满萌的添加个动画

![img]({{site.cdn}}/assets/images/blog/2019/20190605172515.png)

由于这个是基于Hexo的方式开发的,所以引用到jekyll里面还是费点劲的

## 2. 步骤

> 此步骤可以忽略,纯粹是为了获取生成的静态数据
>
> 可以直接到3.7之后获取

### 1.安装nodejs(略)

### 2.安装Hexo

1. 执行命令

   ```shell
   ::安装脚手架
   npm install hexo-cli -g
   ::初始化博客
   hexo init blog
   ::进入博客
   cd blog
   ::为博客安装依赖
   npm install
   ::启动博客
   hexo server
   ```

2. 效果如图

   ![img]({{site.cdn}}/assets/images/blog/2019/20190605230213.png)

### 3.安装Live2D

1. 接着上面的命令行执行

   ```shell
   npm install --save hexo-helper-live2d
   ```

2. 将下面的代码添加到Hexo博客的配置文件`_config.xml`中

   ```yaml
   live2d:
     enable: true
     scriptFrom: local
     pluginRootPath: live2dw/
     pluginJsPath: lib/
     pluginModelPath: assets/
     tagMode: false
     debug: false
     model:
       use: wanko
     display:
       position: right
       width: 150
       height: 300
     mobile:
       show: true
   ```

3. 但这一步只下载了个空壳，不包含看板娘的。所以还需要下载看板娘`资源`。详见[live2d-widget-models](https://github.com/xiazeyu/live2d-widget-models)。

   ```
    git clone https://github.com/xiazeyu/live2d-widget-models.git
   ```

4. 找到项目里的`live2d-widget-model-wanko`文件夹，把里面`assets`里面的内容（不含`assets`文件夹），拷贝到Hexo的`blog`文件夹下新建一个`live2d_models\wanko`文件夹中。

   ![img]({{site.cdn}}/assets/images/blog/2019/20190605230817.png)

5. 注意`_config.xml`中的`model`下面的`use`和`live2d_models`下面的文件夹相对应。

6. 重新运行

   ```
   hexo server
   ```

   效果图:

   ![img]({{site.cdn}}/assets/images/blog/2019/20190605230920.png)

7. 编译静态文件

   ```
   hexo deploy
   ```

### 4.配置jekyll的动态图

1. 打开public下的`index.html`文件,获取此行,放入footer中

   `可以适当修改`

   ```javascript
   <!-- 动漫图 -->
       <script src="{{ site.smartcdn }}/assets/live2dw/lib/L2Dwidget.min.js?094cbace49a39548bed64abff5988b05"></script>
       <script>
           setTimeout(() => {
               L2Dwidget.init({
                   "pluginRootPath": "assets/live2dw/",
                   "pluginJsPath": "lib/",
                   "pluginModelPath": "assets/",
                   "tagMode": false,
                   "debug": false,
                   "model": {"jsonPath": "/assets/live2dw/assets/wanko.model.json"},
                   "display": {"position": "right", "width": 150, "height": 300},
                   "mobile": {"show": true},
                   "log": false
               })
           }, 1000)
       </script>
   ```

2. 将public下的`live2dw`复制放倒jekyll的assets目录下

   ![img]({{site.cdn}}/assets/images/blog/2019/20190605232958.png)

3. 如图,大功告成

   ![img]({{site.cdn}}/assets/images/blog/2019/20190605233352.png)

### 5.更换图片

如果需要更换图片,只需要更换两个地方即可

1. 将第四步中 github下载的文件中找出自己满意的样式

2. 将下图中的1位置里面的文件都删除,将上一步中的assets中的文件复制到该位置

3. 修改 js代码 将model名字替换为和assests中文件同名

4. 如图

   ![img]({{site.cdn}}/assets/images/blog/2019/20190605234410.png)

## 3.参考链接

[如何给你的Jekyll博客添加可爱的二次元看板娘(Live2D)](https://done.moe/tutorial/2018/08/11/how-to-add-cute-live2d-in-jekyll-blog/)

[hexo 添加live2d看板动画](https://www.cnblogs.com/xiaqiuchu/p/10356578.html)