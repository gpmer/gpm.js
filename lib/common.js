/**
 * Created by axetroy on 17-2-14.
 */

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));

const {isExistPath} = require('./utils');

function *ensureJsonFile(filePath) {
  const isExistLockFile = yield isExistPath(filePath);
  if (!isExistLockFile) {
    yield fs.writeJsonAsync(filePath, {});
  }
}

function *readJsonAsync(filePath) {
  yield ensureJsonFile(filePath);
  return yield fs.readJsonAsync(filePath);
}

function *writeJsonAsync(filePath, data) {
  yield ensureJsonFile(filePath);
  return yield fs.writeJsonAsync(filePath, data);
}

module.exports = {
  readJsonAsync,
  writeJsonAsync
};