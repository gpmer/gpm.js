/**
 * Created by axetroy on 17-3-13.
 */
const process = require('process');

const Promise = require('bluebird');
const log4js = require('log4js');
const co = require('co');
const storage = require('node-persist');

const config = require('../config');
const pluginLoader = require('../plugin');

const ACTION = Symbol('foreach every repository');

function* foreach(argv, options) {
  let repositories = (yield storage.getItem('repositories')) || [];
  const cwd = process.cwd();
  while (repositories.length) {
    let repository = repositories.shift();
    const plugins = pluginLoader.get(ACTION);
    yield new Promise(function (resolve, reject) {
      process.chdir(repository.path);
      plugins.forEach(function (plugin) {
        const runner = plugin.foreach;
        if (typeof runner !== 'function') throw new Error('Plugin don\'t export foreach method.');
        runner.call(repository, function (err) {
          err ? reject(err) : resolve();
        });
      });
    });
  }
  process.chdir(cwd);
}

module.exports = function (argv = {}, options = {}) {
  pluginLoader.load(ACTION, argv.plugin);
  return co.wrap(foreach)(argv, options);
};
