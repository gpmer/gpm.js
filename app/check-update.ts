/**
 * Created by axetroy on 17-2-15.
 */
const path = require('path');
const axios = require('axios');
const semver = require('semver');
const log4js = require('log4js');

const logger = log4js.getLogger('CHECK');
const pkg = require(path.join(__dirname, '../package.json'));

const npmRegistry = `http://registry.npm.taobao.org`;

export default async function checkNewVersion() {
  // check the update
  try {
    const res: any = await axios.get(`${npmRegistry}/${pkg.name}/latest`, {
      timeout: 200
    });
    const remotePkg = res.data;
    if (semver.gt(remotePkg.version, pkg.version)) {
      logger.warn(
        `Your current version of ${pkg.name} is out of date. The latest version is ${remotePkg
          .version.red} while you're on ${pkg.version.green}.`
      );
      logger.warn(
        `Checkout change log here ${'https://github.com/gpmer/gpm.js/blob/master/CHANGELOG.md'
          .green}`
      );
    }
  } catch (err) {}
}
