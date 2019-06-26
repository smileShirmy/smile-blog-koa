const { Sequelize, Model } = require('sequelize')
const { unset, clone, isArray } = require('lodash')

const {
  dbName,
  host,
  port,
  user,
  password
} = require('../config/config').database

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  logging: true,
  timezone: '+8:00',
  define: {
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true,
    scopes: {
      bh: {
        attributes: {
          exclude: ['updated_at', 'deleted_at', 'created_at']
        }
      }
    }
  }
})

// 设为 true 会重新创建数据表
sequelize.sync({
  force: true
})

// 全局序列化
Model.prototype.toJSON = function () {
  let data = clone(this.dataValues)
  
  if (isArray(this.exclude)) {
    this.exclude.forEach(value => {
      unset(data, value)
    })
  }
  return data
}

module.exports = {
  sequelize
}