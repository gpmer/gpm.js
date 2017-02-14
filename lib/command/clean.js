/**
 * Created by axetroy on 17-2-14.
 */
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const config = require('../config');
const log4js = require('log4js');
const logger = log4js.getLogger('CLEAN');

function* clean(options) {
  yield fs.emptyDirAsync(config.paths.temp);
  logger.info(`clean ${config.paths.temp.green.underline} success`);
}

module.exports = function (options) {
  return clean(options);
};
