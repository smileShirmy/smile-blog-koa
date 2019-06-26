const Router = require('koa-router')

const { PositiveIntegerValidator } = require('@validator/validator')
const { CreateOrUpdateArticleValidator, CreateCommentValidator, ReplyCommentValidator } = require('@validator/article')
const { success } = require('../../lib/helper')

const { ArticleDao } = require('@dao/article')
const { CommentDao } = require('@dao/comment')

const { ArticleTag } = require('@models/articleTag')

const articleApi = new Router({
  prefix: '/v1/article'
})

const ArticleDto = new ArticleDao()
const CommentDto = new CommentDao()

articleApi.post('/', async (ctx) => {
  const v = await new CreateOrUpdateArticleValidator().validate(ctx)
  const categoryId = v.get('body.categoryId')
  await ArticleDto.createArticle(v, categoryId)
  success({
    msg: '新建文章成功'
  })
})

articleApi.get('/', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const { article, tags } = await ArticleDto.getArticle(v.get('query.id'))
  article.setDataValue('tags', tags)
  ctx.body = article
})

articleApi.get('/articles', async (ctx) => {
  const articles = await ArticleDto.getArticles()
  ctx.body = articles
})

articleApi.post('/add/comment', async (ctx) => {
  const v = await new CreateCommentValidator().validate(ctx, {
    id: 'articleId'
  })
  const articleId = v.get('body.articleId')
  await CommentDto.createComment(v, articleId)
  success({
    msg: '添加评论成功'
  })
})

articleApi.get('/get/comment', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'articleId'
  })
  const articleId = v.get('query.articleId')
  const comments = await CommentDto.getComments(articleId)
  ctx.body = {
    comments
  }
})

articleApi.delete('/del/comment', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  await CommentDto.deleteComment(id)
  success({
    msg: '删除评论成功'
  })
})

articleApi.put('/like/comment', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  await CommentDto.likeComment(id)
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
  await CommentDto.replyComment(v, articleId, parentId)
  success({
    msg: '回复成功'
  })
})

module.exports = articleApi