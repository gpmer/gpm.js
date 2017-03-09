# gpm.js 
[![Build Status](https://travis-ci.org/gpmer/gpm.js.svg?branch=master)](https://travis-ci.org/gpmer/gpm.js)
[![Dependency](https://david-dm.org/gpmer/gpm.js.svg)](https://david-dm.org/gpmer/gpm.js)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E=6.9-blue.svg?style=flat-square)

Git Package Manager, make you manage the repository easier

## Documentation

[简体中文](https://gpmer.github.io/gpm.js/#/zh-cn/)

[English](https://gpmer.github.io/gpm.js)

## Features

- [x] support Github, Gitlab, etc
- [x] add, remove, clean, cache, list commands
- [x] score, humanize, easier to manager
- [ ] add repository in multi directories

## Installation
```bash
npm install @axetroy/gpm -g
```

## Requirement

- nodejs>=6.9
- npm || yarn
- Git

## Supports

- [x] Windows
- [x] Linux
- [x] MacOS

## Usage

```bash
gpm -h
# or gpmx -h

# print out

  Usage: gpm <command> [options]


  Commands:

    add|a [options] <repo>            add a repository to gpm
    remove|rm [key]                   Remove a repository from registry and disk, optional [key] to filter
    list|ls [key]                     Display the all repositories in registry
    clean|cl                          Clear the cache, usually is /home/axetroy/.gpm/temp
    search|sr <key>                   @Deprecated, Search repository by a key, You can get all about the repository info
    find|fd <key>                     Find repository by a key, You can get all about the repository info
    relink|rl [options]               Relink the base directory and gpm registry, like Angular, trigger the $digest in manual
    config|cf <action> [key] [value]  Config　handler, <list|get|set|delete|reset> [key] [value]
    runtime|rt                        Print the program runtime, useful for submit issue
    import|ip [options] <dir>         Import local repository into gpm registry

  Git Package Manager, make you manage the repository easier

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

```

### Config

this is a default config, it will be generated in ``~/.gpm`` by default

**~/.gpm/gpm.config.json**

```json
{
  "name": "gpm",
  "base": "gpm"
}
```

- name: user name
- base: the repositories base dir, all repository will be install in this dir

## Structure

```bash
.
├── github.com
│   ├── axetroy
│   │   ├── aabbcc
│   │   ├── build-cli -> /home/axetroy/develop/build-cli
│   │   ├── commander.dart
│   │   ├── contributors-stat
│   │   ├── event-emitter.dart
│   │   ├── event-emitter.js
│   │   ├── git-url-parse
│   │   ├── gpm.dart
│   │   ├── gpm.go
│   │   ├── labrador-cli
│   │   ├── labrador-demo
│   │   ├── ng-promise -> /home/axetroy/develop/ng-promise
│   │   ├── nmr
│   │   ├── protocols
│   │   ├── songojs -> /home/axetroy/develop/songojs
│   │   ├── url-parser
│   │   ├── wechatapp-dev-tool-linux
│   │   ├── wxapp-socket
│   │   └── ymli
│   ├── chentsulin
│   │   └── electron-react-boilerplate
│   ├── electron
│   │   └── electron-quick-start -> /home/axetroy/develop/electron-quick-start
│   ├── fenivana
│   │   └── wx-mina-html-view
│   ├── geeeeeeeeek
│   │   └── electronic-wechat -> /home/axetroy/develop/electronic-wechat
│   ├── gpmer
│   │   ├── gpm.js
│   │   └── gpm.ruby
│   ├── lidong1665
│   │   └── WeiXinProject
│   ├── maichong
│   │   └── labrador-demo
│   ├── zarknight
│   │   └── wx-falls-layout
│   └── zeit
│       └── nextgram
└── xxx.net(private git server)
    ├── axetroy
    │   ├── xxx
    │   ├── xxx -> /home/axetroy/develop/xxx
    │   ├── xxx -> /home/axetroy/develop/xxx
    │   ├── xxx
    │   ├── xxx -> /home/axetroy/develop/xxx
    │   ├── xxx -> /home/axetroy/develop/xxx
    │   └── xxx
    ├── xxx
    │   └── xxx
    └── xxx
        ├── xxx -> /home/axetroy/develop/xxx
        ├── xxx -> /home/axetroy/develop/xxx
        └── xxx -> /home/axetroy/develop/xxx
```

## Example

```bash
gpm add https://github.com/zeit/release.git
gpm add https://github.com/axetroy/gpm.git
gpm add https://github.com/axetroy/ymli.git

gpm ls

# print out
github.com: 
  axetroy: 
    gpm:  /home/axetroy/gpm/github.com/axetroy/gpm
    ymli: /home/axetroy/gpm/github.com/axetroy/ymli
  zeit: 
    release: /home/axetroy/gpm/github.com/zeit/release
```

## Uninstall

```bash
npm uninstall @axetroy/gpm -g
rm -rf ~/.gpm      # all file, cache, contain in this dir
```

## Contribute

```bash
git clone https://github.com/gpmer/gpm.js.git
cd ./gpm
yarn
./bin/gpm
```

You can flow [Contribute Guide](https://github.com/gpmer/gpm.js/blob/master/contributing.md)

## License

The [MIT License](https://github.com/gpmer/gpm.js/blob/master/LICENSE)
