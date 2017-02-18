/**
 * Created by axetroy on 17-2-14.
 */

const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const prettyjson = require('prettyjson');
const log4js = require('log4js');
const logger = log4js.getLogger('LS');

const config = require('../config');

function *ls(options) {
  const lockJSON = yield fs.readJsonAsync(config.paths.lock);
  lockJSON.repos = lockJSON.repos || [];

  if (_.isEmpty(lockJSON.repos)) {
    logger.warn(`You did not add any repository yet, try run command line: ${config.name} add <repo> [options]`);
  } else {
    const result = {};
    lockJSON.repos.forEach(function (repo) {
      result[repo.source] = result[repo.source] || {};
      result[repo.source][repo.owner] = result[repo.source][repo.owner] || {};
      result[repo.source][repo.owner][repo.name] = repo.path.yellow;
    });
    process.stdout.write(prettyjson.render(result) + '\n');
  }
}

module.exports = function (options) {
  return ls(options);
};