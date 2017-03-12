/**
 * Created by axetroy on 17-2-15.
 */

const process = require('process');
const os = require('os');

const co = require('co');

const prettyjson = require('prettyjson');

const pkg = require('../../package.json');
const config = require('../config');

function *runtime(argv, options) {
  const info = {
    node: process.version,
    [config.name]: pkg.version,
    arch: os.arch(),
    os: os.type() + ' ' + os.release(),
    platform: os.platform()
  };

  !options.nolog && process.stdout.write(prettyjson.render(info) + '\n');
  return info;
}

module.exports = function (argv = {}, options = {}) {
  return co.wrap(runtime)(argv, options);
};