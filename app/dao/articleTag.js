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
    const tagIds = await ArticleTag.findAll({
      where: {
        article_id: articleId
      }
    })
    let ids = []
    tagIds.forEach(tag => {
      ids.push(tag.tag_id)
    })
    return await Tag.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    })
  }
}

module.exports = {
  ArticleTagDao
}