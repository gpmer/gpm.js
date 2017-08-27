/**
 * Created by axetroy on 17-2-15.
 */

const path = require('path');

const prettyjson = require('prettyjson');
const fs = require('fs-extra');
const log4js = require('log4js');
const logger = log4js.getLogger('CONFIG');
const __ = require('i18n').__;

import config from '../config';
import globalConfig from '../global-config';

export interface Argv$ {
  key?: string;
  value?: string;
  action: string;
}

interface Options$ {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
}

async function configHandler(argv: Argv$, options: Options$) {
  const { action, key, value } = argv;
  let output = void 0;

  switch (action.toUpperCase()) {
    case 'LIST':
      output = globalConfig.entity;
      !options.nolog &&
        process.stdout.write(prettyjson.render(globalConfig.entity) + '\n');
      break;
    case 'GET':
      if (!key)
        return (
          !options.nolog && logger.error(__('commands.config.log.require_key'))
        );
      output = globalConfig.get(key);
      !options.nolog && logger.info(`${key}: ${output}`);
      break;
    case 'SET':
      if (!key)
        return (
          !options.nolog && logger.error(__('commands.config.log.require_key'))
        );
      if (!value)
        return (
          !options.nolog && logger.error(__('commands.config.log.require_val'))
        );
      output = await globalConfig.set(key, value);
      !options.nolog &&
        process.stdout.write(prettyjson.render(globalConfig.entity) + '\n');
      break;
    case 'REMOVE':
      if (!key)
        return (
          !options.nolog && logger.error(__('commands.config.log.require_key'))
        );
      output = await globalConfig.remove(key);
      !options.nolog &&
        process.stdout.write(prettyjson.render(globalConfig.entity) + '\n');
      break;
    case 'RESET':
      output = await globalConfig.reset();
      !options.nolog && logger.info(__('commands.config.log.info_reset'));
      !options.nolog &&
        process.stdout.write(prettyjson.render(globalConfig.entity) + '\n');
      break;
    default:
      !options.nolog &&
        logger.info(
          __('commands.config.log.help', {
            cmd: (config.name +
              ' config ' +
              'list|get|set|remove|reset'.yellow.underline +
              ' [key] [value]').green
          })
        );
      break;
  }
  return output;
}

export default async function(argv: Argv$, options: Options$) {
  return configHandler(argv, options);
}
