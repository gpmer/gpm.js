const process = require('process');
const path = require('path');

// 3th lib
const program = require('commander');
const co = require('co');

const pkg = require(path.join(__dirname, '../package.json'));
const config = require('./config');

function bootstrapWrapper(func) {
  return function () {
    program.__bootstrap__ = true;
    func.apply(this, arguments);
  }
}

function errorHandler(err) {
  if (err) {
    console.error(err);
  }
  process.exit(1);
}

process.on('unhandledRejection', errorHandler);

process.on('uncaughtException', errorHandler);

process.on('warning', (warning) => {
  console.warn(warning.name);    // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack);   // Print the stack trace
});

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('<command> [options]');

program
  .command('add <repo>')
  .alias('a')
  .description('add a repository to gpm')
  .option("-f, --force", "forced add, ignore the question witch ask you replace the old repository or not.")
  .option("-n, --name <name>", "custom repository directory name")
  .action(bootstrapWrapper(function (repo, options) {
    co(require('./command/add')(repo, options))
      .catch(errorHandler);
  }));

program
  .command('remove [key]')
  .alias('rm')
  .description('Remove a repository from registry and disk, optional [key] to filter')
  .action(bootstrapWrapper(function (key, options) {
    co(require('./command/remove')(key, options))
      .catch(errorHandler);
  }));

program
  .command('list [key]')
  .alias('ls')
  .description('Display the all repositories in registry')
  .action(bootstrapWrapper(function (key, options) {
    co(require('./command/list')(key, options))
      .catch(errorHandler);
  }));

program
  .command('clean')
  .alias('cl')
  .description('Clear the cache, usually is ' + config.paths.temp)
  .action(bootstrapWrapper(function (options) {
    co(require('./command/clean')(options))
      .catch(errorHandler);
  }));

program
  .command('search <key>')
  .alias('sr')
  .description('@Deprecated, Search repository by a key, You can get all about the repository info')
  .action(bootstrapWrapper(function (key, options) {
    process.stderr.write('WARNING'.yellow + ':search <key> has beem @Deprecated, Please use find <key> instead. it will be remove in next major version\n');
    co(require('./command/search')(key, options)).catch(errorHandler);
  }));

program
  .command('find <key>')
  .alias('fd')
  .description('Find repository by a key, You can get all about the repository info')
  .action(bootstrapWrapper(function (key, options) {
    co(require('./command/search')(key, options)).catch(errorHandler);
  }));

program
  .command('relink')
  .alias('rl')
  .description('Relink the base directory and gpm registry, like Angular, trigger the $digest in manual')
  .option("-q, --quiet", "quiet mode, will not print any thing")
  .action(bootstrapWrapper(function (key, options) {
    co(require('./command/relink')(key, options))
      .catch(errorHandler);
  }));

program
  .command('config <action> [key] [value]')
  .alias('cf')
  .description('Config　handler, <list|get|set|delete|reset> [key] [value]')
  .action(bootstrapWrapper(function (action, key, value, options) {
    co(require('./command/config')(action, key, value, options))
      .catch(errorHandler);
  }));

program
  .command('runtime')
  .alias('rt')
  .description('Print the program runtime, useful for submit issue')
  .action(bootstrapWrapper(function (options) {
    co(require('./command/runtime')(options))
      .catch(errorHandler);
  }));

program
  .command('import <dir>')
  .alias('ip')
  .description('Import local repository into gpm registry')
  .option("--hard", "hard mode, move the repository directory to gpm base directory instead of link directory by default.")
  .option("--all", "traverse the cwd, find the child dir and import then all to gpm. loop 1 deep dir")
  .option("-f, --force", "forced mode, skip the question that ask you cover the old one or not if the repository has exist in gpm registry")
  .action(bootstrapWrapper(function (dir, options) {
    co(require('./command/import')(dir, options))
      .catch(errorHandler);
  }));

program.parse(process.argv);

if (!program.args.length || !program.__bootstrap__) program.help();