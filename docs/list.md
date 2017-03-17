## Command

```bash
$ gpm list|ls [key]
```

print repositories list with yaml format

## Help Information

```bash
$ gpm help list

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm list [key]

   ARGUMENTS

     [key]      filter by the key      optional

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

- **key**: [optional]
    
filter by a key word

## Options

- -u, --unixify

Output the path as unix style, useful in Windows Git bash

- -f, --force

Forced mode, skip the question

- --nolog

Don't not display any log

## Example

#### output the all repositories

```bash
$ gpm list
```

#### output the repositories filter by a key word

```bash
$ gpm ls gpm
```