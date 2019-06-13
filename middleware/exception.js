const { HttpException } = require('../core/http-exception')

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    const isHttpException = error instanceof HttpException
    const isDev = global.config.environment = 'dev'
    if (isDev && !isHttpException) {
      throw error
    }
    if (isHttpException) {
      ctx.body = {
        msg: error.msg,
        errorCode: error.errorCode,
        request: `${ctx.method}: ${ctx.path}`
      }
      ctx.status = error.code
    }
    else {
      ctx.body = {
        msg: 'we made a mistake O(∩_∩)O~~',
        errorCode: 999,
        request: `${ctx.method}: ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError