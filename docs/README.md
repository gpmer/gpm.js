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

   gpm 8.1.0 - Git Package Manager, make you manage the repository easier
     
   USAGE

     gpm <command> [options]

   COMMANDS

     add <repo>                         Add a repository to gpm.                                                                
     remove [owner] [repo]              Remove a repository from registry and disk.                                             
     list [key]                         Display the all repositories in registry.                                               
     clean                              Clear the cache, locate in /home/axetroy/.gpm/temp.                                     
     prune                              Remove the file or dir you don't really need id, like node_modules                      
     find                               Find repository by a key, You can get all about the repository info.                    
     relink                             Relink the base directory and gpm registry, like Angular, trigger the $digest in manual.
     config <action> [key] [value]      A series handler of configurations.                                                     
     runtime                            Print the program runtime, useful for submit issue.                                     
     help <command>                     Display help for a specific command                                                     

   GLOBAL OPTIONS

     -h, --help         Display help                                      
     -V, --version      Display version                                   
     --no-color         Disable colors                                    
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages

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
cd ./gpm.js
yarn
./bin/gpm
```

## License

The [MIT License](https://github.com/gpmer/gpm.js/blob/master/LICENSE)
