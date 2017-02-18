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

const logger = log4js.getLogger('SEARCH');
const prompt = inquirer.createPromptModule();

const config = require('../config');

function *remove(options) {
  const lockJSON = yield fs.readJsonAsync(config.paths.lock);
  lockJSON.repos = lockJSON.repos || [];

  let repos = _.map(lockJSON.repos, function (repo) {
    return _.extend({}, repo, {
      __index__: `${repo.source}:@${repo.owner}/${repo.name.green}(${path.relative(process.env.HOME, repo.path)})`
    });
  });

  const selector = yield prompt({
    type: 'list',
    name: 'target',
    message: `Select a repository`,
    choices: repos.map(v => v.__index__)
  });

  const isConfirmDel = yield prompt({
    type: 'confirm',
    name: 'result',
    message: `[${'DANGER'.red}]Are you sure to delete ${selector.target.underline}:`,
    "default": false,
  });

  if (!isConfirmDel.result) {
    logger.info('ok! Good bye.');
    return process.exit(1);
  }

  const target = _.find(repos, repo => {
    const matcher = selector.target.match(/\([^\)]+\)$/g);
    const repoPath = path.join(process.env.HOME, (matcher[0] || '').replace(/^\(|\)$/g, '').trim());
    return repoPath === repo.path;
  });

  yield fs.ensureDirAsync(target.path);
  yield fs.emptyDirAsync(target.path);
  yield fs.removeAsync(target.path);

  _.remove(lockJSON.repos, function (repo) {
    return target.source === repo.source && target.owner === repo.owner && target.name === repo.name;
  });

  yield fs.writeJsonAsync(config.paths.lock, lockJSON);

  logger.info(`remove ${target.path.green}`);

}

module.exports = function (options) {
  return remove(options);
};