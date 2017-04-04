/**
 * Created by axetroy on 17-2-14.
 */

const path = require('path');
const process = require('process');
const co = require('co');

const _ = require('lodash');
const prettyjson = require('prettyjson');
const log4js = require('log4js');
const __ = require('i18n').__;
const jt = require('json-toy');

const logger = log4js.getLogger('LIST');
const config = require('../config');
const { normalizePath } = require('../utils');
const registry = require('../registry');
const globalConfig = require('../global-config');

function* ls(key, options) {
  if (registry.isEmpty)
    return logger.warn(__('commands.list.log.warn_empty_registry'));

  let repositories = key ? registry.find(key) : registry.repositories.slice();

  if (_.isEmpty(repositories)) return logger.info(__('commands.list.log.err_not_found'));

  const result = registry.toJson(null, options);

  const basePath = path.join(
    config.paths.home,
    globalConfig.entity.base || config.defaults.base
  );

  const ROOT = normalizePath(basePath, options);

  !options.nolog &&
    process.stdout.write(
      jt.treeString(result, {
        space: 4,
        vSpace: 0,
        valueOut: false,
        rootName: normalizePath(ROOT, options)
      }) + '\n'
    );
  return result;
}

module.exports = function(argv = {}, options = {}) {
  return co.wrap(ls)(argv.key, options);
};
