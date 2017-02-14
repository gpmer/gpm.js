/**
 * Created by axetroy on 17-2-14.
 */

const Promise = require('bluebird');
const prettyjson = require('prettyjson');
const fs = Promise.promisifyAll(require('fs-extra'));

const {isExistPath} = require('../utils');
const config = require('../config');

function *init(options) {
  yield fs.ensureDirAsync(config.paths.root);
  const hasExistConfig = yield isExistPath(config.paths.config);

  if (!hasExistConfig) {
    yield fs.writeJSONAsync(config.paths.config, require(config.paths.defaultConfig));
    console.log(`Init done: ${config.paths.config.green.underline}`);
  } else {

  }

  const gpmConfig = yield fs.readJSONAsync(config.paths.config);
  console.log(prettyjson.render(gpmConfig));
}

module.exports = function (options) {
  return init(options);
};