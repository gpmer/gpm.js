/**
 * Created by axetroy on 17-2-14.
 */

const path = require('path');
const process = require('process');
const co = require('co');

const _ = require('lodash');
const prettyjson = require('prettyjson');
const log4js = require('log4js');

const logger = log4js.getLogger('LIST');
const config = require('../config');
const {normalizePath} = require('../utils');
const registry = require('../registry');

function *ls(key, options) {

  if (registry.isEmpty)return logger.warn(`You did not add any repository yet, try run command line: ${config.name} add <repo> [options]`);

  let repositories = key ? registry.find(key) : registry.repositories.slice();

  if (_.isEmpty(repositories)) return logger.info('Not Found');

  const result = registry.toJson(repositories, _.extend({color: true}, options));

  const basePath = path.join(config.paths.home, config.defaults.base);

  const ROOT = normalizePath(basePath, options).white;

  !options.nolog && process.stdout.write(prettyjson.render({
      [ROOT]: result
    }) + '\n');
  return result;
}

module.exports = function (argv = {}, options = {}) {
  return co.wrap(ls)(argv.key, options);
};
