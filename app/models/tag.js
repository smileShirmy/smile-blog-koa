const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Tag extends Model {

}

Tag.init({
  name: {
    type: Sequelize.STRING(64),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'tag'
})

module.exports = {
  Tag
}