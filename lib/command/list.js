/**
 * Created by axetroy on 17-2-14.
 */

const path = require('path');
const process = require('process');

const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const prettyjson = require('prettyjson');
const log4js = require('log4js');
const fuzzy = require('fuzzy');

const logger = log4js.getLogger('LIST');
const config = require('../config');

function *ls(key, options) {
  const lockJSON = yield fs.readJsonAsync(config.paths.lock);
  lockJSON.repos = lockJSON.repos || [];

  if (_.isEmpty(lockJSON.repos)) {
    logger.warn(`You did not add any repository yet, try run command line: ${config.name} add <repo> [options]`);
  } else {
    const result = {};

    let repos = lockJSON.repos;

    if (key) {
      const searchResult = fuzzy
        .filter(key, repos.map(repo => repo.owner + '/' + repo.name))
        .map(v => v.string);
      repos = repos.filter((repo) => _.includes(searchResult, repo.owner + '/' + repo.name));
    }

    if (_.isEmpty(repos)) {
      logger.info('Not Found');
      return;
    }

    repos.forEach(function (repo) {
      result[repo.source.red] = result[repo.source.red] || {};
      result[repo.source.red][repo.owner.yellow] = result[repo.source.red][repo.owner.yellow] || {};
      result[repo.source.red][repo.owner.yellow][repo.name.green] = repo.path.white;
    });
    process.stdout.write(prettyjson.render({
        [path.join(config.paths.home, config.defaults.base).white]: result
      }) + '\n\n');
  }
}

module.exports = function (key, options) {
  return ls(key, options);
};