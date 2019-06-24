const { LinValidator, Rule } = require('../../core/lin-validator')

class CreateOrUpdateArticleValidator extends LinValidator {
  constructor() {
    super()
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
  }
}

module.exports = {
  CreateOrUpdateArticleValidator
}