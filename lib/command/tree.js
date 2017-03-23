/**
 * Created by axetroy on 17-3-23.
 */

const path = require('path');
const process = require('process');
const co = require('co');

const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const prettyjson = require('prettyjson');
const log4js = require('log4js');
const fuzzy = require('fuzzy');
const storage = require('node-persist');
const jt = require("json-toy");

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
    const source = result[repo.source] = result[repo.source] || {};
    const owner = source[repo.owner] = source[repo.owner] || {};
    const project = owner[repo.name];
    if (!_.isEmpty(project)) {
      if (_.isString(project)) {
        owner[repo.name] = [project].concat(normalizePath(repo.path, options));
      } else if (_.isArray(project)) {
        owner[repo.name].push(normalizePath(repo.path, options).red);
      }
    } else {
      owner[repo.name] = normalizePath(repo.path, options);
    }
  }

  const ROOT = path.join(config.paths.home, config.defaults.base);

  process.stdout.write(jt.treeString(result, {
      space: 4,
      vSpace: 0,
      valueOut: false,
      rootName: normalizePath(ROOT, options)
    }) + '\n');

  return result;
}

module.exports = function (argv = {}, options = {}) {
  return co.wrap(ls)(argv.key, options);
};