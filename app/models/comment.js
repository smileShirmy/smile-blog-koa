const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { NotFound } = require('@exception')
const { Article } = require('@models/article')

class Comment extends Model {
  static async addComment(v, articleId) {
    const article = await Article.getArticle(articleId)
    if (!article) {
      throw new NotFound({
        msg: '没有找到相关文章'
      })
    }
    return await Comment.create({
      nickname: v.get('body.nickname'),
      content: v.get('body.content'),
      email: v.get('v.email'),
      website: v.get('website'),
      article_id: articleId
    })
  }

  static async getComments(articleId) {
    const comments = await Comment.findAll({
      where: {
        article_id: articleId,
        deleted_at: null
      }
    })
    return comments
  }

  static async deleteComment(id) {
    const comment = await Comment.findOne({
      where: {
        id,
        deleted_at: null
      }
    })
    if (!comment) {
      throw new NotFound({
        msg: '没有找到相关评论'
      })
    }
    comment.destroy()
  }

  static async likeComment(id) {
    const comment = await Comment.findByPk(id)
    if (!comment) {
      throw new NotFound({
        msg: '没有找到相关评论'
      })
    }
    await comment.increment('like', { by: 1 })
  }

  static async replyComment(v, articleId, parentId) {
    const article = await Article.findByPk(articleId)
    if (!article) {
      throw new NotFound({
        msg: '没有找到相关文章'
      })
    }
    const comment = await Comment.findByPk(parentId)
    if (!comment) {
      throw new NotFound({
        msg: '没有找到相关评论'
      })
    }
    return await Comment.create({
      parent_id: parentId,
      article_id: articleId,
      nickname: v.get('body.nickname'),
      content: v.get('body.content'),
      email: v.get('v.email'),
      website: v.get('website'),
    })
  }
}

Comment.init({
  parent_id: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  nickname: {
    type: Sequelize.STRING(32),
    allowNull: false
  },
  content: {
    type: Sequelize.STRING(1023),
    allowNull: false
  },
  like: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING(320),
    allowNull: true
  },
  website: {
    type: Sequelize.STRING(127),
    allowNull: true,
  },
  article_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'comment'
})

module.exports = {
  Comment
}
