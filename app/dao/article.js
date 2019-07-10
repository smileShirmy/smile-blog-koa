const { sequelize } = require('../../core/db')
const { omitBy, isUndefined, intersection } = require('lodash')
const { Op } = require('sequelize') 

const { NotFound, Forbidden } = require('@exception')

const { Article } = require('@models/article')
const { ArticleTagDao } = require('@dao/articleTag')
const { ArticleAuthorDao } = require('@dao/articleAuthor')
const { CategoryDao } = require('@dao/category')
const { CommentDao } = require('@dao/comment')

const ArticleTagDto = new ArticleTagDao()
const ArticleAuthorDto = new ArticleAuthorDao()
const CategoryDto = new CategoryDao()
const CommentDto = new CommentDao()

class ArticleDao {
  async createArticle(v) {
    const article = await Article.findOne({
      where: {
        title: v.get('body.title')
      }
    })
    if (article) {
      throw new Forbidden({
        msg: '存在同名文章'
      })
    }
    const categoryId = v.get('body.categoryId')
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
        description: v.get('body.description'),
        cover: v.get('body.cover'),
        created_date: v.get('body.createdDate'),
        category_id: categoryId,
        public: v.get('body.public'),
        status: v.get('body.status'),
        star: v.get('body.star'),
        like: 0
      }, { transaction: t })
      const articleId = result.getDataValue('id')
      await ArticleTagDto.createArticleTag(articleId, v.get('body.tags'), { transaction: t })
      await ArticleAuthorDto.createArticleAuthor(articleId, v.get('body.authors'), { transaction: t })
    })
  }

  // 编辑某篇文章
  async updateArticle(v) {
    const id = v.get('body.id')
    const article = await Article.findByPk(id)
    if (!article) {
      throw new NotFound({
        msg: '没有找到相关文章'
      })
    }
    const tags = v.get('body.tags')
    const authors = v.get('body.authors')

    // step1: 先删除相关关联
    const isDeleteAuthor = await ArticleAuthorDto.deleteArticleAuthor(id, authors)
    const isDeleteTag = await ArticleTagDto.deleteArticleTag(id, tags)

    // step2: 再创建关联
    if (isDeleteAuthor) {
      await ArticleAuthorDto.createArticleAuthor(id, authors)
    }
    if (isDeleteTag) {
      await ArticleTagDto.createArticleTag(id, tags)
    }

    // step3: 更新文章
    article.title = v.get('body.title')
    article.content = v.get('body.content'),
    article.description = v.get('body.description'),
    article.cover = v.get('body.cover')
    article.created_date = v.get('body.createdDate')
    article.category_id = v.get('body.categoryId')
    article.public = v.get('body.public')
    article.status = v.get('body.status')
    article.star = v.get('body.star')
    article.save()
  }

  // 获取文章详情
  async getArticle(id) {
    const article = await Article.scope('frontShow').findOne({
      where: {
        id
      },
      attributes: {
        exclude: ['public', 'status']
      }
    })
    if (!article) {
      throw new NotFound({
        msg: '没有找到相关文章'
      })
    }
    // 获取这篇文章下的所有标签
    const tags = await ArticleTagDto.getArticleTag(id)
    // 获取这篇文章下的所有作者
    const authors = await ArticleAuthorDto.getArticleAuthor(id, {
      attributes: { exclude: ['auth', 'description', 'email'] }
    })
    // 获取这篇文章相关分类下的文章列表(除了自己)
    const categoryArticles = await Article.scope('frontShow').findAll({
      where: {
        category_id: article.category_id,
        id: {
          [Op.not]: id
        }
      },
      attributes: ['id', 'created_date', 'title']
    })
    article.exclude = ['category_id']

    await article.increment('views', { by: 1 })

    article.setDataValue('tags', tags)
    article.setDataValue('authors', authors)
    article.setDataValue('categoryArticles', categoryArticles)

    return article
  }

  async likeArticle(id) {
    const article = await Article.findByPk(id)
    if (!article) {
      throw new NotFound({
        msg: '没有找到相关文章'
      })
    }
    await article.increment('like', { by: 1 })
  }

  // 把文章设为私密或公开
  async updateArticlePublic(id, publicId) {
    const article = await Article.findByPk(id)
    if (!article) {
      throw new NotFound({
        msg: '没有找到相关文章'
      })
    }
    article.public = publicId
    article.save()
  }

  // 把文章设为精选(2)或非精选(1)
  async updateArticleStar(id, starId) {
    if (starId === 2) {
      const articles = await Article.findAll({
        attributes: ['id']
      })
      if (articles.length === 10) {
        throw new Forbidden({
          msg: '最多只能设置10篇精选文章'
        })
      }
    }
    const article = await Article.findByPk(id)
    if (!article) {
      throw new NotFound({
        msg: '没有找到相关文章'
      })
    }
    article.star = starId
    article.save()
  }

  // 获取所有精选文章
  async getStarArticles() {
    const articles = await Article.scope('frontShow').findAll({
      where: {
        star: 2,      // 精选
      },
      attributes: {
        exclude: ['content', 'like', 'public', 'star', 'status', 'views']
      }
    })
    for (let i = 0; i < articles.length; i++) {
      let article = articles[i]
      await article.setDataValue('authors', await ArticleAuthorDto.getArticleAuthor(articles[i].id, {
        attributes: { exclude: ['auth', 'description', 'email', 'avatar'] }
      }))
      await article.setDataValue('category',  await CategoryDto.getCategory(articles[i].category_id, {
        attributes: { exclude: ['description', 'cover']}
      }))
      article.exclude = ['category_id']
    }
    return articles
  }

  // 获取历史归档
  async getArchive() {
    const articles = await Article.scope('frontShow').findAll({
      order: [
        ['created_date', 'DESC']
      ],
      attributes: ['id', 'title', 'created_date']
    })
    for (let i = 0; i < articles.length; i++) {
      let article = articles[i]
      await article.setDataValue('authors', await ArticleAuthorDto.getArticleAuthor(articles[i].id, {
        attributes: { exclude: ['auth', 'description', 'email'] }
      }))
    }
    return articles
  }

  /**
   * 获取所有文章
   * @param {Object} v 操作对象
   * @param {Boolean} isFont 是否展示端
   */
  async getArticles(v, isFont = false) {
    const categoryId = v.get('query.categoryId')
    const authorId = v.get('query.authorId')
    const tagId = v.get('query.tagId')
    const publicId = v.get('query.publicId')
    const statusId = v.get('query.statusId')
    const starId = v.get('query.starId')
    const search = v.get('query.search')
    const start = v.get('query.page');
    const pageCount = v.get('query.count');

    // step1: 获取关联表的文章 id 交集
    let ids = []
    if (authorId !== 0 || tagId !== 0) {
      // 求交集
      if (authorId !== 0 && tagId !== 0) {
        const arr1 = await ArticleAuthorDto.getArticleIds(authorId)
        const arr2 = await ArticleTagDto.getArticleIds(tagId)
        ids = intersection(arr1, arr2)
      }
  
      // 查询该标签下是否有文章
      if (tagId !== 0 && authorId === 0) {
        ids = await ArticleTagDto.getArticleIds(tagId)
      }
  
      // 查询该作者下是否有文章
      if (authorId !== 0 && tagId === 0) {
        ids = await ArticleAuthorDto.getArticleIds(authorId)
      }
  
      // 如果作者和标签都没有查询到文章
      if (!ids.length) {
        return []
      }
    }
  
    // step2: 获取筛选条件
    let query = {
      category_id: categoryId === 0 ? undefined : categoryId,
      status: statusId === 0 ? undefined : statusId,
      public: publicId === 0 ? undefined : publicId,
      star: starId === 0 ? undefined : starId
    }

    // 忽略值为空的key
    let target = omitBy(query, isUndefined)
    let opIn = ids.length ? {
      id: {
        [Op.in]: ids
      }
    } : {}
    let like = search ? {
      [Op.or]: [
        {
          title: {
            [Op.like]: `${search}%`,
          }
        },
        {
          content: {
            [Op.like]: `${search}%`,
          }
        }
      ]
    } : {}

    // step3: 构建查询条件
    const where = {
      ...target,
      ...opIn,
      ...like
    }

    const { rows, count } = await Article.findAndCountAll({
      where,
      order: [
        ['created_date', 'DESC']
      ],
      offset: start * pageCount,
      limit: pageCount,
      attributes: {
        exclude: isFont ? ['content', 'public', 'status'] : ['content']
      },
    })

    for (let i = 0; i < rows.length; i++) {
      const id = rows[i].id
      let article = rows[i]
      await article.setDataValue('tags', await ArticleTagDto.getArticleTag(id))
      await article.setDataValue('authors', await ArticleAuthorDto.getArticleAuthor(id, {
        attributes: { exclude: ['auth', 'description', 'email'] }
      }))
      await article.setDataValue('category',  await CategoryDto.getCategory(rows[i].category_id, {
        attributes: { exclude: ['description', 'cover']}
      }))
      await article.setDataValue('comment_count', await CommentDto.findCommentCount(id))
      article.exclude = ['category_id']
    }

    return {
      articles: rows,
      total: count
    }
  }

  // 前端展示搜索文章
  async searchArticles(v) {
    const search = v.get('query.search')
    const start = v.get('query.page');
    const pageCount = v.get('query.count');

    const { rows, count } = await Article.scope('frontShow').findAndCountAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `${search}%`,
            }
          },
          {
            content: {
              [Op.like]: `${search}%`,
            }
          }
        ]
      },
      order: [
        ['created_date', 'DESC']
      ],
      attributes: ['id', 'title', 'created_date', 'star'],
      offset: start * pageCount,
      limit: pageCount,
    })

    return {
      articles: rows,
      total: count
    }
  }

  async deleteArticle(id) {
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

    // 删除相关关联
    await ArticleAuthorDto.deleteArticleAuthor(id)
    await ArticleTagDto.deleteArticleTag(id)
    article.destroy()
  }

  // 获取谋篇文章内容
  async getContent(id) {
    const content = await Article.findOne({
      where: {
        id
      },
      attributes: ['content']
    })
    return content
  }
}

module.exports = {
  ArticleDao
}
