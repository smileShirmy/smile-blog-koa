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
  cover: {
    type: Sequelize.STRING(255),
    defaultValue: ''
  },
  description: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  created_date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  public: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  like: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  star: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  views: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  sequelize,
  tableName: 'article'
})

module.exports = {
  Article
}
