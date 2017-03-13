/**
 * Created by axetroy on 17-2-14.
 */
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const log4js = require('log4js');
const co = require('co');
const config = require('../config');
const logger = log4js.getLogger('CLEAN');

function* clean(argv, options) {
  yield fs.emptyDirAsync(config.paths.temp);
  // auto generate file again
  yield require('./relink')({}, {nolog: options.nolog});
  !options.nolog && logger.info(`clean ${config.paths.temp.green.underline} success`);
}

module.exports = function (argv = {}, options = {}) {
  return co.wrap(clean)(argv, options);
};
