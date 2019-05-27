---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: springboot集成阿里云ddns
category: springboot
tags: [springboot,aliyun]
excerpt: 使用springboot集成阿里云的ddns
keywords: carlme,superwang,superwangcarl,carl,卡尔米,springboot,阿里云,ddns
---

## 简介

由于在家里办了个服务器,但是固定ip太贵,所有就是用的阿里云域名ddns的方式配置的,就是用域名实时解析我们家里的动态的ip,我们就可以用域名连接我们家里的服务器了

## 步骤

### 阿里云配置访问权限

1. 点击`AccessKey`

   ![img]({{site.cdn}}/assets/images/blog/2019/20190416135212.png)

2. 安全起见我们还是使用子用户

   ![img]({{site.cdn}}/assets/images/blog/2019/20190416135313.png)

3. 创建用户

   ![img]({{site.cdn}}/assets/images/blog/2019/20190416141439.png)

4. 给用户分配权限

   ![img]({{site.cdn}}/assets/images/blog/2019/20190416141602.png)

5. 获取AccessKey

   ![img]({{site.cdn}}/assets/images/blog/2019/20190416141701.png)

### 配置nginx获取ip

给nginx添加这个配置,之后我们访问这个地址,会返回我们的ip

```conf
server {
    listen 1002 default;
	return 200 '$remote_addr';
}
```

### 代码编写

