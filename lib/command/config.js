/**
 * Created by axetroy on 17-2-15.
 */

const path = require('path');
const process = require('process');

const _ = require('lodash');
const prettyjson = require('prettyjson');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const log4js = require('log4js');
const logger = log4js.getLogger('CONFIG');

const config = require('../config');
const {isExistPath} = require('../utils');

function* list(configJSON) {
  process.stdout.write(prettyjson.render(configJSON) + '\n');
}

function* get(key, configJSON) {
  if (!key) return logger.error(`The [key] must be required, please try again: ${(config.name + ' config get [key]').green}`);
  if (!configJSON[key]) return logger.error(`${key.green} field doesn't exist in config file`);

  logger.info(`${key}: ${configJSON[key]}`);
}

function* set(key, value, configJSON) {
  if (!key) return logger.error(`The [key] must be required, please try again: ${(config.name + ` config set ${key} [key]`).green}`);
  if (!value) return logger.error(`The <value> must be required, please try again: ${(config.name + ` config set ${key} <value>`).green}`);

  configJSON[key] = value;

  yield fs.writeJsonAsync(config.paths.config, configJSON);
  yield list(configJSON);
}

function* remove(key, configJSON) {
  if (!key) return logger.error(`The [key] must be required, please try again: ${(config.name + ` config set ${key} [key]`).green}`);

  if (configJSON[key]) configJSON[key] = null;
  delete configJSON[key];
  yield fs.writeJsonAsync(config.paths.config, configJSON);
  yield list(configJSON);
}

function *configHandler(action, key, value, options) {
  const configJSON = yield fs.readJsonAsync(config.paths.config);

  switch (action.toUpperCase()) {
    case 'LIST':
      yield list(configJSON);
      break;
    case 'GET':
      yield get(key, configJSON);
      break;
    case 'SET':
      yield set(key, value, configJSON);
      break;
    case 'DELETE':
      yield remove(key, configJSON);
      break;
    default:
      logger.info(`Flow the command line: ${(config.name + ' config ' + 'list|get|set|delete'.yellow.underline + ' [key] [value]').green}`);
      break;
  }
}

module.exports = function (action, key, value, options) {
  return configHandler(action, key, value, options);
};