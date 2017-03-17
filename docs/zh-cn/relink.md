## 命令

```bash
$ gpm relink|rl [options]
```

重新链接仓库，一般用于

1. 手动删除仓库(不通过gpm删除)，导致gpm存储的信息没更新
2. 版本升级不兼容, 用于输出升级的提示或者警告

## 帮助信息

```bash
$ gpm help relink

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm relink

   OPTIONS

     -q, --quiet        quiet mode, will not print any thing                           optional
     -u, --unixify      Output the path as unix style, useful in Windows Git bash      optional
     -f, --force        Forced mode, skip the question                                 optional
     --nolog            Don't not display any log                                      optional

   GLOBAL OPTIONS

     -h, --help         Display help
     -V, --version      Display version
     --no-color         Disable colors
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages
```

## 可选参数

## 可选项

- -u, --unixify

目录输出格式为unix格式

- -f, --force

强制模式，跳过询问

- --nolog

安静模式，不输入日志

## 例子

#### 重新链接仓库

```bash
$ gpm relink
```