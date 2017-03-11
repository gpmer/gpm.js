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
const storage = require('node-persist');

const logger = log4js.getLogger('LIST');
const config = require('../config');
const {normalizePath} = require('../utils');

function *ls(key, options) {
  let repositories = (yield storage.getItem('repositories')) || [];

  if (_.isEmpty(repositories))return logger.warn(`You did not add any repository yet, try run command line: ${config.name} add <repo> [options]`);
  const result = {};

  if (key) {
    const searchResult = fuzzy
      .filter(key, repositories.map(repo => repo.owner + '/' + repo.name))
      .map(v => v.string);
    repositories = repositories.filter((repo) => _.includes(searchResult, repo.owner + '/' + repo.name));
  }

  if (_.isEmpty(repositories)) return logger.info('Not Found');

  while (repositories.length) {
    const repo = repositories.shift();
    const source = result[repo.source.red] = result[repo.source.red] || {};
    const owner = source[repo.owner.yellow] = source[repo.owner.yellow] || {};
    const project = owner[repo.name.green];
    if (!_.isEmpty(project)) {
      if (_.isString(project)) {
        owner[repo.name.green] = [project].concat(normalizePath(repo.path, options).white);
      } else if (_.isArray(project)) {
        owner[repo.name.green].push(normalizePath(repo.path, options).white);
      }
    } else {
      owner[repo.name.green] = normalizePath(repo.path, options).white;
    }
  }

  const basePath = path.join(config.paths.home, config.defaults.base);

  process.stdout.write(prettyjson.render({
      [normalizePath(basePath, options).white]: result
    }) + '\n');
}

module.exports = function (argv, options) {
  return ls(argv.key, options);
};