const Router = require('koa-router')

const { success } = require('../../lib/helper')
const { CreateAuthorValidator, LoginValidator } = require('@validator/author')
const { NotEmptyValidator } = require('@validator/common')
const { generateToken } = require('../../../core/util')
const { AuthType } = require('../../lib/enums')
const { Auth } = require('../../../middleware/auth')

const { AuthorDao } = require('@dao/author')

const AuthorDto = new AuthorDao()

const authorApi = new Router({
  prefix: '/v1/author'
})

authorApi.post('/', async (ctx) => {
  const v = await new CreateAuthorValidator().validate(ctx)

  let auth = v.get('body.auth')
  if (!auth) {
    throw new Error('auth是必须参数')
  }
  auth = parseInt(auth)
  if (!AuthType.isThisType(auth)) {
    throw new Error('auth参数不合法')
  }

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

module.exports = authorApi