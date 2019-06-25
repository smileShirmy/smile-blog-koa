const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { NotFound } = require('@exception')

class Comment extends Model {
  static async addComment(v, articleId) {
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
}

Comment.init({
  nickname: {
    type: Sequelize.STRING(32),
    allowNull: false
  },
  content: {
    type: Sequelize.STRING(1023),
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
