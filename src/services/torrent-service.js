const crypto = require('crypto')
const createTorrent = require('create-torrent')
const WebTorrent = require('webtorrent')
const swarm = require('discovery-swarm')
const {File, TorrentFile} = require('../models/file')
const networkService = require('./network-service')

class TorrentService {
  createTorrent(file) {
    return new Promise((resolve, reject) => {
      if (file instanceof File) {
        if (!file.buffer) {
          reject(new Error('Unable to create torrent file, file buffer not found'))
        }

        const fileParams = {
          name: file.name,
          private: true,
          announceList: [],
          urlList: [
            file.downloadUrl,
          ],
        }

        createTorrent(file.buffer, fileParams, function (err, torrent) {
          if (err) {
            reject(err)
          }

          resolve(new TorrentFile({
            name: file.name + '.torrent',
            buffer: torrent,
          }))
        })
      } else {
        reject(new Error('file argument is not a File instance'))
      }
    })
  }

  createClient(swarmPort, enableWebSeeds) {
    const networkAddress = networkService.discoverIpAddress()

    return new WebTorrent({
      tracker: false,
      dht: {
        host: false,
        bootstrap: [
          networkAddress + ':' + swarmPort,
        ],
      },
      webSeeds: enableWebSeeds,
    })
  }

  createSwarm(port) {
    return new Promise((resolve, reject) => {
      const sw = swarm({
        dht: {
          bootstrap: false,
        },
      })

      try {
        sw.listen(port)
        resolve(sw)
      } catch (error) {
        reject(error)
      }
    })
  }
}

const torrentService = new TorrentService()
module.exports = torrentService
