/**
 * Created by axetroy on 17-3-13.
 */
const EventEmitter = require('events').EventEmitter;
const process = require('process');
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const spawn = require('cross-spawn');
const fs = require('fs-extra');
let globalPackageLoader = require('global-modules-path');
require('console.table');

const { camelcase } = require('./utils');

const GLOBAL_NODE_MODULES_PATH = globalPackageLoader.getPath('./');

class Plugin extends EventEmitter {
  constructor() {
    super();
    this.plugins = {};
    this.$ = this.loader();
  }

  get(action) {
    return (this.plugins[action] || []).slice();
  }

  remove(pluginName) {
    return Promise(function(resolve, reject) {
      const uninstall = spawn(
        'npm',
        ['uninstall', `gpm-plugin-${pluginName}`],
        { stdio: 'inherit' }
      );
      uninstall.on('close', (code, signal) => {
        if (code !== 0) {
          reject(code);
          throw new Error(`Error Code: ${code}, Exist Signal: ${signal}`);
        } else {
          resolve(code);
        }
      });
    });
  }

  list() {
    let table = [];
    _.each(this.$, (v, name) => {
      const pkg = fs.readJsonSync(path.join(v.__gpm__path__, 'package.json'));
      table.push({
        name: (pkg.name || '').yellow,
        description: (pkg.description || '').gray,
        homepage: pkg.homepage || ''
      });
    });
    console.table(table);
    return table;
  }

  load(action, pluginName) {
    const container = (this.plugins[action] = this.plugins[action] || []);
    let plugin = {};
    if (pluginName) {
      const pluginFullName = `gpm-plugin-${pluginName}`;
      const pluginPath = globalPackageLoader.getPath(pluginFullName);
      if (!pluginFullName) {
        throw new Error(
          `Can not found ${pluginFullName}, Please make sure you have install it in global`
        );
      }
      try {
        plugin = require(pluginPath);
      } catch (err) {
        throw err;
      }
      plugin.name = plugin.name || pluginName;
      if (_.isEmpty(plugin))
        throw new Error(
          `Can not found ${pluginFullName}, Please make sure you have install it in global`
        );
      container.push(plugin);
    }
    return plugin;
  }

  loader() {
    const output = {};
    const modules = fs.readdirSync(GLOBAL_NODE_MODULES_PATH) || [];
    modules
      .filter(module => /gpm-plugin-[\w\-\_]+/.test(module))
      .forEach(moduleName => {
        const shortName = moduleName.replace(/^gpm-plugin-/, '');
        const modulePath = path.join(GLOBAL_NODE_MODULES_PATH, moduleName);
        const module = require(modulePath);
        module.__gpm__path__ = modulePath;
        output[camelcase(shortName)] = module;
      });
    return output;
  }
}

module.exports = new Plugin();
