/**
 * Created by axetroy on 17-2-14.
 */
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const spawn = require('cross-spawn');
const ora = require('ora');
const _ = require('lodash');

function isExistPath(dir) {
  return fs.statAsync(dir)
    .then(() => Promise.resolve(true))
    .catch(() => Promise.resolve(false));
}

function spawnShell(commander, argv, config) {
  return new Promise(function (resolve, reject) {
    let data = '';

    let child = spawn(commander, argv, config);

    const spinner = ora(`Pulling the Repository...`).start();
    spinner.color = 'blue';

    child.on('error', reject);

    child.on('exit', code => {
      spinner.stop();
      code === 0 ? resolve(data) : reject();
    });

  });
}

function isGitRepoDir(dir) {
  return isExistPath(path.join(dir, '.git'));
}

function ensureReadJson(file) {
  return fs.ensureFileAsync(file)
    .then(function () {
      return fs.readJsonAsync(file)
        .then(function (data) {
          if (_.isPlainObject(data)) {
            return Promise.resolve();
          } else {
            return fs.writeJsonAsync(file, {});
          }
        })
        .catch(function () {
          return fs.writeJsonAsync(file, {});
        });
    })
    .then(() => fs.readJsonAsync(file));
}

module.exports = {
  isExistPath,
  isGitRepoDir,
  spawnShell,
  ensureReadJson
};