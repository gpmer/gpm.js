/**
 * Created by axetroy on 17-2-14.
 */

const prettyjson = require('prettyjson');
const fs = require('fs-extra');
const _ = require('lodash');
const inquirer = require('inquirer');
const log4js = require('log4js');
const __ = require('i18n').__;

const logger = log4js.getLogger('REMOVE');
export const prompt: any = inquirer.createPromptModule();

import registry, { Target$ } from '../registry';
import { normalizePath } from '../utils';
import { decoratorIndex } from './find';

interface Argv$ {
  owner: string;
  repo: string;
}

interface Options$ {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
}

export default async function remove(argv: Argv$, options: Options$) {
  let repositories = registry.repositories.slice();
  let target: Target$;
  if (argv.owner) {
    if (!argv.repo)
      return logger.info(
        __('commands.remove.log.err_missing_repo', { owner: argv.owner })
      );
    target = _.find(
      repositories,
      repo => repo.owner === argv.owner.trim() && repo.name === argv.repo.trim()
    );
  } else {
    repositories = _.map(repositories, decoratorIndex);

    const answer = await inquirer.prompt([
      {
        name: 'repository',
        message: __('commands.remove.log.info_type_to_search') + ':',
        type: 'autocomplete',
        pageSize: 10,
        source: (answers, input) =>
          Promise.resolve(
            registry.find(input).map(decoratorIndex).map(repo => repo.__index__)
          )
      }
    ]);

    target = _.find(repositories, v => v.__index__ === answer.repository);
  }

  if (
    (await prompt(
      {
        type: 'confirm',
        name: 'result',
        message:
          `[${'DANGER'.red}]` +
          __('commands.remove.log.warn_confirm_del', {
            repo: normalizePath(target.path, options).red
          }) +
          ':',
        default: false
      }
    )).result == false
  ) {
    !options.nolog && logger.info(__('global.tips.good_bye'));
    return process.exit(0);
  }

  await fs.ensureDir(target.path);
  await fs.emptyDir(target.path);
  await fs.remove(target.path);

  await registry.remove(target);

  logger.info(
    __('commands.remove.log.del', {
      repo: normalizePath(target.path, options).green
    })
  );
}
