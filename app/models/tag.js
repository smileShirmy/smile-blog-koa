const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Tag extends Model {
  toJSON() {
    let origin = {
      id: this.id,
      name: this.name
    }
    return origin
  }
}

Tag.init({
  name: {
    type: Sequelize.STRING(64),
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  tableName: 'tag'
})

module.exports = {
  Tag
}