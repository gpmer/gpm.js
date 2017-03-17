## 命令

```bash
$ gpm import|ip  [options] <dir>
```

导入那些没有通过gpm安装的仓库

## 帮助信息

```bash
$ gpm help import

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm import <dir>

   ARGUMENTS

     <dir>      The directory you want to import      required

   OPTIONS

     --hard             hard mode, move the repository directory to gpm base directory instead of link directory by default.      optional
     --all              traverse the cwd, find the child dir and import then all to gpm. loop 1 deep dir                          optional
     -u, --unixify      Output the path as unix style, useful in Windows Git bash                                                 optional
     -f, --force        Forced mode, skip the question                                                                            optional
     --nolog            Don't not display any log                                                                                 optional

   GLOBAL OPTIONS

     -h, --help         Display help
     -V, --version      Display version
     --no-color         Disable colors
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages
```

## 参数

- **dir**: <必填>
    
要导入的仓库路径,可以是相对路径，也可以是绝对路径

## 可选项

- -u, --unixify

目录输出格式为unix格式

- -f, --force

强制模式，跳过询问

- --nolog

安静模式，不输入日志

- --hard

硬导入，直接把要导入的目录，移动到对应的目录。默认是创建一个软链接，指向要导入的目录

- --all

如果设置，则在dir中，遍历其子目录，将所有git仓库导入

## 例子

#### 导入一个仓库

```bash
$ gpm import ./angular
```

#### 强制导入一个仓库

```bash
$ gpm import ./angular -f
```

#### 把仓库移动到gpm对应的目录中

```bash
$ gpm import ./angular -hard
```

#### 导入一群仓库

```bash
$ gpm import ./project --all
```

project目录下的仓库，都会被导入，忽略掉不是仓库的目录。

判断条件是目录中是否有**.git**文件夹，并且能够被正确解析