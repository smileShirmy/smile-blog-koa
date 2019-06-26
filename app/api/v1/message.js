const Router = require('koa-router')

const { PositiveIntegerValidator } = require('@validator/validator')
const { CreateMessageValidator } = require('@validator/message')
const { success } = require('../../lib/helper')

const { MessageDao } = require('@dao/message')

const MessageDto = new MessageDao()

const messageApi = new Router({
  prefix: '/v1/message'
})

messageApi.post('/', async (ctx) => {
  const v = await new CreateMessageValidator().validate(ctx)
  await MessageDto.createMessage(v)
  success({
    msg: '新建留言成功'
  })
})

messageApi.get('/messages', async (ctx) => {
  const messages = await MessageDto.getMessages()
  ctx.body = messages
})

messageApi.delete('/', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  await MessageDto.deleteMessage(id)
  success({
    msg: '删除留言成功'
  })
})

module.exports = messageApi
