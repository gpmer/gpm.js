/**
 * Created by axetroy on 17-2-14.
 */
const path = require('path');
const process = require('process');

const gitUrlParse = require("git-url-parse");
const Promise = require('bluebird');
const prettyjson = require('prettyjson');
const fs = Promise.promisifyAll(require('fs-extra'));
const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('ADD');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();

const {isExistPath, spawnShell, isLink} = require('../utils');
const config = require('../config');

function *add(repo, options) {
  const gitInfo = gitUrlParse(repo);

  const gpmConfig = yield fs.readJsonAsync(config.paths.config);

  const tempDir = path.join(config.paths.temp, gitInfo.name);
  const baseDir = path.join(process.env.HOME, gpmConfig.base);
  const sourceDir = path.join(baseDir, gitInfo.source);
  const ownerDir = path.join(sourceDir, gitInfo.owner);
  const repoDir = path.join(ownerDir, gitInfo.name);

  if (yield isExistPath(repoDir)) {
    const isConfirmReplace = yield prompt({
      type: 'confirm',
      name: 'result',
      message: `Are you sure to replace ${repoDir.yellow.underline}`.white,
      "default": false,
    });
    if (!isConfirmReplace.result) {
      logger.info('ok! Good bye.');
      return process.exit(1);
    }
  }

  yield fs.ensureDirAsync(baseDir);
  yield fs.ensureDirAsync(sourceDir);
  yield fs.ensureDirAsync(ownerDir);
  yield fs.removeAsync(tempDir);

  yield spawnShell('git', ['clone', gitInfo.href], {cwd: config.paths.temp});

  // if it's a link, then unlink first
  if (yield isLink(repoDir)) yield fs.unlinkAsync(repoDir);
  yield fs.removeAsync(repoDir);
  yield fs.moveAsync(tempDir, repoDir);

  // write in the lock
  const repoLock = {
    [gitInfo.source]: {
      [gitInfo.owner]: {
        [gitInfo.name]: {
          path: repoDir,
          href: gitInfo.href
        }
      }
    }
  };

  // read the old lock
  const lockJSON = yield fs.readJsonAsync(config.paths.lock);

  // merge and write the new lock
  _.merge(lockJSON, repoLock);
  yield fs.writeJSONAsync(config.paths.lock, lockJSON);

  logger.info(`Repository has been add to ${repoDir.green.underline}`);
}

module.exports = function (repo, options) {
  return add(repo, options);
};