## 命令

```bash
$ gpm config|cf <action> [key] [value]
```

操作全局配置

也可以手动更改(不建议)，配置文件在 ``$HOME/.gpm/gpm.config.json``

全局配置字段:

- name: 预留，暂时没有其他用处, 默认值：gpm
- base: gpm仓库的根目录，所有的仓库都会放在这个目录下。相对路径，相对于**$HOME**目录, 默认值:gpm
- version: 当前使用的版本，用于对比线上版本，更新版本之后的一些提示

## 参数

- **clean|cl**: <必填>

- **action**: [选填]
    - list: 输出配置
    - get: 获取配置，需要指定key
    - set: 设置配置，需要指定key和对应的value
    - delete: 删除配置, 需要指定key
    - reset: 重置回默认配置

- **key**: [选填]
    > 配置中的key
    
- **value**: [选填]
    > 只有设置的时候才用填写value

## 例子

#### 输出配置

```bash
$ gpm config list

name: gpm
version: xxx
base: gpm
```

#### 获取配置

```bash
$ gpm config get base

gpm
```

#### 设置配置

设置gpm的根目录至**$HOME/dev**

```bash
$ gpm config set base dev
```

#### 重置配置

```bash
$ gpm config reset

name: gpm
version: xxx
base: gpm
```