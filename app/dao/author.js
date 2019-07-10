const { Op } = require('sequelize')

const { Author } = require('@models/author')
const { ArticleAuthor } = require('@models/articleAuthor')
const { AuthFailed, Forbidden } = require('@exception')
const { AuthType } = require('../lib/enums')
const bcrypt = require('bcryptjs')

class AuthorDao {
  async createAuthor(v) {
    const name = v.get('body.name')
    const author = await Author.findOne({
      where: {
        name
      }
    })
    if (author) {
      throw new Forbidden({
        msg: '已存在该作者名'
      })
    }
    await Author.create({
      name: v.get('body.name'),
      avatar: v.get('body.avatar'),
      email: v.get('body.email'),
      description: v.get('body.description'),
      password: v.get('body.password'),
      auth: v.get('body.auth')
    })
  }

  async getAuthorDetail(id) {
    const author = await Author.findOne({
      where: {
        id,
      },
      attributes: { exclude: ['auth'] }
    })
    return author
  }

  async updateAuthor(v, id) {
    const author = await Author.findByPk(id)
    if (!author) {
      throw new NotFound({
        msg: '没有找到相关作者'
      })
    }
    author.avatar = v.get('body.avatar')
    author.email = v.get('body.email')
    author.description = v.get('body.description')
    author.auth = v.get('body.auth')
    author.save()
  }

  async updateAvatar(avatar, id) {
    const author = await Author.findByPk(id)
    if (!author) {
      throw new NotFound({
        msg: '没有找到相关作者'
      })
    }
    author.avatar = avatar
    author.save()
    return author
  }

  async deleteAuthor(id) {
    const author = await Author.findOne({
      where: {
        id
      }
    })
    if (!author) {
      throw new NotFound({
        msg: '没有找到相关作者'
      })
    }
    const result = await ArticleAuthor.findOne({
      where: {
        author_id: id
      }
    })
    if (result) {
      throw new Forbidden({
        msg: '该作者下有文章，禁止删除'
      })
    }
    author.destroy()
  }

  async changePassword(v, id) {
    const author = await Author.findByPk(id)
    if (!author) {
      throw new NotFound({
        msg: '没有找到相关作者'
      })
    }
    author.password = v.get('body.password')
    author.save()
  }

  async changeSelfPassword(v, id) {
    const author = await Author.findByPk(id)
    if (!author) {
      throw new NotFound({
        msg: '没有找到相关作者'
      })
    }
    const correct = bcrypt.compareSync(v.get('body.oldPassword'), author.password)
    if (!correct) {
      throw new AuthFailed('原始密码不正确')
    }
    author.password = v.get('body.password')
    author.save()
  }

  async verifyEmailPassword(ctx, name, password) {
    const author = await Author.findOne({
      where: {
        name
      }
    })
    if (!author) {
      throw new AuthFailed('作者不存在')
    }
    const correct = bcrypt.compareSync(password, author.password)
    if (!correct) {
      throw new AuthFailed('密码不正确')
    }
    
    return author
  }

  async getAuthors() {
    const authors = await Author.findAll({
      attributes: { exclude: ['auth'] }
    })
    return authors
  }

  // 获取除了管理员之外的全部作者
  async getAdminAuthors() {
    const authors = await Author.findAll({
      where: {
        auth: {
          [Op.ne]: AuthType.SUPER_ADMIN
        }
      },
      attributes: { exclude: ['auth'] }
    })
    return authors
  }
}

module.exports = {
  AuthorDao
}