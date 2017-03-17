/**
 * Created by axetroy on 2017/3/18.
 */

const path = require('path');
const process = require('process');
const spawn = require('cross-spawn');

const _ = require('lodash');
const co = require('co');
const prettyjson = require('prettyjson');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const log4js = require('log4js');
const logger = log4js.getLogger('CONFIG');

const config = require('../config');
const plugin = require('../plugin');
const {spawnShell} = require('../utils');

const $ = plugin.pluginLoader();

let __options__ = {};

function* list() {
  _.each($, name => {
    process.stdout.write(name + '\n');
  });
}

function* remove(key) {
  if (!key) return !__options__.nolog && logger.error(`The [key] must be required, please try again: ${(config.name + ` config set ${key} [key]`).green}`);

  const uninstall = spawn('npm', ['uninstall', `gpm-plugin-${key}`], {stdio: 'inherit'});

  uninstall.on('close', (code, signal) => {
    if (code !== 0) {
      throw new Error(`Error Code: ${code}, Exist Signal: ${signal}`);
    }
  });
}

function *configHandler(argv, options) {
  const {action, key} = argv;
  let output = void 0;

  switch (action.toUpperCase()) {
    case 'LIST':
      output = yield list();
      break;
    case 'REMOVE':
      output = yield remove(key);
      break;
    default:
      !__options__.nolog && logger.info(`Flow the command line: ${(config.name + ' plugin ' + 'list|delete'.yellow.underline + ' [key]').green}`);
      break;
  }
  return output;
}

module.exports = function (argv = {}, options = {}) {
  __options__ = options;
  return co.wrap(configHandler)(argv, options);
};