const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class ArticleAuthor extends Model {
  
}

ArticleAuthor.init({
  article_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  author_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'articleAuthor'
})

module.exports = {
  ArticleAuthor
}