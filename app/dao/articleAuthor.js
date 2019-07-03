const { Op } = require('sequelize')

const { Author } = require('@models/author')
const { ArticleAuthor } = require('@models/articleAuthor')
const { Article } = require('@models/article')

class ArticleAuthorDao {
  async createArticleAuthor(articleId, authors, t) {
    const arr = typeof authors === 'string' ? JSON.parse(authors) : authors
    for (let i = 0; i < arr.length; i++) {
      await ArticleAuthor.create({
        article_id: articleId,
        author_id: arr[i]
      }, { transaction: t })
    }
  }

  async getArticleAuthor(articleId, options = {}) {
    const result = await ArticleAuthor.findAll({
      where: {
        article_id: articleId
      }
    })
    let ids = result.map(v => v.author_id)
    return await Author.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      },
      ...options
    })
  }

  async getAuthorArticles(authorId) {
    const ids = this.getArticleIds(authorId)
    return await Article.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    })
  }

  async getArticleIds(authorId) {
    const ids = await ArticleAuthor.findAll({
      where: {
        author_id: authorId
      }
    })
    return ids.map(v => v.article_id)
  }
}

module.exports = {
  ArticleAuthorDao
}