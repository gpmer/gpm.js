## Command

```bash
$ gpm find|fn <key>
```

search repository by a key and print the info about this

## Help Information

```bash
$ gpm help find

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm find

   OPTIONS

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

## Arguments

- **key**: required
    
the key you want to search

## Options

- -u, --unixify

Output the path as unix style, useful in Windows Git bash

- -f, --force

Forced mode, skip the question

- --nolog

Don't not display any log

## Example

#### search repository with a key "gpm"

```bash
$ gpm find gpm
```