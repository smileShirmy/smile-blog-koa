const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
  static initCore(app) {
    // 入口
    InitManager.app = app
    InitManager.initLoadRoutes()
    InitManager.loadConfig()
  }

  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config.js'
    const config = require(configPath)
    global.config = config
  }

  static initLoadRoutes() {
    const appDirectory = `${process.cwd()}/app/api`
    requireDirectory(module, appDirectory, {
      visit: whenLoadingModule
    })

    function whenLoadingModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }
}

module.exports = InitManager