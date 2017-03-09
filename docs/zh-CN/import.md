## 命令

```bash
$ gpm import|ip  [options] <dir>
```

导入那些没有通过gpm安装的仓库

## 参数

- **list|ls**: <必填>

- **options**: [选填]
    > -h, --help         输出帮助信息
    
    > --hard             硬导入，直接把要导入的目录，移动到对应的目录。默认是创建一个软链接，指向要导入的目录
    
    > --all              如果设置，则在dir中，遍历其子目录，将所有git仓库导入
    
    > -f, --force        强制导入，遇到已存在的仓库，不用询问，直接覆盖。默认会询问是否覆盖

- **dir**: <必填>
    
    > 要导入的仓库路径,可以是相对路径，也可以是绝对路径

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