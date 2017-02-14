/**
 * Created by axetroy on 17-2-14.
 */

const Promise = require('bluebird');
const prettyjson = require('prettyjson');
const fs = Promise.promisifyAll(require('fs-extra'));

const {isExistPath} = require('../utils');
const config = require('../config');

function *remove(repo, options) {

}

module.exports = function (repo, options) {
  return remove(repo, options);
};