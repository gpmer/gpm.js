/**
 * Created by axetroy on 2017/3/23.
 */
import { EventEmitter } from 'events';
const _ = require('lodash');
const fs = require('fs-extra');

const config = require('./config');

class GlobalConfig extends EventEmitter {
  private hasInit: boolean = false;
  public entity: any = {};
  constructor() {
    super();
  }

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
    this.hasInit = true;
  }

  get(key) {
    return this.entity[key];
  }

  async set(key, value) {
    this.entity[key] = value;
    await fs.writeJson(config.paths.config, this.entity);
    return this.entity;
  }

  async remove(key) {
    this.entity[key] = null;
    delete this.entity[key];
    await fs.writeJson(config.paths.config, this.entity);
    return this.entity;
  }

  async reset() {
    this.entity = config.defaults;
    await fs.writeJson(config.paths.config, this.entity);
    return this.entity;
  }
}

export default new GlobalConfig();
