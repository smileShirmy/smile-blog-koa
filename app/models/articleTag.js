const { sequelize } = require('../../core/db')
const { Sequelize, Model, Op } = require('sequelize')
const { Tag } = require('@models/tag')

class ArticleTag extends Model {
  static async createArticleTag(articleId, tags, t) {
    const arr = JSON.parse(tags)
    for (let i = 0; i < arr.length; i++) {
      await ArticleTag.create({
        article_id: articleId,
        tag_id: arr[i]
      }, { transaction: t })
    }
  }

  static async getArticleTag(articleId) {
    const tagIds = await ArticleTag.findAll({
      where: {
        article_id: articleId
      }
    })
    let ids = []
    tagIds.forEach(tag => {
      ids.push(tag.id)
    })
    return await Tag.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    })
  }
}

ArticleTag.init({
  article_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tag_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'articleTag'
})

module.exports = {
  ArticleTag
}