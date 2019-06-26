const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Category extends Model {

}

Category.init({
  name: {
    type: Sequelize.STRING(64),
    allowNull: false,
    unique: true
  },
  description: {
    type: Sequelize.STRING(255),
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'category'
})

module.exports = {
  Category
}
