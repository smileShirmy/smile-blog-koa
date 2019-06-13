const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { NotFound } = require('@exception') 

class Article extends Model {
  static async addArticle(content) {
    return await Article.create({
      content
    })
  }

  static async getArticle(articleId) {
    const article = await Article.findOne({
      where: {
        id: articleId
      }
    })
    if (!article) {
      throw new NotFound()
    }
    return article
  }
}

Article.init({
  content: Sequelize.TEXT
}, {
  sequelize,
  tableName: 'article'
})

module.exports = {
  Article
}
