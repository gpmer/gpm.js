/**
 * Created by axetroy on 2017/3/23.
 */
const Promise = require('bluebird');
const co = require('co');
const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs-extra'));

const config = require('./config');

let hasInit = false;
let CONFIG = {};

function init() {
  return co(function *() {
    yield fs.ensureFileAsync(config.paths.config);
    const globalConfigRaw = yield fs.readFileAsync(config.paths.config);
    let globalConfigJson = JSON.parse(globalConfigRaw);
    if (_.isEmpty(globalConfigJson)) {
      CONFIG = config.defaults;
      yield fs.writeJsonAsync(config.paths.config, CONFIG)
    } else {
      CONFIG = globalConfigJson;
    }
    hasInit = true;
  });
}

function set(key, value) {
  return co(function *() {
    CONFIG[key] = value;
    yield fs.writeJsonAsync(config.paths.config, CONFIG);
  });
}

function remove(key) {
  return co(function *() {
    CONFIG[key] = null;
    delete CONFIG[key];
    yield fs.writeJsonAsync(config.paths.config, CONFIG);
  });
}

function get(key) {
  return CONFIG[key];
}

const globalConfig = {
  init,
  get,
  set,
  remove,
  get entity() {
    return CONFIG;
  }
};

module.exports = globalConfig;
