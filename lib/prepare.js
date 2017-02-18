/**
 * Created by axetroy on 17-2-15.
 */

const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const config = require('./config');

/**
 1. make sure root directory has exist
 2. make sure [temp, config, lock] has exist
 3. make sure [config, lock] must be a json file even it's empty
 */
function* prepare(options) {
  yield fs.ensureDirAsync(config.paths.root);
  yield [
    fs.ensureDirAsync(config.paths.temp),
    fs.ensureFileAsync(config.paths.config),
    fs.ensureFileAsync(config.paths.lock)
  ];

  const [configRaw, lockRaw] = yield [
    fs.readFileAsync(config.paths.config),
    fs.readFileAsync(config.paths.lock)
  ];

  let configJSON = {};
  let lockJSON = {};

  try {
    configJSON = JSON.parse(configRaw);
    lockJSON = JSON.parse(lockRaw);
  } catch (err) {
  }

  return yield [
    _.isEmpty(configJSON) ? fs.writeJsonAsync(config.paths.config, config.defaults) : Promise.resolve(),
    _.isEmpty(lockJSON) ? fs.writeJsonAsync(config.paths.lock, {}) : Promise.resolve()
  ]
}

module.exports = function (options) {
  return prepare(options);
};