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
const gitUrlParse = require('git-url-parse');
const inquirer = require('inquirer');
const co = require('co');
const __ = require('i18n').__;

const prompt = inquirer.createPromptModule();
const logger = log4js.getLogger('IMPORT');
const config = require('../config');
const registry = require('../registry');
const {
  isGitRepoDir,
  parseGitConfigAsync,
  isExistPath,
  isLink,
  normalizePath
} = require('../utils');

function* importHandlerOneDir(targetPath, options) {
  targetPath = path.resolve(process.cwd(), targetPath);
  const isGitDir = yield isGitRepoDir(targetPath);

  if (!isGitDir)
    throw new Error(
      __('commands.import.log.invalid_repo', {
        repo: normalizePath(targetPath, options).green
      })
    );

  let gitConfig = yield parseGitConfigAsync({
    cwd: targetPath,
    path: path.join('.git', 'config')
  });

  const origin = gitConfig[`remote "origin"`] || {};

  if (!origin.url) throw new Error(__('commands.import.log.invalid_repo_url'));

  const gitInfo = gitUrlParse(origin.url);

  const configJSON = yield fs.readJsonAsync(config.paths.config);

  const distPath = path.join(
    config.paths.home,
    configJSON.base,
    gitInfo.source,
    gitInfo.owner,
    gitInfo.name
  );

  if (process.platform === 'win32') {
    logger.warn(__('commands.import.log.warn_cmd_require_pms'));
  }

  const hasExistDist = yield isExistPath(distPath);
  const hasLinkDist = yield isLink(distPath);

  if (hasExistDist || hasLinkDist) {
    let isConfirmReplace = { result: false };
    if (options.force) {
      isConfirmReplace = { result: true };
    } else {
      isConfirmReplace = yield prompt({
        type: 'confirm',
        name: 'result',
        message: __('commands.import.log.confirm_replace', {
          path: normalizePath(distPath, options).yellow
        }).white,
        default: false
      });
    }

    if (!isConfirmReplace.result) {
      !options.nolog && logger.info(__('global.tips.good_bye'));
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

  yield registry.add(_.extend({}, gitInfo, { path: distPath }));

  logger.info(
    `${normalizePath(targetPath, options).green} has been ${action} to ${normalizePath(distPath, options).yellow}`
  );

  return yield Promise.resolve();
}

function* importHandler(targetPath, options) {
  if (options.all) {
    const files = yield fs.readdirAsync(targetPath);
    while (files.length) {
      let file = files.shift();
      yield co(function*() {
        return yield importHandlerOneDir(path.join(targetPath, file), options);
      }).catch(function(err) {
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

module.exports = function(argv, options) {
  return importHandler(argv.dir, options);
};
