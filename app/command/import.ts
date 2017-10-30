/**
 * Created by axetroy on 17-2-15.
 */

const path = require('path');
const _ = require('lodash');
import chalk from 'chalk';
const fs = require('fs-extra');
const gitUrlParse = require('git-url-parse');
const inquirer = require('inquirer');
const __ = require('i18n').__;

export const prompt: any = inquirer.createPromptModule();
import registry from '../registry';
import config from '../config';
import {
  isGitRepoDir,
  parseGitConfigAsync,
  isExistPath,
  isLink,
  normalizePath
} from '../utils';
import { info, warn } from '../logger';

interface Argv$ {
  dir: string;
}

interface Options$ {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
  hard?: boolean;
  all?: boolean;
}

interface PromptResult$ {
  result?: boolean;
}

type action$ = 'move' | 'link';

async function importHandlerOneDir(
  targetPath: string,
  options: Options$
): Promise<void> {
  targetPath = path.resolve(process.cwd(), targetPath);
  const isGitDir: boolean = await isGitRepoDir(targetPath);

  if (!isGitDir)
    throw new Error(
      __('commands.import.log.invalid_repo', {
        repo: chalk.green(normalizePath(targetPath, options))
      })
    );

  let gitConfig = await parseGitConfigAsync({
    cwd: targetPath,
    path: path.join('.git', 'config')
  });

  const origin = gitConfig[`remote "origin"`] || {};

  if (!origin.url) throw new Error(__('commands.import.log.invalid_repo_url'));

  const gitInfo = gitUrlParse(origin.url);

  const configJSON = await fs.readJson(config.paths.config);

  const distPath = path.join(
    config.paths.home,
    configJSON.base,
    gitInfo.source,
    gitInfo.owner,
    gitInfo.name
  );

  if (process.platform === 'win32') {
    warn(__('commands.import.log.warn_cmd_require_pms'));
  }

  const hasExistDist: boolean = await isExistPath(distPath);
  const hasLinkDist: boolean = await isLink(distPath);

  if (hasExistDist || hasLinkDist) {
    let isConfirmReplace: PromptResult$ = { result: false };
    if (options.force) {
      isConfirmReplace = { result: true };
    } else {
      isConfirmReplace = <PromptResult$>await prompt(<any>{
        type: 'confirm',
        name: 'result',
        message: __('commands.import.log.confirm_replace', {
          path: chalk.green(normalizePath(distPath, options))
        }).white,
        ['default']: false
      });
    }

    if (!isConfirmReplace.result) {
      !options.nolog && info(__('global.tips.good_bye'));
      return;
    } else {
      // if it's a link, then unlink first
      if (hasLinkDist) await fs.unlink(distPath);
      await fs.remove(distPath);
    }
  }

  let action: action$;

  if (options.hard) {
    action = 'move';
    await fs.move(targetPath, distPath);
  } else {
    action = 'link';
    // make sure his parent dir has exist
    await fs.ensureDir(path.resolve(distPath, '../'));
    // specify dir only for window, other platform will ignore
    await fs.symlink(targetPath, distPath, 'dir');
  }

  await registry.add(_.extend({}, gitInfo, { path: distPath }));

  info(
    `${chalk.green(
      normalizePath(targetPath, options)
    )} has been ${action} to ${chalk.yellow(normalizePath(distPath, options))}`
  );
}

async function importHandler(
  targetPath: string,
  options: Options$
): Promise<void> {
  if (options.all) {
    const files: string[] = await fs.readdir(targetPath);
    while (files.length) {
      let file: string = <string>files.shift();
      try {
        await importHandlerOneDir(path.join(targetPath, file), options);
      } catch (err) {
        console.error(err);
      }
    }
  } else {
    await importHandlerOneDir(targetPath, options);
  }
}

export default function(argv: Argv$, options: Options$): Promise<void> {
  return importHandler(argv.dir, options);
}
