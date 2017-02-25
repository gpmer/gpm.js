/**
 * Created by axetroy on 17-2-13.
 */

const path = require('path');
const os = require('os');
const pkg = require('../package.json');

const name = pkg.name.replace(/^\@[\w\-\_]+\//img, '');

const root = path.join(os.homedir(), `${name}`);
const config = path.join(root, `${name}.config.json`);
const temp = path.join(root, 'temp');
const lock = path.join(root, `${name}.lock.json`);

module.exports = {
  name,
  paths: {
    root,
    config,
    temp,
    lock
  },
  defaults: {
    owner: name,
    base: name
  }
};
