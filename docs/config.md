## Command

```bash
$ gpm config|cf <action> [key] [value]
```

handle the global config

you can edit by yourself(NOT RECOMMENDED)，config file locate at ``$HOME/.gpm/gpm.config.json``

global config field:

- name: Reserved，nothing use at now, default：gpm
- base: gpm root path，all the directory will install in this path。relative to **$HOME**, default:gpm
- version: current version, useful to upgrade gpm and give you some tip or warning

## Arguments

- **clean|cl**: <required>

- **action**: [optional]
    - list: output the all config
    - get: get the key's value of the config
    - set: set a key with a value, [value] is required
    - delete: delete a key of the config
    - reset: reset to default config

- **key**: [optional]
    > the key of config
    
- **value**: [optional]
    > only require when set config

## Example

#### get the all config

```bash
$ gpm config list

name: gpm
version: xxx
base: gpm
```

#### get config

```bash
$ gpm config get base

gpm
```

#### set config

set gpm base directory to **$HOME/dev**

```bash
$ gpm config set base dev
```

#### reset to default config

```bash
$ gpm config reset

name: gpm
version: xxx
base: gpm
```