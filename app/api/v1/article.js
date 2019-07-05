const Router = require('koa-router')

const { PositiveIntegerValidator } = require('@validator/common')
const { CreateOrUpdateArticleValidator, CreateCommentValidator, ReplyCommentValidator, GetArticlesValidator, SetPublicValidator } = require('@validator/article')
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

// 更新某篇文章
articleApi.put('/', new Auth().m, async (ctx) => {
  const v = await new CreateOrUpdateArticleValidator().validate(ctx)
  await ArticleDto.updateArticle(v)
  success('更新文章成功')
})

// 获取某篇文章详情
articleApi.get('/', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const { article, tags, authors } = await ArticleDto.getArticle(v.get('query.id'))
  
  article.setDataValue('tags', tags)
  article.setDataValue('authors', authors)
  article.exclude = ['category_id']

  ctx.body = article
})

// 获取文章内容
articleApi.get('/content', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const content = await ArticleDto.getContent(v.get('query.id'))

  ctx.body = content
})

// 点赞某篇文章
articleApi.put('/like/article', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  await ArticleDto.likeArticle(id)
  success('点赞文章成功')
})

// 获取全部文章
articleApi.get('/articles', async (ctx) => {
  const v = await new GetArticlesValidator().validate(ctx)
  
  const articles = await ArticleDto.getArticles(v)
  ctx.body = articles
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

// 添加评论
articleApi.post('/add/comment', async (ctx) => {
  const v = await new CreateCommentValidator().validate(ctx, {
    id: 'articleId'
  })
  const articleId = v.get('body.articleId')
  await CommentDto.createComment(v, articleId)
  success('添加评论成功')
})

// 获取某篇文章下的全部评论
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
  const id = v.get('query.id')
  await CommentDto.likeComment(id)
  success('点赞评论成功')
})

// 回复某条评论
articleApi.post('/reply/comment', async (ctx) => {
  const v = await new ReplyCommentValidator().validate(ctx, {
    id: 'parentId'
  })
  const articleId = v.get('body.articleId')
  const parentId = v.get('body.parentId')
  await CommentDto.replyComment(v, articleId, parentId)
  success('回复成功')
})

module.exports = articleApi