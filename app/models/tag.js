const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { NotFound, Forbidden } = require('@exception')

class Tag extends Model {
  static async createTag(v) {
    const tag = await Tag.findOne({
      where: {
        name: v.get('body.name'),
        deleted_at: null
      }
    });
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
        id,
        deleted_at: null
      }
    })
    return tag
  }

  static async getTags() {
    const tags = Tag.findAll({
      where: {
        deleted_at: null
      }
    })
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
        id,
        deleted_at: null
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