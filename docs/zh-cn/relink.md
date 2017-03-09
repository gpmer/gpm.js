## 命令

```bash
$ gpm relink|rl [options]
```

重新链接仓库，一般用于

1. 手动删除仓库(不通过gpm删除)，导致gpm存储的信息没更新
2. 版本升级不兼容, 用于输出升级的提示或者警告

## 参数

- **relink|rl**: <必填>

- **options**: [选填]
    > -h, --help         输出帮助信息
    
    > -q, --quiet        安静模式，不会输出任何信息

## 例子

#### 重新链接仓库

```bash
$ gpm relink
```