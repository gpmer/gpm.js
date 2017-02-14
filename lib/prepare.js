/**
 * Created by axetroy on 17-2-15.
 */

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const config = require('./config');

function* prepare(options) {
  yield fs.ensureDirAsync(config.paths.root);
  yield [
    fs.ensureDirAsync(config.paths.temp),
    fs.ensureFileAsync(config.paths.config),
    fs.ensureFileAsync(config.paths.lock)
  ];
  return yield [
    fs.statAsync(config.paths.config)
      .then(() => Promise.resolve())
      .catch(() => fs.writeJsonAsync({})),
    fs.statAsync(config.paths.lock)
      .then(() => Promise.resolve())
      .catch(() => fs.writeJsonAsync({}))
  ]
}

module.exports = function (options) {
  return prepare(options);
};
