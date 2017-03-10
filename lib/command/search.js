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
const gitUrlParse = require("git-url-parse");
const storage = require('node-persist');

const config = require('../config');

function filter(list, input) {
  const searchResult = fuzzy.filter(input, list.map(v => v.__search__)).map(v => v.string);
  return _.filter(list, v => _.includes(searchResult, v.__search__))
    .map(v => v.__index__);
}

function *search(options) {
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

  delete target.__index__;
  delete target.__search__;
  _.extend(target, gitUrlParse(target.href));

  process.stdout.write(prettyjson.render(target) + '\n');
}

module.exports = function (options) {
  return search(options);
};

module.exports.filter = filter;