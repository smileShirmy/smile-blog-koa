const Router = require('koa-router')
const { Article } = require('@models/article')
const { PositiveIntegerValidator, AddArticleValidator } = require('@validator')
const { success } = require('../../lib/helper')

const router = new Router({
  prefix: '/v1/article'
})

router.post('/add', async (ctx) => {
  const v = await new AddArticleValidator().validate(ctx)
  Article.addArticle(v.get('body.content'))
  success()
})

router.get('/get', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const article = await Article.getArticle(v.get('query.id'))
  console.log(article)
  ctx.body = article
})


module.exports = router