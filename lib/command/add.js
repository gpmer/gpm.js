/**
 * Created by axetroy on 17-2-14.
 */
const path = require('path');
const process = require('process');

const gitUrlParse = require("git-url-parse");
const Promise = require('bluebird');
const prettyjson = require('prettyjson');
const fs = Promise.promisifyAll(require('fs-extra'));
const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('ADD');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const storage = require('node-persist');

const npm = require('global-npm');
const GLOBAL_NODE_MODULES_PATH = path.join(npm.GLOBAL_NPM_PATH, '../');
const cwd = process.cwd();

const {isExistPath, spawnShell, isLink} = require('../utils');
const config = require('../config');

const plugins = [];

function *add(repo, options) {
  const gitInfo = gitUrlParse(repo);

  if (!gitInfo || !gitInfo.owner || !gitInfo.name) {
    throw new Error(`Invalid Repository Url: ${repo.green}, please Make sure it is right`);
  }

  const gpmConfig = yield fs.readJsonAsync(config.paths.config);

  const tempDir = path.join(config.paths.temp, gitInfo.name);
  const baseDir = path.join(config.paths.home, gpmConfig.base);
  const sourceDir = path.join(baseDir, gitInfo.source);
  const ownerDir = path.join(sourceDir, gitInfo.owner);
  const repoDir = path.join(ownerDir, typeof options.name === 'string' ? options.name : gitInfo.name);

  let confirmCover = false;
  if (yield isExistPath(repoDir)) {
    if (options.force) {
      confirmCover = true;
    } else {
      confirmCover = (yield prompt({
        type: 'confirm',
        name: 'result',
        message: `Are you sure to replace ${repoDir.yellow.underline}`.white,
        "default": false,
      })).result;
    }
    if (!confirmCover) {
      logger.info('ok! Good bye.');
      return process.exit(1);
    }
  }

  yield fs.ensureDirAsync(baseDir);
  yield fs.ensureDirAsync(sourceDir);
  yield fs.ensureDirAsync(ownerDir);
  yield fs.removeAsync(tempDir);

  try {
    yield spawnShell('git', ['--help'])
  }
  catch (err) {
    throw new Error(`Can not Found ${'Git'.green} environment variable in system, please make sure you has install Git`);
  }

  yield spawnShell('git', ['clone', gitInfo.href], {cwd: config.paths.temp});

  // if it's a link, then unlink first
  if (yield isLink(repoDir)) yield fs.unlinkAsync(repoDir);
  yield fs.removeAsync(repoDir);
  yield fs.moveAsync(tempDir, repoDir);

  let repositories = (yield storage.getItem('repositories')) || [];
  const entity = _.extend({}, gitInfo, {path: repoDir});
  delete entity.toString;
  !confirmCover && repositories.push(entity);
  yield storage.setItem('repositories', repositories);

  logger.info(`Repository has been add to ${repoDir.green.underline}`);

  const havePlugins = !!plugins.length;

  while (plugins.length) {
    const plugin = plugins.shift();
    yield new Promise(function (resolve, reject) {
      process.chdir(entity.path);
      plugin.runner.call(entity, function (err) {
        err ? reject(err) : resolve();
      });
    });
  }

  process.chdir(cwd);
  havePlugins && logger.info(`Plugin done`);
}

module.exports = function (repo, options) {
  const pluginName = options.plugin;
  if (pluginName) {
    const pluginFullName = `gpm-plugin-${pluginName}`;
    let plugin = {};
    try {
      plugin = require(path.join(GLOBAL_NODE_MODULES_PATH, pluginFullName));
    } catch (err) {
      throw err;
    }
    if (_.isEmpty(plugin) || !plugin.add) throw new Error(`Can not found ${pluginFullName}, Please make sure you have install it in global`);
    const pluginRunner = plugin.add;
    if (_.isFunction(pluginRunner)) {
      plugins.push({
        name: pluginName,
        runner: pluginRunner
      });
    }
  }

  return add(repo, options);
};