const { Op } = require('sequelize')

const { Author } = require('@models/author')
const { ArticleAuthor } = require('@models/articleAuthor')
const { Article } = require('@models/article')

class ArticleAuthorDao {
  async createArticleAuthor(articleId, authors, options = {}) {
    const arr = typeof authors === 'string' ? JSON.parse(authors) : authors
    for (let i = 0; i < arr.length; i++) {
      await ArticleAuthor.create({
        article_id: articleId,
        author_id: arr[i]
      }, {...options})
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
    const result = await ArticleAuthor.findAll({
      where: {
        author_id: authorId
      }
    })
    return result.map(v => v.article_id)
  }

  async deleteArticleAuthor(articleId, authors = []) {
    const result = await ArticleAuthor.findAll({
      where: {
        article_id: articleId
      }
    })
    // 如果 id 相同则不再需要删除
    if (authors.length && result.map(v => v.author_id).join('') === authors.join('')) {
      return false
    } else {
      for (let i = 0; i < result.length; i++) {
        await result[i].destroy()
      }
      return true
    }
  }
}

module.exports = {
  ArticleAuthorDao
}