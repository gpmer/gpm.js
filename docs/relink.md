## Command

```bash
$ gpm relink|rl [options]
```

relink the repositories, used in:
1. remove the repository manually(not via gpm), which make gpm can't update the registry info at time
2. have breaking change with new version. useful to show some upgrade tip or warning

## Arguments

- **relink|rl**: <required>

- **options**: [optional]
    > -h, --help         output usage information
    
    > -q, --quiet        quiet mode, will not print any thing

## Example

#### relink the repositories

```bash
$ gpm relink
```