/**
 * Created by axetroy on 17-2-14.
 */
import chalk from 'chalk';
const fs = require('fs-extra');
const path = require('path');
import globalConfig from '../global-config';
import config from '../config';
import * as Walker from '@axetroy/walk';

export default async function prune(): Promise<void> {
  const walker = new Walker(
    path.join(config.paths.home, globalConfig.entity.base)
  );

  let files = 0;
  let directory = 0;

  walker.on('file', function(filepath: string, stat) {
    files++;
  });

  const done: Promise<any>[] = [];
  let removeDirCount = 0;

  walker.on('directory', function(filepath: string, stat) {
    directory++;
    const name = path.basename(filepath);
    if (name === 'node_modules') {
      done.push(
        fs
          .remove(filepath)
          .then(() => {
            console.log(`Remove ` + chalk.green(filepath));
            removeDirCount++;
          })
          .catch(err => {
            console.error(err + '');
            return Promise.resolve();
          })
      );
    }
  });

  await walker.walk();

  await Promise.all(done);

  console.info(`Find ${files} file， ${directory} directories`);
}
