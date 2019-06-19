const createTorrent = require('create-torrent')
const WebTorrent = require('webtorrent')

class TorrentService {
  createTorrent(torrentFile) {
    return new Promise((resolve, reject) => {
      if (!torrentFile.file.buffer) {
        reject(new Error('Unable to create torrent file, file buffer not found'))
      }

      const fileParams = {
        name: torrentFile.name,
        private: torrentFile.private,
        announceList: torrentFile.announceList.length > 0 ? [torrentFile.announceList] : [],
        urlList: [
          torrentFile.downloadUrl,
        ],
      }

      createTorrent(torrentFile.file.buffer, fileParams, function (err, torrent) {
        if (err) {
          reject(err)
        }

        torrentFile.buffer = torrent
        resolve(torrentFile)
      })
    })
  }

  async createClient(enableTracker, enableDht, enableWebSeeds) {
    return new WebTorrent({
      tracker: enableTracker,
      dht: enableDht,
      webSeeds: enableWebSeeds,
    })
  }
}

const torrentService = new TorrentService()
module.exports = torrentService
