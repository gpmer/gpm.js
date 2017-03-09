/**
 * Created by axetroy on 17-2-14.
 */

const path = require('path');
const process = require('process');

const _ = require('lodash');
const prettyjson = require('prettyjson');
const Promise = require('bluebird');
const co = require('co');
const fs = Promise.promisifyAll(require('fs-extra'));
const log4js = require('log4js');
const logger = log4js.getLogger('RELINK');
const gitUrlParse = require("git-url-parse");
const storage = require('node-persist');

const config = require('../config');
const {isGitRepoDir, parseGitConfigAsync, isDir} = require('../utils');

function *relink(options) {
  const configJSON = yield fs.readJsonAsync(config.paths.config);
  const basePath = path.join(config.paths.home, configJSON.base);

  const repositories = (yield storage.getItem('repositories')) || [];

  yield fs.ensureDirAsync(basePath);
  const sources = yield fs.readdirAsync(basePath) || [];
  if (_.isEmpty(sources)) {
    logger.error(`You did't have any repository to relink, please add it first.`);
    return;
  }

  while (sources.length) {
    const source = sources.shift();
    const sourcePath = path.join(basePath, source);
    if (!(yield isDir(sourcePath))) return;
    const owners = yield yield fs.readdirAsync(sourcePath);
    while (owners.length) {
      const owner = owners.shift();
      const ownerPath = path.join(basePath, source, owner);
      if (!(yield isDir(ownerPath))) return;
      const repos = yield fs.readdirAsync(ownerPath);
      while (repos.length) {
        const repo = repos.shift();
        const dist = path.join(basePath, source, owner, repo);
        if (!(yield isGitRepoDir(dist))) continue;

        let gitConfig = yield parseGitConfigAsync({cwd: dist, path: path.join('.git', 'config')});
        const origin = gitConfig[`remote "origin"`] || {};

        if (!origin.url || _.isEmpty(origin)) continue;

        const gitInfo = gitUrlParse(origin.url);

        repositories.push(_.extend({}, gitInfo, {path: dist, href: origin.url}));

        yield storage.setItem('repositories', repositories);

        logger.info(`${origin.url.green} >>> ${dist.yellow}`);
      }
    }
  }

}

module.exports = function (options) {
  return relink(options);
};