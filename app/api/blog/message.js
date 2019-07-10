const Router = require('koa-router')

const { PaginateValidator } = require('@validator/common')
const { CreateMessageValidator } = require('@validator/message')
const { success } = require('../../lib/helper')
const { MessageDao } = require('@dao/message')

const MessageDto = new MessageDao()

const messageApi = new Router({
  prefix: '/v1/blog/message'
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

module.exports = messageApi
