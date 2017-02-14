const process = require('process');
const path = require('path');

// 3th lib
const program = require('commander');
const co = require('co');
const colors = require('colors');

const pkg = require(path.join(__dirname, '../package.json'));

function bootstrapWrapper(func) {
  return function () {
    program.__bootstrap__ = true;
    func.apply(this, arguments);
  }
}

process.on('uncaughtException', function (err) {
  process.stderr.write(errToStr(err) + '\n');
  process.exit(1)
});

process.on('exit', function (code) {
  // let msg = `Process exit with Code ${(code + '').yellow}\n`;
  // console.log(msg);
});

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('<command> [options]');

program
  .command('add <repo>')
  .description('clone repo into local dir')
  .action(bootstrapWrapper(function (repo, options) {
    co(require('./command/add')(repo, options))
      .catch(function (err) {
        console.error('ERROR:', err);
      });
  }));

program
  .command('remove')
  .description('remove a repo')
  .action(bootstrapWrapper(function (options) {
    co(require('./command/remove')(options))
      .catch(function (err) {
        console.error(err);
      });
  }));

program
  .command('init')
  .description('init the GPM config, when you install or update, run this command first')
  .action(bootstrapWrapper(function (options) {
    co(require('./command/init')(options))
      .catch(function (err) {
        console.error(err);
      });
  }));

program
  .command('ls')
  .description('display the all repo')
  .action(bootstrapWrapper(function (options) {
    co(require('./command/ls')(options))
      .catch(function (err) {
        console.error(err);
      });
  }));

program
  .command('reset')
  .description('reset the GPM config to default')
  .action(bootstrapWrapper(function (options) {
    co(require('./command/reset')(options))
      .catch(function (err) {
        console.error(err);
      });
  }));

program
  .command('clean')
  .description('clear the cache')
  .action(bootstrapWrapper(function (options) {
    co(require('./command/clean')(options))
      .catch(function (err) {
        console.error(err);
      });
  }));

program.parse(process.argv);

if (!program.args.length || !program.__bootstrap__) program.help();