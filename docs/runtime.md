## Command

```bash
$ gpm runtime|rt
```

output the runtime info, useful to submit a issue

## Help Information

```bash

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm runtime

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

## Options

- -u, --unixify

Output the path as unix style, useful in Windows Git bash

- -f, --force

Forced mode, skip the question

- --nolog

Don't not display any log

## Example

#### output the runtime info

```bash
$ gpm runtime

node:     v6.10.0
gpm:      5.3.1
arch:     x64
os:       Windows_NT 10.0.14393
platform: win32

```