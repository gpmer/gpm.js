/**
 * Created by axetroy on 17-2-14.
 */
const fs = require('fs-extra');
const log4js = require('log4js');
const logger = log4js.getLogger('CLEAN');

import config from '../config';

import relinkHandler from './relink';

interface Argv$ {}

interface Options$ {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
}

export default async function clean(
  argv: Argv$,
  options: Options$
): Promise<void> {
  try {
    await fs.emptyDir(config.paths.temp);
  } catch (err) {
    throw new Error(
      `${err + ''}\n May be you don't have permission to access ${config.paths
        .temp}, try to delete in manual`
    );
  }
  // auto generate file again
  await relinkHandler(argv, { nolog: options.nolog });
  !options.nolog &&
    logger.info(`clean ${config.paths.temp.green.underline} success`);
}
