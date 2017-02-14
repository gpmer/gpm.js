/**
 * Created by axetroy on 17-2-14.
 */

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));

const {isExistPath} = require('./utils');

function *ensureJsonFile(filePath) {
  const isExistLockFile = yield isExistPath(filePath);
  if (!isExistLockFile) yield fs.writeJSONAsync(filePath, {});
}

function *readJSON(filePath) {
  yield ensureJsonFile(filePath);
  return yield fs.readJSONAsync(filePath);
}

function *writeJSON(filePath, data) {
  yield ensureJsonFile(filePath);
  return yield fs.writeJSONAsync(filePath, data);
}

module.exports = {
  readJSON,
  writeJSON
};