/**
 * Created by axetroy on 17-2-14.
 */
const process = require('process');
const path = require('path');
const Promise = require('bluebird');
const prettyjson = require('prettyjson');
const fs = Promise.promisifyAll(require('fs-extra'));
const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const _ = require('lodash');
const log4js = require('log4js');
const gitUrlParse = require("git-url-parse");
const storage = require('node-persist');

const logger = log4js.getLogger('SEARCH');
const prompt = inquirer.createPromptModule();

const config = require('../config');

function *search(key, options) {
  let repositories = (yield storage.getItem('repositories')) || [];
  repositories = _.map(repositories, function (repo) {
    return _.extend({}, repo, {
      __index__: `${repo.source}:@${repo.owner}/${repo.name.green}(${path.relative(config.paths.home, repo.path)})`,
      __search__: `@${repo.owner}/${repo.name}`
    });
  });

  const results = fuzzy.filter(key, repositories.map(v => v.__search__));

  if (_.isEmpty(results)) return logger.info(`Not found any repository with key: ${key.green}`);

  const repoList = _.filter(repositories, v => _.includes(results.map(v => v.string), v.__search__));

  const selector = yield prompt({
    type: 'list',
    name: 'target',
    message: `Select a repository`,
    choices: repoList.map(v => v.__index__)
  });

  const target = _.find(repositories, v => v.__index__ === selector.target);

  delete target.__index__;
  delete target.__search__;
  _.extend(target, gitUrlParse(target.href));
  process.stdout.write(prettyjson.render(target) + '\n');
}

module.exports = function (key, options) {
  return search(key, options);
};