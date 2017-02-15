# gpmx

Git Package Manager, make you manage the project easier

## Features

- [x] support Github, gitlab, etc
- [x] add, remove, clean, cache, list commands
- [x] score, humanize, easier to manager
- [ ] add repository in multi directories

## Installation
```bash
npm install @axetroy/gpmx -g
```

## Usage

```bash
gpmx -h

# print out

  Usage: gpmx <command> [options]


  Commands:

    add|a <repo>                      clone repo into local dir
    remove|rm                         remove a repo
    list|ls                           display the all repo
    reset|rs                          reset the GPM config to default
    clean|cl                          clear the cache
    search|sr <key>                   search repository witch add by gpm
    relink|rl                         relink the base dir which contain repositories if you delete repository manually
    config|cf <action> [key] [value]  handle the config, read and set
    runtime|rt                        print the program runtime, useful for submit a issue

  Git Package Manager, make you manage the repository easier

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

```

### Config

this is a default config, it will be generated in ``~/.gpmx`` by default

```javascript
// ~/.gpmx/gpmx.config.json
const config = {
  "name": "gpmx",   // user name
  "base": "gpmx"    // the repositories base dir, all repository will be install in this dir
}
```

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

## Contribute

Welcome every PR.

```bash
git clone https://github.com/axetroy/gpm.git
cd ./gpm
yarn
./bin/gpmx
```

## License

The [MIT License](https://github.com/axetroy/gpm/blob/master/LICENSE)
