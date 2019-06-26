const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Article extends Model {

}

Article.init({
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tags: {
    type: Sequelize.STRING(127),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'article'
})

module.exports = {
  Article
}
