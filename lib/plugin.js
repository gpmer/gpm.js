/**
 * Created by axetroy on 17-3-13.
 */
const path = require('path');
const npm = require('global-npm');
const _ = require('lodash');
const GLOBAL_NODE_MODULES_PATH = path.join(npm.GLOBAL_NPM_PATH, '../');

const plugins = {};

function get(action) {
  return (plugins[action] || []).slice();
}

function load(action, pluginName) {
  const container = plugins[action] = plugins[action] || [];
  let plugin;
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
  } else {
    throw new Error(`Invalid plugin name: ${pluginName}`);
  }
  return plugin;
}

module.exports = {
  get,
  load
};