const Router = require('koa-router')

const { PositiveIntegerValidator } = require('@validator/common')
const { AuthorDao } = require('@dao/author')
const AuthorDto = new AuthorDao()

const authorApi = new Router({
  prefix: '/v1/blog/author'
})

// 获取作者详情
authorApi.get('/detail', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')

  const author = await AuthorDto.getAuthorDetail(id)
  ctx.body = author
})

// 获取全部作者
authorApi.get('/authors', async (ctx) => {
  const authors = await AuthorDto.getAuthors()
  ctx.body = authors
})

module.exports = authorApi