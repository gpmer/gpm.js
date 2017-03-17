## 命令

```bash
$ gpm clean|cl [options]
```

清除缓存，同时会触发一次[relink](/zh-cn/relink)

## 帮助信息

```bash
$ gpm help clean

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm clean

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

#### 清除缓存

```bash
$ gpm clean
```