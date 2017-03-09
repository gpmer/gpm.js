## 命令

```bash
$ gpm list|ls [key]
```

以yaml的格式，输出仓库列表以及对应的仓库路径

## 参数

- **list|ls**: <必填>

- **key**: [选填]
    
    > 根据关键字筛选仓库

## 例子

#### 输出全部的仓库

```bash
$ gpm list
```

#### 输出与关键字相关的仓库

```bash
$ gpm ls gpm
```