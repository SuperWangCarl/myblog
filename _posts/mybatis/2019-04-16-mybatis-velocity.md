---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: mybatis-plus模板修改
category: mybatis
tags: [mybatis,mybatisplus]
excerpt: mybatis-plus模版生成修改
keywords: IT超仔,carlme,superwang,superwangcarl,carl,卡尔米,mybatis,mybatisplus,ssm
---

## 简介

由于公司最近使用的是mybatis-plus来操作数据库,但是写了几天后发现好多都是复制粘贴的功能,所以就想在生成代码的时候,直接把这些相似的代码生成出来.

## 步骤

### mybatisplus生成代码

```java
@Test
public void  testGenerator() {
	//1. 全局配置
	GlobalConfig config = new GlobalConfig();
	config.setActiveRecord(true) // 是否支持AR模式
			.setAuthor("SuperWang") // 作者
			.setOutputDir("E:/") // 生成路径
			.setFileOverride(true)  // 文件覆盖
			.setIdType(IdType.UUID) // 主键策略
			.setServiceName("%sService")  // 设置生成的service接口的名字的首字母是否为I
			.setBaseResultMap(true)  	//结果集映射
			.setBaseColumnList(true)	//列片段
			.setEnableCache(false)
			;

	//2. 数据源配置
	DataSourceConfig dsConfig  = new DataSourceConfig();
	dsConfig.setDbType(DbType.MYSQL)  // 设置数据库类型
			.setDriverName("com.mysql.cj.jdbc.Driver")
			.setUrl("jdbc:mysql://xxx.xxx.xxx.xxx:3306/zhenjiang?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8")
			.setUsername("root")
			.setPassword("123456")
			;

	//3. 策略配置
	StrategyConfig stConfig = new StrategyConfig();
	stConfig.setCapitalMode(true) //全局大写命名
			.setDbColumnUnderline(true)  // 指定表名 字段名是否使用下划线
			.setNaming(NamingStrategy.underline_to_camel) // 数据库表映射到实体的命名策略
			.setTablePrefix("t_")
			.setRestControllerStyle(true) //前后端分离生成 restful风格
			.setInclude("t_entpr_meta","t_entpr_user","t_entpr_info")
			.setLogicDeleteFieldName("use_flag")
			.setSuperControllerClass("com.hedian.platform.base.BaseController") //controller的继承父类
			;  // 生成的表

	//4. 包名策略配置
	PackageConfig pkConfig = new PackageConfig();
	pkConfig.setParent("com.super.wang")
			.setMapper("persistence.mapper")
			.setService("service")
			.setController("controller")
			.setEntity("persistence.po")
			.setXml("persistence.mapper.xml")
			;

	//5.自定义Controller 和 Service,此处使用我们自己自定义的
	TemplateConfig tc = new TemplateConfig();
	tc.setController("/templatesMybatis/controller.java.vm")
	  .setService("/templatesMybatis/service.java.vm")
	  .setServiceImpl("/templatesMybatis/serviceImpl.java.vm")
	  ;

	//6. 整合配置
	AutoGenerator ag = new AutoGenerator();

	ag.setGlobalConfig(config)
			.setDataSource(dsConfig)
			.setStrategy(stConfig)
			.setPackageInfo(pkConfig)
			.setTemplate(tc)
			;

	//7. 执行
	ag.execute();
}
```

### BaseController

```java
public abstract class BaseController {

	private final static ThreadLocal<HttpServletRequest> REQUEST = new ThreadLocal<HttpServletRequest>();
	private final static ThreadLocal<HttpServletResponse> RESPONSE = new ThreadLocal<HttpServletResponse>();
	private final static ThreadLocal<ModelMap> MODEL = new ThreadLocal<ModelMap>();

	@ModelAttribute
	public final void init(HttpServletRequest request,HttpServletResponse response,ModelMap model){
		REQUEST.set(request);
		RESPONSE.set(response);
		MODEL.set(model);
	}

	public final HttpServletRequest getRequest(){
		return REQUEST.get();
	}

	public final HttpServletResponse getResponse(){
		return RESPONSE.get();
	}

	public final ModelMap getModel(){
		return MODEL.get();
	}

	//获取当前用户
	public UserVo getUser(){
		return getRequest().getAttribute("currentUser") == null ? new UserVo() : (UserVo) getRequest().getAttribute("currentUser");
	}
}
```

