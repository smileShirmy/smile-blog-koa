const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { NotFound, Forbidden } = require('@exception')

class Category extends Model {
  static async createCategory(v) {
    const category = await Category.findOne({
      where: {
        name: v.get('body.name'),
        deleted_at: null
      }
    });
    if (category) {
      throw new Forbidden({
        msg: '分类已存在'
      })
    }
    return await Category.create({
      name: v.get('body.name'),
      description: v.get('body.description')
    })
  }

  static async getCategories() {
    const categories = await Category.findAll({
      where: {
        deleted_at: null
      }
    });
    return categories;
  }

  static async updateCategory(v, id) {
    const category = await Category.findByPk(id)
    if (!category) {
      throw new NotFound({
        msg: '没找到相关分类'
      })
    }
    category.name = v.get('body.name')
    category.description = v.get('body.description')
    category.save()
  }

}

Category.init({
  name: {
    type: Sequelize.STRING(64),
    allowNull: false
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
