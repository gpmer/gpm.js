/**
 * Created by axetroy on 17-2-15.
 */

const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const config = require('./config');
const {ensureReadJson} = require('./utils');

function* prepare(options) {
  yield fs.ensureDirAsync(config.paths.root);
  yield [
    fs.ensureDirAsync(config.paths.temp),
    fs.ensureFileAsync(config.paths.config),
    fs.ensureFileAsync(config.paths.lock)
  ];

  const configJSON = yield ensureReadJson(config.paths.config);

  yield ensureReadJson(config.paths.lock);

  return yield [
    _.isEmpty(configJSON) ? fs.writeJsonAsync(config.paths.config, config.defaults) : Promise.resolve()
  ]
}

module.exports = function (options) {
  return prepare(options);
};