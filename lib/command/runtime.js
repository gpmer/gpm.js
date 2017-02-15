/**
 * Created by axetroy on 17-2-15.
 */

const process = require('process');
const os = require('os');

const prettyjson = require('prettyjson');

const pkg = require('../../package.json');
const config = require('../config');

function *runtime(options) {
  const info = {
    node: process.version,
    [config.name]: pkg.version,
    arch: os.arch(),
    os: os.type() + ' ' + os.release(),
    platform: os.platform()
  };

  console.log(prettyjson.render(info));
}

module.exports = function (options) {
  return runtime(options);
};