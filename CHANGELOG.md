<a name="7.0.0"></a>
# [7.0.0](https://github.com/gpmer/gpm.js/compare/v6.5.2...v7.0.0) (2017-08-29)


### Bug Fixes

* **package:** update console.table to version 0.9.0 ([0cb6f22](https://github.com/gpmer/gpm.js/commit/0cb6f22))
* **package:** update fs-extra to version 4.0.0 ([e9bf9f1](https://github.com/gpmer/gpm.js/commit/e9bf9f1))
* **package:** update log4js to version 2.0.0 ([ff10c28](https://github.com/gpmer/gpm.js/commit/ff10c28))



<a name="6.5.2"></a>
## [6.5.2](https://github.com/gpmer/gpm.js/compare/v6.5.1...v6.5.2) (2017-05-03)


### Bug Fixes

* fix last commit ([2bfcebf](https://github.com/gpmer/gpm.js/commit/2bfcebf))



<a name="6.5.1"></a>
## [6.5.1](https://github.com/gpmer/gpm.js/compare/v6.5.0...v6.5.1) (2017-05-03)



<a name="6.5.0"></a>
# [6.5.0](https://github.com/gpmer/gpm.js/compare/v6.4.0...v6.5.0) (2017-04-04)


### Bug Fixes

* missing quotation marks ([056f227](https://github.com/gpmer/gpm.js/commit/056f227))
* missing quotation marks ([2cde5d2](https://github.com/gpmer/gpm.js/commit/2cde5d2))


### Features

* support i18n command and message ([9574241](https://github.com/gpmer/gpm.js/commit/9574241)), closes [#12](https://github.com/gpmer/gpm.js/issues/12)



<a name="6.4.0"></a>
# [6.4.0](https://github.com/gpmer/gpm.js/compare/v6.3.3...v6.4.0) (2017-03-30)


### Bug Fixes

* missing config command description ([bd7e048](https://github.com/gpmer/gpm.js/commit/bd7e048))
* support plugin in windows ([20fd89e](https://github.com/gpmer/gpm.js/commit/20fd89e)), closes [#11](https://github.com/gpmer/gpm.js/issues/11)


### Features

* command add & find will copy the repo path to your system clipboard if you platform support ([7ef1fa0](https://github.com/gpmer/gpm.js/commit/7ef1fa0))



<a name="6.3.3"></a>
## [6.3.3](https://github.com/gpmer/gpm.js/compare/v6.3.2...v6.3.3) (2017-03-29)


### Bug Fixes

* fix tree command ([4f6a5a5](https://github.com/gpmer/gpm.js/commit/4f6a5a5))
* multiple same repo can be add to registry ([4e9fd83](https://github.com/gpmer/gpm.js/commit/4e9fd83))


### Features

* add --ignore-rc for add command, ignore .gpmrc which you don't trust or you don't run the hooks ([4fa3ed0](https://github.com/gpmer/gpm.js/commit/4fa3ed0))



<a name="6.3.2"></a>
## [6.3.2](https://github.com/gpmer/gpm.js/compare/v6.3.1...v6.3.2) (2017-03-27)


### Bug Fixes

* fix gpm ls command can't filter the key ([07fb70e](https://github.com/gpmer/gpm.js/commit/07fb70e))



<a name="6.3.1"></a>
## [6.3.1](https://github.com/gpmer/gpm.js/compare/v6.3.0...v6.3.1) (2017-03-23)


### Bug Fixes

* the json-toy missing in deps ([f898610](https://github.com/gpmer/gpm.js/commit/f898610))


### Features

* add LICENSE command ([452dcca](https://github.com/gpmer/gpm.js/commit/452dcca))



<a name="6.3.0"></a>
# [6.3.0](https://github.com/gpmer/gpm.js/compare/v6.2.1...v6.3.0) (2017-03-23)


### Bug Fixes

* fix relink loop before check exist or not ([bbee726](https://github.com/gpmer/gpm.js/commit/bbee726))
* run the gpmrc hooks before check it exist or not ([3b9aea5](https://github.com/gpmer/gpm.js/commit/3b9aea5))


### Features

* add tree command ([ae21cb6](https://github.com/gpmer/gpm.js/commit/ae21cb6))
* config need to check gpm upgrade or not in global config ~/.gpm/gpm.config.json ([66abd4e](https://github.com/gpmer/gpm.js/commit/66abd4e))
* print the time during this command ([9283593](https://github.com/gpmer/gpm.js/commit/9283593))



<a name="6.2.1"></a>
## [6.2.1](https://github.com/gpmer/gpm.js/compare/v6.2.0...v6.2.1) (2017-03-21)


### Bug Fixes

* fix gpmrc hook can't run multiple command line. ([efeac96](https://github.com/gpmer/gpm.js/commit/efeac96))



<a name="6.2.0"></a>
# [6.2.0](https://github.com/gpmer/gpm.js/compare/v6.1.3...v6.2.0) (2017-03-18)


### Features

* support .gpmrc config file in repo ([30850c0](https://github.com/gpmer/gpm.js/commit/30850c0))



<a name="6.1.3"></a>
## [6.1.3](https://github.com/gpmer/gpm.js/compare/v6.1.2...v6.1.3) (2017-03-17)


### Bug Fixes

* node command should be git.. ([4d4e24b](https://github.com/gpmer/gpm.js/commit/4d4e24b))



<a name="6.1.2"></a>
## [6.1.2](https://github.com/gpmer/gpm.js/compare/v6.1.1...v6.1.2) (2017-03-17)



<a name="6.1.1"></a>
## [6.1.1](https://github.com/gpmer/gpm.js/compare/v6.1.0...v6.1.1) (2017-03-17)


### Code Refactoring

* rename [gpm config delete <key>] to [gpm config remove <key>] ([71f6c1e](https://github.com/gpmer/gpm.js/commit/71f6c1e))


### Features

* add plugin command ([8adf931](https://github.com/gpmer/gpm.js/commit/8adf931))


### BREAKING CHANGES

* use gpm config remove <key> instead gpm config delete <key>



<a name="6.1.0"></a>
# [6.1.0](https://github.com/gpmer/gpm.js/compare/v6.0.0...v6.1.0) (2017-03-14)


### Bug Fixes

* fix then plugin's name is invalid, will throw an error. it should not ([3ca743b](https://github.com/gpmer/gpm.js/commit/3ca743b))


### Features

* add foreach command ([f55a05d](https://github.com/gpmer/gpm.js/commit/f55a05d))
* add plugin a method to load all plugin ([d38c612](https://github.com/gpmer/gpm.js/commit/d38c612))
* gpm remove, now can specify which one you  want to remove, required repo's owner & name ([b85df6e](https://github.com/gpmer/gpm.js/commit/b85df6e))



<a name="6.0.0"></a>
# [6.0.0](https://github.com/gpmer/gpm.js/compare/v5.4.1...v6.0.0) (2017-03-12)


### Bug Fixes

* compatible with last Caporal.js ([2de90c5](https://github.com/gpmer/gpm.js/commit/2de90c5))
* fix some command argv are invalid ([2805ed8](https://github.com/gpmer/gpm.js/commit/2805ed8))
* fix the child_process don't set the process env, command will fail in test ([d4f6a1e](https://github.com/gpmer/gpm.js/commit/d4f6a1e))
* fix type ([feb10c6](https://github.com/gpmer/gpm.js/commit/feb10c6))


### Features

* add global flag to config command ([b5f4094](https://github.com/gpmer/gpm.js/commit/b5f4094))
* all command add --unixify, --force, --nolog ([0d2dc77](https://github.com/gpmer/gpm.js/commit/0d2dc77))
* all command add -u, --unixify flag to parse path to unix style, useful in Windows Git Bash. invalid in Power Shell. ([ee2dec7](https://github.com/gpmer/gpm.js/commit/ee2dec7))
* dep on robotjs, now it will auto type cd to dist dir once add success ([b62add7](https://github.com/gpmer/gpm.js/commit/b62add7))
* support unix style path in Window Git bash with -u, --unixify flag ([94f1e2f](https://github.com/gpmer/gpm.js/commit/94f1e2f))


### Reverts

* remove the esc-exit, not compatible with windows ([5399d24](https://github.com/gpmer/gpm.js/commit/5399d24))


### BREAKING CHANGES

* Before: gpm relink --quiet

After: gpm relink --nolog



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



