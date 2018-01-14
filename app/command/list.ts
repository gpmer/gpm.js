/**
 * Created by axetroy on 17-2-14.
 */

const path = require('path');
import chalk from 'chalk';
const _ = require('lodash');
const prettyjson = require('prettyjson');
import * as i18n from 'i18n';
const { __ } = i18n;

import config from '../config';
import { normalizePath } from '../utils';
import registry, { Target$, Json$ } from '../registry';
import { warn, info } from '../logger';

interface Argv$ {
  key?: string;
}

interface Options$ {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
}

async function ls(key: string, options: Options$): Promise<Json$ | void> {
  if (registry.isEmpty)
    return warn(__('commands.list.log.warn_empty_registry'));

  let repositories: Target$[] = key
    ? registry.find(key)
    : registry.repositories.slice();

  if (_.isEmpty(repositories))
    return info(__('commands.list.log.err_not_found'));

  const result: Json$ = registry.toJson(repositories);

  const basePath: string = path.join(config.paths.home, config.defaults.base);

  const ROOT: string = chalk.white(normalizePath(basePath, options));

  !options.nolog &&
    process.stdout.write(prettyjson.render({ [ROOT]: result }) + '\n');
  return result;
}

export default async function(
  argv: Argv$,
  options: Options$
): Promise<Json$ | void> {
  return await ls(argv.key || '', options);
}
