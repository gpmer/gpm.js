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

export interface Json$ {
  [source: string]: Source$;
}

export interface Source$ {
  [owner: string]: Owner$;
}

export interface Owner$ {
  [name: string]: Project$;
}

export type Project$ = string | string[];

export interface Config$ {
  dir: string;
  stringify: Function;
  parse: Function;
  encoding: string;
  logging: boolean;
  continuous: boolean;
  interval: boolean;
  ttl: boolean;
  expiredInterval: number;
  forgiveParseErrors: boolean;
}

class Registry extends EventEmitter {
  private key = 'repositories';
  public repositories: Target$[] = [];
  constructor(private config: Config$) {
    super();
  }

  get isEmpty(): boolean {
    return this.repositories.length === 0;
  }

  async init(): Promise<void> {
    await storage.init(this.config);

    this.repositories = (await storage.getItem(this.key)) || [];
  }

  async add(target: Target$): Promise<void> {
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

  async remove(target: Target$): Promise<void> {
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

  find(key: string = ''): Target$[] {
    if (!key) return this.repositories;
    const searchResult = fuzzy
      .filter(key, this.repositories.map(repo => repo.owner + '/' + repo.name))
      .map(v => v.string);
    return this.repositories
      .filter(repo => _.includes(searchResult, repo.owner + '/' + repo.name))
      .map(v => v);
  }

  async clean(): Promise<void> {
    this.repositories = [];
    await storage.set(this.key, this.repositories);
  }

  toJson(
    repositories,
    options: ToJsonOptions$ | any = { color: '#fff' }
  ): Json$ {
    const output: Json$ = {};
    repositories = (repositories || this.repositories).slice();
    while (repositories.length) {
      const repo: Target$ = repositories.shift();
      const sourceKey: string = options.color ? repo.source.red : repo.source;
      const ownerKey: string = options.color ? repo.owner.yellow : repo.owner;
      const nameKey: string = options.color ? repo.name.green : repo.name;
      const source: Source$ = (output[sourceKey] = output[sourceKey] || {});
      const owner: Owner$ = (source[ownerKey] = source[ownerKey] || {});
      const project: Project$ = owner[nameKey];

      let projectPath: string = normalizePath(repo.path, options);
      projectPath = options.color ? projectPath.white : projectPath;

      if (!_.isEmpty(project)) {
        if (_.isString(project)) {
          owner[nameKey] = [<string>project].concat(projectPath);
        } else if (_.isArray(project)) {
          (<string[]>owner[nameKey]).push(projectPath);
        }
      } else {
        owner[nameKey] = projectPath;
      }
    }
    return output;
  }
}

export default new Registry({
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
