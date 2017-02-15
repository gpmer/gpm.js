/**
 * Created by axetroy on 17-2-14.
 */
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const spawn = require('cross-spawn');
const ora = require('ora');
const _ = require('lodash');
const parseGitConfig = require('parse-git-config');

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

function parseGitConfigAsync(options) {
  return new Promise(function (resolve, reject) {
    parseGitConfig(options, function (err, config) {
      if (err) return reject(err);
      return resolve(config);
    })
  })
}

function isLink(path) {
  return fs.readlinkAsync(path)
    .then(() => Promise.resolve(true))
    .catch(err => Promise.resolve(false));
}

module.exports = {
  isExistPath,
  isGitRepoDir,
  spawnShell,
  ensureReadJson,
  parseGitConfigAsync,
  isLink
};