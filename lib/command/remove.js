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

function *remove(argv, options) {
  let repositories = (yield storage.getItem('repositories')) || [];

  repositories = _.map(repositories, function (repo) {
    return _.extend({}, repo, {
      __index__: `${repo.source}:@${repo.owner}/${repo.name.green}(${path.relative(config.paths.home, repo.path)})`,
      __search__: `@${repo.owner}/${repo.name}`
    });
  });

  const answer = yield inquirer.prompt([{
    name: 'repository',
    message: 'Type to Search:',
    type: 'autocomplete',
    pageSize: 10,
    source: (answers, input) => Promise.resolve(!input ? repositories.map(v => v.__index__) : filter(repositories, input))
  }]);

  const target = _.find(repositories, v => v.__index__ === answer.repository);

  const confirmDelete = (yield prompt({
    type: 'confirm',
    name: 'result',
    message: `[${'DANGER'.red}]Are you sure to delete ${normalizePath(target.path, options).red}:`,
    "default": false,
  })).result;

  if (!confirmDelete) {
    logger.info('ok! Good bye.');
    return process.exit(0);
  }

  yield fs.ensureDirAsync(target.path);
  yield fs.emptyDirAsync(target.path);
  yield fs.removeAsync(target.path);

  _.remove(repositories, repo => target.source === repo.source && target.owner === repo.owner && target.name === repo.name && repo.path === target.path);

  yield storage.setItem('repositories', repositories);

  logger.info(`remove ${normalizePath(target.path, options).green}`);
}

module.exports = function (argv, options) {
  return remove(argv, options);
};