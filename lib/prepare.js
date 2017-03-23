/**
 * Created by axetroy on 17-2-15.
 */

const Promise = require('bluebird');
const co = require('co');
const fs = Promise.promisifyAll(require('fs-extra'));
const config = require('./config');
const globalConfig = require('./global-config');
const registry = require('./registry');

/**
 1. make sure root directory has exist
 2. make sure [temp, config] has exist
 3. make sure [config] must be a json file even it's empty
 */
module.exports = function (options) {
  return co(function *() {
    yield fs.ensureDirAsync(config.paths.root);
    yield [
      fs.ensureDirAsync(config.paths.temp),
      yield globalConfig.init(),
      yield registry.init()
    ];
  });
};
