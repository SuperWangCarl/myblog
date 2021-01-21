---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: 定时任务使用总结
category: springboot
tags: [springboot]
excerpt: 定时任务使用总结
keywords: carlme,superwang,superwangcarl,carl,卡尔米,springboot,java
---

## 简介

工作中使用的几种定时任务方法总结

## 代码地址

[GitHub代码地址](https://github.com/SuperWangCarl/spring-boot-examples/tree/master/scheduled)

## java定时任务

### 定义TimerManager

```java
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.Calendar;
import java.util.Date;
import java.util.Timer;
@Component
public class TimerManager {

	@Resource
	private ReportSynDataTask reportSynDataTask;

	// 时间间隔
	private static final long PERIOD_DAY = 24 * 60 * 60 * 1000;

	@PostConstruct
	public void init(){
		Calendar calendar = Calendar.getInstance();

		/*** 定制每日08:30执行方法 ***/
		calendar.set(Calendar.HOUR_OF_DAY,8);
		calendar.set(Calendar.MINUTE,30);
		calendar.set(Calendar.SECOND, 0);

		Date date = calendar.getTime(); //  第一次执行定时任务的时间

		// 如果第一次执行定时任务的时间 小于 当前的时间
		// 此时要在 第一次执行定时任务的时间 加一天，以便此任务在下个时间点执行。如果不加一天，任务会立即执行。
		if (date.before(new Date())) {
			date = this.addDay(date, 1);
		}

		Timer timer = new Timer();
		// 安排指定的任务在指定的时间开始进行重复的固定延迟执行。
		timer.schedule(reportSynDataTask, date, PERIOD_DAY);
	}

	// 增加或减少天数
	public Date addDay(Date date, int num) {
		Calendar startDT = Calendar.getInstance();
		startDT.setTime(date);
		startDT.add(Calendar.DAY_OF_MONTH, num);
		return startDT.getTime();
	}

}
```

### 定义ReportSynDataTask

```java
import org.springframework.stereotype.Component;

import java.util.TimerTask;

@Component
public class ReportSynDataTask extends TimerTask {

	public void run() {
		//定时任务执行..
		System.out.println("run...");
	}

}
```

## springboot定时任务

![img]({{site.cdn}}assets/images/blog/2019/20190527165706.png)

## 参考资料

[玩转SpringBoot之定时任务详解](https://www.cnblogs.com/mmzs/p/10161936.html)