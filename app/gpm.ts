const startTime: Date = new Date();
require("@axetroy/graceful")(true);
import * as path from "path";
const program = require("caporal");
import * as inquirer from "inquirer";
import prepare from "./prepare";
import checkUpdate from "./check-update";
import globalConfig from "./global-config";
import chalk from "chalk";
import * as i18n from "i18n";
import { paths } from "./config";
import Gpmrc, { Rc$ } from "./gpmrc";
const { __ } = i18n;

// command handler
import listHandler from "./command/list";
import relinkHandler from "./command/relink";
import addHandler from "./command/add";
import runtimeHandler, { RuntimeInfo$ } from "./command/runtime";
import configHandler from "./command/config";
import cleanHandler from "./command/clean";
import pruneHandler from "./command/prune";
import findHandler from "./command/find";
import removeHandler from "./command/remove";
import {
  IRuntimeOption,
  IAddOption,
  IRemoveOption,
  ICleanOption,
  IRelinkOption,
  IFindOption,
  IPruneOption,
  IListOption
} from "./type";
import { Json$ } from "./registry";

inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

const pkg = require(path.join(__dirname, "../package.json"));

class Gpm {
  public paths = paths;
  public version: string = pkg.version;
  public description: string = pkg.description;
  private inited = false;
  async runtime(options: IRuntimeOption = {}): Promise<RuntimeInfo$> {
    return runtimeHandler(options);
  }
  async init() {
    try {
      await prepare();

      if ((globalConfig.entity.checkUpgrade + "").trim() === "true") {
        checkUpdate();
      }
      this.inited = true;
    } catch (err) {
      this.inited = true;
      throw err;
    }
  }
  async getGlobalConfig() {
    return globalConfig.getConfig();
  }
  async getCurrentRc(dir: string = process.cwd()): Promise<Rc$> {
    return new Gpmrc().getRc(dir);
  }
  async add(repo: string, options: IAddOption = {}) {
    return addHandler(repo, options);
  }
  async remove(owner, repo, options: IRemoveOption = {}) {
    return removeHandler(owner, repo, options);
  }
  async clean(options: ICleanOption = {}) {
    return cleanHandler(options);
  }
  async relink(options: IRelinkOption = {}) {
    return relinkHandler(options);
  }
  async find(options: IFindOption = {}) {
    return findHandler(options);
  }
  async prune(options: IPruneOption = {}) {
    return pruneHandler(options);
  }
  async list(key?: string, options: IListOption = {}): Promise<Json$ | void> {
    return listHandler(key, options);
  }
  async config(argv, options = {}) {
    return configHandler(argv, options);
  }
}

export { Gpm };
