const { LinValidator, Rule } = require('../../core/lin-validator')

class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '需要是正整数', {
        min: 1
      })
    ]
  }
}

class AddArticleValidator extends LinValidator {
  constructor() {
    super()
    this.content = [
      new Rule('isLength', '文章内容不能为空', {
        min: 1
      })
    ]
  }
}

module.exports = {
  PositiveIntegerValidator,
  AddArticleValidator
}