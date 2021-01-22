---
layout: post
no-post-nav: false 
copyright: me
original: https://mp.weixin.qq.com/s?__biz=MzA3ODQ0Mzg2OA==&mid=2649049604&idx=1&sn=05d36691886d5b6925f3e2eed1823374&chksm=87534e37b024c72183b2269af10d79a770233507f7ef40d2ea07a10408209c6b4b0ae0de8af9&mpshare=1&scene=1&srcid=#rd
comments: true
title: easyexcel操作excel(转)
category: java
tags: [java]
excerpt: 使用easyexcel操作excel
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,springboot
---

## 简介

Java解析、生成Excel比较有名的框架有Apache poi、jxl。但他们都存在一个严重的问题就是非常的耗内存，poi有一套SAX模式的API可以一定程度的解决一些内存溢出的问题，但POI还是有一些缺陷，比如07版Excel解压缩以及解压后存储都是在内存中完成的，内存消耗依然很大。easyexcel重写了poi对07版Excel的解析，能够原本一个3M的excel用POI sax依然需要100M左右内存降低到KB级别，并且再大的excel不会出现内存溢出，03版依赖POI的sax模式。在上层做了模型转换的封装，让使用者更加简单方便

## 代码地址

[GitHub代码地址](https://github.com/SuperWangCarl/spring-boot-examples/tree/master/office-easyexcel)

## 读取excel

### 读07版小于1000行数据返回List<List>

```
List<Object> data = EasyExcelFactory.read(inputStream, new Sheet(1, 0));

```

### 读07版小于1000行数据返回List<? extend BaseRowModel>

```
List<Object> data = EasyExcelFactory.read(inputStream, new Sheet(2, 1,JavaModel.class));

```

### 读07版大于1000行数据返回List<List>

```
ExcelListener excelListener = new ExcelListener();
EasyExcelFactory.readBySax(inputStream, new Sheet(1, 1), excelListener);

```

### 读07版大于1000行数据返回List<? extend BaseRowModel>

```
ExcelListener excelListener = new ExcelListener();
EasyExcelFactory.readBySax(inputStream, new Sheet(2, 1,JavaModel.class), excelListener);

```

### 读03版方法同上

## 写入excel

### 没有模板

```java
/**
 * 表头动态生成
 * @throws Exception
 */
public void writeExcelDynamic() throws Exception {
	// 文件输出位置
	OutputStream out = new FileOutputStream(path + ClassUtils.getMethodName() + ".xlsx");

	ExcelWriter writer = EasyExcelFactory.getWriter(out);

	// 动态添加表头，适用一些表头动态变化的场景
	Sheet sheet1 = new Sheet(1, 0);

	sheet1.setSheetName("第一个sheet");

	// 创建一个表格，用于 Sheet 中使用
	Table table1 = new Table(1);

	// 自定义表格样式
    table1.setTableStyle(DataUtil.createTableStyle());

	// 无注解的模式，动态添加表头
	table1.setHead(DataUtil.createTestListStringHead());
	// 写数据
	writer.write1(DataUtil.createDynamicModelList(), sheet1, table1);

	// 合并单元格
	writer.merge(5, 6, 0, 4);

	// 将上下文中的最终 outputStream 写入到指定文件中
	writer.finish();

	// 关闭流
	out.close();
}
```

### 有模板

```java
/**
 * 简单的excel写出
 * 表头根据注解生成
 * @throws Exception
 */
public void writeExcelSimple() throws Exception {
	// 文件输出位置
	OutputStream out = new FileOutputStream(path + ClassUtils.getMethodName() + ".xlsx");

	ExcelWriter writer = EasyExcelFactory.getWriter(out);

	// 写仅有一个 Sheet 的 Excel 文件, 此场景较为通用
	Sheet sheet1 = new Sheet(1, 0, WriteModelUser.class);

	// 第一个 sheet 名称
	sheet1.setSheetName("第一个sheet");

	// 写数据到 Writer 上下文中
	// 入参1: 创建要写入的模型数据
	// 入参2: 要写入的目标 sheet
	writer.write(DataUtil.createModelList(), sheet1);

	// 将上下文中的最终 outputStream 写入到指定文件中
	writer.finish();

	// 关闭流
	out.close();
}
```

## web下载实例写法

```java
public class Down {
    @GetMapping("/a.htm")
    public void cooperation(HttpServletRequest request, HttpServletResponse response) {
        ServletOutputStream out = response.getOutputStream();
         response.setContentType("multipart/form-data");
        response.setCharacterEncoding("utf-8");
        response.setHeader("Content-disposition", "attachment;filename="+fileName+".xlsx");
        ExcelWriter writer = new ExcelWriter(out, ExcelTypeEnum.XLSX, true);
        String fileName = new String(("UserInfo " + new SimpleDateFormat("yyyy-MM-dd").format(new Date()))
                .getBytes(), "UTF-8");
        Sheet sheet1 = new Sheet(1, 0);
        sheet1.setSheetName("第一个sheet");
        writer.write0(getListString(), sheet1);
        writer.finish();
      
        out.flush();
        }
    }
}
```

## 参考链接

[JAVA解析Excel工具easyexcel](https://github.com/alibaba/easyexcel)

[惊了！7 行代码优雅地实现 Excel 文件导出功能？](https://mp.weixin.qq.com/s?__biz=MzA3ODQ0Mzg2OA==&mid=2649049604&idx=1&sn=05d36691886d5b6925f3e2eed1823374&chksm=87534e37b024c72183b2269af10d79a770233507f7ef40d2ea07a10408209c6b4b0ae0de8af9&mpshare=1&scene=1&srcid=#rd)