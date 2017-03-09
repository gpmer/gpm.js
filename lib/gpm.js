const process = require('process');
const path = require('path');

// 3th lib
const program = require('commander');
const co = require('co');

const pkg = require(path.join(__dirname, '../package.json'));

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
  .description('clone repo into local dir')
  .option("-f, --force", "forced add, ignore the question witch ask you replace the old repository or not.")
  .option("-n, --name <name>", "custom repository directory name")
  .action(bootstrapWrapper(function (repo, options) {
    co(require('./command/add')(repo, options))
      .catch(errorHandler);
  }));

program
  .command('remove [key]')
  .alias('rm')
  .description('remove a repo')
  .action(bootstrapWrapper(function (key, options) {
    co(require('./command/remove')(key, options))
      .catch(errorHandler);
  }));

program
  .command('list [key]')
  .alias('ls')
  .description('display the all repo')
  .action(bootstrapWrapper(function (key, options) {
    co(require('./command/list')(key, options))
      .catch(errorHandler);
  }));

program
  .command('clean')
  .alias('cl')
  .description('clear the cache')
  .action(bootstrapWrapper(function (options) {
    co(require('./command/clean')(options))
      .catch(errorHandler);
  }));

program
  .command('search <key>')
  .alias('sr')
  .description('@Deprecated, search repository by a key')
  .action(bootstrapWrapper(function (key, options) {
    co(require('./command/search')(key, options)).catch(errorHandler);
  }));

program
  .command('find <key>')
  .alias('fd')
  .description('find repository by a key')
  .action(bootstrapWrapper(function (key, options) {
    co(require('./command/search')(key, options)).catch(errorHandler);
  }));

program
  .command('relink')
  .alias('rl')
  .description('relink the base dir which contain repositories if you delete repository manually')
  .option("-q, --quiet", "quiet mode, will not print any thing")
  .action(bootstrapWrapper(function (key, options) {
    co(require('./command/relink')(key, options))
      .catch(errorHandler);
  }));

program
  .command('config <action> [key] [value]')
  .alias('cf')
  .description('handle the config, read and set')
  .action(bootstrapWrapper(function (action, key, value, options) {
    co(require('./command/config')(action, key, value, options))
      .catch(errorHandler);
  }));

program
  .command('runtime')
  .alias('rt')
  .description('print the program runtime, useful for submit a issue')
  .action(bootstrapWrapper(function (options) {
    co(require('./command/runtime')(options))
      .catch(errorHandler);
  }));

program
  .command('import <dir>')
  .alias('ip')
  .description('register a local repository to GPM')
  .option("--hard", "import the repository in hard mode, it will move the repository into GPM container not just link")
  .option("--all", "import all the repositories in the current directory into GPM")
  .option("-f, --force", "forced import, that mean you don't care the replace the old dir or not, just do it.")
  .action(bootstrapWrapper(function (dir, options) {
    co(require('./command/import')(dir, options))
      .catch(errorHandler);
  }));

program.parse(process.argv);

if (!program.args.length || !program.__bootstrap__) program.help();