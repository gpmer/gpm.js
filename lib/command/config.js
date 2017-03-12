/**
 * Created by axetroy on 17-2-15.
 */

const path = require('path');
const process = require('process');

const co = require('co');
const prettyjson = require('prettyjson');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const log4js = require('log4js');
const logger = log4js.getLogger('CONFIG');

const config = require('../config');

let __options__ = {};

function* list(configJSON) {
  !__options__.nolog && process.stdout.write(prettyjson.render(configJSON) + '\n');
  return configJSON;
}

function* get(key, configJSON) {
  if (!key && !__options__.nolog) {
    !__options__.nolog && logger.error(`The [key] must be required, please try again: ${(config.name + ' config get [key]').green}`);
    return;
  }
  if (!configJSON[key]) {
    !__options__.nolog && logger.error(`${key.green} field doesn't exist in config file`);
    return;
  }

  const value = (configJSON[key]).trim();
  !__options__.nolog && logger.info(`${key}: ${value}`);
  return value;
}

function* set(key, value, configJSON) {
  if (!key) return !__options__.nolog && logger.error(`The [key] must be required, please try again: ${(config.name + ` config set ${key} [key]`).green}`);
  if (!value) return !__options__.nolog && logger.error(`The <value> must be required, please try again: ${(config.name + ` config set ${key} <value>`).green}`);

  configJSON[key] = value;

  yield fs.writeJsonAsync(config.paths.config, configJSON);
  yield list(configJSON);
  return value;
}

function* remove(key, configJSON) {
  if (!key) return !__options__.nolog && logger.error(`The [key] must be required, please try again: ${(config.name + ` config set ${key} [key]`).green}`);

  if (configJSON[key]) configJSON[key] = null;
  delete configJSON[key];
  yield fs.writeJsonAsync(config.paths.config, configJSON);
  yield list(configJSON);
  return {[key]: configJSON[key]};
}

function *configHandler(argv, options) {
  const {action, key, value} = argv;
  const configJSON = yield fs.readJsonAsync(config.paths.config);
  let output = void 0;

  switch (action.toUpperCase()) {
    case 'LIST':
      output = yield list(configJSON);
      break;
    case 'GET':
      output = yield get(key, configJSON);
      break;
    case 'SET':
      output = yield set(key, value, configJSON);
      break;
    case 'DELETE':
      output = yield remove(key, configJSON);
      break;
    case 'RESET':
      yield fs.writeJsonAsync(config.paths.config, config.defaults);
      !__options__.nolog && logger.info(`Has reset the config to default`);
      !__options__.nolog && process.stdout.write(prettyjson.render(config.defaults) + '\n');
      output = config.defaults;
      break;
    default:
      !__options__.nolog && logger.info(`Flow the command line: ${(config.name + ' config ' + 'list|get|set|delete|reset'.yellow.underline + ' [key] [value]').green}`);
      break;
  }
  return output;
}

module.exports = function (argv = {}, options = {}) {
  __options__ = options;
  return co.wrap(configHandler)(argv, options);
};