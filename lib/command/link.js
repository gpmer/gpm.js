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

function *relink(options) {
  
}

module.exports = function (options) {
  return relink(options);
};