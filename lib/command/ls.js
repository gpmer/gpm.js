/**
 * Created by axetroy on 17-2-14.
 */

const _ = require('lodash');
const prettyjson = require('prettyjson');
const Promise = require('bluebird');

const config = require('../config');
const {readJsonAsync} = require('../common');

function *ls(options) {
  const lockJSON = yield readJsonAsync(config.paths.lock);

  _.each(lockJSON, function (v1, source) {
    _.each(v1, function (v2, owner) {
      _.each(v2, function (v3, name) {
        lockJSON[source][owner][name] = v3.path;
      });
    });
  });

  process.stdout.write(prettyjson.render(lockJSON) + '\n');
}

module.exports = function (options) {
  return ls(options);
};