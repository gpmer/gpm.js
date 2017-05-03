/**
 * Created by axetroy on 17-2-15.
 */

const co = require('co');
const fs = require('fs-extra');
const i18n = require('i18n');

const config = require('./config');
const globalConfig = require('./global-config');
const registry = require('./registry');

/**
 1. make sure root directory has exist
 2. make sure [temp, config] has exist
 3. make sure [config] must be a json file even it's empty
 */
module.exports = function(options) {
  return co(function*() {
    yield fs.ensureDir(config.paths.root);
    yield [
      fs.ensureDir(config.paths.temp),
      yield globalConfig.init(),
      yield registry.init()
    ];

    const supports = ['en_US', 'zh_CN'];

    const currentLocale = globalConfig.get('locale') || config.defaults.locale;

    i18n.configure({
      locales: ['en_US', 'zh_CN'],
      defaultLocale: supports.includes(currentLocale)
        ? currentLocale
        : config.defaults.locale,
      directory: config.paths.project + '/locales',
      extension: '.json',
      register: global,
      objectNotation: true
    });
  });
};
