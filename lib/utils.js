/**
 * Created by axetroy on 17-2-14.
 */
const path = require('path');
const process = require('process');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const spawn = require('cross-spawn');
const parseGitConfig = require('parse-git-config');
const _ = require('lodash');

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

module.exports = {
  isExistPath,
  isGitRepoDir,
  parseGitConfigAsync,
  isLink,
  isDir,
  unixify,
  normalizePath,
  camelcase
};