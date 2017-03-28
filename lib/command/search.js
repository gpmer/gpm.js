/**
 * Created by axetroy on 17-2-14.
 */
const process = require('process');
const path = require('path');
const Promise = require('bluebird');
const prettyjson = require('prettyjson');
const inquirer = require('inquirer');
const _ = require('lodash');
const gitUrlParse = require('git-url-parse');

const config = require('../config');
const { normalizePath } = require('../utils');
const registry = require('../registry');

function decoratorIndex(repo) {
  repo.__index__ = `${repo.source.red}:${('@' + repo.owner).yellow}/${repo.name.green}(${path.relative(config.paths.home, repo.path)})`;
  return repo;
}

function* search(argv, options) {
  let repositories = registry.repositories.map(decoratorIndex);

  const answer = yield inquirer.prompt([
    {
      name: 'repository',
      message: 'Type to Search:',
      type: 'autocomplete',
      pageSize: 10,
      source: (answers, input) =>
        Promise.resolve(
          registry.find(input).map(decoratorIndex).map(repo => repo.__index__)
        )
    }
  ]);

  const target = _.find(repositories, v => v.__index__ === answer.repository);

  _.extend(target, gitUrlParse(target.href));

  target.path = normalizePath(target.path, options);

  delete target.__index__;
  delete target.__search__;
  delete target.toString;

  process.stdout.write(prettyjson.render(target) + '\n');
}

module.exports = function(argv, options) {
  return search(argv, options);
};

module.exports.decoratorIndex = decoratorIndex;
