# gpmx

Git Package Manager, make you manage the project easier

## Features

- [ ] Support Github, gitlab, etc
- [ ] add, remove, clean, cache, list
- [ ] score, humanize, easier to manager
- [x] add repository in multi directories

## Usage

```bash
npm install @axetroy/gpmx -g

gpmx init # init the program first

gpmx -h

# print out

  Usage: gpmx <command> [options]


  Commands:

    add|a <repo>  clone repo into local dir
    remove|rm     remove a repo
    init|i        init the GPM config, when you install or update, run this command first
    list|ls       display the all repo
    reset|rs      reset the GPM config to default
    clean|cl      clear the cache

  Git Package Manager, make you manage the repository easier

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

```

### Config

this is a default config, it will be generated in ``~/.gpmx`` by default

```javascript
const config = {
  "name": "gpmx",   // user name
  "base": "gpmx"    // the repositories base dir, all repository will be install in this dir
}
```

## Example

```bash
gpmx add https://github.com/zeit/release.git
gpmx add https://github.com/axetroy/gpm.git

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

The MIT License (MIT)

Copyright (c) 2017 axetroy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
