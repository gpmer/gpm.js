## 命令

```bash
$ gpm add|a [options] <repo>
```

## 参数

- **add|a**: <必填>

- **options**: [选填]
    > -h, --help         输出帮助信息
    
    > -f, --force        强制添加，不会询问你是否要覆盖旧仓库，如果旧仓库存在的话
    
    > -n, --name <name>  自定义目录名，这样可以允许你添加多个相同源的仓库
- **repo**: <必填>
    
    > git仓库地址，支持https，https协议，支持github, gitlab等

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