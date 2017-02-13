const process = require('process');
const path = require('path');

// 3th lib
const program = require('commander');
const Promise = require('bluebird');
const gitUrlParse = require("git-url-parse");
const fs = Promise.promisifyAll(require('fs-extra'));
const spawn = require('cross-spawn');
const co = require('co');
const ora = require('ora');
const colors = require('colors');
const confirm = require('confirm-simple');
const argv = require('yargs').argv;
const _ = require('lodash');
const prettyjson = require('prettyjson');

const pkg = require(path.join(__dirname, '../package.json'));
const config = require('./config');

const defaultConfig = require(path.join(__dirname, '../default-config.json'));
const lockFile = path.join(config.paths.root, 'lock.json');

program
  .version(pkg.version)
  .usage('<command> [options]')
  .description(pkg.description);

program
  .command('add <repo>')
  .description('clone repo into local dir')
  .action(function (repo, options) {
    co(function*() {
      const gitInfo = gitUrlParse(repo);
      const hasExistConfig = yield isExistPath(config.paths.config);
      if (!hasExistConfig) {
        throw 'You need run command line: [gpm init] to init the program';
      }

      const gpmConfig = yield fs.readJSONAsync(config.paths.config);

      const tempDir = path.join(config.paths.temp, gitInfo.name);
      const baseDir = path.join(process.env.HOME, gpmConfig.base);
      const sourceDir = path.join(baseDir, gitInfo.source);
      const ownerDir = path.join(sourceDir, gitInfo.owner);
      const repoDir = path.join(ownerDir, gitInfo.name);

      const isExistRepoDir = yield isExistPath(repoDir);

      if (!isExistRepoDir) {

      } else {
        const wantReplace = yield confirmMsg(`Are you want to replace ${repoDir.yellow.underline}`.white);
        // ask replace with this new repo or not
        if (wantReplace) {
          yield fs.removeAsync(repoDir);
        } else {
          console.log('Ok, Good by!');
          process.exit(1);
        }
      }

      yield fs.ensureDirAsync(baseDir);
      yield fs.ensureDirAsync(config.paths.temp);
      yield fs.removeAsync(tempDir);
      yield fs.ensureDirAsync(sourceDir);
      yield fs.ensureDirAsync(ownerDir);
      // yield fs.ensureFileAsync(lockFile);

      yield spawnShell('git', ['clone', gitInfo.href], {cwd: config.paths.temp});

      const isExistLockFile = yield isExistPath(lockFile);
      if (!isExistLockFile) yield fs.writeJSONAsync(lockFile, {});

      yield fs.moveAsync(tempDir, repoDir);

      // write in the lock
      const repoLock = {
        [gitInfo.source]: {
          [gitInfo.owner]: {
            [gitInfo.name]: {
              path: repoDir,
              href: gitInfo.href
            }
          }
        }
      };
      let lockJSON = yield fs.readJSONAsync(lockFile);
      _.merge(lockJSON, repoLock);
      yield fs.writeJSONAsync(lockFile, lockJSON);

      console.log(`SUCCESS: repo has been add to ${repoDir.green.underline} [CTRL+V]`);
    }).catch(function (err) {
      console.error('ERROR:', err);
    });
  });

program
  .command('remove <repo>')
  .description('remove a repo')
  .action(function (options) {

  });

program
  .command('init')
  .description('init the GPM config')
  .action(function (options) {
    co(function *() {
      yield fs.ensureDirAsync(config.paths.root);
      const hasExistConfig = yield isExistPath(config.paths.config);

      if (!hasExistConfig) {
        yield fs.writeJSONAsync(config.paths.config, require(config.paths.defaultConfig));
      }

      const gpmConfig = yield fs.readJSONAsync(config.paths.config);

      console.log(`Init done: ${config.paths.config.green.underline}`);
    }).catch(function (err) {
      console.error(err);
    });
  });

program
  .command('ls')
  .description('display the all repo')
  .action(function (options) {
    co(function *() {
      const isExistLockFile = yield isExistPath(lockFile);
      if (!isExistLockFile) yield fs.writeJSONAsync(lockFile, {});
      const lockJSON = yield fs.readJSONAsync(lockFile);
      console.log(prettyjson.render(lockJSON));
    }).catch(function (err) {
      console.error(err);
    })
  });

program
  .command('reset')
  .description('reset the GPM config to default')
  .action(function (options) {
    co(function *() {
      yield fs.ensureDirAsync(config.paths.root);
      const hasExistConfig = yield isExistPath(config.paths.config);
      if (!hasExistConfig) {
        throw 'You need run command line: [gpm init] to init the program';
      }

      yield fs.writeJSONAsync(config.paths.config, defaultConfig);
      console.log(`Has reset the default config`);
    }).catch(function (err) {
      console.error(err);
    })
  });

function spawnShell(commander, argv, config) {
  return new Promise(function (resolve, reject) {
    let data = '';

    let child = spawn(commander, argv, config);

    const spinner = ora(`Exec command ${(commander + ' ' + argv.join(' ')).underline.green}\n`).start();
    spinner.color = 'blue';
    spinner.text = 'Pulling the repo...';

    child.on('error', reject);

    child.on('exit', code => {
      spinner.stop();
      code === 0 ? resolve(data) : reject();
    });

  });
}

function confirmMsg(msg) {
  return new Promise(function (resolve, reject) {
    confirm(msg, function (ok) {
      ok ? resolve(true) : resolve(false);
    })
  });
}

function* isExistPath(dir) {
  return yield fs.statAsync(dir)
    .then(() => Promise.resolve(true))
    .catch(() => Promise.resolve(false));
}

program.parse(process.argv);

if (!program.args.length) program.help();