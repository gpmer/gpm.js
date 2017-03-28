/**
 * Created by axetroy on 17-3-23.
 */

const path = require('path');
const process = require('process');
const co = require('co');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const _ = require('lodash');
const jt = require('json-toy');

const config = require('../config');
const {
  normalizePath,
  isExistPath,
  isGitRepoDir,
  parseGitConfigAsync,
  parseLicense
} = require('../utils');
const registry = require('../registry');
const globalConfig = require('../global-config');

function* licenses(key, options) {
  const output = {};
  const repositories = registry.repositories.slice();
  while (repositories.length) {
    const repo = repositories.shift();
    const sourceKey = repo.source;
    const ownerKey = repo.owner;
    const nameKey = repo.name;
    const source = (output[sourceKey] = output[sourceKey] || {});
    const owner = (source[ownerKey] = source[ownerKey] || {});
    const project = owner[nameKey];

    const repoDir = normalizePath(repo.path, options);

    if (!(yield isGitRepoDir(repoDir))) return;
    let gitConfig = yield parseGitConfigAsync({
      cwd: repoDir,
      path: path.join('.git', 'config')
    });
    const origin = gitConfig[`remote "origin"`] || {};
    if (!origin.url || _.isEmpty(origin)) return;

    const entity = {
      URL: origin.url,
      License: 'unkown'
    };

    const licensePath = path.join(repoDir, 'LICENSE');
    if (yield isExistPath(licensePath)) {
      const raw = yield fs.readFileAsync(licensePath, { encoding: 'utf8' });
      let license = parseLicense(raw);
      entity.License = license.trim().replace(/\*+$/, '');
    }

    if (!_.isEmpty(project)) {
      if (_.isString(project)) {
        owner[nameKey] = [project].concat(entity);
      } else if (_.isArray(project)) {
        owner[nameKey].push(entity);
      }
    } else {
      owner[nameKey] = entity;
    }
  }

  const basePath = path.join(
    config.paths.home,
    globalConfig.entity.base || config.defaults.base
  );

  const ROOT = normalizePath(basePath, options);

  !options.nolog &&
    process.stdout.write(
      jt.treeString(output, {
        space: 4,
        vSpace: 0,
        valueOut: true,
        rootName: normalizePath(ROOT, options)
      }) + '\n'
    );
  return output;
}

module.exports = function(argv = {}, options = {}) {
  return co.wrap(licenses)(argv.key, options);
};
