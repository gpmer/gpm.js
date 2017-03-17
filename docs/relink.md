## Command

```bash
$ gpm relink|rl [options]
```

relink the repositories, used in:
1. remove the repository manually(not via gpm), which make gpm can't update the registry info at time
2. have breaking change with new version. useful to show some upgrade tip or warning

## Help Information

```bash
$ gpm help relink

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm relink

   OPTIONS

     -q, --quiet        quiet mode, will not print any thing                           optional
     -u, --unixify      Output the path as unix style, useful in Windows Git bash      optional
     -f, --force        Forced mode, skip the question                                 optional
     --nolog            Don't not display any log                                      optional

   GLOBAL OPTIONS

     -h, --help         Display help
     -V, --version      Display version
     --no-color         Disable colors
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages
```

## Options

- -u, --unixify

Output the path as unix style, useful in Windows Git bash

- -f, --force

Forced mode, skip the question

- --nolog

Don't not display any log

## Example

#### relink the repositories

```bash
$ gpm relink
```