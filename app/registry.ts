/**
 * Created by axetroy on 17-3-23.
 */
import { EventEmitter } from 'events';
const _ = require('lodash');
const storage = require('node-persist');
const fuzzy = require('fuzzy');
const { normalizePath } = require('./utils');
const config = require('./config');

export interface Target$ {
  source: string;
  owner: string;
  name: string;
  path: string;
}

export interface ToJsonOptions$ {
  color: string;
}

class Registry extends EventEmitter {
  private key = 'repositories';
  public repositories: Target$[] = [];
  constructor() {
    super();
  }

  get isEmpty() {
    return this.repositories.length === 0;
  }

  async init() {
    await storage.init({
      dir: config.paths.storage,
      stringify: JSON.stringify,
      parse: JSON.parse,
      encoding: 'utf8',
      logging: false, // can also be custom logging function
      continuous: true, // continously persist to disk
      interval: false, // milliseconds, persist to disk on an interval
      ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS
      expiredInterval: 7 * 24 * 3600 * 1000, // clear cache in 7 days
      // in some cases, you (or some other service) might add non-valid storage files to your
      // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
      forgiveParseErrors: false // [NEW]
    });

    this.repositories = (await storage.getItem(this.key)) || [];
  }

  async add(target: Target$) {
    const self = this;
    _.remove(
      this.repositories,
      repo =>
        repo.source === target.source &&
        repo.owner === target.owner &&
        repo.name === target.name &&
        repo.path === target.path
    );
    self.repositories.push(target);
    await storage.set(self.key, self.repositories);
  }

  async remove(target: Target$) {
    let before = this.repositories.slice();
    _.remove(
      this.repositories,
      repo =>
        repo.source === target.source &&
        repo.owner === target.owner &&
        repo.name === target.name &&
        repo.path === target.path
    );
    const after = this.repositories;
    if (!_.isEqual(before, after)) {
      await storage.set(this.key, this.repositories);
    }
  }

  find(key = '') {
    if (!key) return this.repositories;
    const searchResult = fuzzy
      .filter(key, this.repositories.map(repo => repo.owner + '/' + repo.name))
      .map(v => v.string);
    return this.repositories
      .filter(repo => _.includes(searchResult, repo.owner + '/' + repo.name))
      .map(v => v);
  }

  async clean() {
    this.repositories = [];
    await storage.set(this.key, this.repositories);
  }

  toJson(repositories, options: ToJsonOptions$ | any = { color: '#fff' }) {
    const output = {};
    repositories = (repositories || this.repositories).slice();
    while (repositories.length) {
      const repo = repositories.shift();
      const sourceKey = options.color ? repo.source.red : repo.source;
      const ownerKey = options.color ? repo.owner.yellow : repo.owner;
      const nameKey = options.color ? repo.name.green : repo.name;
      const source = (output[sourceKey] = output[sourceKey] || {});
      const owner = (source[ownerKey] = source[ownerKey] || {});
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

export default new Registry();
