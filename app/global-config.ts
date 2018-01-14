/**
 * Created by axetroy on 2017/3/23.
 */
import { EventEmitter } from 'events';
const _ = require('lodash');
const fs = require('fs-extra');

const config = require('./config');

class GlobalConfig extends EventEmitter {
  public entity: any = {};
  constructor() {
    super();
  }

  /**
   * Init the global config
   * @returns {Promise<void>}
   */
  async init() {
    await fs.ensureFile(config.paths.config);
    const globalConfigRaw = await fs.readFile(config.paths.config, {
      encoding: 'utf8'
    });
    let globalConfigJson = !_.isEmpty(globalConfigRaw)
      ? JSON.parse(globalConfigRaw)
      : {};
    if (_.isEmpty(globalConfigJson)) {
      this.entity = config.defaults;
      await fs.writeJson(config.paths.config, this.entity);
    } else {
      this.entity = globalConfigJson;
    }
  }

  /**
   * get config by a key
   * @param key
   * @returns {any}
   */
  get(key) {
    return this.entity[key];
  }

  /**
   * set a key
   * @param key
   * @param value
   * @returns {Promise<any>}
   */
  async set(key, value) {
    this.entity[key] = value;
    await fs.writeJson(config.paths.config, this.entity);
    return this.entity;
  }

  /**
   * remove a key
   * @param key
   * @returns {Promise<any>}
   */
  async remove(key) {
    this.entity[key] = null;
    delete this.entity[key];
    await fs.writeJson(config.paths.config, this.entity);
    return this.entity;
  }

  /**
   * reset to default config
   * @returns {Promise<any>}
   */
  async reset() {
    this.entity = config.defaults;
    await fs.writeJson(config.paths.config, this.entity);
    return this.entity;
  }
}

export default new GlobalConfig();
