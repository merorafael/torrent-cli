const {Command, flags} = require('@oclif/command')
const fs = require('fs')
const humanizeDuration = require('humanize-duration')
const networkService = require('../services/network-service')
const torrentService = require('../services/torrent-service')

class ShareCommand extends Command {
  async run() {
    const {flags} = this.parse(ShareCommand)

    const timeout = Number(flags.timeout)
    const client = await torrentService.createClient(flags.tracker, flags.dht, flags.webSeeds)

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

    if (timeout > 0) {
      setTimeout(() => {
        client.destroy(() => {
          this.log('Torrent client closed because timeout setted is reached(' + timeout + ' milliseconds)')
        })
      }, timeout)
    }
  }
}

ShareCommand.description = `Download and share torrent file
`

ShareCommand.flags = {
  torrentFile: flags.string({
    char: 'f',
    description: 'Torrent file address',
    required: true,
  }),
  path: flags.string({
    char: 'p',
    description: 'Folder to download files',
    required: false,
    default: './',
  }),
  timeout: flags.string({
    char: 't',
    description: 'Client timeout in milliseconds(0 for infinity)',
    required: false,
    default: '0',
  }),
  dht: flags.boolean({
    description: 'Enable/Disable BitTorrent DHT protocol',
    required: false,
    default: true,
    allowNo: true,
  }),
  tracker: flags.boolean({
    description: 'Enable/Disable BitTorrent Tracker protocol',
    required: false,
    default: true,
    allowNo: true,
  }),
  webSeeds: flags.boolean({
    description: 'Enable/Disable web seeds',
    required: false,
    default: true,
    allowNo: true,
  }),
}

module.exports = ShareCommand
