## Command

```bash
$ gpm import|ip  [options] <dir>
```

import the repository which not add via gpm

## Arguments

- **list|ls**: <required>

- **options**: [optional]
    > -h, --help         output usage information
    
    > --hard             hard mode, move the repository directory to gpm base directory instead of link directory by default.
    
    > --all              traverse the cwd, find the child dir and import then all to gpm. loop 1 deep dir
    
    > -f, --force        forced mode, skip the question that ask you cover the old one or not if the repository has exist in gpm registry

- **dir**: <required>
    
    > The path of the repository to be imported can be a relative path or an absolute path

## Example

#### import a repository

```bash
$ gpm import ./angular
```

#### import a repository with forced mode

```bash
$ gpm import ./angular -f
```

#### move repository directory to the gpm registry

```bash
$ gpm import ./angular -hard
```

#### import repositories

```bash
$ gpm import ./project --all
```

Project directory of the repository, will be imported, ignoring the directory is not a repository.

The judgment condition is whether the directory has a git ** folder and can be parsed correctly