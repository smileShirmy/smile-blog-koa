## smile-blog-koa

[![Build Status](https://www.travis-ci.org/smileShirmy/smile-blog-koa.svg?branch=master)](https://www.travis-ci.org/smileShirmy/smile-blog-koa)

- 权限控制
- 无感知Token刷新
- 支持七牛云文件上传
- HTTPS反向代理
- Koa2 + Sequelize
- MySQL

该项目为服务端部分，其它部分可点击下面的链接

- 展示前端 [smile-blog-nuxt](https://github.com/smileShirmy/smile-blog-nuxt)
- 管理后台 [smile-blog-admin](https://github.com/smileShirmy/smile-blog-admin)
- 服务端 [smile-blog-koa](https://github.com/smileShirmy/smile-blog-koa)


## Setup

- 需要把`config`目录下的`config.js.sample`重命名为`config.js`，然后进行相关参数的配置
- 开始需要关闭权限校验中间件，通过`Postman`创建一个超级管理员
- 启动该项目前需要全局安装`nodemon`和`pm2`

```bash
npm install -g nodemon
npm install -g pm2
```

```bash
# install
npm install

# development
nodemon

# production 
pm2 start app
```
