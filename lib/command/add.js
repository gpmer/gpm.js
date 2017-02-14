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

const {isExistPath, spawnShell, confirmMsg} = require('../utils');
const config = require('../config');

function *add(repo, options) {
  const gitInfo = gitUrlParse(repo);
  const hasExistConfig = yield isExistPath(config.paths.config);
  if (!hasExistConfig) {
    logger.error('You need run command line: [gpmx init] to init the program');
    return process.exit(1);
  }

  const gpmConfig = yield fs.readJSONAsync(config.paths.config);

  const tempDir = path.join(config.paths.temp, gitInfo.name);
  const baseDir = path.join(process.env.HOME, gpmConfig.base);
  const sourceDir = path.join(baseDir, gitInfo.source);
  const ownerDir = path.join(sourceDir, gitInfo.owner);
  const repoDir = path.join(ownerDir, gitInfo.name);

  const isExistRepoDir = yield isExistPath(repoDir);

  if (!isExistRepoDir) {

  } else {
    const wantReplace = yield confirmMsg(`Are you want to replace ${repoDir.yellow.underline}`.white);
    // ask replace with this new repo or not
    if (wantReplace) {
      yield fs.removeAsync(repoDir);
    } else {
      logger.info('Ok, Good by!');
      return process.exit(1);
    }
  }

  yield fs.ensureDirAsync(baseDir);
  yield fs.ensureDirAsync(config.paths.temp);
  yield fs.removeAsync(tempDir);
  yield fs.ensureDirAsync(sourceDir);
  yield fs.ensureDirAsync(ownerDir);

  yield spawnShell('git', ['clone', gitInfo.href], {cwd: config.paths.temp});

  const isExistLockFile = yield isExistPath(config.paths.lock);
  if (!isExistLockFile) yield fs.writeJSONAsync(config.paths.lock, {});

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
  let lockJSON = yield fs.readJSONAsync(config.paths.lock);
  _.merge(lockJSON, repoLock);
  yield fs.writeJSONAsync(config.paths.lock, lockJSON);

  logger.info(`Repository has been add to ${repoDir.green.underline}`);
}

module.exports = function (repo, options) {
  return add(repo, options);
};