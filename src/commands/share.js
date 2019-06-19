const {Command, flags} = require('@oclif/command')
const fs = require('fs')
const humanizeDuration = require('humanize-duration')
const networkService = require('../services/network-service')
const torrentService = require('../services/torrent-service')

class ShareCommand extends Command {
  async run() {
    const {flags} = this.parse(ShareCommand)

    const sw = await torrentService.createSwarm(flags.swarmPort)
    this.log('Swarm created and listening on port ' + flags.swarmPort)

    sw.join(flags.channel)

    const client = torrentService.createClient(flags.swarmPort, flags.webSeeds)

    sw.on('connection', (conn, info) => {
      const peerId = info.id.toString('hex')
      this.log(`Connected to peer: ${peerId}`)

      if (info.initiator) {
        conn.setKeepAlive(true, 600)
        client.dht.addNode({
          host: info.host,
          port: info.port,
        })
      }
    })

    const torrentFile = fs.readFileSync(flags.torrentFile)
    client.add(torrentFile, {path: flags.path}, torrent => {
      torrent.on('done', () => {
        this.log('File downloaded in ' + flags.path)
      })

      torrent.on('download', bytes => {
        this.log('--- Download Report ---')
        this.log('just downloaded: ' + networkService.formatBytes(bytes))
        this.log('total downloaded: ' + networkService.formatBytes(torrent.downloaded))
        this.log('download speed: ' + networkService.formatBytes(torrent.downloadSpeed) + '/s')
        this.log('progress: ' + Number(torrent.progress * 100).toFixed(2) + '%')
        this.log('peers: ' + torrent.numPeers)
        this.log('time remaining: ' + (humanizeDuration(torrent.timeRemaining, {language: 'pt', round: true})))
        this.log('------')
      })

      torrent.on('upload', bytes => {
        this.log('--- Upload Report ---')
        this.log('just uploaded: ' + networkService.formatBytes(bytes))
        this.log('total uploaded: ' + networkService.formatBytes(torrent.uploaded))
        this.log('upload speed: ' + networkService.formatBytes(torrent.uploadSpeed) + '/s')
        this.log('peers: ' + torrent.numPeers)
        this.log('------')
      })

      torrent.on('noPeers', announceType => {
        this.log('--- Peer Report ---')
        this.log('No peers: ' + announceType)
        this.log('------')
      })
    })
  }
}

ShareCommand.description = `Download and share torrent file
`

ShareCommand.flags = {
  torrentFile: flags.string({
    char: 't',
    description: 'Torrent file address',
    required: true,
  }),
  channel: flags.string({
    char: 'c',
    description: 'Channel used to connect another peers',
    required: true,
  }),
  path: flags.string({
    description: 'Folder to download files',
    required: false,
    default: './',
  }),
  swarmPort: flags.string({
    description: 'Port used to listen p2p swarm',
    required: false,
    default: 20000,
  }),
  webSeeds: flags.boolean({
    description: 'Enable/Disable web seeds',
    required: false,
    default: true,
    allowNo: true,
  }),
}

module.exports = ShareCommand
