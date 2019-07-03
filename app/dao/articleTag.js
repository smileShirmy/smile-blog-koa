const { Op } = require('sequelize')

const { Tag } = require('@models/tag')
const { ArticleTag } = require('@models/articleTag')

class ArticleTagDao {
  async createArticleTag(articleId, tags, t) {
    const arr = typeof tags === 'string' ? JSON.parse(tags) : tags
    for (let i = 0; i < arr.length; i++) {
      await ArticleTag.create({
        article_id: articleId,
        tag_id: arr[i]
      }, { transaction: t })
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
    const ids = await ArticleTag.findAll({
      where: {
        tag_id: tagId
      }
    })
    return ids.map(v => v.article_id)
  }
}

module.exports = {
  ArticleTagDao
}