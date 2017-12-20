/**
 * Created by axetroy on 17-2-14.
 */

const path = require('path');
const prettyjson = require('prettyjson');
const inquirer = require('inquirer');
const _ = require('lodash');
const gitUrlParse = require('git-url-parse');
const clipboardy = require('clipboardy');
const __ = require('i18n').__;
import chalk from 'chalk';

import config from '../config';
import registry, { Target$ } from '../registry';
import { normalizePath } from '../utils';
import { info, warn } from '../logger';

interface Argv$ {}

interface Options$ {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
}

export interface ExtendTarget$ extends Target$ {
  __index__: string;
  __search__: string;
}

export function decoratorIndex<T>(repo: any): T {
  repo.__index__ = `${repo.source.red}:${chalk.yellow('@' + repo.owner)}/${
    repo.name.green
  }(${path.relative(config.paths.home, repo.path)})`;
  return repo;
}

export default async function search(argv: Argv$, options: Options$) {
  let repositories = registry.repositories.map(v => decoratorIndex(v));

  const answer = await inquirer.prompt([
    {
      name: 'repository',
      message: __('commands.find.log.info_type_to_search') + ':',
      type: 'autocomplete',
      pageSize: 10,
      source: (answers, input) =>
        Promise.resolve(
          registry
            .find(input)
            .map(v => decoratorIndex(v))
            .map(repo => (<any>repo).__index__)
        )
    }
  ]);

  const target: ExtendTarget$ = _.find(
    repositories,
    (v: ExtendTarget$) => v.__index__ === answer.repository
  );

  _.extend(target, gitUrlParse(target.href));

  target.path = normalizePath(target.path, options);

  delete target.__index__;
  delete target.__search__;
  delete target.toString;

  process.stdout.write(prettyjson.render(target) + '\n');

  try {
    clipboardy.writeSync(target.path);
    info(__('global.tips.past', { key: chalk.green('<CTRL+V>') }));
  } catch (err) {
    warn(__('global.tips.copy_fail'));
  }
}
