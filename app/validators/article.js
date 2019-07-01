const { LinValidator, Rule } = require('../../core/lin-validator')
const { PositiveIntegerValidator} = require('./common')

class CreateOrUpdateArticleValidator extends LinValidator {
  constructor() {
    super()
    this.validateTags = checkTags
    this.validateAuthors = checkAuthors
    this.title = [
      new Rule('isLength', '标题必须在1~64个字符之间', {
        min: 1,
        max: 64
      })
    ]
    this.content = [
      new Rule('isLength', '文章内容不能为空', {
        min: 1
      })
    ]
    this.cover = [
      new Rule('isURL', '不符合URL规范')
    ]
    this.createdDate = new Rule('isNotEmpty', '创建时间不能为空');
    this.categoryId = [
      new Rule('isInt', '分类ID需要是正整数', {
        min: 1
      })
    ]
  }
}

function checkTags(val) {
  let tags = val.body.tags
  if (!tags) {
    throw new Error('tags是必须参数')
  }
  try {
    tags = JSON.parse(tags)
  } catch (error) {
    throw new Error('tags参数不合法')
  }
  if (!Array.isArray(tags)) {
    throw new Error('tags必须是元素都为正整数的数组')
  }
}

function checkAuthors(val) {
  let authors = val.body.authors
  if (!authors) {
    throw new Error('authors是必须参数')
  }
  try {
    authors = JSON.parse(authors)
  } catch (error) {
    throw new Error('authors参数不合法')
  }
  if (!Array.isArray(authors)) {
    throw new Error('authors必须是元素都为正整数的数组')
  }
}

class CreateCommentValidator extends PositiveIntegerValidator {
  constructor() {
    super()
    this.nickname = [
      new Rule('isLength', '昵称必须在1~32个字符之间', {
        min: 1,
        max: 32
      })
    ],
    this.content = [
      new Rule('isLength', '内容必须在1~1023个字符之间', {
        min: 1,
        max: 1023
      })
    ]
    this.email = [
      new Rule('isOptional'),
      new Rule('isEmail', '不符合Email规范')
    ]
    this.website = [
      new Rule('isOptional'),
      new Rule('isURL', '不符合URL规范')
    ]
  }
}

class ReplyCommentValidator extends CreateCommentValidator {
  constructor() {
    super()
    this.parentId = [
      new Rule('isOptional'),
      new Rule('isInt', '需要是正整数', {
        min: 1
      })
    ]
  }
}


module.exports = {
  CreateOrUpdateArticleValidator,
  CreateCommentValidator,
  ReplyCommentValidator
}