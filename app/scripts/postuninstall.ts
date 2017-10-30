const fs = require('fs-extra');
import chalk from 'chalk';
import { paths } from '../config';
import { info, error } from '../logger';

fs
  .remove(paths.root)
  .then(() => {
    info(`${chalk.green(paths.root)} have been remove`);
  })
  .catch(() => {
    error(`Remove ${chalk.green(paths.root)} fail.`);
    process.exit(1);
  });
