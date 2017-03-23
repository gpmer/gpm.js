/**
 * Created by axetroy on 17-3-23.
 */
const Promise = require('bluebird');
const co = require('co');
const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs-extra'));
const storage = require('node-persist');

const config = require('./config');

class Registry {
  constructor() {
    this.key = 'repositories';
    this[this.key] = [];
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

      self[self.key] = (yield storage.getItem(self.key)) || [];
    });
  }

  add(repo) {
    const self = this;
    return co(function*() {
      self[self.key].push(repo);
      yield storage.set(self.key, self[self.key]);
    });
  }

  remove() {

  }

}

module.exports = new Registry();
