/**
 * Created by axetroy on 17-2-14.
 */
const process = require('process');
const path = require('path');
const Promise = require('bluebird');
const prettyjson = require('prettyjson');
const fs = Promise.promisifyAll(require('fs-extra'));
const _ = require('lodash');
const inquirer = require('inquirer');
const log4js = require('log4js');
const fuzzy = require('fuzzy');
const storage = require('node-persist');

const {filter} = require('./search');

const logger = log4js.getLogger('REMOVE');
const prompt = inquirer.createPromptModule();

const config = require('../config');
const {normalizePath} = require('../utils');
const registry = require('../registry');

function decoratorIndex(repo) {
  repo.__index__ = `${repo.source}:@${repo.owner}/${repo.name.green}(${path.relative(config.paths.home, repo.path)})`;
  return repo;
}

function *remove(argv, options) {
  let repositories = registry.repositories.slice();
  let target = {};
  if (argv.owner) {
    if (!argv.repo) return logger.info(`remove ${argv.owner} <repo> missing repo`);
    target = _.find(repositories, repo => repo.owner === argv.owner.trim() && repo.name === argv.repo.trim());
  }
  else {
    repositories = _.map(repositories, decoratorIndex);

    const answer = yield inquirer.prompt([{
      name: 'repository',
      message: 'Type to Search:',
      type: 'autocomplete',
      pageSize: 10,
      source: (answers, input) => Promise.resolve(
        registry
          .find(input)
          .map(decoratorIndex)
          .map(repo => repo.__index__)
      )
    }]);

    target = _.find(repositories, v => v.__index__ === answer.repository);
  }

  if (
    (yield prompt({
      type: 'confirm',
      name: 'result',
      message: `[${'DANGER'.red}]Are you sure to delete ${normalizePath(target.path, options).red}:`,
      "default": false,
    })).result == false
  ) {
    logger.info('ok! Good bye.');
    return process.exit(0);
  }

  yield fs.ensureDirAsync(target.path);
  yield fs.emptyDirAsync(target.path);
  yield fs.removeAsync(target.path);

  yield registry.remove(target);

  logger.info(`remove ${normalizePath(target.path, options).green}`);
}

module.exports = function (argv, options) {
  return remove(argv, options);
};