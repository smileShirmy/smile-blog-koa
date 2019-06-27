const { LinValidator, Rule } = require('../../core/lin-validator')
const { Auth } = require('../../middleware/auth')

class CreateAuthorValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '昵称长度为4~32个字符', {
        min: 4,
        max: 32
      })
    ]
    this.email = [
      new Rule('isEmail', '不符合Email规范')
    ]
    this.password = [
      new Rule('isLength', '密码长度为6~32个字符', {
        min: 6,
        max: 32
      }),
      new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
    ]
    this.avatar = [
      new Rule('isURL', '不符合URL规范')
    ],
    this.description = [
      new Rule('isLength', '描述长度为1~255个字符', {
        min: 1,
        max: 255
      })
    ]
    this.auth = [
      new Rule('isInt')
    ]
  }
}

class LoginValidator extends LinValidator {
  constructor() {
    super()
    this.nickname = new Rule('isNotEmpty', '昵称不可为空');
    this.password = new Rule('isNotEmpty', '密码不可为空');
  }
}

module.exports = {
  CreateAuthorValidator,
  LoginValidator
}