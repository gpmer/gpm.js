/**
 * Created by axetroy on 17-2-14.
 */
const path = require('path');
const process = require('process');

const co = require('co');
const gitUrlParse = require('git-url-parse');
const Promise = require('bluebird');
const prettyjson = require('prettyjson');
const fs = Promise.promisifyAll(require('fs-extra'));
const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('ADD');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const observatory = require('observatory');
const which = require('which');
const uniqueString = require('unique-string');

const cwd = process.cwd();

const { isExistPath, isLink, normalizePath, runShell } = require('../utils');
const config = require('../config');
const plugin = require('../plugin');
const registry = require('../registry');
const globalConfig = require('../global-config');
const Gpmrc = require('../gpmrc');

const ACTION = Symbol('after add repository');

function* add(repo, options) {
  const gitInfo = gitUrlParse(repo);

  if (!gitInfo || !gitInfo.owner || !gitInfo.name) {
    throw new Error(
      `Invalid Repository Url: ${repo.green}, please Make sure it is right`
    );
  }

  const randomTemp = path.join(config.paths.temp, uniqueString());
  const tempDir = path.join(randomTemp, gitInfo.name);
  const baseDir = path.join(
    config.paths.home,
    globalConfig.entity.base || config.defaults.base
  );
  const sourceDir = path.join(baseDir, gitInfo.source);
  const ownerDir = path.join(sourceDir, gitInfo.owner);
  let repoDir = path.join(
    ownerDir,
    typeof options.name === 'string' ? options.name : gitInfo.name
  );

  let confirmCover = false;
  if (yield isExistPath(repoDir)) {
    if (options.force) {
      confirmCover = true;
    } else {
      confirmCover = (yield prompt({
        type: 'confirm',
        name: 'result',
        message: `Are you sure to cover ${normalizePath(repoDir, options).yellow.underline}`.white,
        default: false
      })).result;
    }
    if (!confirmCover) {
      !options.nolog && logger.info('ok! Good bye.');
      return process.exit(1);
    }
  }

  yield fs.ensureDirAsync(baseDir);
  yield fs.ensureDirAsync(sourceDir);
  yield fs.ensureDirAsync(ownerDir);
  yield fs.ensureDirAsync(randomTemp);

  try {
    const git = which.sync('git');
    if (!git) {
      return Promise.reject(
        new Error(
          `Can not Found ${'Git'.green} environment variable in system, please make sure you has install Git`
        )
      );
    }
  } catch (err) {
    throw err;
  }

  yield runShell(`git clone ${gitInfo.href}`, {
    cwd: randomTemp,
    stdio: 'inherit'
  });

  // if it's a link, then unlink first
  if (yield isLink(repoDir)) yield fs.unlinkAsync(repoDir);
  yield fs.removeAsync(repoDir);
  yield fs.moveAsync(tempDir, repoDir);
  yield fs.removeAsync(randomTemp);

  /**
   * parse the .gpmrc
   * valid argument:
   *    name: the repo's name
   *    hooks:
   *      add: run command after add repo
   */
  const gpmrc = new Gpmrc();
  yield gpmrc.load(repoDir);
  if (gpmrc.exist) {
    const alias = gpmrc.rc.name;
    if (alias && alias !== gitInfo.name) {
      let newRepoDir = path.join(
        ownerDir,
        _.isString(options.name) ? options.name : alias
      );
      yield fs.moveAsync(repoDir, newRepoDir);
      repoDir = newRepoDir;
    }
    yield gpmrc.runHook('add', { cwd: repoDir }).catch(err => {
      console.error(err);
      return Promise.resolve();
    });
  }

  const entity = _.extend({}, gitInfo, { path: repoDir });
  delete entity.toString;
  yield registry.add(entity);

  !options.nolog &&
    logger.info(
      `Repository has been add to ${normalizePath(repoDir, options).green.underline}`
    );

  const plugins = plugin.get(ACTION);

  process.chdir(entity.path);

  while (plugins.length) {
    const plugin = plugins.shift();
    const task = observatory.add(
      `Running plugin: ${('gpm-plugin-' + plugin.name).green}`
    );
    yield new Promise(function(resolve, reject) {
      if (!_.isFunction(plugin.add)) {
        reject(
          new Error(`ERROR: Plugin ${plugin.name} do not export [add] method`)
        );
      } else {
        plugin.add.call(entity, err => {
          if (err) {
            task.fail('Fail');
            reject(err);
          } else {
            task.done('Success!');
            resolve();
          }
        });
      }
    });
  }

  process.chdir(cwd);
}

module.exports = function(argv, options) {
  plugin.load(ACTION, options.plugin);
  return co.wrap(add)(argv.repo, options);
};
