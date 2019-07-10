const busboy = require('co-busboy')
const streamWormhole = require('stream-wormhole')
const path = require('path')
const { FileExtensionException, FileTooLargeException, FileTooManyException } = require('@exception')
const { cloneDeep } = require('lodash')

const multipart = (app) => {
  app.context.multipart = async function (opts) {
    // multipart/form-data
    if (!this.is('multipart')) {
      throw new Error('Content-Type must be multipart/*')
    }
    // field指表单中的非文件
    const parts = busboy(this, { autoFields: opts && opts.autoFields })
    let part
    let totalSize = 0
    const files = []
    while ((part = await parts()) != null ) {
      if (part.length) {

      } else {
        if (!part.filename) {
          await streamWormhole(part)
        }
        // 检查 extension
        const ext = path.extname(part.filename)
        if (!checkFileExtension(ext, opts && opts.include, opts && opts.exclude)) {
          throw new FileExtensionException({
            msg: `不支持类型为${ext}的文件`
          })
        }
        const { valid, conf } = checkSingleFileSize(part._readableState.length, opts && opts.singleLimit)
        if (!valid) {
          throw new FileTooLargeException({
            msg: `文件单个大小不能超过${conf}b`
          })
        }
        // 计算那总大小
        totalSize += part._readableState.length
        const tmp = cloneDeep(part)
        files.push(tmp)
        // 恢复再次接受 data
        part.resume()
      }
    }
    const { valid, conf } = checkFileCount(files.length, opts && opts.fileCount)
    if (!valid) {
      throw new FileTooManyException({
        msg: `上传文件数量不能超过${conf}`
      })
    }
    const { valid: valid1, conf: conf1 } = checkTotalFileSize(totalSize, opts && opts.totalLimit)
    if (!valid1) {
      throw new FileTooLargeException({
        msg: `总文件体积不能超过${conf1}`
      })
    }
    return files
  }
}

function checkSingleFileSize(size, singleLimit) {
  // 默认 2M
  const confSize = singleLimit ? singleLimit : global.config.file.singleLimit || 1024 * 1024 * 2
  return {
      valid: confSize > size,
      conf: confSize
  }
}

function checkTotalFileSize(size, totalLimit) {
  // 默认 20M
  const confSize = totalLimit ? totalLimit : global.config.file.totalLimit || 1024 * 1024 * 20
  return {
      valid: confSize > size,
      conf: confSize
  };
}

function checkFileExtension(ext, include, exclude) {
  const fileInclude = include ? include : global.config.file.include
  const fileExclude = exclude ? exclude : global.config.file.exclude
  
  // 如果两者都有取fileInclude，有一者则用一者
  if (fileInclude && fileExclude) {
    if (!Array.isArray(fileInclude)) {
      throw new Error('file_include must an array!')
    }
    return fileInclude.includes(ext)
  }
  else if (fileInclude && !fileExclude) {
    // 有include，无exclude
    if (!Array.isArray(fileInclude)) {
      throw new Error('file_include must an array!')
    }
    return fileInclude.includes(ext)
  }
  else if (fileExclude && !fileInclude) {
    // 有exclude，无include
    if (!Array.isArray(fileExclude)) {
      throw new Error('file_exclude must an array!')
    }
    return !fileExclude.includes(ext)
  }
  else {
    // 二者都没有
    return true
  }
}

function checkFileCount(count, fileCount) {
  // 默认 10
  const confCount = fileCount ? fileCount : global.config.file.fileCount || 10
  return {
      valid: confCount > count,
      conf: confCount
  };
}

module.exports = multipart