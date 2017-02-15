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
const parseGitConfig = require('parse-git-config');

const config = require('../config');
const {isGitRepoDir} = require('../utils');

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

function parseGitConfigAsync(options) {
  return new Promise(function (resolve, reject) {
    parseGitConfig(options, function (err, config) {
      if (err) return reject(err);
      return resolve(config);
    })
  })
}

function *relink(options) {
  const configJSON = yield fs.readJsonAsync(config.paths.config);
  let lockJSON = yield fs.readJsonAsync(config.paths.lock);
  const basePath = path.join(process.env.HOME, configJSON.base);

  const sources = yield fs.readdirAsync(basePath);
  _.each(sources, coRuntime(function *(source) {
    let owners = yield fs.readdirAsync(path.join(basePath, source));

    _.each(owners, coRuntime(function*(owner) {
      let repos = yield fs.readdirAsync(path.join(basePath, source, owner));
      _.each(repos, coRuntime(function *(repo) {
        const isGitRepo = yield isGitRepoDir(path.join(basePath, source, owner, repo));

        if (!isGitRepo) return;

        let gitConfig = yield parseGitConfigAsync({
          cwd: path.join(basePath, source, owner, repo),
          path: path.join('.git', 'config')
        });

        const origin = gitConfig[`remote "origin"`];

        let entity = {
          [source]: {
            [owner]: {
              [repo]: {
                path: path.join(basePath, source, owner, repo),
                href: origin.url
              }
            }
          }
        };

        _.merge(lockJSON, entity);
        yield fs.writeJSONAsync(config.paths.lock, lockJSON);

      }));
    }));

  }));


}

module.exports = function (options) {
  return relink(options);
};