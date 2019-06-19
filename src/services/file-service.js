const axios = require('axios')
const fs = require('fs')

class FileService {
  createLocalFileBuffer(localUrl) {
    return new Promise((resolve, reject) => {
      fs.readFile(localUrl, (err, buffer) => {
        if (err) {
          reject(err)
        }

        resolve(buffer)
      })
    })
  }

  createExternalFileBuffer(downloadUrl) {
    return new Promise((resolve, reject) => {
      axios.get(downloadUrl, {responseType: 'arraybuffer'}).then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
    })
  }
}

const fileService = new FileService()
module.exports = fileService
