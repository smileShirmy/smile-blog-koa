const Router = require('koa-router')

const { CreateOrUpdateCategoryValidator } = require('@validator/category')
const { PositiveIntegerValidator } = require('@validator/validator')
const { success } = require('../../lib/helper')
const { getSafeParamId } = require('../../lib/util')

const { CategoryDao } = require('@dao/category')

const categoryApi = new Router({
  prefix: '/v1/category'
})

const CategoryDto = new CategoryDao()

categoryApi.get('/categories', async (ctx) => {
  const categories = await CategoryDto.getCategories()
  ctx.body = categories
})

categoryApi.post('/', async (ctx) => {
  const v = await new CreateOrUpdateCategoryValidator().validate(ctx)
  await CategoryDto.createCategory(v)
  success({
    msg: '新建分类成功'
  })
})

categoryApi.put('/', async (ctx) => {
  const v = await new CreateOrUpdateCategoryValidator().validate(ctx)
  const id = getSafeParamId(v)
  await CategoryDto.updateCategory(v, id)
  success({
    msg: '更新分类成功'
  })
})

categoryApi.delete('/', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  await CategoryDto.deleteCategory(id)
  success({
    msg: '删除分类成功'
  })
})

module.exports = categoryApi