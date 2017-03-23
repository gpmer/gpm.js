/**
 * Created by axetroy on 2017/3/23.
 */
const EventEmitter = require('events').EventEmitter;
const Promise = require('bluebird');
const co = require('co');
const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs-extra'));

const config = require('./config');

class GlobalConfig extends EventEmitter {
  constructor() {
    super();
    this.hasInit = false;
    this.entity = {};
  }

  init() {
    let self = this;
    return co(function *() {
      yield fs.ensureFileAsync(config.paths.config);
      const globalConfigRaw = yield fs.readFileAsync(config.paths.config);
      let globalConfigJson = !_.isEmpty(globalConfigRaw) ? JSON.parse(globalConfigRaw) : {};
      if (_.isEmpty(globalConfigJson)) {
        self.entity = config.defaults;
        yield fs.writeJsonAsync(config.paths.config, self.entity)
      } else {
        self.entity = globalConfigJson;
      }
      self.hasInit = true;
    });
  }

  get(key) {
    return this.entity[key];
  }

  set(key, value) {
    let self = this;
    return co(function *() {
      self.entity[key] = value;
      yield fs.writeJsonAsync(config.paths.config, self.entity);
      return self.entity;
    });
  }

  remove(key) {
    let self = this;
    return co(function *() {
      self.entity[key] = null;
      delete self.entity[key];
      yield fs.writeJsonAsync(config.paths.config, self.entity);
      return this.entity;
    });
  }

  reset() {
    let self = this;
    return co(function*() {
      self.entity = config.defaults;
      yield fs.writeJsonAsync(config.paths.config, self.entity);
      return self.entity;
    });
  }
}

module.exports = new GlobalConfig();
