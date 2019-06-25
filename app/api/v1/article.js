const Router = require('koa-router')
const { Article } = require('@models/article')
const { PositiveIntegerValidator } = require('@validator/validator')
const { CreateOrUpdateArticleValidator } = require('@validator/article')
const { success } = require('../../lib/helper')

const articleApi = new Router({
  prefix: '/v1/article'
})

articleApi.post('/', async (ctx) => {
  const v = await new CreateOrUpdateArticleValidator().validate(ctx)
  await Article.createArticle(v)
  success({
    msg: '新建文章成功'
  })
})

articleApi.get('/', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const article = await Article.getArticle(v.get('query.id'))
  if (!article) {
    throw new NotFound({
      msg: '没有找到相关文章'
    })
  }
  ctx.body = article
})

articleApi.get('/articles', async (ctx) => {
  const articles = await Article.getArticles()
  if (!articles.length) {
    throw new NotFound({
      msg: '没有找到相关文章'
    })
  }
  ctx.body = articles
})

module.exports = articleApi