const Router = require('koa-router')

const { PositiveIntegerValidator } = require('@validator/common')
const {
  CreateOrUpdateArticleValidator,
  CreateCommentValidator,
  ReplyCommentValidator,
  GetArticlesValidator,
  SetPublicValidator,
  SetStarValidator
} = require('@validator/article')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middleware/auth')

const { ArticleDao } = require('@dao/article')
const { CommentDao } = require('@dao/comment')

const { ArticleTag } = require('@models/articleTag')

const articleApi = new Router({
  prefix: '/v1/article'
})

// 实例图片：https://resource.shirmy.me/lighthouse.jpeg

const ArticleDto = new ArticleDao()
const CommentDto = new CommentDao()

// 创建文章
articleApi.post('/', new Auth().m, async (ctx) => {
  const v = await new CreateOrUpdateArticleValidator().validate(ctx)
  await ArticleDto.createArticle(v)
  success('新建文章成功')
})

// 更新文章
articleApi.put('/', new Auth().m, async (ctx) => {
  const v = await new CreateOrUpdateArticleValidator().validate(ctx)
  await ArticleDto.updateArticle(v)
  success('更新文章成功')
})

// 获取文章详情
articleApi.get('/', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const article = await ArticleDto.getArticle(v.get('query.id'))

  ctx.body = article
})

// 获取文章内容
articleApi.get('/content', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const content = await ArticleDto.getContent(v.get('query.id'))

  ctx.body = content
})

// 点赞某篇文章
articleApi.put('/like', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('body.id')
  await ArticleDto.likeArticle(id)
  success('点赞文章成功')
})

// 管理后台 获取全部文章
articleApi.get('/articles', new Auth().m, async (ctx) => {
  const v = await new GetArticlesValidator().validate(ctx)
  
  const articles = await ArticleDto.getArticles(v)
  ctx.body = articles
})

// 展示前端 获取全部文章
articleApi.get('/blog/articles', async (ctx) => {
  // 文章必须是公开的 1 公开 2 私密
  ctx.query.publicId = 1
  // 文章必须是已发布的 1 已发布 2 草稿
  ctx.query.statusId = 1
  // 文章包括非精选和精选
  ctx.query.starId = '0'
  const v = await new GetArticlesValidator().validate(ctx)

  const articles = await ArticleDto.getArticles(v, true)
  ctx.body = articles
})

articleApi.get('/archive', async (ctx) => {
  const archive = await ArticleDto.getArchive()
  ctx.body = archive
})

// 删除某篇文章，需要最高权限
articleApi.delete('/', new Auth(32).m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  await ArticleDto.deleteArticle(id)
  success('删除文章成功')
})

// 设置某篇文章为 公开 或 私密
articleApi.put('/public', new Auth().m, async (ctx) => {
  const v = await new SetPublicValidator().validate(ctx)
  const id = v.get('query.id')
  const publicId = v.get('body.publicId')

  await ArticleDto.updateArticlePublic(id, publicId)
  success(`设为${publicId === 1 ? '公开' : '私密'}成功`)
})

// 设置某篇文章为 精选 或 非精选
articleApi.put('/star', new Auth().m, async (ctx) => {
  const v = await new SetStarValidator().validate(ctx)
  const id = v.get('query.id')
  const starId = v.get('body.starId')

  await ArticleDto.updateArticleStar(id, starId)
  success(`设为${starId === 2 ? '精选' : '非精选'}成功`)
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

// 删除某条评论 需要最高权限
articleApi.delete('/del/comment', new Auth(32).m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  await CommentDto.deleteComment(id)
  success('删除评论成功')
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