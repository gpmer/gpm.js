/**
 * Created by axetroy on 17-2-14.
 */
const path = require('path');
const process = require('process');
const Promise = require('bluebird');
const co = require('co');
const fs = Promise.promisifyAll(require('fs-extra'));
const spawn = require('cross-spawn');
const parseGitConfig = require('parse-git-config');
const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('UTILS');

function isExistPath(dir) {
  return fs.statAsync(dir)
    .then(() => Promise.resolve(true))
    .catch(() => Promise.resolve(false));
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
  return '/' + path
      .replace(/^\/+/g, '').replace(/^[A-Z]/, function (match, index, input) {
        return match.toLowerCase();
      })
      .replace(/\:/, '')
      .replace(/\\/g, '/');
}

function normalizePath(path, options) {
  return (options || {}).unixify ? unixify(path) : path;
}

function camelcase(flag) {
  return flag.split('-').reduce(function (str, word) {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

function spawnShell(command, argv = [], options = {}) {
  const cmd = spawn(command, argv, _.extend({env: process.env, cwd: process.cwd(), stdio: 'inherit'}, options));
  return new Promise(function (resolve, reject) {
    cmd.on('close', (code, signal) => {
      code === 0 ? resolve() : reject(new Error(`<${(command + ' ' + argv.join(' ')).red}> Error Code: ${code}, Exist Signal: ${signal}`));
    });
  });
}

function runShell(cmd, options) {
  const cmds = cmd.split(/\&\&/);
  return co(function *() {
    while (cmds.length) {
      let cmd = cmds.shift();
      const _cmd = cmd.split(/\&/).map(v => v.trim());
      while (_cmd.length) {
        let __cmd = _cmd.shift();
        __cmd = __cmd.split(/\s+/).map(v => v.trim()).filter(v => !!v);
        let command = __cmd.shift().trim();
        let argv = __cmd || [];
        let full_command = command + ' ' + argv.join(' ');
        logger.debug(`Running Command ${full_command.yellow}`);
        yield spawnShell(command, argv, options);
      }
    }
  }).catch(err => Promise.reject(err));
}

module.exports = {
  isExistPath,
  isGitRepoDir,
  parseGitConfigAsync,
  isLink,
  isDir,
  unixify,
  normalizePath,
  camelcase,
  runShell,
  spawnShell
};