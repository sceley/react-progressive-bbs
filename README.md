# React-PWA-Bbs

## About

一个个人论坛，搭建这个论坛旨在于通过实战练习来加深自己所学到的技术点，还有希望我能用它记住生活的点滴。

## 项目向上运行地址

[https://bbs.qinyongli.cn](https://bbs.qinyongli.cn)

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
- github第三方接入 做github第三方登录
- 七牛云接入 作为图片的存储空间
- email接入 作为认证

## 运行项目

### 安装应用

- redis
- mysql
- node

### 修改配置文件config.default.js

- qn、github、email要自己去申请第三方服务接入
- mysql、redis密码根据自己

### 启动

- cd server && npm install && npm start //启动服务器
- cd client && npm install && npm start //启动客户端

## 后期工作

- 美化UI
- 查找修复bug