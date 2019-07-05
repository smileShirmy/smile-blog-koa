const { Op } = require('sequelize')

const { Tag } = require('@models/tag')
const { ArticleTag } = require('@models/articleTag')

class ArticleTagDao {
  async createArticleTag(articleId, tags, options = {}) {
    const arr = typeof tags === 'string' ? JSON.parse(tags) : tags
    for (let i = 0; i < arr.length; i++) {
      await ArticleTag.create({
        article_id: articleId,
        tag_id: arr[i]
      }, {...options})
    }
  }

  async getArticleTag(articleId) {
    const result = await ArticleTag.findAll({
      where: {
        article_id: articleId
      }
    })
    let ids = result.map(v => v.tag_id)
    return await Tag.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    })
  }

  async getArticleIds(tagId) {
    const result = await ArticleTag.findAll({
      where: {
        tag_id: tagId
      }
    })
    return result.map(v => v.article_id)
  }

  async deleteArticleTag(articleId, tags = []) {
    const result = await ArticleTag.findAll({
      where: {
        article_id: articleId
      }
    })
    // 如果 id 相同则不再需要删除
    if (tags.length && result.map(v => v.tag_id).join('') === tags.join('')) {
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
  ArticleTagDao
}