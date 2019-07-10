require('module-alias/register')

const Koa = require('koa')
const parser = require('koa-bodyparser')
const InitManager = require('./core/init')
const catchError = require('./middleware/exception')
const cors = require('koa2-cors');
const multipart = require('./core/multipart')

const app = new Koa()

app.use(cors())
app.use(catchError)
app.use(parser())
multipart(app)

InitManager.initCore(app)

app.listen(3000, () => {
  console.log('listening port 3000')
})