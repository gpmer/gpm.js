/**
 * Created by axetroy on 17-2-14.
 */

const _ = require('lodash');
const prettyjson = require('prettyjson');
const Promise = require('bluebird');
const log4js = require('log4js');
const logger = log4js.getLogger('LS');

const config = require('../config');
const {readJsonAsync} = require('../common');

function *ls(options) {
  const lockJSON = yield readJsonAsync(config.paths.lock);

  _.each(lockJSON, function (v1, source) {
    _.each(v1, function (v2, owner) {
      _.each(v2, function (v3, name) {
        lockJSON[source][owner][name] = v3.path;
      });
    });
  });

  if (_.isEmpty(lockJSON)) {
    logger.warn(`You did not add any repository yet, try run command line: ${config.name} add <repo> [options]`);
  } else {
    process.stdout.write(prettyjson.render(lockJSON) + '\n');
  }
}

module.exports = function (options) {
  return ls(options);
};