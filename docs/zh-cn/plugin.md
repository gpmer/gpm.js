## 命令

```bash
$ gpm plugin|pl
```

关于插件的一系列操作

## 帮助信息

```bash

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm plugin <action> [key]

   ARGUMENTS

     <action>      plugin action      required
     [key]         query key          optional

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

## 参数

- **action**: required

插件的action，list|remove 中的一个值

- **key**: required

查询的key

## 可选项

- -u, --unixify

目录输出格式为unix格式

- -f, --force

强制模式，跳过询问

- --nolog

安静模式，不输入日志

## 例子

```bash
$ gpm plugin list
```

```bash
$ gpm plugin remove npmi
```