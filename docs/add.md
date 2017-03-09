## Command

```bash
$ gpm add|a [options] <repo>
```

## Arguments

- **add|a**: <required>

- **options**: [optional]
    > -h, --help         output usage information
    
    > -f, --force        forced add, ignore the question witch ask you replace the old repository or not.
    
    > -n, --name <name>  custom repository directory name，so you can add multi repository from same git url
- **repo**: <required>
    
    > git repository url，support https，https proto && github, gitlab etc

## Example

#### add a repository

final dist: **$BASE/github.com/gpmer/gpm.js**

```bash
$ gpm add https://github.com/gpmer/gpm.js.git
```

#### custom dist

final dist: **$BASE/github.com/gpmer/my-gpm**

```bash
$ gpm add https://github.com/gpmer/gpm.js.git -n my-gpm
```