/**
 * Created by axetroy on 17-2-15.
 */
import chalk from 'chalk';
const prettyjson = require('prettyjson');
const __ = require('i18n').__;

import { info, error } from '../logger';
import config from '../config';
import globalConfig from '../global-config';

type Action$ =
  | 'list'
  | 'LIST'
  | 'get'
  | 'GET'
  | 'set'
  | 'SET'
  | 'remove'
  | 'REMOVE'
  | 'reset'
  | 'RESET';

export interface Argv$ {
  key?: string;
  value?: string;
  action: Action$;
}

interface Options$ {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
}

async function configHandler(argv: Argv$, options: Options$): Promise<any> {
  const { action, key, value } = argv;
  let output = void 0;

  const actionUpperCase: Action$ = <Action$>action.toUpperCase();

  switch (actionUpperCase) {
    case 'LIST':
      output = globalConfig.entity;
      !options.nolog &&
        process.stdout.write(prettyjson.render(globalConfig.entity) + '\n');
      break;
    case 'GET':
      if (!key)
        return !options.nolog && error(__('commands.config.log.require_key'));
      output = globalConfig.get(key);
      !options.nolog && info(`${key}: ${output}`);
      break;
    case 'SET':
      if (!key)
        return !options.nolog && error(__('commands.config.log.require_key'));
      if (!value)
        return !options.nolog && error(__('commands.config.log.require_val'));
      output = await globalConfig.set(key, value);
      !options.nolog &&
        process.stdout.write(prettyjson.render(globalConfig.entity) + '\n');
      break;
    case 'REMOVE':
      if (!key)
        return !options.nolog && error(__('commands.config.log.require_key'));
      output = await globalConfig.remove(key);
      !options.nolog &&
        process.stdout.write(prettyjson.render(globalConfig.entity) + '\n');
      break;
    case 'RESET':
      output = await globalConfig.reset();
      !options.nolog && info(__('commands.config.log.info_reset'));
      !options.nolog &&
        process.stdout.write(prettyjson.render(globalConfig.entity) + '\n');
      break;
    default:
      !options.nolog &&
        info(
          __('commands.config.log.help', {
            cmd:
              config.name +
              ' config ' +
              chalk.yellow.underline('list|get|set|remove|reset') +
              chalk.green(' [key] [value]')
          })
        );
      break;
  }
  return output;
}

export default async function(argv: Argv$, options: Options$): Promise<any> {
  return configHandler(argv, options);
}
