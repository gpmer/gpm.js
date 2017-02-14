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
const prompt = inquirer.createPromptModule();

const {readJsonAsync, writeJsonAsync} = require('../common');
const config = require('../config');

function *remove(options) {
  const lockJSON = yield readJsonAsync(config.paths.lock);

  let repos = [];

  _.each(lockJSON, function (v1, source) {
    _.each(v1, function (v2, owner) {
      _.each(v2, function (v3, name) {
        repos.push(_.merge({
          source,
          owner,
          name,
          __index__: `${source}:@${owner}/${name.green}(${path.relative(process.env.HOME, v3.path)})`
        }, v3));
      });
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
    console.log('ok! Good bye.');
    return process.exit(1);
  }

  const target = _.find(repos, repo => {
    const matcher = selector.target.match(/\([^\)]+\)$/g);
    const repoPath = path.join(process.env.HOME, (matcher[0] || '').replace(/^\(|\)$/g, '').trim());
    return repoPath === repo.path;
  });

  yield fs.emptyDirAsync(target.path);
  yield fs.removeAsync(target.path);

  delete lockJSON[target.source][target.owner][target.name];
  if (_.isEmpty(lockJSON[target.source][target.owner])) delete lockJSON[target.source][target.owner];
  if (_.isEmpty(lockJSON[target.source])) delete lockJSON[target.source];

  yield writeJsonAsync(config.paths.lock, lockJSON);
}

module.exports = function (options) {
  return remove(options);
};