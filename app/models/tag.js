const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { NotFound, Forbidden } = require('@exception')

class Tag extends Model {
  static async createTag(v) {
    const tag = await Tag.findOne({
      where: {
        name: v.get('body.name')
      }
    })
    if (tag) {
      throw new Forbidden({
        msg: '标签已存在'
      })
    }
    return await Tag.create({
      name: v.get('body.name')
    })
  }

  static async getTag(id) {
    const tag = Tag.findOne({
      where: {
        id
      }
    })
    return tag
  }

  static async getTags() {
    const tags = Tag.findAll()
    return tags
  }

  static async updateTag(v, id) {
    const tag = await Tag.findByPk(id)
    if (!tag) {
      throw new NotFound({
        msg: '没有找到相关标签'
      })
    }
    tag.name = v.get('body.name')
    tag.save()
  }

  static async deleteTag(id) {
    const tag = await Tag.findOne({
      where: {
        id
      }
    })
    if (!tag) {
      throw new NotFound({
        msg: '没有找到相关标签'
      })
    }
    tag.destroy()
  }
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