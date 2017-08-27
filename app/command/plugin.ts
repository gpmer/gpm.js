/**
 * Created by axetroy on 2017/3/18.
 */

const path = require('path');
const spawn = require('cross-spawn');

const prettyjson = require('prettyjson');
const fs = require('fs-extra');
const log4js = require('log4js');
const logger = log4js.getLogger('CONFIG');
const __ = require('i18n').__;

import plugin from '../plugin';
import config from '../config';

interface Argv$ {
  action: string;
  key: string;
}

interface Options$ {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
}

export default async function configHandler(argv: Argv$, options: Options$) {
  const { action, key } = argv;
  let output = void 0;

  switch (action.toUpperCase()) {
    case 'LIST':
      plugin.list();
      break;
    case 'REMOVE':
      if (!key)
        return (
          !options.nolog &&
          logger.error(
            __('commands.plugin.log.require_key', {
              cmd: (config.name + ` config set ${key} [key]`).green
            })
          )
        );
      await plugin.remove(key);
      break;
    default:
      !options.nolog &&
        logger.info(
          __('commands.plugin.log.info_help', {
            cmd: (config.name +
              ' plugin ' +
              'list|delete'.yellow.underline +
              ' [key]').green
          })
        );
      break;
  }
  return output;
}
