## Command

```bash
$ gpm plugin|pl
```

A series handler of plugin.

## Help Information

```bash

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm plugin <action> [key]

   ARGUMENTS

     <action>      plugin action      required
     [key]         query key          optional

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

- **action**: required

plugin action, one of list|remove

- **key**: required

query key

## Options

- -u, --unixify

Output the path as unix style, useful in Windows Git bash

- -f, --force

Forced mode, skip the question

- --nolog

Don't not display any log

## Example

```bash
$ gpm plugin list
```

```bash
$ gpm plugin remove npmi
```