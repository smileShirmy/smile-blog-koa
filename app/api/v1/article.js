const Router = require('koa-router')
const { Article } = require('@models/article')
const { Comment } = require('@models/comment')
const { PositiveIntegerValidator } = require('@validator/validator')
const { CreateOrUpdateArticleValidator, AddCommentValidator } = require('@validator/article')
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
  ctx.body = articles
})

articleApi.post('/add/comment', async (ctx) => {
  const v = await new AddCommentValidator().validate(ctx, {
    id: 'articleId'
  })
  const articleId = v.get('body.articleId')
  await Comment.addComment(v, articleId)
  success({
    msg: '添加评论成功'
  })
})

articleApi.get('/get/comment', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'articleId'
  })
  const articleId = v.get('query.articleId')
  const comments = await Comment.getComments(articleId)
  ctx.body = {
    comments
  }
})

articleApi.delete('/del/comment', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  await Comment.deleteComment(id)
  success({
    msg: '删除评论成功'
  })
})

module.exports = articleApi