## 命令

```bash
$ gpm runtime|rt
```

输出运行环境，用于提交issue

## 帮助信息

```bash

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm runtime

   OPTIONS

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

## 可选项

- -u, --unixify

目录输出格式为unix格式

- -f, --force

强制模式，跳过询问

- --nolog

安静模式，不输入日志

## 例子

#### 输出运行环境

```bash
$ gpm runtime

node:     v6.10.0
gpm:      5.3.1
arch:     x64
os:       Windows_NT 10.0.14393
platform: win32

```