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

  async getArticleAuthor(articleId) {
    const authorIds = await ArticleAuthor.findAll({
      where: {
        article_id: articleId
      }
    })
    let ids = []
    authorIds.forEach(author => {
      ids.push(author.id)
    })
    return await Author.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    })
  }

  async getAuthorArticles(authorId) {
    const articleIds = await ArticleAuthor.findAll({
      where: {
        author_id: authorId
      }
    })
    let ids = []
    articleIds.forEach(article => {
      ids.push(article.article_id)
    })
    return await Article.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    })
  }
}

module.exports = {
  ArticleAuthorDao
}