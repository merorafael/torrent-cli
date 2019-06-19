const os = require('os')

class NetworkService {
  discoverIpAddress() {
    return new Promise((resolve, reject) => {
      const ifaces = os.networkInterfaces()
      const netInterfaces = Object.keys(ifaces)

      for (let i = 0; i < netInterfaces.length; i++) {
        const interfaceIps = ifaces[netInterfaces[i]]
        for (let c = 0; c < interfaceIps.length; c++) {
          if (interfaceIps[c].family === 'IPv4' && interfaceIps[c].internal === false) {
            resolve(interfaceIps[c].address)
          }
        }
      }

      reject(new Error('External IPv4 address not found'))
    })
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / (k ** i)).toFixed(dm)) + ' ' + sizes[i]
  }
}

const networkService = new NetworkService()
module.exports = networkService
