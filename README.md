# gpmx 
[![Build Status](https://travis-ci.org/axetroy/gpm.svg?branch=master)](https://travis-ci.org/axetroy/gpm)
[![Dependency](https://david-dm.org/axetroy/gpm.svg)](https://david-dm.org/axetroy/gpm)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E=6.9-blue.svg?style=flat-square)



Git Package Manager, make you manage the repository easier

## Features

- [x] support Github, Gitlab, etc
- [x] add, remove, clean, cache, list commands
- [x] score, humanize, easier to manager
- [ ] add repository in multi directories

## Installation
```bash
npm install @axetroy/gpmx -g
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
gpmx -h

# print out

  Usage: gpmx <command> [options]


  Commands:

    add|a [options] <repo>            clone repo into local dir
    remove|rm [key]                   remove a repo
    list|ls [key]                     display the all repo
    clean|cl                          clear the cache
    search|sr <key>                   @Deprecated, search repository by a key
    find|fd <key>                     find repository by a key
    relink|rl                         relink the base dir which contain repositories if you delete repository manually
    config|cf <action> [key] [value]  handle the config, read and set
    runtime|rt                        print the program runtime, useful for submit a issue
    import|ip [options] <dir>         register a local repository to GPM

  Git Package Manager, make you manage the repository easier

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

```

### Config

this is a default config, it will be generated in ``~/.gpmx`` by default

```javascript
// ~/.gpmx/gpmx.config.json
{
  "name": "gpmx"
  "base": "gpmx"
}
```

- name: user name
- base: the repositories base dir, all repository will be install in this dir

## Example

```bash
gpmx add https://github.com/zeit/release.git
gpmx add https://github.com/axetroy/gpm.git
gpmx add https://github.com/axetroy/ymli.git

gpmx ls

# print out
github.com: 
  axetroy: 
    gpm:  /home/axetroy/gpmx/github.com/axetroy/gpm
    ymli: /home/axetroy/gpmx/github.com/axetroy/ymli
  zeit: 
    release: /home/axetroy/gpmx/github.com/zeit/release
```

## Uninstall

```bash
npm uninstall @axetroy/gpmx -g
rm -rf ~/.gpmx      # all file, cache, contain in this dir
```

## Contribute

```bash
git clone https://github.com/axetroy/gpm.git
cd ./gpm
yarn
./bin/gpmx
```

You can flow [Contribute Guide](https://github.com/axetroy/gpm/blob/master/contributing.md)

## License

The [MIT License](https://github.com/axetroy/gpm/blob/master/LICENSE)
