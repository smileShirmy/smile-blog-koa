const Router = require('koa-router')
const { Tag } = require('@models/tag')
const { success } = require('../../lib/helper')
const { CreateOrUpdateTagValidator } = require('@validator/tag')
const { getSafeParamId } = require('../../lib/util')
const { NotFound } = require('@exception')
const { PositiveIntegerValidator } = require('@validator/validator')

const tagApi = new Router({
  prefix: '/v1/tag'
})

tagApi.get('/tags', async (ctx) => {
  const tags = await Tag.getTags()
  if (!tags.length) {
    throw new NotFound({
      msg: '没有找到相关标签'
    })
  }
  ctx.body = tags
})

tagApi.get('/', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  const tag = await Tag.getTag(id)
  if (!tag) {
    throw new NotFound({
      msg: '没有找到相关标签'
    })
  }
  ctx.body = tag
})

tagApi.post('/', async (ctx) => {
  const v = await new CreateOrUpdateTagValidator().validate(ctx)
  await Tag.createTag(v)
  success({
    msg: '新建标签成功'
  })
})

tagApi.put('/', async (ctx) => {
  const v = await new CreateOrUpdateTagValidator().validate(ctx)
  const id = getSafeParamId(v)
  await Tag.updateTag(v, id)
  success({
    msg: '更新标签成功'
  })
})

tagApi.delete('/', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  await Tag.deleteTag(id)
  success({
    msg: '删除标签成功'
  })
})

module.exports = tagApi