const { LinValidator, Rule } = require('../../core/lin-validator')

class CreateMessageValidator extends LinValidator {
  constructor() {
    super()
    this.nickname = [
      new Rule('isOptional'),
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
  }
}

module.exports = {
  CreateMessageValidator
}
