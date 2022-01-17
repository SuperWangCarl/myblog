---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: openwrt设置ss
category: devops
tags: [devops,nas,rsync]
excerpt: openwrt设置ss
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,k2,openwrt
---

## 简介

OpenWrt 下 Shadowsocks 和其配套软件的逻辑通信架构以及安装、配置的详细过程，最终可在 OpenWrt 路由器上实现透明代理上网。

Shadowsocks for OpenWrt 是基于 shadowsocks-libev 移植的，包含 **ss-local、ss-redir **和 **ss-tunnel **三个组件。此外，一个完整的 Shadowsocks 透明代理解决方案还包括 ChinaDNS 和远程 Shadowsocks 服务器等配套服务

其中， **ss-redir **负责将 OpenWrt 的 TCP/UDP 出口流量透明地转发至境外 shadowsocks 代理服务器； **ss-local **是本地 SOCKS5 代理服务器，可额外地为浏览器等客户端应用提供 SOCKS5 代理服务； **Dnsmaq **是 OpenWrt 的默认 DNS 转发服务，本方案下 Dnsmaq 接收来自局域网的 DNS 请求后转发给 ChinaDNS 处理； **ChinaDNS **是本文的 DNS 污染解决方案，它通过 **ss-tunnel **转发 DNS 请求到墙外服务器，从而获取无污染的解析结果。

## 01安装 Shadowsocks

首先，由于 OpenWrt 内建的 wget 不支持 TLS，无法下载 HTTPS 网站上的软件包，因此 SSH 进入 OpenWrt 命令行后先安装好整版的 wget 和 CA 证书软件包

```shell
opkg update
opkg install wget ca-certificates
```

openwrt-dist 软件源安装方法：

添加软件源公钥

```shell
wget http://openwrt-dist.sourceforge.net/packages/openwrt-dist.pub
opkg-key add openwrt-dist.pub
```

添加软件源到配置文件，注意命令中 `x86_64 `替换为你的硬件架构斐讯k2为`mipsel_24kc`

```
# vim /etc/opkg/customfeeds.conf
src/gz openwrt_dist http://openwrt-dist.sourceforge.net/packages/base/x86_64
src/gz openwrt_dist_luci http://openwrt-dist.sourceforge.net/packages/luci
```

接着安装 shadowsocks `UDP-Relay `（UDP 转发）功能依赖的软件包 `iptables-mod-tproxy`

```shell
opkg install iptables-mod-tproxy
```

安装 shadowsocks-libev、luci-app-shadowsocks( luci 前端)

```shell
opkg update
opkg install shadowsocks-libev
opkg install luci-app-shadowsocks
```

## 02安装 ChinaDNS

国内运营商网络 DNS 污染严重，导致大量境外域名无法正确解析，而 shadowsocks-libev 本身并没有解决 DNS 污染问题，需要配合 ChinaDNS 来解决此问题，其解决 DNS 污染的思路如下：

> ChinaDNS 分国内 DNS 和可信 DNS。ChinaDNS 会同时向国内 DNS 和可信 DNS 发请求，如果可信 DNS 先返回，则采用可信 DNS 的数据；如果国内 DNS 先返回，又分两种情况，返回的数据是国内的 IP, 则采用，否则丢弃并转而采用可信 DNS 的结果。

先前添加了 openwrt-dist 源，直接命令行安装

```shell
opkg install ChinaDNS
opkg install luci-app-chinadns
```

立即更新 ChinaDNS 的国内 IP 路由表 `/etc/chinadns_chnroute.txt`

```
# wget -O /tmp/delegated-apnic-latest 'http://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest' && awk -F\| '/CN\|ipv4/ { printf("%s/%d\n", $4, 32-log($5)/log(2)) }' /tmp/delegated-apnic-latest > /etc/chinadns_chnroute.txt
```

编辑 crontab 任务计划，每周一凌晨 3 点更新 `chinadns_chnroute.txt`

```
# crontab -e
0 3 * * 1    wget http://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest -O /tmp/delegated-apnic-latest && awk -F\| '/CN\|ipv4/ { printf("%s/%d\n", $4, 32-log($5)/log(2)) }' /tmp/delegated-apnic-latest > /etc/chinadns_chnroute.txt
# /etc/init.d/cron start
# /etc/init.d/cron enable
```

验证 crontab 任务是否正确执行

```
# logread | grep crond
```

**注意： **不要直接使用 `vim `编辑 `/etc/crontabs/root `文件；更新任务已经过优化，网络连接失败的情况下不会覆写 `/etc/chinadns_chnroute.txt `；你也可使用 ipip.net 整理好的 [国内 IP ](https://github.com/17mon/china_ip_list)，可能更为准确，更新命令：

```
wget --no-check-certificate https://raw.githubusercontent.com/17mon/china_ip_list/master/china_ip_list.txt -O /tmp/china_ip_list.txt && mv /tmp/china_ip_list.txt /etc/chinadns_chnroute.txt
```

安装好后如图所示：

## 03配置 Shadowsocks

Servers Manage

管理 Shadowsocks 服务器节点。按照实际情况填写你的 Shadowsocks 代理服务器信息即可。

**注意 **：如果要开启 `TCP Fast Open `选项，需要修改 `sysctl.conf `添加一行net.ipv4.tcp_fastopen = 3，然后使之生效。命令如下

```
echo "net.ipv4.tcp_fastopen = 3" >> /etc/sysctl.conf
sysctl -p
```

General Settings

打开 `Transparent Proxy `和 `Port Forward `，其中 `UDP-Relay `是 UDP 转发功能，这里要将其开启，其余配置项保持默认即可。

Access Control

Shadowsocks 的访问规则控制。一种合适规则是国外网站走 Shadowsocks 代理而国内网站直连，这样通常还可以加速国外网站，配置如下：

`Bypassed IP List `选择 `ChinaDNS CHNRoute`

![img]({{ site.cdn }}assets/images/blog/2021/20211025112038.png)

## 04**配置 ChinaDNS**

勾选 `Also filter results inside China from foreign DNS servers `、将上游 DNS 修改为 `114.114.114.114,127.0.0.1:5300 `（前者用于解析国内域名，后者为 `ss-tunnel `提供的 DNS 端口转发服务，将由远程服务器解析国外网站），然后启动 ChinaDNS。

![img]({{ site.cdn }}assets/images/blog/2021/20211025111830.png)

## 05**配置 Dnsmasq**

OpenWrt 管理面 `Network `-> `DHCP and DNS`

`DNS forwardings `修改为 `127.0.0.1#5353 `即 ChinaDNS 监听的端口；勾选 `Ignore resolve file `（不使用 `/etc/resolv.conf `中的 DNS 即电信运营商分配的 DNS）。

至此，一切准备就绪，Enjoy yourself! 🙂

## 参考资料

[软路由内核查询](https://openwrt.org/toh/start)

[OpenWrt+shadowsocks实现路由器透明代理](https://joybean.org/blog/2018/02/14/configure-router-for-transparent-proxy-by-using-openwrt-and-shadowsocks/)