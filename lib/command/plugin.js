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

function* configHandler(argv, options) {
  const { action, key } = argv;
  let output = void 0;

  switch (action.toUpperCase()) {
    case 'LIST':
      plugin.list();
      break;
    case 'REMOVE':
      if (!key)
        return !options.nolog &&
          logger.error(
            `The [key] must be required, please try again: ${(config.name + ` config set ${key} [key]`).green}`
          );
      yield plugin.remove(key);
      break;
    default:
      !options.nolog &&
        logger.info(
          `Flow the command line: ${(config.name + ' plugin ' + 'list|delete'.yellow.underline + ' [key]').green}`
        );
      break;
  }
  return output;
}

module.exports = function(argv = {}, options = {}) {
  return co.wrap(configHandler)(argv, options);
};
