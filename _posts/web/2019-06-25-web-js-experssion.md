---
layout: post
no-post-nav: false 
copyright: me
original: https://www.cnblogs.com/lemonade1172/p/7388638.html
comments: true
title: JS中&&和||(转)
category: js
tags: [web,javascript]
excerpt: JavaScript赋值语句中的逻辑与&&和逻辑或||(转)
keywords: IT超仔,carlme,superwang,superwangcarl,carl,git,license,卡尔米,web,javascript
---

## 常见许可证



## 简介

在其他语言中，我们往往看到逻辑符号出现在判断语句当中，如

但在一些js相关的面试题或者书中，我们有时会看到逻辑与&&和逻辑或||符号出现在赋值语句或者返回语句中，如

```javascript
var x=a||b;
return a&&b||c;
```

第一次看到时，我们很可能一头雾水，这是怎么回事？

***

因为在js中允许使用表达式赋值，所得的值为该表达式的运算结果。如

```javascript
var a= 5;  
var b= 6;  
var c= a+b;  
a= 10;  
console.log(c);//11  js是按顺序进行，之后的赋值不会影响之前已经计算后的表达式结果

```

```javascript
var b= 6; 
var c= a+b; 
var a= 5; 
console.log(c);//NaN 
//js虽然是按顺序进行，但在js中变量声明会提前处理，赋值操作只有在进行到该赋值语句时才会执行，所以执行到var c= a+b;时，a只定义未赋值。返回 not a num 
```

***

我们知道，

逻辑与&&的运算规则：只有左右都是true时才为true，一边是false时就是false。

逻辑或 | | 的运算规则：只有左右都是false时才为false，一个为true时就是true。

***

那么，在赋值语句和返回语句中逻辑与&&和逻辑或||又是怎样呢？

赋予的和返回的值也不是判断得到的布尔值，而是运算符左右两旁某个表达式的运算结果。

对逻辑与&&来说：

当有一个false时，返回false一侧的值；

当有两个false时，返回运算符之前（左侧）的值；

当有两个true时，返回运算符之后（右侧）的值。

逻辑与&&运算属于短路运算，在`按从左向右的运算顺序运算时，如果一个为假，即停止运算，并返回为假的值`。如，

```javascript
var a={};  
var b=56;  
//window.aaa为一个不存在的对象,  
console.log(window.aaa && null);   //undefined  
console.log(null && window.aaa);   //null  
console.log(a && null);                //null  
console.log(window.aaa&& a);      //undefined  
console.log(a && b);                   //56  
console.log(b && a);                   //object {}  
```

对逻辑或 | | 来说，正好同逻辑与&&相反`|| 可以替代三元运算符`：

当有一个true时，返回true一侧的值；

当有两个true时，返回运算符之前（左侧）的值；

当有两个false时，返回运算符之后（右侧）的值。

逻辑或 | | 运算也属于短路运算，在按从左向右的运算顺序运算时，`只有第一个操作数为假，才进行第二个操作数，返回停止运算一侧的值`，如

```javascript
var a={};  
var b=56;  
console.log(window.aaa || null);   //null 
console.log(null || window.aaa);   //window.aaa 
console.log(a || null);                //object {} 
console.log(window.aaa|| a);      //object {}
console.log(a || b);                   //object {}  
console.log(b || a);                   //56 
```

## 参考资料

[JavaScript赋值语句中的逻辑与和逻辑或](https://www.cnblogs.com/lemonade1172/p/7388638.html)