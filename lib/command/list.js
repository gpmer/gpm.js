/**
 * Created by axetroy on 17-2-14.
 */

const path = require('path');
const process = require('process');
const os = require('os');

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
      result[repo.source.red] = result[repo.source.red] || {};
      result[repo.source.red][repo.owner.yellow] = result[repo.source.red][repo.owner.yellow] || {};
      result[repo.source.red][repo.owner.yellow][repo.name.green] = repo.path.white;
    });
    process.stdout.write(prettyjson.render({
        [path.join(os.homedir(), config.defaults.base).white]: result
      }) + '\n\n');
    console.log(`Repository Source`.red);
    console.log(`Repository Owner`.yellow);
    console.log(`Repository Name`.green);
  }
}

module.exports = function (options) {
  return ls(options);
};