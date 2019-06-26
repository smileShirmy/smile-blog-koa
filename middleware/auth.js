const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

const { Forbidden } = require('@exception')

class Auth {
  constructor(level) {
    this.level = level || 1
  }

  get m() {
    return async (ctx, next) => {
      
      // 前端传递需要对 token 做 base64 加密
      const userToken = basicAuth(ctx.req)
      let errMsg = 'token不合法'
      if (!userToken || !userToken.name) {
        throw new Forbidden(errMsg)
      }
      try {
        var decode = jwt.verify(userToken.name, global.config.security.secretKey)
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          errMsg = 'token已过期'
        }
        throw new Forbidden(errMsg)
      }

      if (decode.scope < this.level) {
        errMsg = '权限不足'
        throw new Forbidden(errMsg)
      }

      // 往令牌中保存数据
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }
      
      await next()
    }
  }

  static verifyToken(token) {
    try {
      jwt.verify(token, global.config.security.secretKey)
      return true
    } catch (error) {
      return false
    }
  }
}

module.exports = {
  Auth
}
