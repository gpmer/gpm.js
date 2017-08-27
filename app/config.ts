/**
 * Created by axetroy on 17-2-13.
 */
const path = require('path');
const os = require('os');
const osLocale = require('os-locale');
const pkg = require('../package.json');

export const name: string = <string>pkg.name.replace(/^\@[\w\-\_]+\//gim, '');

const home =
  process.env.GPM_ENV === 'development'
    ? path.join(__dirname, '../', '.home')
    : os.homedir();

export const root = path.join(home, `.${name}`);

const config = path.join(root, `${name}.config.json`);

const temp = path.join(root, 'temp');

const storage = path.join(root, 'storage');

const project = path.join(__dirname, '../');

export const sysLocale = osLocale.sync();

export const paths = {
  home,
  root,
  config,
  temp,
  storage,
  project
};

export const defaults = {
  version: pkg.version,
  owner: name,
  base: name,
  checkUpgrade: true,
  locale: sysLocale
};

export default {
  name,
  paths,
  defaults
};
