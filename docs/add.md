## Command

```bash
$ gpm add|a [options] <repo>
```

## Usage

```bash
$ gpm help add

   gpm 6.1.0 - Git Package Manager, make you manage the repository easier

   USAGE

     gpm add <repo>

   ARGUMENTS

     <repo>      git url address      required

   OPTIONS

     -n, --name <name>          custom repository directory name                               optional
     -p, --plugin <plugin>      run the plugin                                                 optional
     -u, --unixify              Output the path as unix style, useful in Windows Git bash      optional
     -f, --force                Forced mode, skip the question                                 optional
     --nolog                    Don't not display any log                                      optional

   GLOBAL OPTIONS

     -h, --help         Display help
     -V, --version      Display version
     --no-color         Disable colors
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages
```

## Arguments

- **add|a**: <required>

git repository url，support https，https proto && github, gitlab etc

## Options

- -n, --name <name>

custom repository directory name，so you can add multi repository from same git url
    
- -p, --plugin <plugin>

run the plugin after add repo
    
- -f, --force

forced add, ignore the question witch ask you replace the old repository or not.

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