const Router = require('koa-router')

const { PositiveIntegerValidator } = require('@validator/common')
const {
  CreateCommentValidator,
  ReplyCommentValidator,
  GetArticlesValidator,
  SearchArticlesValidator
} = require('@validator/article')
const { success } = require('../../lib/helper')

const { ArticleDao } = require('@dao/article')
const { CommentDao } = require('@dao/comment')

const articleApi = new Router({
  prefix: '/v1/blog/article'
})

const ArticleDto = new ArticleDao()
const CommentDto = new CommentDao()

// 获取文章详情
articleApi.get('/', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const article = await ArticleDto.getArticle(v.get('query.id'))

  ctx.body = article
})

// 点赞某篇文章
articleApi.put('/like', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('body.id')
  await ArticleDto.likeArticle(id)
  success('点赞文章成功')
})

// 获取全部文章
articleApi.get('/blog/articles', async (ctx) => {
  // 文章必须是公开的 1 公开 2 私密
  ctx.query.publicId = 1
  // 文章必须是已发布的 1 已发布 2 草稿
  ctx.query.statusId = 1
  // 文章包括非精选和精选
  ctx.query.starId = '0'
  const v = await new GetArticlesValidator().validate(ctx)

  const result = await ArticleDto.getArticles(v, true)
  ctx.body = result
})

// 搜索文章
articleApi.get('/search/articles', async (ctx) => {
  const v = await new SearchArticlesValidator().validate(ctx)
  
  const result = await ArticleDto.searchArticles(v)
  ctx.body = result
})

// 获取归档
articleApi.get('/archive', async (ctx) => {
  const archive = await ArticleDto.getArchive()
  ctx.body = archive
})

// 获取所有精选文章
articleApi.get('/star/articles', async (ctx) => {
  const articles = await ArticleDto.getStarArticles()
  ctx.body = articles
})

// 添加评论
articleApi.post('/add/comment', async (ctx) => {
  const v = await new CreateCommentValidator().validate(ctx, {
    id: 'articleId'
  })
  const articleId = v.get('body.articleId')
  await CommentDto.createComment(v, articleId)
  success('添加评论成功')
})

// 获取文章下的全部评论
articleApi.get('/get/comment', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'articleId'
  })
  const articleId = v.get('query.articleId')
  const comments = await CommentDto.getComments(articleId)
  ctx.body = comments
})

// 点赞某条评论
articleApi.put('/like/comment', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('body.id')
  await CommentDto.likeComment(id)
  success('点赞评论成功')
})

// 回复某条评论
articleApi.post('/reply/comment', async (ctx) => {
  const v = await new ReplyCommentValidator().validate(ctx, {
    id: 'articleId'
  })
  const articleId = v.get('body.articleId')
  const parentId = v.get('body.parentId')
  await CommentDto.replyComment(v, articleId, parentId)
  success('回复成功')
})

module.exports = articleApi