const { sequelize } = require('../../core/db')

const { NotFound, Forbidden } = require('@exception')

const { Article } = require('@models/article')
const { ArticleTagDao } = require('@dao/articleTag')
const { ArticleAuthorDao } = require('@dao/articleAuthor')
const { CategoryDao } = require('@dao/category')

const ArticleTagDto = new ArticleTagDao()
const ArticleAuthorDto = new ArticleAuthorDao()
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
    return sequelize.transaction(async t => {
      const result =  await Article.create({
        title: v.get('body.title'),
        content: v.get('body.content'),
        cover: v.get('body.cover'),
        created_date: v.get('body.createdDate'),
        category_id: categoryId,
        public: v.get('body.public'),
        status: v.get('body.status')
      }, { transaction: t })
      const articleId = result.getDataValue('id')
      await ArticleTagDto.createArticleTag(articleId, v.get('body.tags'), t)
      await ArticleAuthorDto.createArticleAuthor(articleId, v.get('body.authors'), t)
    })
  }

  async getArticle(id) {
    const article = await Article.scope('bh').findOne({
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
    const authors = await ArticleAuthorDto.getArticleAuthor(id)
    const category = await CategoryDto.getCategory(article.getDataValue('category_id'))
    article.setDataValue('category', category)
    return { article, tags, authors }
  }

  async getArticles() {
    const articles = await Article.findAll()
    return articles
  }
}

module.exports = {
  ArticleDao
}
