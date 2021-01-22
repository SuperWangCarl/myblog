---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 基于cookie的记住我
category: jquery
tags: [jquery,web,safe]
excerpt: 简介
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,web,jquery,safe
---

## 简介

基于jquery.cookie.js实现记住我功能

## 步骤

- 安装插件

  ```html
  <script src="../jquery.min.js"></script>
  <script src="../jquery.cookie.js"></script>
  ```

- html

  ```html
  <form method="post" action="a.html" onsubmit="return verify()">
  <tr>
      <td width="60">账  号：</td>
      <td width="244"><input id="userName" name="userName" type="text" class="inp_01" /></td>
    </tr>
    <tr>
      <td>密  码：</td>
      <td><input id="password" name="password" type="password" class="inp_01" /></td>
    </tr>
    <tr>
      <td> </td>
      <td><input id="rememberMe" type="checkbox"/> 记住我</td>
    </tr>
     <input type="submit" value="登录">
  </form>
  ```

- js

  ```javascript
  function verify(){
          var username = $('#username').val();
          var password = $('#password').val();
          if ($('#rememberMe').is(':checked')) {
              $.cookie('username', username, {
                  expires: 365
              });
              $.cookie('password', password, {
                  expires: 365
              });
              $.cookie('bit', 'true', {
                  expires: 365
              });
          } else {
              $.removeCookie('username');
              $.removeCookie('password');
              $.removeCookie('bit');
          }

           var len = $("#username").val().length;
    		//用户名超过20位默认不向后台发送请求
           if (len < 20) {
               return true;
           } else {
               $("#errMsg").show();
               return false
           }
      }

      $(function () {
          if ($.cookie('bit') === 'true') {
              $('#rememberMe').attr('checked', 'checked');
              $('#username').val($.cookie('username'));
              $('#password').val($.cookie('password'));
          }
      });
  ```

## 参考链接

[使用jquery插件【jquery.cookie】，实现【记住我】功能](https://blog.csdn.net/lisq037/article/details/9118559)

[jquery 设置cookie、删除cookie、获取cookie](https://www.cnblogs.com/hellofangfang/p/9626797.html)

[jquery.cookie.js插件删除不掉cookie的问题](https://www.cnblogs.com/wangmaoling/p/7745005.html)