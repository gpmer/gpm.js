## Command

```bash
$ gpm import|ip  [options] <dir>
```

import the repository which not add via gpm

## Help Information

```bash
$ gpm help import

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm import <dir>

   ARGUMENTS

     <dir>      The directory you want to import      required

   OPTIONS

     --hard             hard mode, move the repository directory to gpm base directory instead of link directory by default.      optional
     --all              traverse the cwd, find the child dir and import then all to gpm. loop 1 deep dir                          optional
     -u, --unixify      Output the path as unix style, useful in Windows Git bash                                                 optional
     -f, --force        Forced mode, skip the question                                                                            optional
     --nolog            Don't not display any log                                                                                 optional

   GLOBAL OPTIONS

     -h, --help         Display help
     -V, --version      Display version
     --no-color         Disable colors
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages
```

## Arguments

- **dir**: required
    
The path of the repository to be imported can be a relative path or an absolute path
    
## Options

- -u, --unixify

Output the path as unix style, useful in Windows Git bash

- -f, --force

Forced mode, skip the question

- --nolog

Don't not display any log

- --hard

hard mode, move the repository directory to gpm base directory instead of link directory by default.

- --all

traverse the cwd, find the child dir and import then all to gpm. loop 1 deep dir

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