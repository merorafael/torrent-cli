const {Command, flags} = require('@oclif/command')
const fs = require('fs')
const Listr = require('listr')
const path = require('path')
const {File, TorrentFile} = require('../models/file')
const fileService = require('../services/file-service')
const torrentService = require('../services/torrent-service')

class CreateCommand extends Command {
  async run() {
    const {flags} = this.parse(CreateCommand)
    const fileName = (flags.localUrl) ? path.basename(flags.localUrl) : path.basename(flags.downloadUrl)

    const tasks = new Listr([
      {
        title: 'Reading local file',
        enabled: ctx => Boolean(ctx.localUrl) === true,
        task: ctx => {
          return fileService.createLocalFileBuffer(ctx.localUrl).then(buffer => {
            ctx.torrentFile.file.buffer = buffer
          })
        },
      },
      {
        title: 'Downloading remote file',
        enabled: ctx => Boolean(ctx.localUrl) === false,
        task: ctx => {
          return fileService.createExternalFileBuffer(ctx.torrentFile.downloadUrl).then(buffer => {
            ctx.torrentFile.file.buffer = buffer
          })
        },
      },
      {
        title: 'Creating torrent file',
        task: ctx => {
          return torrentService.createTorrent(ctx.torrentFile).then(torrentFile => {
            fs.writeFileSync(ctx.src + '/' + torrentFile.name, torrentFile.buffer)
          })
        },
      },
    ])

    tasks.run({
      torrentFile: new TorrentFile({
        name: fileName + '.torrent',
        downloadUrl: flags.downloadUrl,
        private: flags.private,
        announceList: flags.announce,
        file: new File({
          name: fileName,
        }),
      }),
      localUrl: flags.localUrl,
      src: flags.src || './',
    })
  }
}

CreateCommand.description = `Create a torrent file
`

CreateCommand.flags = {
  downloadUrl: flags.string({
    char: 'd',
    description: 'Download url used for WebSeed and download file if localUrl is not informed',
    required: true,
  }),
  localUrl: flags.string({
    char: 'l',
    description: 'Local file url',
    required: false,
  }),
  src: flags.string({
    description: 'Directory when torrent file is write',
    default: './',
    required: false,
  }),
  private: flags.boolean({
    description: 'Make a private torrent file (Works only on specified announcer tracker)',
    default: false,
    required: false,
    allowNo: true,
  }),
  announce: flags.string({
    description: 'Tracker announce address used for torrent download',
    required: false,
    multiple: true,
  }),
}

module.exports = CreateCommand
