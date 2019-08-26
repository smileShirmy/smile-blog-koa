const Router = require('koa-router')

const { PositiveIntegerValidator } = require('@validator/common')
const {
  CreateOrUpdateArticleValidator,
  GetArticlesValidator,
  SetPublicValidator,
  SetStarValidator,
} = require('@validator/article')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middleware/auth')

const { ArticleDao } = require('@dao/article')
const { CommentDao } = require('@dao/comment')

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
articleApi.get('/', new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const article = await ArticleDto.getArticle(v.get('query.id'))

  ctx.body = article
})

// 获取文章内容
articleApi.get('/content', new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const content = await ArticleDto.getContent(v.get('query.id'))

  ctx.body = content
})

// 管理后台 获取全部文章
articleApi.get('/articles', new Auth().m, async (ctx) => {
  const v = await new GetArticlesValidator().validate(ctx)
  
  const result = await ArticleDto.getArticles(v)
  ctx.body = result
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

// 获取文章下的全部评论
articleApi.get('/get/comment', new Auth().m, async (ctx) => {
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

module.exports = articleApi