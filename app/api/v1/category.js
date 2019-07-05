const Router = require('koa-router')

const { CreateOrUpdateCategoryValidator } = require('@validator/category')
const { PositiveIntegerValidator } = require('@validator/common')
const { success } = require('../../lib/helper')
const { getSafeParamId } = require('../../lib/util')
const { Auth } = require('../../../middleware/auth')

const { CategoryDao } = require('@dao/category')

const categoryApi = new Router({
  prefix: '/v1/category'
})

const CategoryDto = new CategoryDao()

categoryApi.get('/categories', async (ctx) => {
  const categories = await CategoryDto.getCategories()
  ctx.body = categories
})

categoryApi.post('/', new Auth().m, async (ctx) => {
  const v = await new CreateOrUpdateCategoryValidator().validate(ctx)
  await CategoryDto.createCategory(v)
  success('新建分类成功')
})

categoryApi.put('/', new Auth().m, async (ctx) => {
  const v = await new CreateOrUpdateCategoryValidator().validate(ctx)
  const id = getSafeParamId(v)
  await CategoryDto.updateCategory(v, id)
  success('更新分类成功')
})

// 删除分类 需要最高权限才能删除分诶
categoryApi.delete('/', new Auth(32).m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('query.id')
  await CategoryDto.deleteCategory(id)
  success('删除分类成功')
})

module.exports = categoryApi