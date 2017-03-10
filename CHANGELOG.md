<a name="5.4.1"></a>
## [5.4.1](https://github.com/gpmer/gpm.js/compare/v5.4.0...v5.4.1) (2017-03-10)


### Bug Fixes

* will register many time when install from a same repo ([b401128](https://github.com/gpmer/gpm.js/commit/b401128))



<a name="5.4.0"></a>
# [5.4.0](https://github.com/gpmer/gpm.js/compare/v5.3.1...v5.4.0) (2017-03-10)


### Features

* support the plugin for add command, other command coming soon. plugin name with 'gpm-plugin-${name}', use it with -p, --plugin flag ([926514e](https://github.com/gpmer/gpm.js/commit/926514e))



<a name="5.3.1"></a>
## [5.3.1](https://github.com/gpmer/gpm.js/compare/v5.3.0...v5.3.1) (2017-03-09)


### Bug Fixes

* fix can't registry multi repo with diff name ([eff0789](https://github.com/gpmer/gpm.js/commit/eff0789))


### Features

* record the gpm version in config ([315e12f](https://github.com/gpmer/gpm.js/commit/315e12f))



<a name="5.3.0"></a>
# [5.3.0](https://github.com/gpmer/gpm.js/compare/v5.3.0-0...v5.3.0) (2017-03-09)


### Bug Fixes

* after clean temp cache, will auto run relink command ([6b79729](https://github.com/gpmer/gpm.js/commit/6b79729))



<a name="5.3.0-0"></a>
# [5.3.0-0](https://github.com/gpmer/gpm.js/compare/v5.2.1...v5.3.0-0) (2017-03-09)


### Features

* **BC:** make data persist base on node-persist. ([5941265](https://github.com/gpmer/gpm.js/commit/5941265))
* add a options for quite mode ([286d3db](https://github.com/gpmer/gpm.js/commit/286d3db))



<a name="5.2.1"></a>
## [5.2.1](https://github.com/gpmer/gpm.js/compare/v5.2.0...v5.2.1) (2017-03-09)


### Features

* add an option the custom the repo dir when run command add ([60875f2](https://github.com/gpmer/gpm.js/commit/60875f2))



<a name="5.2.0"></a>
# [5.2.0](https://github.com/gpmer/gpm.js/compare/v5.1.9...v5.2.0) (2017-03-09)


### Features

* support show list/remove by a valid key, search owner and repo name. & refactor some code ([5a6aa2e](https://github.com/gpmer/gpm.js/commit/5a6aa2e))



<a name="5.1.9"></a>
## [5.1.9](https://github.com/gpmer/gpm.js/compare/v5.1.8...v5.1.9) (2017-03-02)


### Bug Fixes

* fix run link command, if there are one dir isn't git repo, then it will return not continue loop next one. ([896d541](https://github.com/gpmer/gpm.js/commit/896d541))



<a name="5.1.8"></a>
## [5.1.8](https://github.com/gpmer/gpm.js/compare/v5.1.7...v5.1.8) (2017-03-02)


### Bug Fixes

* fix run link command, if there are one dir isn't git repo, then it will return not continue loop next one. ([f116d0e](https://github.com/gpmer/gpm.js/commit/f116d0e))



<a name="5.1.7"></a>
## [5.1.7](https://github.com/gpmer/gpm.js/compare/v5.1.6...v5.1.7) (2017-02-28)


### Bug Fixes

* fix check git env in $PATH, it's not invalid in linux and macOS ([ba4ecc6](https://github.com/gpmer/gpm.js/commit/ba4ecc6))



<a name="5.1.6"></a>
## [5.1.6](https://github.com/gpmer/gpm.js/compare/v5.1.5...v5.1.6) (2017-02-27)



<a name="5.1.5"></a>
## [5.1.5](https://github.com/gpmer/gpm.js/compare/v5.1.4...v5.1.5) (2017-02-26)


### Bug Fixes

* fix remove command in window platform ([77313ca](https://github.com/gpmer/gpm.js/commit/77313ca))



<a name="5.1.4"></a>
## [5.1.4](https://github.com/gpmer/gpm.js/compare/v5.1.3...v5.1.4) (2017-02-26)


### Bug Fixes

* can't found home path from process.env.home in window platform ([f9f7f05](https://github.com/gpmer/gpm.js/commit/f9f7f05))



<a name="5.1.3"></a>
## [5.1.3](https://github.com/gpmer/gpm.js/compare/v5.1.2...v5.1.3) (2017-02-26)


### Bug Fixes

* can't found home path from process.env.home in window platform ([a5eb5dc](https://github.com/gpmer/gpm.js/commit/a5eb5dc))



<a name="5.1.2"></a>
## [5.1.2](https://github.com/gpmer/gpm.js/compare/v5.1.1...v5.1.2) (2017-02-26)


### Bug Fixes

* can't found home path from process.env.home in window platform ([6f3fb3b](https://github.com/gpmer/gpm.js/commit/6f3fb3b))



<a name="5.1.1"></a>
## [5.1.1](https://github.com/gpmer/gpm.js/compare/v5.1.0...v5.1.1) (2017-02-26)


### Bug Fixes

* fix the root dir is not '.gpmx' ([44acced](https://github.com/gpmer/gpm.js/commit/44acced))
* **relink:** check the path is a dir or a file when loop the base dir ([0c9c76b](https://github.com/gpmer/gpm.js/commit/0c9c76b))


### Features

* ignore the vscode config ([2e51d54](https://github.com/gpmer/gpm.js/commit/2e51d54))



<a name="5.1.0"></a>
# [5.1.0](https://github.com/gpmer/gpm.js/compare/v5.0.2...v5.1.0) (2017-02-25)


### Bug Fixes

* fix can't get home dir in window platform ([4bb41de](https://github.com/gpmer/gpm.js/commit/4bb41de))
* fix some bugs in window platform ([12b79ac](https://github.com/gpmer/gpm.js/commit/12b79ac))
* make sure has install git before run command ([8ca6f27](https://github.com/gpmer/gpm.js/commit/8ca6f27))



<a name="5.0.2"></a>
## [5.0.2](https://github.com/gpmer/gpm.js/compare/v5.0.1...v5.0.2) (2017-02-18)


### Features

* **add:** add [gpmx add -f] options to skip to question ([ec883d3](https://github.com/gpmer/gpm.js/commit/ec883d3))



<a name="5.0.1"></a>
## [5.0.1](https://github.com/gpmer/gpm.js/compare/v5.0.0...v5.0.1) (2017-02-16)


### Bug Fixes

* **relink:** fix it will recover the other config before ([2e069f0](https://github.com/gpmer/gpm.js/commit/2e069f0))



<a name="5.0.0"></a>
# [5.0.0](https://github.com/gpmer/gpm.js/compare/v4.3.0...v5.0.0) (2017-02-16)



<a name="4.3.0"></a>
# [4.3.0](https://github.com/gpmer/gpm.js/compare/v4.2.0...v4.3.0) (2017-02-16)


### Features

* **import:** add [gpmx import] -f --all support ([b678710](https://github.com/gpmer/gpm.js/commit/b678710))



<a name="4.2.0"></a>
# [4.2.0](https://github.com/gpmer/gpm.js/compare/v4.1.0...v4.2.0) (2017-02-15)


### Features

* support gpmx import --hard ([b60b044](https://github.com/gpmer/gpm.js/commit/b60b044))



<a name="4.1.0"></a>
# [4.1.0](https://github.com/gpmer/gpm.js/compare/v4.0.1...v4.1.0) (2017-02-15)


### Bug Fixes

* **relink:** if delete repository manually, run relink can't remove it ([895c588](https://github.com/gpmer/gpm.js/commit/895c588))


### Features

* add [gpmx import <path>] to import repositories thoes was been clone ([eda4f6d](https://github.com/gpmer/gpm.js/commit/eda4f6d))
* init [gpmx import xxx] command ([a3f764d](https://github.com/gpmer/gpm.js/commit/a3f764d))



<a name="4.0.1"></a>
## [4.0.1](https://github.com/gpmer/gpm.js/compare/v4.0.0...v4.0.1) (2017-02-15)



<a name="4.0.0"></a>
# [4.0.0](https://github.com/gpmer/gpm.js/compare/v3.3.0...v4.0.0) (2017-02-15)



<a name="3.3.0"></a>
# [3.3.0](https://github.com/gpmer/gpm.js/compare/v3.2.0...v3.3.0) (2017-02-15)


### Features

* add a new command [gpmx runtime], print the current runtime in ternimal, useful for issue ([7c41d7b](https://github.com/gpmer/gpm.js/commit/7c41d7b))



<a name="3.2.0"></a>
# [3.2.0](https://github.com/gpmer/gpm.js/compare/3.2.0...v3.2.0) (2017-02-15)


### Bug Fixes

* make sure the colors has load in global, it can be use in any files ([4deb290](https://github.com/gpmer/gpm.js/commit/4deb290))


### Features

* complete the the relink command ([aeb1177](https://github.com/gpmer/gpm.js/commit/aeb1177))
* fix check-update warn info ([2944cc5](https://github.com/gpmer/gpm.js/commit/2944cc5))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/gpmer/gpm.js/compare/3.1.0...v3.1.0) (2017-02-15)


### Bug Fixes

* ensure lock json ([f6cf49c](https://github.com/gpmer/gpm.js/commit/f6cf49c))
* lock json err in add command ([e41a56e](https://github.com/gpmer/gpm.js/commit/e41a56e))
* make sure the lock file has been init ([27f4bd9](https://github.com/gpmer/gpm.js/commit/27f4bd9))


### Features

* add gpmx config command to handle the config file ([c911691](https://github.com/gpmer/gpm.js/commit/c911691))
* checkout new version before run command ([4238cd3](https://github.com/gpmer/gpm.js/commit/4238cd3))
* set timeout when checkout the new version ([cb5782a](https://github.com/gpmer/gpm.js/commit/cb5782a))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/gpmer/gpm.js/compare/3.0.1...v3.0.1) (2017-02-14)



<a name="3.0.0"></a>
# [3.0.0](https://github.com/gpmer/gpm.js/compare/3.0.0...v3.0.0) (2017-02-14)


### Features

* init the command link(todo) ([466ce73](https://github.com/gpmer/gpm.js/commit/466ce73))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/gpmer/gpm.js/compare/2.1.0...v2.1.0) (2017-02-14)


### Bug Fixes

* fix the search function name ([85ee702](https://github.com/gpmer/gpm.js/commit/85ee702))


### Features

* check the latest version before run command ([8060f8d](https://github.com/gpmer/gpm.js/commit/8060f8d))
* init the search command(todo) ([d9ff876](https://github.com/gpmer/gpm.js/commit/d9ff876))
* now can search repository by gpmx search <key> ([2a66b7c](https://github.com/gpmer/gpm.js/commit/2a66b7c))



<a name="2.0.5"></a>
## [2.0.5](https://github.com/gpmer/gpm.js/compare/2.0.5...v2.0.5) (2017-02-14)



<a name="2.0.4"></a>
## [2.0.4](https://github.com/gpmer/gpm.js/compare/2.0.4...v2.0.4) (2017-02-14)



<a name="2.0.3"></a>
## [2.0.3](https://github.com/gpmer/gpm.js/compare/2.0.3...v2.0.3) (2017-02-14)



<a name="2.0.2"></a>
## [2.0.2](https://github.com/gpmer/gpm.js/compare/2.0.2...v2.0.2) (2017-02-14)



<a name="2.0.1"></a>
## [2.0.1](https://github.com/gpmer/gpm.js/compare/2.0.1...v2.0.1) (2017-02-14)



<a name="2.0.0"></a>
# [2.0.0](https://github.com/gpmer/gpm.js/compare/2.0.0...v2.0.0) (2017-02-14)


### Features

* support gpmx clean ([93edb6c](https://github.com/gpmer/gpm.js/commit/93edb6c))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/gpmer/gpm.js/compare/1.0.0...1.0.1) (2017-02-13)



<a name="1.0.0"></a>
# 1.0.0 (2017-02-13)



