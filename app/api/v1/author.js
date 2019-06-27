const Router = require('koa-router')

const { success } = require('../../lib/helper')
const { CreateAuthorValidator, LoginValidator } = require('@validator/author')
const { NotEmptyValidator, PositiveIntegerValidator } = require('@validator/common')
const { generateToken } = require('../../../core/util')
const { Auth } = require('../../../middleware/auth')

const { AuthorDao } = require('@dao/author')
const { ArticleAuthorDao } = require('@dao/articleAuthor')

const AuthorDto = new AuthorDao()
const ArticleAuthorDto = new ArticleAuthorDao()

const authorApi = new Router({
  prefix: '/v1/author'
})

authorApi.post('/', async (ctx) => {
  const v = await new CreateAuthorValidator().validate(ctx)

  await AuthorDto.createAuthor(v)
  success({
    msg: '创建用户成功'
  })
})

authorApi.post('/login', async (ctx) => {
  const v = await new LoginValidator().validate(ctx)
  const name = v.get('body.name')
  const password = v.get('body.password')

  const author = await AuthorDto.verifyEmailPassword(name, password)
  const token =  generateToken(author.id, AuthType.USER)
  ctx.body = {
    token
  }
})

authorApi.post('/verify', async (ctx) => {
  const v = await new NotEmptyValidator().validate(ctx)
  const result = Auth.verifyToken(v.get('body.token'))
  ctx.body = {
    isValid: result,
  }
})

authorApi.get('/articles', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'authorId'
  })
  const id = v.get('query.authorId')
  const articles = await ArticleAuthorDto.getAuthorArticles(id)
  ctx.body = articles
})

module.exports = authorApi