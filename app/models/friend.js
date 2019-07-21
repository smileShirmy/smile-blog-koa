const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Friend extends Model {
  toJSON() {
    let origin = {
      id: this.id,
      name: this.name,
      link: this.link,
      avatar: this.avatar
    }
    return origin
  }
}

Friend.init({
  name: {
    type: Sequelize.STRING(64),
    allowNull: false
  },
  link: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  avatar: {
    type: Sequelize.STRING(255),
    defaultValue: ''
  },
}, {
  sequelize,
  tableName: 'friend'
})

module.exports = {
  Friend
}
