const Router = require('koa-router')
const { Category } = require('@models/category')
const { CreateOrUpdateCategoryValidator } = require('@validator/category')
const { PositiveIntegerValidator } = require('@validator/validator')
const { NotFound } = require('@exception')
const { success } = require('../../lib/helper')
const { getSafeParamId } = require('../../lib/util')

const categoryApi = new Router({
  prefix: '/v1/category'
})

categoryApi.get('/categories', async (ctx) => {
  const categories = await Category.getCategories()
  if (!categories.length) {
    throw new NotFound({
      msg: '没有找到相关分类'
    })
  }
  ctx.body = categories
})

categoryApi.post('/', async (ctx) => {
  const v = await new CreateOrUpdateCategoryValidator().validate(ctx)
  await Category.createCategory(v)
  success({
    msg: '新建分类成功'
  })
})

categoryApi.put('/', async (ctx) => {
  const v = await new CreateOrUpdateCategoryValidator().validate(ctx)
  const id = getSafeParamId(v)
  await Category.updateCategory(v, id)
  success({
    msg: '更新分类成功'
  })
})

categoryApi.delete('/', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  await Category.deleteCategory(id)
  success({
    msg: '删除分类成功'
  })
})

module.exports = categoryApi