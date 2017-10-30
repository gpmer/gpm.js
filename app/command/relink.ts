/**
 * Created by axetroy on 17-2-14.
 */

const path = require('path');
import chalk from 'chalk';
const _ = require('lodash');
const fs = require('fs-extra');
const gitUrlParse = require('git-url-parse');
import globalConfig from '../global-config';
import registry from '../registry';
import config from '../config';
import {
  isGitRepoDir,
  parseGitConfigAsync,
  isDir,
  isExistPath,
  normalizePath,
  GitConfig$
} from '../utils';

interface Argv$ {}

interface Options$ {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
}

async function filterDir(files: string[]): Promise<string[]> {
  let output: string[] = [];
  files = files.slice();
  while (files.length) {
    let file: string = <string>files.shift();
    (await isDir(file)) && output.push(file);
  }
  return output;
}

async function loop(
  base: string,
  deepIndex: number = 0,
  options: Options$
): Promise<void> {
  if (!await isExistPath(base)) return;
  if (deepIndex >= 3) {
    if (!await isGitRepoDir(base)) return;
    let gitConfig: GitConfig$ = await parseGitConfigAsync({
      cwd: base,
      path: path.join('.git', 'config')
    });
    const origin = gitConfig[`remote "origin"`] || {};

    if (!origin.url || _.isEmpty(origin)) return;

    const gitInfo = gitUrlParse(origin.url);

    await registry.add(_.extend({}, gitInfo, { path: base, href: origin.url }));

    !options.nolog &&
      console.info(
        `${chalk.green(origin.url)} >>> ${chalk.yellow(
          normalizePath(base, options)
        )}`
      );
  } else {
    const files: string[] = ((await fs.readdir(base)) || []).map(file =>
      path.join(base, file)
    );
    const dirs: string[] = await filterDir(files);
    if (dirs.length) {
      deepIndex = deepIndex + 1;
      await dirs.map(dir => loop(dir, deepIndex, options));
    }
  }
}

async function relink(argv: Argv$, options: Options$): Promise<void> {
  const basePath: string = path.join(
    config.paths.home,
    globalConfig.entity.base
  );
  await registry.clean();
  await loop(basePath, 0, options);
}

export default async function(argv: Argv$, options: Options$): Promise<void> {
  return await relink(argv, options);
}
