let startTime = new Date();
const program = require('caporal');
program.__start__ && (startTime = program.__start__);

const process = require('process');
const path = require('path');
const EventEmitter = require('events').EventEmitter;

// 3th lib
const co = require('co');
const inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const pkg = require(path.join(__dirname, '../package.json'));
const config = require('./config');

const event = new EventEmitter();

event.on('done', () => {
  if (process.env.GPM_ENV !== 'development') {
    process.stdout.write(`done in ${((new Date() - startTime) / 1000).toFixed(2).green}s\n`);
  }
});

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

process.on('exit', () => event.emit("done"));

process.on('unhandledRejection', errorHandler);

process.on('uncaughtException', errorHandler);

process.on('warning', (warning) => {
  console.warn(warning.name);    // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack);   // Print the stack trace
});

const FLAGS = {
  unixify: {flag: '-u, --unixify', desc: 'Output the path as unix style, useful in Windows Git bash'},
  force: {flag: '-f, --force', desc: 'Forced mode, skip the question'},
  nolog: {flag: '--nolog', desc: 'Don\'t not display any log'}
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
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/add')(argv, options))
      .catch(errorHandler);
  }));

program
  .command('remove')
  .alias('rm')
  .description('Remove a repository from registry and disk')
  .argument('[owner]', 'then repository\'owner')
  .argument('[repo]', 'then repository\'name')
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/remove')(argv, options))
      .catch(errorHandler);
  }));

program
  .command('list')
  .alias('ls')
  .argument('[key]', 'filter by the key')
  .description('Display the all repositories in registry')
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/list')(argv, options))
      .catch(errorHandler);
  }));

program
  .command('clean')
  .alias('cl')
  .description('Clear the cache, usually is ' + config.paths.temp)
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/clean')(argv, options))
      .catch(errorHandler);
  }));

program
  .command('find')
  .alias('fd')
  .description('Find repository by a key, You can get all about the repository info')
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/search')(argv, options))
      .catch(errorHandler);
  }));

program
  .command('relink')
  .alias('rl')
  .description('Relink the base directory and gpm registry, like Angular, trigger the $digest in manual')
  .option("-q, --quiet", "quiet mode, will not print any thing")
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
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
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/config')(argv, options))
      .catch(errorHandler);
  }));

program
  .command('runtime')
  .alias('rt')
  .description('Print the program runtime, useful for submit issue')
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/runtime')(argv, options))
      .catch(errorHandler);
  }));

program
  .command('import')
  .alias('ip')
  .argument('<dir>', 'The directory you want to import')
  .description('Import local repository into gpm registry')
  .option("--hard", "hard mode, move the repository directory to gpm base directory instead of link directory by default.")
  .option("--all", "traverse the cwd, find the child dir and import then all to gpm. loop 1 deep dir")
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/import')(argv, options))
      .catch(errorHandler);
  }));

program
  .command('foreach')
  .alias('fe')
  .argument('<plugin>', 'The plugin you want to run in the loop.')
  .description('Run the plugin in each project. The current work directory is the current project.')
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/foreach')(argv, options))
      .catch(errorHandler);
  }));

program
  .command('plugin')
  .alias('pl')
  .argument('<action>', 'plugin action')
  .argument('[key]', 'query key')
  .description('A series handler of plugin.')
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(bootstrapWrapper(function (argv, options) {
    co(require('./command/plugin')(argv, options))
      .catch(errorHandler);
  }));

program.parse(process.argv);
