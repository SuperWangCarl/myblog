---
layout: post
no-post-nav: false 
copyright: me
original: me
comments: true
title: spring-aop
category: Spring
tags: [spring,aop]
excerpt: Spring的Aop的使用和常用方法
keywords: carlme,superwang,superwangcarl,carl,卡尔米,Spring,aop
---

## 简介

最近项目中用了比较多的spring的切面,对使用中的aop进行下总结.

> AspectJ 使 用 org.aspectj.lang.JoinPoint 接 口 表 示 目 标 类 连 接 点 对 象 ， 如 果 是 环 绕 增 强 时 ， 使 用
> org.aspectj.lang.ProceedingJoinPoint表示连接点对象，该类是JoinPoint的子接口。任何一个增强方法都可以 通过将第一个入参
> 声明为JoinPoint访问到连接点上下文的信息。 

## 接口中的两个参数

### JoinPoint 

- java.lang.Object[] getArgs()：获取连接点方法运行时的入参列表；
- Signature getSignature() ：获取连接点的方法签名对象；
- java.lang.Object getTarget() ：获取连接点所在的目标对象；
- java.lang.Object getThis() ：获取代理对象本身； 

### ProceedingJoinPoint 

- ProceedingJoinPoint : `继承JoinPoint子接口`，它新增了两个用于执行连接点方法的方法：
- java.lang.Object proceed() throws java.lang.Throwable：通过反射执行目标对象的连接点处的方法；
- java.lang.Object proceed(java.lang.Object[] args) throws java.lang.Throwable：通过反射执行目标对象连接点处的方法，不过使用新的入参替换原来的入参。 

## **JoinPoint接口的子接口和实现类**

![img](../../assets/images/blog/2019/20190419145143.png)

## **获取切入方法对象三种方法：**

### 1.通过反射机制获取切入点目标类的方法

```java
public void invoke(JoinPoint joinPoint) throws Throwable {
	//登录拦截
	MethodInvocationProceedingJoinPoint methodPoint = (MethodInvocationProceedingJoinPoint) joinPoint;
	Field proxy = methodPoint.getClass().getDeclaredField("methodInvocation");
	proxy.setAccessible(true);
	ReflectiveMethodInvocation j = (ReflectiveMethodInvocation) proxy.get(methodPoint);
	Method method = j.getMethod();
	Login login = method.getAnnotation(Login.class);
}
```

### 2.通过JoinPoint的getTarget()获取连接点所在的目标对象

```java
public void invoke(JoinPoint joinPoint) throws Throwable{
	//拦截的实体类
	Object target = joinPoint.getTarget();
	//拦截的方法名称
	String methodName = joinPoint.getSignature().getName();
	//拦截的方法参数
	Object[] argsa = joinPoint.getArgs();
	//拦截的放参数类型
	Class[] parameterTypes = ((MethodSignature)joinPoint.getSignature()).getMethod().getParameterTypes();
	Method method = target.getClass().getMethod(methodName, parameterTypes);
	Login login = method.getAnnotation(Login.class);
｝
```

### 3.通过JoinPoint的getSignature()获取连接点的方法签名对象

```java
public void invoke(JoinPoint joinPoint) throws Throwable{
	MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
	Method method = methodSignature.getMethod();
	Login login = method.getAnnotation(Login.class);
｝
```

## @Pointcut的用法

通过`&& || 和!`的方式进行组合

### 定义方式

- @args()
- `execution()`
- this()
- @target()
- @within()
- @annotation

### execution()详解

```
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern? name-pattern(param-pattern)throws-pattern?)
```

- returning type pattern,name pattern, and parameters pattern是必须的.
- ret-type-pattern:可以为*表示任何返回值,全路径的类名等.
- name-pattern:指定方法名,*代表所以,set*,代表以set开头的所有方法.
- parameters pattern:指定方法参数(声明的类型),(..)代表所有参数,(*)代表一个参数,(*,String)代表第一个参数为任何值,第二个为String类型.

![img](../../assets/images/blog/2019/20190419153629.png)

2.within:匹配包或子包中的方法(了解)

	within(com.itheima.aop..*)
3.this:匹配实现接口的代理对象中的方法(了解)
	this(com.itheima.aop.user.UserDAO)
4.target:匹配实现接口的目标对象中的方法(了解)
	target(com.itheima.aop.user.UserDAO)
5.args:匹配参数格式符合标准的方法(了解)
	args(int,int)
6.bean(id)  对指定的bean所有的方法(了解)
	bean('userServiceId')

### 案例

- 任意公共方法的执行

  ```
  execution(public * *(..))
  ```

- 任何一个以“set”开始的方法的执行

  ```
  execution(* set*(..))
  ```

- AccountService 接口的任意方法的执行'

  ```
  execution(* com.xyz.service.AccountService.*(..))
  ```

- 定义在service包里的任意方法的执行

  ```
  execution(* com.xyz.service..(..))
  ```

- 定义在service包和所有子包里的任意类的任意方法的执行

  ```
  execution(* com.xyz.service...(..))
  ```

