/**
 * Created by axetroy on 17-2-14.
 */
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const config = require('../config');
const log4js = require('log4js');
const logger = log4js.getLogger('CLEAN');

function* clean(argv, options) {
  yield fs.emptyDirAsync(config.paths.temp);
  // auto generate file again
  yield require('./relink')({quiet: true});
  logger.info(`clean ${config.paths.temp.green.underline} success`);
}

module.exports = function (argv, options) {
  return clean(argv, options);
};
