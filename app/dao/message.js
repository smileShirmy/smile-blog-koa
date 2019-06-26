const { Message } = require('@models/message')

class MessageDao {
  async createMessage(v) {
    return await Message.create({
      nickname: v.get('body.nickname'),
      content: v.get('body.content')
    })
  }

  async getMessages() {
    return await Message.findAll()
  }

  async deleteMessage(id) {
    const message = await Message.findOne({
      where: {
        id
      }
    })
    if (!message) {
      throw new NotFound({
        msg: '没有找到相关留言'
      })
    }
    message.destroy()
  }
}

module.exports = {
  MessageDao
}