`详见github`[传送门](https://github.com/SuperWangCarl/spring-boot-examples/tree/master/aliyun-ddns)

1. 配置`application.yml`

   ```yaml
   aliyun-vo:
     #固定不用改
     regionId: cn-hangzhou
     #刚才申请的 AccessKeyID
     accessKeyId: xxxx
     #刚才申请的 AccessKeySecret
     accessKeySecret: xxx
     #你的一级域名
     domain: xxx.com
     #你需要配置ddns的二级域名
     rr:
       - xxx
       - yyy
     #获取公网ip的连接
     path: http://xxx.xxx.xxx:xxxx
   server:
     port: 9011
   ```

2. `pom.xml`配置引入依赖

   ```xml
    <dependencies>
       <dependency>
           <groupId>com.aliyun</groupId>
           <artifactId>aliyun-java-sdk-alidns</artifactId>
           <version>2.0.1</version>
       </dependency>
       <dependency>
           <groupId>com.aliyun</groupId>
           <artifactId>aliyun-java-sdk-core</artifactId>
           <version>2.3.8</version>
       </dependency>
       <dependency>
           <groupId>com.squareup.okhttp3</groupId>
           <artifactId>okhttp</artifactId>
           <version>3.2.0</version>
       </dependency>

       <dependency>
           <groupId>org.projectlombok</groupId>
           <artifactId>lombok</artifactId>
           <optional>true</optional>
       </dependency>

       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-web</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-configuration-processor</artifactId>
           <optional>true</optional>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-test</artifactId>
           <scope>test</scope>
       </dependency>
   </dependencies>
   ```

3. 代码编写

   ```java
   package com.aliyun.ddns.util;

   import com.aliyun.ddns.vo.AliyunVo;
   import com.aliyuncs.DefaultAcsClient;
   import com.aliyuncs.IAcsClient;
   import com.aliyuncs.alidns.model.v20150109.DescribeDomainRecordsRequest;
   import com.aliyuncs.alidns.model.v20150109.DescribeDomainRecordsResponse;
   import com.aliyuncs.alidns.model.v20150109.DescribeDomainRecordsResponse.Record;
   import com.aliyuncs.alidns.model.v20150109.UpdateDomainRecordRequest;
   import com.aliyuncs.alidns.model.v20150109.UpdateDomainRecordResponse;
   import com.aliyuncs.profile.DefaultProfile;
   import com.aliyuncs.profile.IClientProfile;
   import lombok.extern.slf4j.Slf4j;
   import okhttp3.OkHttpClient;
   import okhttp3.Request;
   import okhttp3.Response;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.scheduling.annotation.Scheduled;
   import org.springframework.stereotype.Component;

   import javax.annotation.PostConstruct;
   import java.util.List;

   @Slf4j
   @Component
   public class DDNSTask {
   	@Autowired
   	private AliyunVo aliyunVo;
   	private static IAcsClient client;

   	@PostConstruct
   	public void init() {
   		IClientProfile profile = DefaultProfile.getProfile(aliyunVo.getRegionId(), aliyunVo.getAccessKeyId(), aliyunVo.getAccessKeySecret());
   		client = new DefaultAcsClient(profile);
   		log.info("初始化client完成{}", client);
   	}

   	@Scheduled(cron = "0 */1 * * * *")  //每分钟执行一次
   	public void aliyunDomain() {
   		DescribeDomainRecordsRequest request = new DescribeDomainRecordsRequest();
   		request.setDomainName(aliyunVo.getDomain());
   		DescribeDomainRecordsResponse response;
   		try {
   			//获取此时外网的ip
   			String cur_ip = getV4IP();
   			//获取当前域名的二级域名
   			response = client.getAcsResponse(request);
   			List<Record> domainRecords = response.getDomainRecords();
   			for (String rr : aliyunVo.getRr()) {
   				for (Record domainRecord : domainRecords) {
   					if (rr.equals(domainRecord.getRR())) {
   						Record record = domainRecord;
   						//获取当前ip 域名的ip
   						String old_ip = record.getValue();

   						//获取当前的记录类型
   						String type = record.getType();
   						// 获取的当前ip 不为空  并且是A记录  且公网ip和域名ip不一样时执行
   						if (!"".equals(cur_ip) && "A".equals(type) && !old_ip.equals(cur_ip)) {
   							UpdateDomainRecordRequest udr_req = new UpdateDomainRecordRequest();
   							udr_req.setValue(cur_ip);
   							udr_req.setType(type);
   							udr_req.setTTL(record.getTTL());
   							udr_req.setPriority(record.getPriority());
   							udr_req.setLine(record.getLine());
   							udr_req.setRecordId(record.getRecordId());
   							udr_req.setRR(rr);

   							@SuppressWarnings("unused")
   							UpdateDomainRecordResponse udr_resp = client.getAcsResponse(udr_req);
   							log.info("二级域名为 : {} , 域名对应ip修改为 : {} ", rr, cur_ip);
   						} else if(!"A".equals(type)){
   							log.info("二级域名为 : {} , 当前记录是 : {} 类型,不是A记录不用修改", rr,type);
   						}else{
   							log.info("二级域名为 : {} , 无需修改,域名ip为 : {} , 外网ip为 : {}", rr, old_ip, cur_ip);
   						}
   					}
   				}
   			}
   		} catch (Exception e) {
   			log.error(e.getMessage());
   		}
   	}

   	/**
   	 * 获取外网IPV4地址
   	 *
   	 * @return
   	 */
   	public String getV4IP() {
   		try {
   			OkHttpClient client = new OkHttpClient();
   			Request request = new Request.Builder().url(aliyunVo.getPath()).build();
   			Response response = client.newCall(request).execute();
   			String ip = response.body().string();
   			log.info("当前ip为 : {}", ip);
   			return ip;
   		} catch (Exception e) {
   			log.error("获取ip失败");
   			log.error(e.getMessage());
   		}
   		return "";
   	}
   }
   ```

### 打成jar包上传到服务器

```shell
java -jar ddns-0.0.1-SNAPSHOT.jar 2>&1 &
```

`为了防止jar文件中断,写个定时脚本监控它`

```shell
cat > /.../monitor-java.sh <<EOF
#!/bin/bash
count=`ps aux | grep "aliyun-ddns.jar" | wc -l`
if [ $count -le 1 ]
then
    cd /#你脚本的目录
    java -jar ddns-0.0.1-SNAPSHOT.jar >/dev/null 2>&1 &
fi
EOF
```

`加入定时任务`

```shell
#写入脚本的绝对路径
*/1 * * * * sh /.../monitor-java.sh >/dev/null 2>&1
```

## 总结

使用该方法可以将家里的公网ip绑定到域名中,之后在外面我们就可以通过域名访问我们家里的服务器了
