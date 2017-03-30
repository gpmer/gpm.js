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
const clipboardy = require('clipboardy');
const __ = require('i18n').__;

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
    throw new Error(__('commands.add.log.invalid_url', { repo }));
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
        message: __('commands.add.log.confirm_cover', {
          path: normalizePath(repoDir, options).yellow.underline
        }).white,
        default: false
      })).result;
    }
    if (!confirmCover) {
      !options.nolog && logger.info(__('global.tips.good_bye'));
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
          __('commands.add.log.make_sure_install', { bin: 'Git'.green })
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
  if (!options.ignoreRc) {
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
  }

  const entity = _.extend({}, gitInfo, { path: repoDir });
  delete entity.toString;
  yield registry.add(entity);

  if (!options.nolog) {
    let finallyPath = normalizePath(repoDir, options);
    logger.info(
      __('commands.add.log.info_add_success', {
        path: finallyPath.green.underline
      })
    );
    try {
      clipboardy.writeSync(finallyPath);
      logger.info(
        __('commands.add.log.info_copy_clipboard', { key: '<CTRL+V>'.green })
      );
    } catch (err) {
      logger.warn(__('commands.add.log.warn_copy_clipboard'));
    }
  }

  const plugins = plugin.get(ACTION);

  process.chdir(entity.path);

  while (plugins.length) {
    const plugin = plugins.shift();
    const task = observatory.add(
      __('commands.add.log.info_run_plugin', {
        name: ('gpm-plugin-' + plugin.name).green
      })
    );
    yield new Promise(function(resolve, reject) {
      if (!_.isFunction(plugin.add)) {
        reject(
          new Error(
            __('commands.add.log.err_run_plugin', {
              name: plugin.name.red
            })
          )
        );
      } else {
        plugin.add.call(entity, err => {
          if (err) {
            task.fail(__('global.tips.fail'));
            reject(err);
          } else {
            task.done('global.tips.success');
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
