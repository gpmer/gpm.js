/**
 * Created by axetroy on 17-2-15.
 */

const _ = require('lodash');
const prettyjson = require('prettyjson');
const Promise = require('bluebird');
const log4js = require('log4js');
const logger = log4js.getLogger('LS');

const config = require('../config');
const {readJsonAsync} = require('../common');

function *importHandler(dir, options) {
  console.log('I want import', dir, 'but wait...');
}

module.exports = function (dir, options) {
  return importHandler(dir, options);
};