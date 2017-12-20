/**
 * Created by axetroy on 17-2-15.
 */

const axios = require('axios');
const semver = require('semver');
import chalk from 'chalk';

const pkg = require('../package.json');
import { warn } from './logger';

const npmRegistry = `http://registry.npm.taobao.org`;

export default async function checkNewVersion() {
  // check the update
  try {
    const res: any = await axios.get(`${npmRegistry}/${pkg.name}/latest`, {
      timeout: 200
    });
    const remotePkg = res.data;
    if (semver.gt(remotePkg.version, pkg.version)) {
      warn(
        `Your current version of ${
          pkg.name
        } is out of date. The latest version is ${chalk.red(
          remotePkg.version
        )} while you're on ${chalk.green(pkg.version)}.`
      );
      warn(
        `Checkout change log here ${chalk.green(
          'https://github.com/gpmer/gpm.js/blob/master/CHANGELOG.md'
        )}`
      );
    }
  } catch (err) {}
}