- 定义在pointcutexp包和所有子包里的JoinPointObjP2类的任意方法的执行

  > 最靠近(..)的为方法名,靠近.*(..))的为类名或者接口名,如上例的JoinPointObjP2.*(..))

  ```
  execution(* com.test.spring.aop.pointcutexp..JoinPointObjP2.*(..))")
  ```

- pointcutexp包里的任意类.

  ```
  within(com.test.spring.aop.pointcutexp.*)
  ```

- pointcutexp包和所有子包里的任意类

  ```
  within(com.test.spring.aop.pointcutexp..*)
  ```

- 实现了Intf接口的所有类,如果Intf不是接口,限定Intf单个类

  > 当一个实现了接口的类被AOP的时候,用getBean方法必须cast为接口类型,不能为该类的类型.

  ```
  this(com.test.spring.aop.pointcutexp.Intf)
  ```

- 带有@Transactional标注的所有类的任意方法.

  >  @within和@target针对类的注解,@annotation是针对方法的注解

  ```
  @within(org.springframework.transaction.annotation.Transactional)
  @target(org.springframework.transaction.annotation.Transactional)
  ```

- 带有@Transactional标注的任意方法.

  ```
  @annotation(org.springframework.transaction.annotation.Transactional)
  ```

- 参数带有@Transactional标注的方法.

  ```
  @args(org.springframework.transaction.annotation.Transactional)
  ```

- 参数为String类型(运行是决定)的方法

  ```
  args(String)
  ```

### Pointcut通过Java注解方式

```java
@Component
@Aspect
public class AspectDef {
	//@Pointcut("execution(* com.test.spring.aop.pointcutexp..JoinPointObjP2.*(..))")  
	//@Pointcut("within(com.test.spring.aop.pointcutexp..*)")  
	//@Pointcut("this(com.test.spring.aop.pointcutexp.Intf)")  
	//@Pointcut("target(com.test.spring.aop.pointcutexp.Intf)")  
	//@Pointcut("@within(org.springframework.transaction.annotation.Transactional)")
    //@Pointcut("@annotation(org.springframework.transaction.annotation.Transactional)" 
	@Pointcut("args(String)")
	public void pointcut1() {
	}
	@Before(value = "pointcut1()")
	public void beforeAdvice() {
		System.out.println("pointcut1 @Before...");
	}
}
```

***注解总结***

`@Aspect `声明切面，修饰切面类，从而获得 通知。

通知

- @Before前置
- @AfterReturning后置
- @Around环绕
- @AfterThrowing抛出异常
- @After最终

切入点

- @PointCut，修饰方法 privatevoid xxx(){}  之后通过“方法名”获得切入点引用

### Pointcut通过XML配置方式

```xml
<aop:config>  
    <aop:aspectrefaop:aspectref="aspectDef">  
        <aop:pointcutidaop:pointcutid="pointcut1"expression="execution(* com.test.spring.aop.pointcutexp..JoinPointObjP2.*(..))"/>  
        <aop:before pointcut-ref="pointcut1" method="beforeAdvice" />  
    </aop:aspect>  
</aop:config
```

## 实战

```java
/**
 * 切面类，含有多个通知
 */
@Component
@Aspect
public class MyAspect {
	
	//切入点当前有效
//	@Before("execution(* com.itheima.d_aspect.b_anno.UserServiceImpl.*(..))")
	public void myBefore(JoinPoint joinPoint){
		System.out.println("前置通知 ： " + joinPoint.getSignature().getName());
	}
	
	//声明公共切入点
	@Pointcut("execution(* com.itheima.d_aspect.b_anno.UserServiceImpl.*(..))")
	private void myPointCut(){
	}
	
//	@AfterReturning(value="myPointCut()" ,returning="ret")
	public void myAfterReturning(JoinPoint joinPoint,Object ret){
		System.out.println("后置通知 ： " + joinPoint.getSignature().getName() + " , -->" + ret);
	}
	
//	@Around(value = "myPointCut()")
	public Object myAround(ProceedingJoinPoint joinPoint) throws Throwable{
		System.out.println("前");
        //获取当前执行的参数
         //Object[] args = joinPoint.getArgs();
         //args[1] = callbackLogVo;
		// 手动执行目标方法 并给参数重新赋值
		//Object obj = joinPoint.proceed(args);
		//手动执行目标方法
		Object obj = joinPoint.proceed();
		
         //对执行后的参数进行处理
         //BaseResult baseResult = (BaseResult) obj;
		System.out.println("后");
		return obj;
	}
	
//	@AfterThrowing(value="execution(* com.itheima.d_aspect.b_anno.UserServiceImpl.*(..))" ,throwing="e")
	public void myAfterThrowing(JoinPoint joinPoint,Throwable e){
		System.out.println("抛出异常通知 ： " + e.getMessage());
	}
	
	@After("myPointCut()")
	public void myAfter(JoinPoint joinPoint){
		System.out.println("最终通知");
	}
}
```



## 参考资料

[AOP实现拦截对象以及获取切入目标方法和注解](https://blog.csdn.net/guan_shijie/article/details/52573189)

[@Pointcut的用法](https://blog.csdn.net/qq_15037231/article/details/78159456)