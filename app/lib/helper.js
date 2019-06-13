const { Success } = require('@exception')

function success(msg, errorCode) {
  throw new Success(msg, errorCode)
}

module.exports = {
  success
}