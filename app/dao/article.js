const { sequelize } = require('../../core/db')

const { NotFound, Forbidden } = require('@exception')

const { Article } = require('@models/article')
const { ArticleTagDao } = require('@dao/articleTag')
const { CategoryDao } = require('@dao/category')

const ArticleTagDto = new ArticleTagDao()
const CategoryDto = new CategoryDao()

class ArticleDao {
  async createArticle(v, categoryId) {
    const article = await Article.findOne({
      where: {
        title: v.get('body.title')
      }
    })
    if (article) {
      throw new Forbidden({
        msg: '文章已存在'
      })
    }
    const category = await CategoryDto.getCategory(categoryId)
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
      await ArticleTagDto.createArticleTag(result.getDataValue('id'), tags, t)
    })
  }

  async getArticle(id) {
    const article = await Article.findOne({
      where: {
        id
      }
    })
    if (!article) {
      throw new NotFound({
        msg: '没有找到相关文章'
      })
    }
    const tags = await ArticleTagDto.getArticleTag(id)
    const category = await CategoryDto.getCategory(article.getDataValue('category_id'))
    article.setDataValue('category', category)
    return { article, tags }
  }

  async getArticles() {
    const articles = await Article.findAll()
    return articles
  }
}

module.exports = {
  ArticleDao
}
