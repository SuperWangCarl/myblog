---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: nginx+lua安装
category: software
tags: [software]
excerpt: nginx+lua安装,并调用本地脚本
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,software,nginx,shell,lua
---

## 简介

使用nginx+lua,并且调用本地脚本

## 步骤

> 需要注意软件的版本(`版本错误可能导致安装失败`)

### 下载

**nignx源码包**

[nginx-1.10.3.tar.gz]({{ site.cdn }}assets/download/nginx-1.10.3.tar.gz)

**lua脚本 所需依赖**

[ngx_devel_kit-0.3.0.tar.gz]({{ site.cdn }}assets/download/ngx_devel_kit-0.3.0.tar.gz)

[LuaJIT-2.0.4.tar.gz]({{ site.cdn }}assets/download/ngx_devel_kit-0.3.0.tar.gz)

[lua-nginx-module-0.10.8.tar.gz]({{ site.cdn }}assets/download/lua-nginx-module-0.10.8.tar.gz)

**lua调用shell所需**

[sockproc.tar.gz]({{ site.cdn }}assets/download/sockproc.tar.gz)
[lua-resty-shell.tar.gz]({{ site.cdn }}assets/download/lua-resty-shell.tar.gz)

### 安装依赖

**安装LuaJIT-2.0.4.tar.gz**

```shell
cd /root/tools
#cp /mnt/hgfs/WinLinuxShare/software/LuaJIT-2.0.4.tar.gz ./
tar xzvf LuaJIT-2.0.4.tar.gz
cd LuaJIT-2.0.4
make install PREFIX=/usr/local/luajit
#配置环境变量
cat >> /etc/profile <<EOF
export LUAJIT_LIB=/usr/local/luajit/lib
export LUAJIT_INC=/usr/local/luajit/include/luajit-2.0
EOF
```

解压

**ngx_devel_kit-0.3.0.tar.gz**

 **lua-nginx-module-0.10.8.tar.gz**

```shell
cd /root/tools
tar xf ngx_devel_kit-0.3.0.tar.gz
lua-nginx-module-0.10.8.tar.gz
```

### 安装nginx

```shell
cd /root/tools
#cp /mnt/hgfs/WinLinuxShare/software/nginx-1.10.3.tar.gz ./
tar xf nginx-1.10.3.tar.gz
cd nginx-1.10.3
./configure --user=nginx --group=nginx --prefix=/application/nginx --with-http_stub_status_module --with-debug --with-http_gzip_static_module --with-stream --with-http_ssl_module --add-module=/root/tools/ngx_devel_kit-0.3.0 --add-module=/root/tools/lua-nginx-module-0.10.8
make && make install
cd /application/nginx/conf
#上传配置文件
....
#启动
```

### 安装shell脚本

**安装sockproc**

```shell
#git的安装就不做介绍了 具体看前面博文
git clone https://github.com/juce/sockproc
cd sockproc
make
cd ..
mv sockproc /application/
cd /application/sockproc
./sockproc /tmp/shell.sock
chmod 0666 /tmp/shell.sock
```

**安装lua-resty-shell**

```shell
git clone https://github.com/juce/lua-resty-shell
cd lua-resty-shell
#和你的lua脚本放倒一起
cp lib/resty/shell.lua /application/html
```

**编写lua 脚本**

```shell
cat >> /application/html/ls.lua <<EOF
local shell = require "shell"
   local args = {
            socket = "unix:/tmp/shell.sock",  --这是第一步的unxi socket
   }
local status, out, err = shell.execute("ls", args)  --ls 是想调用的命令,
ngx.header.content_type = "text/plain"
ngx.say("Result:\n" .. out)                    -- 命令输出结果
EOF
```

**配置nginx.conf**

```conf
location = /api/ls {
            content_by_lua_file /application/html/ls.lua 
 }
```

### 测试

![img]({{ site.cdn }}assets/images/blog/2019/20190428224713.png)

## FAQ

### make 时失败

**问题 :** make 时失败

**原因 :** lua-nginx-module 和 nginx版本不匹配

**解决 :** 更换匹配的版本

***

### 启动报找不到lib包

**问题 :** 

![img]({{ site.cdn }}assets/images/blog/2019/20190428224013.png)

**原因 :** 由于编译时没有生成动态链接库，只能手动链接

**解决 :** 

```shell
cat >> /etc/ld.so.conf.d/libc.conf <<EOF
/usr/local/luajit/lib/
/usr/local/lib/
EOF
#重新加载配置
ldconfig
```

***

### 找不到shell.lua

**问题 :** 找不到shell.lua

![img]({{ site.cdn }}assets/images/blog/2019/20190429160515.png)

**原因 :** 路径配置错误,或者权限不够

**解决 :** 修改权限,或者路径





