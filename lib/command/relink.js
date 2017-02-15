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

const config = require('../config');
const {isGitRepoDir, parseGitConfigAsync} = require('../utils');

function coRuntime(func) {
  return function () {
    let args = arguments;
    let __this__ = this;
    co(function *() {
      yield func.apply(__this__, args);
    }).catch(function (err) {
      console.error(err);
    });
  }
}

function *relink(options) {
  const configJSON = yield fs.readJsonAsync(config.paths.config);
  const lockJSON = yield fs.readJsonAsync(config.paths.lock);
  const basePath = path.join(process.env.HOME, configJSON.base);

  _.each(yield fs.readdirAsync(basePath), coRuntime(function *(source) {
    _.each(yield fs.readdirAsync(path.join(basePath, source)), coRuntime(function*(owner) {
      _.each(yield fs.readdirAsync(path.join(basePath, source, owner)), coRuntime(function *(repo) {
        const dist = path.join(basePath, source, owner, repo);
        if (!(yield isGitRepoDir(dist))) return;

        let gitConfig = yield parseGitConfigAsync({
          cwd: dist,
          path: path.join('.git', 'config')
        });
        const origin = gitConfig[`remote "origin"`] || {};

        if (!origin.url || _.isEmpty(origin)) return;

        const repoLock = {
          [source]: {
            [owner]: {
              [repo]: {
                path: dist,
                href: origin.url
              }
            }
          }
        };

        _.merge(lockJSON, repoLock);

        yield fs.writeJSONAsync(config.paths.lock, lockJSON);

        logger.info(`link repository: ${origin.url.green} >>> ${dist.yellow}`);

      }));
    }));

  }));


}

module.exports = function (options) {
  return relink(options);
};