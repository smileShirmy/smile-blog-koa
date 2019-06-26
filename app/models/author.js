const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')
const bcrypt = require('bcryptjs')
const { AuthType } = require('../lib/enums')

class Author extends Model {

}

Author.init({
  name: {
    type: Sequelize.STRING(32),
    allowNull: false,
    unique: true
  },
  avatar: {
    type: Sequelize.STRING(255),
    allowNull: false,
    defaultValue: '',
  },
  email: {
    type: Sequelize.STRING(320),
    allowNull: false
  },
  description: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  auth: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: AuthType.USER
  },
  password: {
    type: Sequelize.STRING(127),
    allowNull: false,
    set(origin) {
      const salt = bcrypt.genSaltSync(10)
      const val = bcrypt.hashSync(origin, salt)
      this.setDataValue('password', val)
    },
    get() {
      return this.getDataValue('password');
    }
  }
}, {
  sequelize,
  tableName: 'author'
})

module.exports = {
  Author
}