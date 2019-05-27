---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: easyexcel操作excel
category: java
tags: [java]
excerpt: 使用easyexcel操作excel
keywords: carlme,superwang,superwangcarl,carl,卡尔米
---

## 简介

Java解析、生成Excel比较有名的框架有Apache poi、jxl。但他们都存在一个严重的问题就是非常的耗内存，poi有一套SAX模式的API可以一定程度的解决一些内存溢出的问题，但POI还是有一些缺陷，比如07版Excel解压缩以及解压后存储都是在内存中完成的，内存消耗依然很大。easyexcel重写了poi对07版Excel的解析，能够原本一个3M的excel用POI sax依然需要100M左右内存降低到KB级别，并且再大的excel不会出现内存溢出，03版依赖POI的sax模式。在上层做了模型转换的封装，让使用者更加简单方便

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
ExcelWriter writer = EasyExcelFactory.getWriter(out);

//写第一个sheet, sheet1  数据全是List<String> 无模型映射关系
Sheet sheet1 = new Sheet(1, 3);
sheet1.setSheetName("第一个sheet");
//设置列宽 设置每列的宽度
Map columnWidth = new HashMap();
columnWidth.put(0,10000);columnWidth.put(1,40000);columnWidth.put(2,10000);columnWidth.put(3,10000);
sheet1.setColumnWidthMap(columnWidth);
sheet1.setHead(createTestListStringHead());
//or 设置自适应宽度
//sheet1.setAutoWidth(Boolean.TRUE);
writer.write1(createTestListObject(), sheet1);

//写第二个sheet sheet2  模型上打有表头的注解，合并单元格
Sheet sheet2 = new Sheet(2, 3, JavaModel1.class, "第二个sheet", null);
sheet2.setTableStyle(createTableStyle());
writer.write(createTestListJavaMode(), sheet2);

//写第三个sheet包含多个table情况
Sheet sheet3 = new Sheet(3, 0);
sheet3.setSheetName("第三个sheet");
Table table1 = new Table(1);
table1.setHead(createTestListStringHead());
writer.write1(createTestListObject(), sheet3, table1);

//写sheet2  模型上打有表头的注解
Table table2 = new Table(2);
table2.setTableStyle(createTableStyle());
table2.setClazz(JavaModel1.class);
writer.write(createTestListJavaMode(), sheet3, table2);

//关闭资源
writer.finish();
out.close();

```

### 有模板

```java
OutputStream out = new FileOutputStream("/Users/jipengfei/2007.xlsx");
ExcelWriter writer = EasyExcelFactory.getWriterWithTemp(inputStream,out,ExcelTypeEnum.XLSX,true);

//写第一个sheet, sheet1  数据全是List<String> 无模型映射关系
Sheet sheet1 = new Sheet(1, 3);
sheet1.setSheetName("第一个sheet");
//设置列宽 设置每列的宽度
Map columnWidth = new HashMap();
columnWidth.put(0,10000);columnWidth.put(1,40000);columnWidth.put(2,10000);columnWidth.put(3,10000);
sheet1.setColumnWidthMap(columnWidth);
sheet1.setHead(createTestListStringHead());
//or 设置自适应宽度
//sheet1.setAutoWidth(Boolean.TRUE);
writer.write1(createTestListObject(), sheet1);

//写第二个sheet sheet2  模型上打有表头的注解，合并单元格
Sheet sheet2 = new Sheet(2, 3, JavaModel1.class, "第二个sheet", null);
sheet2.setTableStyle(createTableStyle());
writer.write(createTestListJavaMode(), sheet2);

//写第三个sheet包含多个table情况
Sheet sheet3 = new Sheet(3, 0);
sheet3.setSheetName("第三个sheet");
Table table1 = new Table(1);
table1.setHead(createTestListStringHead());
writer.write1(createTestListObject(), sheet3, table1);

//写sheet2  模型上打有表头的注解
Table table2 = new Table(2);
table2.setTableStyle(createTableStyle());
table2.setClazz(JavaModel1.class);
writer.write(createTestListJavaMode(), sheet3, table2);

//关闭资源
writer.finish();
out.close();
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