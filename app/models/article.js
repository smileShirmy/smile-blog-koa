const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { NotFound, Forbidden } = require('@exception')
const { Category } = require('@models/category')
const { ArticleTag } = require('@models/articleTag')

class Article extends Model {
  static async createArticle(v, categoryId) {
    const article = await Article.findOne({
      where: {
        title: v.get('body.title'),
        deleted_at: null
      }
    })
    if (article) {
      throw new Forbidden({
        msg: '文章已存在'
      })
    }
    const category = await Category.getCategory(categoryId)
    if (!category) {
      throw new Forbidden({
        msg: '未能找到相关分类'
      })
    }
    const tags = v.get('body.tags')

    return sequelize.transaction(async t => {
      const result =  await Article.create({
        title: v.get('body.title'),
        content: v.get('body.content'),
        category_id: categoryId,
        tags
      }, { transaction: t })
      await ArticleTag.createArticleTag(result.getDataValue('id'), tags, t)
    })
  }

  static async getArticle(id) {
    const article = await Article.findOne({
      where: {
        id,
        deleted_at: null
      }
    })
    if (!article) {
      throw new NotFound({
        msg: '没有找到相关文章'
      })
    }
    const tags = await ArticleTag.getArticleTag(id)
    const category = await Category.getCategory(article.getDataValue('category_id'))
    article.setDataValue('category', category)
    return { article, tags }
  }

  static async getArticles() {
    const articles = await Article.findAll({
      where: {
        deleted_at: null
      }
    })
    return articles
  }
}

Article.init({
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tags: {
    type: Sequelize.STRING(127),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'article'
})

module.exports = {
  Article
}
