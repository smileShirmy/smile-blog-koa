const Router = require('koa-router')

const { success } = require('../../lib/helper')
const { CreateAuthorValidator, UpdateAuthorValidator, LoginValidator, PasswordValidator, SelfPasswordValidator } = require('@validator/author')
const { NotEmptyValidator, PositiveIntegerValidator } = require('@validator/common')
const { generateToken } = require('../../../core/util')
const { Auth } = require('../../../middleware/auth')
const { AuthType } = require('../../lib/enums')
const { getSafeParamId } = require('../../lib/util')

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
  success('创建用户成功')
})

authorApi.put('/info', async (ctx) => {
  const v = await new UpdateAuthorValidator().validate(ctx)
  const id = getSafeParamId(v)

  await AuthorDto.updateAuthor(v, id)
  success('更新用户成功')
})

authorApi.put('/password', async (ctx) => {
  const v = await new PasswordValidator().validate(ctx)
  const id = getSafeParamId(v)

  await AuthorDto.changePassword(v, id)
  success('修改作者密码成功')
})

authorApi.put('/password/self', new Auth().m, async (ctx) => {
  const v = await new SelfPasswordValidator().validate(ctx)
  const id = ctx.currentAuthor.id

  await AuthorDto.changeSelfPassword(v, id)
  success('修改密码成功')
})

authorApi.post('/login', async (ctx) => {
  const v = await new LoginValidator().validate(ctx)
  const name = v.get('body.name')
  const password = v.get('body.password')

  const author = await AuthorDto.verifyEmailPassword(ctx, name, password)

  const accessToken = generateToken(author.id, AuthType.USER, { expiresIn: global.config.security.accessExp })
  const refreshToken = generateToken(author.id, AuthType.USER, { expiresIn: global.config.security.refreshExp })
  ctx.body = {
    accessToken,
    refreshToken
  }
})

authorApi.get('/authors', async (ctx) => {
  const authors = await AuthorDto.getAuthors()
  ctx.body = authors
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

authorApi.get('/info', new Auth().m, async (ctx) => {
  ctx.body = ctx.currentAuthor
})

module.exports = authorApi