## Command

```bash
$ gpm remove|rm [key]
```

execute the command line will not delete repository immediately, cause i don't know what you want to delete

it will print a repository list, then you choose one which you want to delete

## Help Information

```bash
$ gpm help remove

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm remove [owner] [repo]

   ARGUMENTS

     [owner]      then repository'owner      optional
     [repo]       then repository'name       optional

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

- **owner**: [optional]
    
the repo's owner you want to remove

- **repo**: [optional]
    
the repo's name you want to remove

## Options

- -u, --unixify

Output the path as unix style, useful in Windows Git bash

- -f, --force

Forced mode, skip the question

- --nolog

Don't not display any log

## Example

#### remove a repository

```bash
$ gpm remove
```

#### remove a repository filter by a key word

```bash
$ gpm remove gpm
```