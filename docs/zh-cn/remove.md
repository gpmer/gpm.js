## 命令

```bash
$ gpm remove|rm [key]
```

执行命令并不会马上删除，因为不知道你要删除什么。

所以执行上面的命令，会输出一个列表，选择要删除的仓库

## 帮助信息

```bash
$ gpm help remove

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm remove [owner] [repo]

   ARGUMENTS

     [owner]      then repository'owner      optional
     [repo]       then repository'name       optional

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

- **owner**: [选填]
    
要移除的仓库的拥有者

- **repo**: [选填]
    
要移除的仓库名称

## 可选项

- -u, --unixify

目录输出格式为unix格式

- -f, --force

强制模式，跳过询问

- --nolog

安静模式，不输入日志

## 例子

#### 简单的删除

```bash
$ gpm remove
```

#### 根据关键字删除

```bash
$ gpm remove gpm
```