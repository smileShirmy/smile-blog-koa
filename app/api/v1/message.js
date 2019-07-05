const Router = require('koa-router')

const { PositiveIntegerValidator, PaginateValidator } = require('@validator/common')
const { CreateMessageValidator } = require('@validator/message')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middleware/auth')

const { MessageDao } = require('@dao/message')

const MessageDto = new MessageDao()

const messageApi = new Router({
  prefix: '/v1/message'
})

// 创建留言
messageApi.post('/', async (ctx) => {
  const v = await new CreateMessageValidator().validate(ctx)
  await MessageDto.createMessage(v)
  success('新建留言成功')
})

// 获取所有留言
messageApi.get('/messages', async (ctx) => {
  const v = await new PaginateValidator().validate(ctx)
  const { rows, total } = await MessageDto.getMessages(v)
  ctx.body = {
    collection: rows,
    total,
  }
})

// 删除留言，需要最高权限才能删除留言
messageApi.delete('/', new Auth(32).m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  await MessageDto.deleteMessage(id)
  success('删除留言成功')
})

module.exports = messageApi
