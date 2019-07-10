const Router = require('koa-router')

const { TagDao } = require('@dao/tag')

const tagApi = new Router({
  prefix: '/v1/blog/tag'
})

const TagDto = new TagDao()

// 获取所有标签
tagApi.get('/tags', async (ctx) => {
  const tags = await TagDto.getTags()
  ctx.body = tags
})

module.exports = tagApi