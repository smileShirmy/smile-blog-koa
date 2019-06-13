const { Success } = require('../../core/http-exception')

function success(msg, errorCode) {
  throw new Success(msg, errorCode)
}

module.exports = {
  success
}