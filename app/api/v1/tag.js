const Router = require('koa-router')

const { success } = require('../../lib/helper')
const { CreateOrUpdateTagValidator } = require('@validator/tag')
const { getSafeParamId } = require('../../lib/util')
const { NotFound } = require('@exception')
const { PositiveIntegerValidator } = require('@validator/common')
const { Auth } = require('../../../middleware/auth')

const { TagDao } = require('@dao/tag')

const tagApi = new Router({
  prefix: '/v1/tag'
})

const TagDto = new TagDao()

tagApi.get('/tags', async (ctx) => {
  const tags = await TagDto.getTags()
  ctx.body = tags
})

tagApi.get('/', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  const tag = await TagDto.getTag(id)
  if (!tag) {
    throw new NotFound({
      msg: '没有找到相关标签'
    })
  }
  ctx.body = tag
})

tagApi.post('/', async (ctx) => {
  const v = await new CreateOrUpdateTagValidator().validate(ctx)
  await TagDto.createTag(v)
  success('新建标签成功')
})

tagApi.put('/', async (ctx) => {
  const v = await new CreateOrUpdateTagValidator().validate(ctx)
  const id = getSafeParamId(v)
  await TagDto.updateTag(v, id)
  success('更新标签成功')
})

// 删除标签，需要最高权限才能删除留言
tagApi.delete('/', new Auth(32).m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  await TagDto.deleteTag(id)
  success('删除标签成功')
})

module.exports = tagApi