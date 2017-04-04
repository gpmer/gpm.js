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
const __ = require('i18n').__;

const config = require('../config');
const globalConfig = require('../global-config');

function* configHandler(argv, options) {
  const { action, key, value } = argv;
  let output = void 0;

  switch (action.toUpperCase()) {
    case 'LIST':
      output = globalConfig.entity;
      !options.nolog &&
        process.stdout.write(prettyjson.render(globalConfig.entity) + '\n');
      break;
    case 'GET':
      if (!key)
        return !options.nolog &&
          logger.error(__('commands.config.log.require_key'));
      output = globalConfig.get(key);
      !options.nolog && logger.info(`${key}: ${output}`);
      break;
    case 'SET':
      if (!key)
        return !options.nolog &&
          logger.error(__('commands.config.log.require_key'));
      if (!value)
        return !options.nolog &&
          logger.error(__('commands.config.log.require_val'));
      output = yield globalConfig.set(key, value);
      !options.nolog &&
        process.stdout.write(prettyjson.render(globalConfig.entity) + '\n');
      break;
    case 'REMOVE':
      if (!key)
        return !options.nolog &&
          logger.error(__('commands.config.log.require_key'));
      output = yield globalConfig.remove(key);
      !options.nolog &&
        process.stdout.write(prettyjson.render(globalConfig.entity) + '\n');
      break;
    case 'RESET':
      output = yield globalConfig.reset();
      !options.nolog && logger.info(__('commands.config.log.info_reset'));
      !options.nolog &&
        process.stdout.write(prettyjson.render(globalConfig.entity) + '\n');
      break;
    default:
      !options.nolog &&
        logger.info(
          __('commands.config.log.help', {
            cmd: (config.name +
              ' config ' +
              'list|get|set|remove|reset'.yellow.underline +
              ' [key] [value]').green
          })
        );
      break;
  }
  return output;
}

module.exports = function(argv = {}, options = {}) {
  return co.wrap(configHandler)(argv, options);
};
