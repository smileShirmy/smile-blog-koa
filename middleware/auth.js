const jwt = require('jsonwebtoken')
const { Author } = require('@models/author')

const { Forbidden, AuthFailed, NotFound } = require('@exception')

class Auth {
  constructor(level) {
    this.level = level || 1
  }

  get m() {
    return async (ctx, next) => {
      if (!ctx.header || !ctx.header.authorization) {
        throw new AuthFailed({ msg: '认证失败，请检查请求令牌是否正确' })
      }
      const parts = ctx.header.authorization.split(' ')
      if (parts.length === 2) {
        // Bearer 字段
        const schema = parts[0]
        // token 字段
        const token = parts[1]
        if (/^Bearer$/i.test(schema)) {
          let decode
          try {
            decode = jwt.verify(token, global.config.security.secretKey)
          } catch (error) {
            if (error.name === 'TokenExpiredError') {
              throw new AuthFailed({ msg: '认证失败，token已过期' })
            } else {
              throw new AuthFailed({ msg: '认证失败，令牌失效'})
            }
          }

          if (decode.scope < this.level) {
            throw new Forbidden({ msg: '权限不足' })
          }

          const author = await Author.findByPk(decode.uid)
          if (!author) {
            throw new NotFound({ msg: '没有找到相关作者' })
          }

          // 把 author 挂在 ctx 上
          ctx.currentAuthor = author

          // 往令牌中保存数据
          ctx.auth = {
            uid: decode.uid,
            scope: decode.scope
          }
        }
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
