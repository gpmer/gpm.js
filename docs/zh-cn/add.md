## 命令

```bash
$ gpm add|a [options] <repo>
```

## 使用

```bash
$ gpm help add

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm add <repo>

   ARGUMENTS

     <repo>      git url address      required

   OPTIONS

     -n, --name <name>          custom repository directory name                               optional
     -p, --plugin <plugin>      run the plugin                                                 optional
     -u, --unixify              Output the path as unix style, useful in Windows Git bash      optional
     -f, --force                Forced mode, skip the question                                 optional
     --nolog                    Don't not display any log                                      optional

   GLOBAL OPTIONS

     -h, --help         Display help
     -V, --version      Display version
     --no-color         Disable colors
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages
```

## 参数

- **add|a**: <必填>

git仓库地址，支持https，https协议，支持github, gitlab等

## 可选项

- -n, --name <name>

自定义目录名，这样可以允许你添加多个相同源的仓库

- -p, --plugin <plugin>

在添加仓库之后运行相应的插件
    
- -f, --force

强制添加，不会询问你是否要覆盖旧仓库，如果旧仓库存在的话


## 例子

#### 简单的添加

最终生成地址: **$BASE/github.com/gpmer/gpm.js**

```bash
$ gpm add https://github.com/gpmer/gpm.js.git
```

#### 自定义目录

最终生成地址: **$BASE/github.com/gpmer/my-gpm**

```bash
$ gpm add https://github.com/gpmer/gpm.js.git -n my-gpm
```