### BaseResult

```java
@Data
@ApiModel(value="响应对象",description="基础响应对象")
public class BaseResult<T> implements Serializable {

	private static final long serialVersionUID = 1L;

	@ApiModelProperty(value = "响应结果 success表示成功")
	private String desc = ResultConstant.SUCCESS.getMessage();

	@ApiModelProperty(value = "响应码 10000表示成功")
	private String resultCode = ResultConstant.SUCCESS.getResultCode();

	private T data;

	public BaseResult() {
		super();
	}

	public BaseResult(T data) {
		super();
		this.data = data;
	}

	public BaseResult(String desc){
		super();
		this.resultCode = ResultConstant.OTHER_ERROE.getResultCode();
		this.desc = desc;
	}

}
```

### ResultConstant

```java
public enum ResultConstant {

    //服务异常
    INTERNAL_SERVER_ERROR("20000", "internal.server.error"),

    //业务处理成功
    SUCCESS("10000", "success"),

    //token过期或无效(包含未登陆)
    ACCESS_DENIED("30000", "access.denied"),

    //参数错误
    PARAM_ERROR("40001", "param.error"),

    //无操作权限
    PERMISSION_DENIED("30001", "permission.denied"),

    //操作失败
    OPERATE_FAIL("40000", "operation.failed"),
    NO_EXIST("40002", "no.exist"),
    EDIT_FAIL("40003", "edit.fail"),
    IS_EXIST("40001", "is.exist"),
    ADD_FAIL("40004", "add.fail"),
    DELETE_FAIL("40005", "delete.fail"),
    IMPORT_FAIL("40006", "import.fail"),
    FILE_TYPE_ERROR("40007", "file.type.error"),

    //HTTP方法不支持
    HTTP_METHOD_NOT_SUPPORT("50000", "http.method.not.support"),

    //用户名或密码错误
    USERNAME_PASSWORD_ERROR("30001", "user.password.error"),

    //其他所有错误
    OTHER_ERROE("60000", "other.error"),

    ;
    public String resultCode;
    public String message;

    ResultConstant(String resultCode, String message) {
        this.resultCode = resultCode;
        this.message = message;
    }

    public String getResultCode() {
        return resultCode;
    }

    public void setResultCode(String resultCode) {
        this.resultCode = resultCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
```

### controller.java.vm

