const process = require('process');
const path = require('path');

// 3th lib
const program = require('commander');
const co = require('co');
const colors = require('colors');

const pkg = require(path.join(__dirname, '../package.json'));

program
  .version(pkg.version)
  .usage('<command> [options]')
  .description(pkg.description);

program
  .command('add <repo>')
  .description('clone repo into local dir')
  .action(function (repo, options) {
    co(require('./command/add')(repo, options))
      .catch(function (err) {
      console.error('ERROR:', err);
    });
  });

program
  .command('remove <repo>')
  .description('remove a repo')
  .action(function (options) {
    co(require('./command/remove')())
      .catch(function (err) {
        console.error(err);
      })
  });

program
  .command('init')
  .description('init the GPM config')
  .action(function (options) {
    co(require('./command/init')(options))
      .catch(function (err) {
        console.error(err);
      });
  });

program
  .command('ls')
  .description('display the all repo')
  .action(function (options) {
    co(require('./command/ls')(options))
      .catch(function (err) {
        console.error(err);
      });
  });

program
  .command('reset')
  .description('reset the GPM config to default')
  .action(function (options) {
    co(require('./command/reset')(options))
      .catch(function (err) {
        console.error(err);
      });
  });

program.parse(process.argv);

if (!program.args.length) program.help();