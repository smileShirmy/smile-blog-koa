const { LinValidator, Rule } = require('../../core/lin-validator')

class CreateOrUpdateTagValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '标签名必须在1~64个字符之间', {
        min: 1,
        max: 64
      })
    ]
  }
}

module.exports = {
  CreateOrUpdateTagValidator
}