/**
 * Created by axetroy on 17-2-13.
 */
const process = require('process');
const path = require('path');
const os = require('os');
const pkg = require('../package.json');

const name = pkg.name.replace(/^\@[\w\-\_]+\//img, '');

const home = process.env.GPM_ENV === 'development' ? path.join(__dirname, '../', '.home') : os.homedir();
const root = path.join(home, `.${name}`);
const config = path.join(root, `${name}.config.json`);
const temp = path.join(root, 'temp');

module.exports = {
  name,
  paths: {
    home,
    root,
    config,
    temp
  },
  defaults: {
    version: pkg.version,
    owner: name,
    base: name
  }
};
