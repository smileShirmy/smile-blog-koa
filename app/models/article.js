const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Article extends Model {

}

Article.init({
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  cover: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'article'
})

module.exports = {
  Article
}
