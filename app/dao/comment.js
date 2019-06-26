const { NotFound } = require('@exception')
const { Comment } = require('@models/comment')
const { ArticleDao } = require('@dao/article')

const ArticleDto = new ArticleDao()

class CommentDao {
  async addComment(v, articleId) {
    const article = await ArticleDto.getArticle(articleId)
    if (!article) {
      throw new NotFound({
        msg: '没有找到相关文章'
      })
    }
    return await Comment.create({
      nickname: v.get('body.nickname'),
      content: v.get('body.content'),
      email: v.get('v.email'),
      website: v.get('website'),
      article_id: articleId
    })
  }

  async getComments(articleId) {
    const comments = await Comment.findAll({
      where: {
        article_id: articleId
      }
    })
    return comments
  }

  async deleteComment(id) {
    const comment = await Comment.findOne({
      where: {
        id
      }
    })
    if (!comment) {
      throw new NotFound({
        msg: '没有找到相关评论'
      })
    }
    comment.destroy()
  }

  async likeComment(id) {
    const comment = await Comment.findByPk(id)
    if (!comment) {
      throw new NotFound({
        msg: '没有找到相关评论'
      })
    }
    await comment.increment('like', { by: 1 })
  }

  async replyComment(v, articleId, parentId) {
    const article = await ArticleDto.findByPk(articleId)
    if (!article) {
      throw new NotFound({
        msg: '没有找到相关文章'
      })
    }
    const comment = await Comment.findByPk(parentId)
    if (!comment) {
      throw new NotFound({
        msg: '没有找到相关评论'
      })
    }
    return await Comment.create({
      parent_id: parentId,
      article_id: articleId,
      nickname: v.get('body.nickname'),
      content: v.get('body.content'),
      email: v.get('v.email'),
      website: v.get('website'),
    })
  }
}

module.exports = {
  CommentDao
}