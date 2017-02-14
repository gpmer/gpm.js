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

const logger = log4js.getLogger('SEARCH');
const prompt = inquirer.createPromptModule();

const config = require('../config');
const {readJsonAsync} = require('../common');

function *search(key, options) {
  let list = [
    "hello",
    "world",
    "i am axetroy",
    "do not worry"
  ];

  const lockJSON = yield readJsonAsync(config.paths.lock);

  let repos = [];

  _.each(lockJSON, function (v1, source) {
    _.each(v1, function (v2, owner) {
      _.each(v2, function (v3, name) {
        repos.push(_.merge({
          source,
          owner,
          name,
          __index__: `${source}:@${owner}/${name.green}(${path.relative(process.env.HOME, v3.path)})`,
          __search__: `@${owner}/${name}`
        }, v3));
      });
    });
  });

  const results = fuzzy.filter(key, repos.map(v => v.__search__));

  if (_.isEmpty(results)) return logger.info(`Not found any repository with key: ${key.green}`);

  const repoList = _.filter(repos, v => _.includes(results.map(v => v.string), v.__search__));

  const selector = yield prompt({
    type: 'list',
    name: 'target',
    message: `Select a repository`,
    choices: repoList.map(v => v.__index__)
  });

  const target = _.find(repos, v => v.__index__ === selector.target);

  delete target.__index__;
  delete target.__search__;
  _.extend(target, gitUrlParse(target.href));
  console.log(prettyjson.render(target));

}

module.exports = function (key, options) {
  return search(key, options);
};