```velocity
package ${package.Controller};


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import com.hedian.platform.base.BaseResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.hedian.platform.annotation.BaseLog;
import com.hedian.platform.validate.AddGroup;
import com.hedian.platform.validate.EditGroup;
import com.baomidou.mybatisplus.plugins.Page;
import ${package.Service}.${table.serviceName};

#if(${restControllerStyle})
import org.springframework.web.bind.annotation.RestController;
#else
import org.springframework.stereotype.Controller;
#end
#if(${superControllerClassPackage})
import ${superControllerClassPackage};
#end

/**
 * <p>
 * $!{table.comment} 前端控制器
 * </p>
 *
 * @author ${author}
 * @since ${date}
 */
#if(${restControllerStyle})
@RestController
#else
@Controller
#end
@RequestMapping("/${table.entityPath}")
#if(${kotlin})
class ${table.controllerName}#if(${superControllerClass}) : ${superControllerClass}()#end

#else
#if(${superControllerClass})
@Api(tags = "${entity}")
@Slf4j
@BaseLog("$!{table.comment}")
public class ${table.controllerName} extends ${superControllerClass} {
#else
public class ${table.controllerName} {
#end

    @Autowired
	private ${table.serviceName} ${table.entityPath}Service;

	/**
	 * 单个查
	 */
	@GetMapping("/query/{id}")
	@ApiOperation(value = "单个查询", httpMethod = "GET")
	@ApiImplicitParam(name = "id", value = "id", required = true, dataType = "String", paramType = "path")
	@BaseLog
	public BaseResult<${entity}Vo> query${entity}(@PathVariable String id) {
		log.info("query --- query:{}", id);
		return ${table.entityPath}Service.query${entity}(id);
	}

	/**
	 * 分页查 条件查
	 */
	@GetMapping("/page")
	@ApiOperation(value = "公告查询", httpMethod = "GET")
	@ApiImplicitParams({
			@ApiImplicitParam(name = "index", value = "第几页,默认1",  dataType = "Integer", paramType = "query"),
			@ApiImplicitParam(name = "size", value = "每页几条数据,默认10",  dataType = "Integer", paramType = "query"),
			@ApiImplicitParam(name = "searchInfo", value = "搜索信息", dataType = "String", paramType = "query"),
	})
	@BaseLog
	public BaseResult<Page<${entity}Vo>> query${entity}List(@RequestParam(name = "index", defaultValue = "1", required = false) Integer index,
														@RequestParam(name = "size", defaultValue = "10", required = false) Integer size,
														@RequestParam(name = "searchInfo", defaultValue = "", required = false) String searchInfo) {
		log.info("queryUserList:{}:{}:{}", searchInfo);
		Page<${entity}Vo> page = new Page<>(index, size);
		return ${table.entityPath}Service.query${entity}List(page,searchInfo);
	}
	/**
	 * 增
	 */
	@PostMapping("/add")
	@ApiOperation(value = "添加", httpMethod = "POST")
	@BaseLog
	public BaseResult<${entity}Vo> add${entity}(@RequestBody @Validated(AddGroup.class) ${entity}Vo ${table.entityPath}Vo) {
		${table.entityPath}Vo.setCreateId(getUser().getUserId());
		return ${table.entityPath}Service.add${entity}(${table.entityPath}Vo);
	}
	/**
	 * 改
	 */
	@PutMapping("/edit")
	@ApiOperation(value = "编辑", httpMethod = "PUT")
	@BaseLog
	public BaseResult<${entity}Vo> edit${entity}(@RequestBody @Validated(EditGroup.class) ${entity}Vo ${table.entityPath}Vo) {
		${table.entityPath}Vo.setModifiedId(getUser().getUserId());
		return ${table.entityPath}Service.edit${entity}(${table.entityPath}Vo);
	}
	/**
	 * 删
	 */
	@DeleteMapping("/delete/{id}")
	@ApiOperation(value = "删除", httpMethod = "DELETE")
	@ApiImplicitParam(name = "id", value = "id", required = true, dataType = "String", paramType = "path")
	@BaseLog
	public BaseResult<${entity}Vo> delete${entity}(@PathVariable String id) {
		return ${table.entityPath}Service.delete${entity}(id,getUser().getUserId());
	}
}

#end
```

### service.java.vm

```velocity
package ${package.Service};

import ${package.Entity}.${entity};
import ${superServiceClassPackage};
import org.springframework.web.bind.annotation.PathVariable;
import com.baomidou.mybatisplus.plugins.Page;
/**
 * <p>
 * $!{table.comment} 服务类
 * </p>
 *
 * @author ${author}
 * @since ${date}
 */
#if(${kotlin})
interface ${table.serviceName} : ${superServiceClass}<${entity}>
#else
public interface ${table.serviceName} extends ${superServiceClass}<${entity}> {

        /**
	     * 通过id查询
	     * @param id
	     * @return
	     */
		BaseResult<${entity}Vo> query${entity}(@PathVariable String id);

		/**
         * 分页查询
         * @param page
         * @param searchInfo
         * @return
         */
		BaseResult<Page<${entity}Vo>> query${entity}List(Page page, String searchInfo);

		/**
         * 添加
         * @param
         * @return
         */
		BaseResult<${entity}Vo> add${entity}(${entity}Vo ${table.entityPath}Vo);

		/**
         * 编辑
         * @param
         * @return
         */
		BaseResult<${entity}Vo> edit${entity}(${entity}Vo ${table.entityPath}Vo);

		/**
         * 删除
         * @param id 需要删除的 实体类id
         * @param userId 删除者的用户id
         * @return
         */
		BaseResult<${entity}Vo> delete${entity}(String id,String userId);

}
#end
```

