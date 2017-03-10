/**
 * Created by axetroy on 17-2-14.
 */
const path = require('path');
const process = require('process');
const os = require('os');

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const spawn = require('cross-spawn');
const ora = require('ora');
const parseGitConfig = require('parse-git-config');

function isExistPath(dir) {
  return fs.statAsync(dir)
    .then(() => Promise.resolve(true))
    .catch(() => Promise.resolve(false));
}

function spawnShell(commander, argv, config) {
  return new Promise(function (resolve, reject) {
    let data = '';
    let error = '';

    let child = spawn(commander, argv, config);

    const spinner = ora(`Pulling the Repository...`).start();
    spinner.color = 'blue';

    child.stdout.on('data', function (buf) {
      data += buf;
    });

    child.stderr.on('data', function (err) {
      error += err;
    });

    child.on('error', err => {
      reject(err instanceof Error ? err : new Error(err));
      process.exit(1);
    });

    child.on('exit', (code, signal) => {
      spinner.stop();
      code === 0 ? resolve(data) : reject(new Error(`${error ? error + '\n' : ''}Error Code: ${(code + '').green}, Exist Signal: ${(signal + '').yellow}`));
    });

  });
}

function isGitRepoDir(dir) {
  return isExistPath(path.join(dir, '.git'));
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

function isDir(path) {
  return fs.readdirAsync(path)
    .then(() => Promise.resolve(true))
    .catch(err => Promise.resolve(false));
}

function unixify(path) {
  return require('unixify')(path);
}

module.exports = {
  isExistPath,
  isGitRepoDir,
  spawnShell,
  parseGitConfigAsync,
  isLink,
  isDir,
  unixify,
  isWindows: os.type() === 'Windows_NT',
  isLinux: os.type() === 'Linux',
  isOSX: os.type() === 'Darwin'
};