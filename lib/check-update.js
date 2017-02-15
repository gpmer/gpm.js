/**
 * Created by axetroy on 17-2-15.
 */
const path = require('path');
const co = require('co');
const Promise = require('bluebird');
const axios = require('axios');
const semver = require('semver');
const log4js = require('log4js');

const logger = log4js.getLogger('CHECK');
const pkg = require(path.join(__dirname, '../package.json'));

const npmRegistry = `http://registry.npm.taobao.org`;

function checkNewVersion() {
  // check the update
  return axios.get(`${npmRegistry}/${pkg.name}/latest`, {timeout: 2000})
    .then(function (resp) {
      const remotePkg = resp.data;
      if (semver.gt(remotePkg.version, pkg.version)) {
        logger.warn(`The current version ${pkg.version.green} is not the latest, please run ${`npm install ${pkg.name} -g`.green} update to ${remotePkg.version.red}`);
        logger.warn(`Checkout change log here ${'https://github.com/axetroy/gpm/blob/master/CHANGELOG.md'.green}`)
      }
    })
    .catch(err => Promise.resolve());
}


module.exports = function () {
  return checkNewVersion();
};