### serviceImpl.java.vm

```velocity
package ${package.ServiceImpl};

import ${package.Entity}.${entity};
import ${package.Mapper}.${table.mapperName};
import ${package.Service}.${table.serviceName};
import ${superServiceImplClassPackage};
import com.hedian.platform.base.BaseResult;
import com.hedian.platform.constants.CommonConstant;
import com.hedian.platform.constants.ResultConstant;
import com.hedian.platform.exception.ExceptionController;
import com.hedian.platform.utils.DateTimeUtil;
import com.hedian.platform.utils.JsonUtil;
import com.hedian.zhenjiang.persistence.mapper.EntprInfoMapper;
import com.hedian.zhenjiang.persistence.po.EntprInfo;
import com.hedian.zhenjiang.service.EntprInfoService;
import com.hedian.zhenjiang.vo.EntprInfoVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.mapper.EntityWrapper;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * $!{table.comment} 服务实现类
 * </p>
 *
 * @author ${author}
 * @since ${date}
 */
@Service
@Slf4j
#if(${kotlin})
open class ${table.serviceImplName} : ${superServiceImplClass}<${table.mapperName}, ${entity}>(), ${table.serviceName} {

}
#else
public class ${table.serviceImplName} extends ${superServiceImplClass}<${table.mapperName}, ${entity}> implements ${table.serviceName} {


	@Autowired
	private ExceptionController exceptionController;
	@Override
	public BaseResult<${entity}Vo> query${entity}(@PathVariable String id){
		${entity} ${table.entityPath} = selectById(id);
		if (${table.entityPath} == null) {
			return exceptionController.commonResult(ResultConstant.NO_EXIST);
		}

		${entity}Vo ${table.entityPath}Vo = new ${entity}Vo();
		BeanUtils.copyProperties(${table.entityPath},${table.entityPath}Vo );
		return new BaseResult<>(${table.entityPath}Vo);
    }

    @Override
    public BaseResult<Page<${entity}Vo>> query${entity}List(Page page, String searchInfo){
    	//TODO 自定义查询条件
		Page<${entity}> ${table.entityPath}Page = selectPage(page, new EntityWrapper<${entity}>()
				.like("",searchInfo)
				.orderBy("create_time",false)
		);

		List<${entity}> ${table.entityPath}List = ${table.entityPath}Page.getRecords();
		List<${entity}Vo> ${table.entityPath}VoList = new ArrayList<>(100);

		//将实体类转换为 前台需要的VO
		${table.entityPath}List.forEach(${table.entityPath}->{
				${entity}Vo ${table.entityPath}Vo = new ${entity}Vo();
				BeanUtils.copyProperties(${table.entityPath},${table.entityPath}Vo);
				${table.entityPath}Vo.setCreateTimeStr(DateTimeUtil.formatDateTimetoString(${table.entityPath}.getCreateTime(),"yyyy-MM-dd HH:mm:ss"));
				${table.entityPath}VoList.add(${table.entityPath}Vo);
		});

		Page<${entity}Vo> ${table.entityPath}VoPage = new Page<>();
		BeanUtils.copyProperties(${table.entityPath}Page,${table.entityPath}VoPage);
		${table.entityPath}VoPage.setRecords(${table.entityPath}VoList);
		return  new BaseResult<>(${table.entityPath}VoPage);
    }

    @Override
    public BaseResult<${entity}Vo> add${entity}(${entity}Vo ${table.entityPath}Vo){
    	//通过条件查询该实体是否存在
		//TODO 自定义实体条件 列
		${entity} ${table.entityPath} = selectOne(new EntityWrapper<${entity}>()
										.eq("", ${table.entityPath}Vo.getName()));

		if (${table.entityPath} != null) {
			return exceptionController.commonResult(ResultConstant.IS_EXIST);
		}
		${table.entityPath} = new ${entity}();

		BeanUtils.copyProperties(${table.entityPath}Vo,${table.entityPath});
		boolean result = insert(${table.entityPath});
		if(result){
			log.info("插入成功{}", JsonUtil.Object2JsonString(${table.entityPath}));
			return new BaseResult<>();
		}
		return exceptionController.commonResult(ResultConstant.ADD_FAIL);
    }

    @Override
    public BaseResult<${entity}Vo> edit${entity}(${entity}Vo ${table.entityPath}Vo){
		//查询该 实体是否存在
		//TODO 获取id
		${entity} ${table.entityPath} = selectById(${table.entityPath}Vo.getId());

		if (${table.entityPath} == null) {
			return exceptionController.commonResult(ResultConstant.NO_EXIST);
		}
		BeanUtils.copyProperties(${table.entityPath}Vo,${table.entityPath});
		boolean result = updateById(${table.entityPath});
		if (result) {
			log.info("编辑成功{}", JsonUtil.Object2JsonString(${table.entityPath}));
			return new BaseResult<>();
		}
		return exceptionController.commonResult(ResultConstant.EDIT_FAIL);
    }

    @Override
    public BaseResult<${entity}Vo> delete${entity}(String id,String userId){
    	//查询该 实体是否存在
		${entity} ${table.entityPath} = selectById(id);
		if (${table.entityPath} == null) {
			return exceptionController.commonResult(ResultConstant.NO_EXIST);
		}
		//修改为删除状态,并添加用户id
		${table.entityPath}.setUseFlag(CommonConstant.useFlag);
		${table.entityPath}.setModifiedId(userId);

		boolean result = updateById(${table.entityPath});
		if (result) {
			log.info("删除成功{}", JsonUtil.Object2JsonString(${table.entityPath}));
			return new BaseResult<>();
		}
		return exceptionController.commonResult(ResultConstant.DELETE_FAIL);
    }


}
#end

```

