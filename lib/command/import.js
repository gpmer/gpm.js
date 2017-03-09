/**
 * Created by axetroy on 17-2-15.
 */
const path = require('path');
const process = require('process');
const _ = require('lodash');
const prettyjson = require('prettyjson');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const log4js = require('log4js');
const gitUrlParse = require("git-url-parse");
const inquirer = require('inquirer');
const co = require('co');
const storage = require('node-persist');

const prompt = inquirer.createPromptModule();
const logger = log4js.getLogger('IMPORT');
const config = require('../config');
const {isGitRepoDir, parseGitConfigAsync, isExistPath, isLink} = require('../utils');

function *importHandlerOneDir(targetPath, options) {
  targetPath = path.resolve(process.cwd(), targetPath);
  const isGitDir = yield isGitRepoDir(targetPath);

  if (!isGitDir) throw new Error(`Invalid path: ${targetPath.green}, please make sure that is a git repository`);

  let gitConfig = yield parseGitConfigAsync({
    cwd: targetPath,
    path: path.join('.git', 'config')
  });

  const origin = gitConfig[`remote "origin"`] || {};

  if (!origin.url) throw new Error(`Invalid repository, please make sure that you have set remote repository url`);

  const gitInfo = gitUrlParse(origin.url);

  const configJSON = yield fs.readJsonAsync(config.paths.config);

  const distPath = path.join(config.paths.home, configJSON.base, gitInfo.source, gitInfo.owner, gitInfo.name);

  if (process.platform === 'win32') {
    logger.warn(`if you are using fucking <cmd>, Make sure you run it as administrator, or it will not have permission`);
  }

  const hasExistDist = yield isExistPath(distPath);
  const hasLinkDist = yield isLink(distPath);

  if (hasExistDist || hasLinkDist) {
    let isConfirmReplace = {result: false};
    if (options.force) {
      isConfirmReplace = {result: true};
    } else {
      isConfirmReplace = yield prompt({
        type: 'confirm',
        name: 'result',
        message: `repository has exist, Are you sure to replace ${distPath.yellow}`.white,
        "default": false,
      });
    }

    if (!isConfirmReplace.result) {
      logger.info('ok! Good bye.');
      return Promise.reject();
    } else {
      // if it's a link, then unlink first
      if (hasLinkDist) yield fs.unlinkAsync(distPath);
      yield fs.removeAsync(distPath);
    }
  }

  let action = '';

  if (options.hard) {
    action = 'move';
    yield fs.moveAsync(targetPath, distPath);
  } else {
    action = 'link';
    // make sure his parent dir has exist
    yield fs.ensureDirAsync(path.resolve(distPath, '../'));
    // specify dir only for window, other platform will ignore
    yield fs.symlinkAsync(targetPath, distPath, 'dir');
  }

  let repositories = (yield storage.getItem('repositories')) || [];

  repositories.push(_.extend({}, gitInfo, {path: distPath}));

  yield storage.setItem('repositories', repositories);

  logger.info(`${targetPath.green} has been ${action} to ${distPath.yellow}`);

  return yield Promise.resolve();
}

function *importHandler(targetPath, options) {
  if (options.all) {
    const files = yield fs.readdirAsync(targetPath);
    while (files.length) {
      let file = files.shift();
      yield co(function *() {
        return yield importHandlerOneDir(path.join(targetPath, file), options);
      }).catch(function (err) {
        if (err) {
          console.error(err);
        }
        return Promise.resolve();
      });
    }
  } else {
    yield importHandlerOneDir(targetPath, options);
  }
}

module.exports = function (path, options) {
  return importHandler(path, options);
};