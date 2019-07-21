const { NotFound, Forbidden } = require('@exception')
const { Friend } = require('@models')

class BlogDao {
  // 创建友链
  async createFriend(v) {
    const friend = await Friend.findOne({
      where: {
        name: v.get('body.name')
      }
    })
    if (friend) {
      throw new Forbidden({
        msg: '已经存在该友链名'
      })
    }
    return await Friend.create({
      name: v.get('body.name'),
      link: v.get('body.link'),
      avatar: v.get('body.avatar')
    })
  }

  // 修改友链
  async updateFriend(v, id) {
    const friend = await Friend.findByPk(id)
    if (!friend) {
      throw new NotFound({
        msg: '没有找到相关友链'
      })
    }
    friend.name = v.get('body.name'),
    friend.link = v.get('body.link'),
    friend.avatar = v.get('body.avatar')
    friend.save()
  }

  // 获取友链
  async getFriends() {
    const friends = Friend.findAll()
    return friends
  }

  // 删除友链
  async deleteFriend(id) {
    const friend = await Friend.findOne({
      where: {
        id
      }
    })
    if (!friend) {
      throw new NotFound({
        msg: '没有找到相关友链'
      })
    }
    friend.destroy()
  }
}

module.exports = {
  BlogDao
}