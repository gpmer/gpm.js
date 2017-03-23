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

class Plugin {
  constructor() {
    this.plugins = {};
    this.$ = this.loader();
  }

  get(action) {
    return (this.plugins[action] || []).slice();
  }

  load(action, pluginName) {
    const container = this.plugins[action] = this.plugins[action] || [];
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

  loader() {
    const output = {};
    const modules = fs.readdirSync(GLOBAL_NODE_MODULES_PATH) || [];
    modules.filter(module => /gpm-plugin-[\w\-\_]+/.test(module))
      .forEach(function (moduleName) {
        const shortName = moduleName.replace(/^gpm-plugin-/, '');
        output[camelcase(shortName)] = require(path.join(GLOBAL_NODE_MODULES_PATH, moduleName));
      });
    this.$ = output;
    return output;
  }

}

module.exports = new Plugin();