## 总结

此方法无法生成`vo`需要我们自己去创建,有待后续改进吧.一些基础的增删改查都不用去手写了

## 附录

| velocity proper                          | velocity vlaue                           |
| ---------------------------------------- | ---------------------------------------- |
| ${table.controllerName}                  | EntprInfoController                      |
| ${package.ModuleName}                    | ${package.ModuleName}                    |
| ${package.ModuleName}                    | ${package.ModuleName}                    |
| ${entity}                                | EntprInfo                                |
| ${controllerMappingHyphenStyle}          | true                                     |
| ${controllerMappingHyphen}               | entpr-info                               |
| ${table.entityPath}                      | entprInfo                                |
| ${kotlin}                                | false                                    |
| ${table.serviceName}                     | EntprInfoService                         |
| ${superServiceClass}<${entity}>          | IService<EntprInfo>                      |
| $!{table.comment}                        | 企业基本信息表                                  |
| ${package.ServiceImpl};                  | com.hedian.zhenjiang.service.impl;       |
| ${table.controllerName}                  | EntprInfoController                      |
| ${package.Entity}.${entity};             | com.hedian.zhenjiang.persistence.po.EntprInfo; |
| ${package.Mapper}.${table.mapperName};   | com.hedian.zhenjiang.persistence.mapper.EntprInfoMapper; |
| ${package.Service}.${table.serviceName}; | com.hedian.zhenjiang.service.EntprInfoService; |
| ${superServiceImplClassPackage};         | com.baomidou.mybatisplus.service.impl.ServiceImpl; |
| ${superControllerClass}                  | BaseController                           |
| ${table.serviceImplName}                 | EntprInfoServiceImpl                     |
| ${superServiceImplClass}<${table.mapperName}, ${entity}> | ServiceImpl<EntprInfoMapper, EntprInfo>  |
| ${table.serviceName}                     | EntprInfoService                         |
| ${restControllerStyle}                   | true                                     |

