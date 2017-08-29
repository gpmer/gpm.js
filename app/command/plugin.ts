/**
 * Created by axetroy on 2017/3/18.
 */

const prettyjson = require('prettyjson');
const __ = require('i18n').__;

import plugin from '../plugin';
import config from '../config';
import { error, info } from '../logger';

type action$ = 'LIST' | 'REMOVE';

interface Argv$ {
  action: action$;
  key: string;
}

interface Options$ {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
}

export default async function configHandler(
  argv: Argv$,
  options: Options$
): Promise<void> {
  const { action, key } = argv;

  const upperCaseAction: action$ = <action$>action.toUpperCase();

  switch (upperCaseAction) {
    case 'LIST':
      plugin.list();
      break;
    case 'REMOVE':
      if (!key)
        if (!options.nolog) {
          return error(
            __('commands.plugin.log.require_key', {
              cmd: (config.name + ` config set ${key} [key]`).green
            })
          );
        }
      await plugin.remove(key);
      break;
    default:
      !options.nolog &&
        info(
          __('commands.plugin.log.info_help', {
            cmd: (config.name +
              ' plugin ' +
              'list|delete'.yellow.underline +
              ' [key]').green
          })
        );
      break;
  }
}
