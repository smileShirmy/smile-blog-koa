const Router = require('koa-router')

const router = new Router({
  prefix: '/v1/article'
})

router.get('/test', async (ctx) => {
  ctx.body = {
    success: 'success'
  }
})


module.exports = router