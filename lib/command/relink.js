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
const globalConfig = require('../global-config');
const registry = require('../registry');

const config = require('../config');
const {isGitRepoDir, parseGitConfigAsync, isDir, isExistPath, normalizePath} = require('../utils');

function filterDir(files) {
  return co(function*() {
    let output = [];
    files = files.slice();
    while (files.length) {
      let file = files.shift();
      (yield isDir(file)) && output.push(file);
    }
    return output;
  })
}

function loop(base, deepIndex = 0, options = {}) {
  return co(function *() {
    if (!(yield isExistPath(base))) return;
    if (deepIndex >= 3) {
      if (!(yield isGitRepoDir(base))) return;
      let gitConfig = yield parseGitConfigAsync({cwd: base, path: path.join('.git', 'config')});
      const origin = gitConfig[`remote "origin"`] || {};

      if (!origin.url || _.isEmpty(origin)) return;

      const gitInfo = gitUrlParse(origin.url);

      yield registry.add(_.extend({}, gitInfo, {path: base, href: origin.url}));

      !options.nolog && logger.info(`${origin.url.green} >>> ${normalizePath(base, options).yellow}`);
    }
    else {
      const files = (yield fs.readdirAsync(base) || []).map(file => path.join(base, file));
      const dirs = yield filterDir(files);
      if (dirs.length) {
        deepIndex++;
        yield dirs.map(dir => loop(dir, deepIndex))
      }
    }
  });
}

function *relink(argv, options) {
  const basePath = path.join(config.paths.home, globalConfig.entity.base);
  yield registry.clean();
  yield loop(basePath, 0, options);
}

module.exports = function (argv, options) {
  return relink(argv, options);
};
