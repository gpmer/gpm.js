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

const logger = log4js.getLogger('REMOVE');
const prompt = inquirer.createPromptModule();

const config = require('../config');

function *remove(key, options) {
  const lockJSON = yield fs.readJsonAsync(config.paths.lock);
  lockJSON.repos = lockJSON.repos || [];

  let repos = _.map(lockJSON.repos, function (repo) {
    return _.extend({}, repo, {
      __index__: `${repo.source}:@${repo.owner}/${repo.name.green}(${path.relative(config.paths.home, repo.path)})`
    });
  });

  let choices = repos.map(v => v.__index__);

  if (key) {
    const searchResult = fuzzy
      .filter(key, repos.map(repo => repo.owner + '/' + repo.name))
      .map(v => v.string);

    choices = repos.filter(function (repo) {
      return _.includes(searchResult, repo.owner + '/' + repo.name);
    }).map(v => v.__index__);
  }

  if (_.isEmpty(choices)) {
    logger.info('Not Found');
    return;
  }

  const selector = yield prompt({
    type: 'list',
    name: 'target',
    message: `Select a repository to, you can press ${'CTRL+C'.red} to cancel.`,
    choices,
  });

  const isConfirmDel = yield prompt({
    type: 'confirm',
    name: 'result',
    message: `[${'DANGER'.red}]Are you sure to delete ${selector.target.underline}:`,
    "default": false,
  });

  if (!isConfirmDel.result) {
    logger.info('ok! Good bye.');
    return process.exit(0);
  }

  const target = _.find(repos, repo => {
    return repo.__index__ === selector.target;
  });

  yield fs.ensureDirAsync(target.path);
  yield fs.emptyDirAsync(target.path);
  yield fs.removeAsync(target.path);

  _.remove(lockJSON.repos, resp => target.source === repo.source && target.owner === repo.owner && target.name === repo.name);

  yield fs.writeJsonAsync(config.paths.lock, lockJSON);

  logger.info(`remove ${target.path.green}`);

}

module.exports = function (key, options) {
  return remove(key, options);
};