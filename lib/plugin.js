/**
 * Created by axetroy on 17-3-13.
 */
const path = require('path');
const npm = require('global-npm');
const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const GLOBAL_NODE_MODULES_PATH = path.join(npm.GLOBAL_NPM_PATH, '../');

const {camelcase} = require('./utils');

const plugins = {};
let allPlugins;

/**
 * const $ = pluginLoader();
 * $.xxx
 * $.xxx
 */
function pluginLoader() {
  if (allPlugins) return allPlugins;
  const output = {};
  const modules = fs.readdirSync(GLOBAL_NODE_MODULES_PATH) || [];
  __plugins__ = modules.filter(module => /gpm-plugin-[\w\-\_]+/.test(module))
    .forEach(function (moduleName) {
      const shortName = moduleName.replace(/^gpm-plugin-/, '');
      output[camelcase(shortName)] = require(path.join(GLOBAL_NODE_MODULES_PATH, moduleName));
    });
  allPlugins = output;
  return allPlugins;
}

function get(action) {
  return (plugins[action] || []).slice();
}

function load(action, pluginName) {
  const container = plugins[action] = plugins[action] || [];
  let plugin = {};
  if (pluginName) {
    const pluginFullName = `gpm-plugin-${pluginName}`;
    try {
      plugin = require(path.join(GLOBAL_NODE_MODULES_PATH, pluginFullName));
    } catch (err) {
      throw err;
    }
    plugin.name = plugin.name || pluginName;
    if (_.isEmpty(plugin)) throw new Error(`Can not found ${pluginFullName}, Please make sure you have install it in global`);
    container.push(plugin);
  }
  return plugin;
}

module.exports = {
  get,
  load,
  pluginLoader
};