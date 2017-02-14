/**
 * Created by axetroy on 17-2-14.
 */

const path = require('path');
const process = require('process');

const _ = require('lodash');
const prettyjson = require('prettyjson');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));

const config = require('../config');
const {isExistPath} = require('../utils');
const lockFile = path.join(config.paths.root, 'lock.json');

function *reset(options) {
  yield fs.ensureDirAsync(config.paths.root);
  const hasExistConfig = yield isExistPath(config.paths.config);
  if (!hasExistConfig) {
    throw 'You need run command line: [gpm init] to init the program';
  }

  yield fs.writeJSONAsync(config.paths.config, require('../../default-config.json'));
  process.stdout.write(`Has reset the default config\n`);
}

module.exports = function (options) {
  return reset(options);
};