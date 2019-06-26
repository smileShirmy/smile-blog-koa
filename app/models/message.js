const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Message extends Model {
  toJSON() {
    let origin = {
      id: this.id,
      nickname: this.nickname,
      content: this.content,
      createTime: this.created_at
    }
    return origin
  }
}

Message.init({
  nickname: {
    type: Sequelize.STRING(32)
  },
  content: {
    type: Sequelize.STRING(1023),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'message'
})

module.exports = {
  Message
}