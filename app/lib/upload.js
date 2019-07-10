const qiniu = require('qiniu')

class UpLoader {
  constructor(prefix) {
    this.prefix = prefix || ''
  }

  async upload(files) {
    // 上传凭证
    const accessKey = global.config.qiniu.accessKey
    const secretKey = global.config.qiniu.secretKey
    const bucket = global.config.qiniu.bucket
    const siteDomain = global.config.qiniu.siteDomain

    let promises = []

    for (const file of files) {
      const key = this.prefix + file.filename
      // 文件覆盖
      const putPolicy = new qiniu.rs.PutPolicy({
        scope: `${bucket}:${key}`
      })
      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
      const uploadToken = putPolicy.uploadToken(mac)

      // ReadableStream 对象的上传
      const config = new qiniu.conf.Config()
      config.zone = qiniu.zone.Zone_z2
      config.useHttpsDomain = true

      const formUploader = new qiniu.form_up.FormUploader(config)
      const putExtra = new qiniu.form_up.PutExtra()
      const readableStream = file

      const promise = new Promise((resolve, reject) => {
        formUploader.putStream(uploadToken, key, readableStream, putExtra, (respErr, respBody, respInfo) => {
          if (respErr) {
            console.log(respErr)
            reject(respErr)
          }
  
          if (respInfo.statusCode === 200) {
            const url = siteDomain + respBody.key
            resolve(url)
          } else {
            // 614 文件已存在
            reject(respInfo)
          }
        })
      })
      promises.push(promise)
    }

    try {
      return Promise.all(promises)
    } catch (error) {
      throw new Error('文件上传失败')
    }
  }
}

module.exports = {
  UpLoader
}