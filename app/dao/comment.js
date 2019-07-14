const { NotFound } = require('@exception')
const { Comment, Article } = require('@models')

class CommentDao {
  async createComment(v, articleId) {
    const article = await Article.findByPk(articleId)
    if (!article) {
      throw new NotFound({
        msg: '没有找到相关文章'
      })
    }
    return await Comment.create({
      nickname: v.get('body.nickname'),
      content: v.get('body.content'),
      email: v.get('body.email'),
      website: v.get('body.website'),
      article_id: articleId
    })
  }

  async getComments(articleId) {
    let comments = await Comment.findAll({
      where: {
        article_id: articleId
      },
      order: [
        ['created_at', 'DESC']
      ],
      attributes: { exclude: ['email', 'article_id'] }
    })
    comments.forEach(v => {
      v.setDataValue('created_date', v.created_at)
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
    const article = await Article.findByPk(articleId)
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
      email: v.get('body.email'),
      website: v.get('body.website'),
    })
  }
  
  // 查找某篇文章的评论总数
  async findCommentCount(articleId) {
    let comments = await Comment.findAll({
      where: {
        article_id: articleId,
      },
      attributes: ['id']
    })
    return comments.length
  }
}

module.exports = {
  CommentDao
}