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
const clipboardy = require('clipboardy');
const log4js = require('log4js');
const __ = require('i18n').__;

const logger = log4js.getLogger('FIND');
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
      message: __('commands.find.log.info_type_to_search') + ':',
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

  try {
    clipboardy.writeSync(target.path);
    logger.info(__('global.tips.past', { key: '<CTRL+V>'.green }));
  } catch (err) {
    logger.warn(__('global.tips.copy_fail'));
  }
}

module.exports = function(argv, options) {
  return search(argv, options);
};

module.exports.decoratorIndex = decoratorIndex;
