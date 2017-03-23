/**
 * Created by axetroy on 17-3-23.
 */
const Promise = require('bluebird');
const co = require('co');
const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs-extra'));
const storage = require('node-persist');
const fuzzy = require('fuzzy');
const {normalizePath} = require('./utils');
const config = require('./config');

class Registry {
  constructor() {
    this.key = 'repositories';
    this.repositories = [];
  }

  get isEmpty() {
    return this.repositories.length === 0;
  }

  init() {
    const self = this;
    return co(function*() {
      yield storage.init({
        dir: config.paths.storage,
        stringify: JSON.stringify,
        parse: JSON.parse,
        encoding: 'utf8',
        logging: false,  // can also be custom logging function
        continuous: true, // continously persist to disk
        interval: false, // milliseconds, persist to disk on an interval
        ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS
        expiredInterval: 7 * 24 * 3600 * 1000,     // clear cache in 7 days
        // in some cases, you (or some other service) might add non-valid storage files to your
        // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
        forgiveParseErrors: false // [NEW]
      });

      self.repositories = (yield storage.getItem(self.key)) || [];
    });
  }

  add(repo) {
    const self = this;
    return co(function*() {
      self.repositories.push(repo);
      yield storage.set(self.key, self.repositories);
    });
  }

  remove(target = {}) {
    const self = this;
    let before = this.repositories.slice();
    _.remove(this.repositories, repo => target.source === repo.source && target.owner === repo.owner && target.name === repo.name && repo.path === target.path);
    const after = this.repositories;
    return co(function*() {
      if (!_.isEqual(before, after)) {
        yield storage.set(self.key, self.repositories);
      }
    });
  }

  find(key = '') {
    if (!key) return this.repositories;
    const searchResult = fuzzy
      .filter(key, this.repositories.map(repo => repo.owner + '/' + repo.name))
      .map(v => v.string);
    return this.repositories.filter((repo) => _.includes(searchResult, repo.owner + '/' + repo.name));
  }

  clean() {
    const self = this;
    return co(function*() {
      self.repositories = [];
      yield storage.set(self.key, self.repositories);
    });
  }

  toJson(options = {}) {
    const output = {};
    const repositories = this.repositories.slice();
    while (repositories.length) {
      const repo = repositories.shift();
      const sourceKey = options.color ? repo.source.red : repo.source;
      const ownerKey = options.color ? repo.owner.yellow : repo.owner;
      const nameKey = options.color ? repo.name.green : repo.name;
      const source = output[sourceKey] = output[sourceKey] || {};
      const owner = source[ownerKey] = source[ownerKey] || {};
      const project = owner[nameKey];

      let projectPath = normalizePath(repo.path, options);
      projectPath = options.color ? projectPath.white : projectPath;

      if (!_.isEmpty(project)) {
        if (_.isString(project)) {
          owner[nameKey] = [project].concat(projectPath);
        } else if (_.isArray(project)) {
          owner[nameKey].push(projectPath);
        }
      } else {
        owner[nameKey] = projectPath;
      }
    }
    return output;
  }

}

module.exports = new Registry();
