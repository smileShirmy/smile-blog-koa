const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { NotFound, Forbidden } = require('@exception') 

class Article extends Model {
  static async createArticle(v) {
    const article = await Article.findOne({
      where: {
        title: v.get('body.title'),
        deleted_at: null
      }
    })
    if (article) {
      throw new Forbidden({
        msg: '文章已存在'
      })
    }
    return await Article.create({
      title: v.get('body.title'),
      content: v.get('body.content')
    })
  }

  static async getArticle(id) {
    const article = await Article.findOne({
      where: {
        id,
        deleted_at: null
      }
    })
    return article
  }
}

Article.init({
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'article'
})

module.exports = {
  Article
}
