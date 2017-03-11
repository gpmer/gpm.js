const process = require('process');
const path = require('path');

// 3th lib
const program = require('caporal');
const co = require('co');
const inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

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

const FLAGS = {
  unixify: {flag: '-u, --unixify', desc: 'output the path as unix style, useful in Windows Git bash'},
  force: {flag: '-f, --force', desc: 'forced mode, skip the question'}
};

program
  .version(pkg.version)
  .description(pkg.description);

program
  .command('add')
  .alias('a')
  .argument('<repo>', 'git url address')
  .description('add a repository to gpm')
  .option("-n, --name <name>", "custom repository directory name")
  .option("-p, --plugin <plugin>", "run the plugin")
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/add')(argv.repo, options))
      .catch(errorHandler);
  }));

program
  .command('remove')
  .alias('rm')
  .description('Remove a repository from registry and disk')
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/remove')(options))
      .catch(errorHandler);
  }));

program
  .command('list')
  .alias('ls')
  .argument('[key]', 'filter by the key')
  .description('Display the all repositories in registry')
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/list')(argv.key, options))
      .catch(errorHandler);
  }));

program
  .command('clean')
  .alias('cl')
  .description('Clear the cache, usually is ' + config.paths.temp)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/clean')(argv, options))
      .catch(errorHandler);
  }));

program
  .command('find')
  .alias('fd')
  .description('Find repository by a key, You can get all about the repository info')
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/search')(argv, options)).catch(errorHandler);
  }));

program
  .command('relink')
  .alias('rl')
  .description('Relink the base directory and gpm registry, like Angular, trigger the $digest in manual')
  .option("-q, --quiet", "quiet mode, will not print any thing")
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/relink')(argv, options))
      .catch(errorHandler);
  }));

program
  .command('config')
  .alias('cf')
  .argument('<action>', 'action, list')
  .argument('[key]', 'config key')
  .argument('[value]', 'config value')
  .action(function (argv, options) {
    co(require('./command/config')(argv, options))
      .catch(errorHandler);
  });

program
  .command('runtime')
  .alias('rt')
  .description('Print the program runtime, useful for submit issue')
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/runtime')(argv, options))
      .catch(errorHandler);
  }));

program
  .command('import')
  .alias('ip')
  .argument('<div>')
  .description('Import local repository into gpm registry')
  .option("--hard", "hard mode, move the repository directory to gpm base directory instead of link directory by default.")
  .option("--all", "traverse the cwd, find the child dir and import then all to gpm. loop 1 deep dir")
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/import')(argv, options))
      .catch(errorHandler);
  }));

program.parse(process.argv);