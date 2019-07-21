const Router = require('koa-router')

const { BlogDao } = require('@dao/blog')

const blogApi = new Router({
  prefix: '/v1/blog/blog'
})

const blogDto = new BlogDao()

// 获取友链
blogApi.get('/friend/friends', async (ctx) => {
  const friends = await blogDto.getFriends()
  ctx.body = friends
})

module.exports = blogApi