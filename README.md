torrent-cli
===========

Torrent CLI to create, download and seed torrent files.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@merorafael/torrent-cli.svg)](https://npmjs.org/package/torrent-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@merorafael/torrent-cli.svg)](https://npmjs.org/package/torrent-cli)
[![License](https://img.shields.io/npm/l/@merorafael/torrent-cli.svg)](https://github.com/merorafael/torrent-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @merorafael/torrent-cli
$ torrent-cli COMMAND
running command...
$ torrent-cli (-v|--version|version)
@merorafael/torrent-cli/0.1.1 linux-x64 node-v11.15.0
$ torrent-cli --help [COMMAND]
USAGE
  $ torrent-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`torrent-cli create`](#torrent-cli-create)
* [`torrent-cli help [COMMAND]`](#torrent-cli-help-command)
* [`torrent-cli share`](#torrent-cli-share)

## `torrent-cli create`

Create a torrent file

```
USAGE
  $ torrent-cli create

OPTIONS
  -d, --downloadUrl=downloadUrl  (required) Download url used for WebSeed and download file if localUrl is not informed
  -l, --localUrl=localUrl        Local file url
  --announce=announce            Tracker announce address used for torrent download
  --[no-]private                 Make a private torrent file (Works only on specified announcer tracker)
  --src=src                      [default: ./] Directory when torrent file is write
```

_See code: [src/commands/create.js](https://github.com/merorafael/torrent-cli/blob/v0.1.1/src/commands/create.js)_

## `torrent-cli help [COMMAND]`

display help for torrent-cli

```
USAGE
  $ torrent-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_

## `torrent-cli share`

Download and share torrent file

```
USAGE
  $ torrent-cli share

OPTIONS
  -f, --torrentFile=torrentFile  (required) Torrent file address
  -p, --path=path                [default: ./] Folder to download files
  -t, --timeout=timeout          [default: 0] Client timeout after download completed in milliseconds(0 for infinity)
  --[no-]dht                     Enable/Disable BitTorrent DHT protocol
  --[no-]tracker                 Enable/Disable BitTorrent Tracker protocol
  --[no-]webSeeds                Enable/Disable web seeds
```

_See code: [src/commands/share.js](https://github.com/merorafael/torrent-cli/blob/v0.1.1/src/commands/share.js)_
<!-- commandsstop -->
