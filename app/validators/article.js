const { LinValidator, Rule } = require('../../core/lin-validator')
const { PositiveIntegerValidator} = require('./validator')

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

class AddCommentValidator extends PositiveIntegerValidator {
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


module.exports = {
  CreateOrUpdateArticleValidator,
  AddCommentValidator
}