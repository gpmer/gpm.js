/**
 * Created by axetroy on 17-2-14.
 */
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const spawn = require('cross-spawn');
const ora = require('ora');
const confirm = require('confirm-simple');

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

function confirmMsg(msg) {
  return new Promise(function (resolve, reject) {
    confirm(msg, function (ok) {
      ok ? resolve(true) : resolve(false);
    })
  });
}

module.exports = {
  isExistPath,
  spawnShell,
  confirmMsg
};