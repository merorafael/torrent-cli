class File {
  constructor(params) {
    params = params || {}

    this.name = params.name
    this.buffer = params.buffer || null
  }
}

class TorrentFile extends File {
  constructor(params) {
    params = params || {}

    super(params)
    this.file = params.file || new File({})
    this.downloadUrl = params.downloadUrl
    this.private = params.private || false
    this.announceList = params.announceList || []
  }
}

module.exports = {File, TorrentFile}
