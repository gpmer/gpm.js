## 命令

```bash
$ gpm list|ls [key]
```

以yaml的格式，输出仓库列表以及对应的仓库路径

## 帮助信息

```bash
$ gpm help list

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm list [key]

   ARGUMENTS

     [key]      filter by the key      optional

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

- **key**: [选填]
    
根据关键字筛选仓库

## 可选项

- -u, --unixify

目录输出格式为unix格式

- -f, --force

强制模式，跳过询问

- --nolog

安静模式，不输入日志

## 例子

#### 输出全部的仓库

```bash
$ gpm list
```

#### 输出与关键字相关的仓库

```bash
$ gpm ls gpm
```