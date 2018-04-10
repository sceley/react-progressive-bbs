# React-PWA-Bbs

## About

一个个人论坛，搭建这个论坛旨在于通过实战来加深自己所学到的技术点，顺带运用自己懂的技术做个小东西，还有希望它能记住我生活的足迹。

## 技术栈

- react 做前端框架
- pwa技术 渐进式web app，更好的用户体验
- antd 做前端UI框架
- fetch API 进行前后端的交互
- express 做后端框架
- mysql/redis 做数据持久化，数据缓存
- jsonwebtoken 做session状态
- async/await、promise 做回调地狱的解决方案
- log4js 做日志的记录
- docker 做容器
- github第三方接入 做github第三方登录
- 七牛云接入 作为图片的存储空间
- email接入 作为认证

## 运行

### 按需求修改配置文件(config.default.js、docker-compose.yml)

- qn、github、email要自己去申请第三方服务接入
- config.default.js中的数据库密码要跟docker-compose.yml配置的docker容器的密码要一样

### 启动docker容器(容器中运行mysql、redis的服务)

```shell
docker-compose up -d
```