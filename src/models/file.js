class File {
  constructor(params) {
    this.name = params.name
    this.downloadUrl = params.downloadUrl
    this.buffer = null
  }
}

class TorrentFile {
  constructor(params) {
    this.name = params.name
    this.buffer = params.buffer
  }
}

module.exports = {File, TorrentFile}
