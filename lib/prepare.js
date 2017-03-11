/**
 * Created by axetroy on 17-2-15.
 */

const _ = require('lodash');
const Promise = require('bluebird');
const co = require('co');
const fs = Promise.promisifyAll(require('fs-extra'));
const config = require('./config');
const storage = require('node-persist');

/**
 1. make sure root directory has exist
 2. make sure [temp, config] has exist
 3. make sure [config] must be a json file even it's empty
 */
module.exports = function (options) {
  return co(function *() {
    yield fs.ensureDirAsync(config.paths.root);
    yield [
      fs.ensureDirAsync(config.paths.temp),
      fs.ensureFileAsync(config.paths.config)
    ];

    const configRaw = yield fs.readFileAsync(config.paths.config);

    let configJSON = {};

    try {
      configJSON = JSON.parse(configRaw);
    } catch (err) {
    }

    yield storage.init({
      dir: config.paths.temp,
      stringify: JSON.stringify,
      parse: JSON.parse,
      encoding: 'utf8',
      logging: false,  // can also be custom logging function
      continuous: true, // continously persist to disk
      interval: false, // milliseconds, persist to disk on an interval
      ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS
      expiredInterval: 7 * 24 * 3600 * 1000,     // clear cache in 7 days
      // in some cases, you (or some other service) might add non-valid storage files to your
      // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
      forgiveParseErrors: false // [NEW]
    });

    return yield [
      _.isEmpty(configJSON) ? fs.writeJsonAsync(config.paths.config, config.defaults) : Promise.resolve()
    ]
  });
};