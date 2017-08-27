/**
 * Created by axetroy on 17-2-14.
 */
const path = require('path');

const gitUrlParse = require('git-url-parse');
const prettyjson = require('prettyjson');
const fs = require('fs-extra');
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

import { isExistPath, isLink, normalizePath, runShell } from '../utils';
import config from '../config';
import plugin from '../plugin';
import registry from '../registry';
import globalConfig from '../global-config';
import Gpmrc from '../gpmrc';

const ACTION = 'add';

interface Argv$ {
  repo: string;
}

interface Options$ {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
  name?: string;
  plugin: string;
  ignoreRc: boolean;
}

async function add(repo: string, options: Options$) {
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
  if (await isExistPath(repoDir)) {
    if (options.force) {
      confirmCover = true;
    } else {
      confirmCover = (await prompt({
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

  await fs.ensureDir(baseDir);
  await fs.ensureDir(sourceDir);
  await fs.ensureDir(ownerDir);
  await fs.ensureDir(randomTemp);

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

  await runShell(`git clone ${gitInfo.href}`, {
    cwd: randomTemp,
    stdio: 'inherit'
  });

  // if it's a link, then unlink first
  if (await isLink(repoDir)) await fs.unlink(repoDir);
  await fs.remove(repoDir);
  await fs.move(tempDir, repoDir);
  await fs.remove(randomTemp);

  /**
   * parse the .gpmrc
   * valid argument:
   *    name: the repo's name
   *    hooks:
   *      add: run command after add repo
   */
  if (!options.ignoreRc) {
    const gpmrc = new Gpmrc();
    await gpmrc.load(repoDir);
    if (gpmrc.exist) {
      const alias = gpmrc.rc.name;
      if (alias && alias !== gitInfo.name) {
        let newRepoDir = path.join(
          ownerDir,
          _.isString(options.name) ? options.name : alias
        );
        await fs.move(repoDir, newRepoDir);
        repoDir = newRepoDir;
      }
      await gpmrc.runHook('add', { cwd: repoDir }).catch(err => {
        console.error(err);
        return Promise.resolve();
      });
    }
  }

  const entity = _.extend({}, gitInfo, { path: repoDir });
  delete entity.toString;
  await registry.add(entity);

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

  // 获取add的相关插件
  const plugins = plugin.get(ACTION);

  process.chdir(entity.path);

  while (plugins.length) {
    const plugin: any = plugins.shift();
    const task = observatory.add(
      __('commands.add.log.info_run_plugin', {
        name: ('gpm-plugin-' + plugin.name).green
      })
    );
    await new Promise((resolve, reject) => {
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

export default async function(argv: Argv$, options: Options$) {
  plugin.load(ACTION, options.plugin);
  return await add(argv.repo, options);
}
