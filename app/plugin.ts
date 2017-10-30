/**
 * Created by axetroy on 17-3-13.
 */
import { EventEmitter } from 'events';
import * as path from 'path';
import * as spawn from 'cross-spawn';
import * as fs from 'fs-extra';
import * as globalPackageLoader from 'global-modules-path';
import * as _ from 'lodash';
import 'console.table';
import chalk from 'chalk';

import { camelcase } from './utils';

const GLOBAL_NODE_MODULES_PATH = globalPackageLoader.getPath('./');

export interface Plugin$ {
  name?: string;
  add?: Function;
  foreach?: Function;
  __gpm__path__?: string;
}

export interface Plugins$ {
  [actionName: string]: Plugin$[];
}

export interface PluginLoader$ {
  [pluginName: string]: Plugin$;
}

export interface PluginObj$ {
  name: string;
  description: string;
  homepage: string;
}

export interface LoaderOutput$ {
  [pluginName: string]: Plugin$;
}

// 支持的插件action
type ACTION$ = 'add' | 'foreach';

class Plugin extends EventEmitter {
  private plugins: Plugins$ = {};
  private $: PluginLoader$ = this.loader();
  constructor() {
    super();
  }

  /**
   * get a plugin
   * @param {ACTION$} action
   * @returns {Plugin$[]}
   */
  get(action: ACTION$): Plugin$[] {
    return (this.plugins[action] || []).slice();
  }

  /**
   * remove a plugin
   * @param {string} pluginName
   * @returns {Promise<number>}
   */
  remove(pluginName: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const uninstall = spawn(
        'npm',
        ['uninstall', `gpm-plugin-${pluginName}`],
        { stdio: 'inherit' }
      );
      uninstall.on('close', (code: number, signal: string) => {
        if (code !== 0) {
          reject(code);
          throw new Error(`Error Code: ${code}, Exist Signal: ${signal}`);
        } else {
          resolve(code);
        }
      });
    });
  }

  /**
   * print the list of plugins
   * @returns {PluginObj$[]}
   */
  list(): PluginObj$[] {
    let table: PluginObj$[] = [];
    _.each(this.$, (v: any, name) => {
      const pkg = fs.readJsonSync(path.join(v.__gpm__path__, 'package.json'));
      table.push({
        name: chalk.yellow(pkg.name || ''),
        description: chalk.gray(pkg.description || ''),
        homepage: pkg.homepage || ''
      });
    });
    console.table(table);
    return table;
  }

  /**
   * get one plugin
   * @param {string} action
   * @param {string} pluginName
   * @returns {Plugin$}
   */
  load(action: ACTION$, pluginName: string): Plugin$ {
    const container: Plugin$[] = (this.plugins[action] =
      this.plugins[action] || []);
    let plugin: Plugin$ = {};
    if (pluginName) {
      const pluginFullName: string = `gpm-plugin-${pluginName}`;
      const pluginPath: string = globalPackageLoader.getPath(pluginFullName);
      if (!pluginFullName) {
        throw new Error(
          `Can not found ${pluginFullName}, Please make sure you have install it in global`
        );
      }
      try {
        plugin = <Plugin$>require(pluginPath);
      } catch (err) {
        throw err;
      }
      plugin.name = plugin.name || pluginName;
      if (_.isEmpty(plugin))
        throw new Error(
          `Can not found ${chalk.green(
            pluginFullName
          )}, Please make sure you have install it in global`
        );
      container.push(plugin);
    }
    return plugin;
  }

  /**
   * load all plugins
   * @returns {LoaderOutput$}
   */
  loader(): LoaderOutput$ {
    const output: LoaderOutput$ = {};
    const modules: string[] = fs.readdirSync(GLOBAL_NODE_MODULES_PATH) || [];
    modules
      .filter(module => /gpm-plugin-[\w\-\_]+/.test(module))
      .forEach((moduleName: string) => {
        const shortName: string = moduleName.replace(/^gpm-plugin-/, '');
        const modulePath: string = path.join(
          GLOBAL_NODE_MODULES_PATH,
          moduleName
        );
        const module: Plugin$ = require(modulePath);
        module.__gpm__path__ = modulePath;
        output[camelcase(shortName)] = module;
      });
    return output;
  }
}

export default new Plugin();
