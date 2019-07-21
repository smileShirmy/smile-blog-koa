const { LinValidator, Rule } = require('../../core/lin-validator')

class CreateOrUpdateFriendValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '友链必须在1~64个字符之间', {
        min: 1,
        max: 64
      })
    ],
    this.link = [
      new Rule('isURL', '不符合URL规范')
    ],
    this.avatar = [
      new Rule('isOptional'),
      new Rule('isURL', '不符合URL规范')
    ]
  }
}

module.exports = {
  CreateOrUpdateFriendValidator
}
