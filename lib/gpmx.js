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

process.on('uncaughtException', function (err) {
  console.log(err);
});

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('<command> [options]');

program
  .command('add <repo>')
  .alias('a')
  .description('clone repo into local dir')
  .action(bootstrapWrapper(function (repo, options) {
    co(require('./command/add')(repo, options))
      .catch(function (err) {
        console.error('ERROR:', err);
      });
  }));

program
  .command('remove')
  .alias('rm')
  .description('remove a repo')
  .action(bootstrapWrapper(function (options) {
    co(require('./command/remove')(options))
      .catch(function (err) {
        console.error(err);
      });
  }));

program
  .command('list')
  .alias('ls')
  .description('display the all repo')
  .action(bootstrapWrapper(function (options) {
    co(require('./command/list')(options))
      .catch(function (err) {
        console.error(err);
      });
  }));

program
  .command('clean')
  .alias('cl')
  .description('clear the cache')
  .action(bootstrapWrapper(function (options) {
    co(require('./command/clean')(options))
      .catch(function (err) {
        console.error(err);
      });
  }));

program
  .command('search <key>')
  .alias('sr')
  .description('search repository witch add by gpm')
  .action(bootstrapWrapper(function (key, options) {
    co(require('./command/search')(key, options))
      .catch(function (err) {
        console.error(err);
      });
  }));

program
  .command('relink')
  .alias('rl')
  .description('relink the base dir which contain repositories if you delete repository manually')
  .action(bootstrapWrapper(function (key, options) {
    co(require('./command/relink')(key, options))
      .catch(function (err) {
        console.error(err);
      });
  }));

program
  .command('config <action> [key] [value]')
  .alias('cf')
  .description('handle the config, read and set')
  .action(bootstrapWrapper(function (action, key, value, options) {
    co(require('./command/config')(action, key, value, options))
      .catch(function (err) {
        console.error(err);
      });
  }));

program
  .command('runtime')
  .alias('rt')
  .description('print the program runtime, useful for submit a issue')
  .action(bootstrapWrapper(function (options) {
    co(require('./command/runtime')(options))
      .catch(function (err) {
        console.error(err);
      });
  }));

program
  .command('import <dir>')
  .alias('ip')
  .description('register a local repository to GPM')
  .option("--hard", "import the repository in hard mode, it will move the repository into GPM container not just link")
  .action(bootstrapWrapper(function (dir, options) {
    co(require('./command/import')(dir, options))
      .catch(function (err) {
        console.error(err);
      });
  }));

program.parse(process.argv);

if (!program.args.length || !program.__bootstrap__) program.help();