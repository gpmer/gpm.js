# gpm.js 
[![Build Status](https://travis-ci.org/gpmer/gpm.js.svg?branch=master)](https://travis-ci.org/gpmer/gpm.js)
[![Dependency](https://david-dm.org/gpmer/gpm.js.svg)](https://david-dm.org/gpmer/gpm.js)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E=6.9-blue.svg?style=flat-square)

Git Package Manager, make you manage the repository easier.

Git's manager, easy to manage the repository. Not in chaos

directories are layered by git information, better management of the repository

directory structure:

```bash
- source
    - owner
        - name
        - name
    - owner
        - name
        - name
        - name
- source
    - owner
        - name
        - name
```

## Installation
```bash
npm install @axetroy/gpm -g
```

## Requirement

- nodejs>=6.9
- npm || yarn
- Git

## Supports

- Windows，got some trouble in this win
- Linux
- MacOS

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

## Contribute

"U CAN U UP"，welcome everyone PR

```bash
git clone https://github.com/gpmer/gpm.js.git
cd ./gpm
yarn
./bin/gpm
```

## License

The [MIT License](https://github.com/gpmer/gpm.js/blob/master/LICENSE)
