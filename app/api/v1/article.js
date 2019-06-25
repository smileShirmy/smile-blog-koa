const Router = require('koa-router')
const { Article } = require('@models/article')
const { Comment } = require('@models/comment')
const { PositiveIntegerValidator } = require('@validator/validator')
const { CreateOrUpdateArticleValidator, AddCommentValidator, ReplyCommentValidator } = require('@validator/article')
const { success } = require('../../lib/helper')
const { ArticleTag } = require('@models/articleTag')

const articleApi = new Router({
  prefix: '/v1/article'
})

articleApi.post('/', async (ctx) => {
  const v = await new CreateOrUpdateArticleValidator().validate(ctx)
  const categoryId = v.get('body.categoryId')
  await Article.createArticle(v, categoryId)
  success({
    msg: '新建文章成功'
  })
})

articleApi.get('/', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const { article, tags } = await Article.getArticle(v.get('query.id'))
  article.setDataValue('tags', tags)
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

articleApi.put('/like/comment', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  await Comment.likeComment(id)
  success({
    msg: '点赞评论成功'
  })
})

articleApi.post('/reply/comment', async (ctx) => {
  const v = await new ReplyCommentValidator().validate(ctx, {
    id: 'parentId'
  })
  const articleId = v.get('body.articleId')
  const parentId = v.get('body.parentId')
  await Comment.replyComment(v, articleId, parentId)
  success({
    msg: '回复成功'
  })
})

module.exports = articleApi