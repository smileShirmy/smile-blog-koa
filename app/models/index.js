const { Article } = require('./article')
const { ArticleAuthor } = require('./articleAuthor')
const { ArticleTag } = require('./articleTag')
const { Author } = require('./author')
const { Category } = require('./category')
const { Comment } = require('./comment')
const { Message } = require('./message')
const { Tag } = require('./tag')

// 关联作者和评论
Article.hasMany(Comment, {
  as: 'comments',
  constraints: false,
})

// 关联作者和分类
Article.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category',
  constraints: false,
})

// 关联文章和作者
Article.belongsToMany(Author, {
  through: {
    model: ArticleAuthor,
    unique: false
  },
  foreignKey: 'article_id',
  constraints: false,
  as: 'authors'
})

Author.belongsToMany(Article, {
  through: {
    model: ArticleAuthor,
    unique: false
  },
  foreignKey: 'author_id',
  constraints: false
})

// 关联文章和标签
Article.belongsToMany(Tag, {
  through: {
    model: ArticleTag,
    unique: false
  },
  foreignKey: 'article_id',
  constraints: false,
  as: 'tags'
})

Tag.belongsToMany(Article, {
  through: {
    model: ArticleTag,
    unique: false
  },
  foreignKey: 'tag_id',
  constraints: false
})

module.exports = {
  Article,
  ArticleAuthor,
  ArticleTag,
  Author,
  Category,
  Comment,
  Message,
  Tag
}
