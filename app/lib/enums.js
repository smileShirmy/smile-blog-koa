function isThisType(val){
  for(let key in this){
      if(this[key] === val){
          return true
      }
  }
  return false
}

const AuthType = {
  USER: 8,
  ADMIN: 16,
  SUPER_ADMIN: 32,
  isThisType
}

const TokenType = {
  ACCESS: 'access',
  REFRESH: 'refresh'
}
module.exports = {
  AuthType,
  TokenType
}
