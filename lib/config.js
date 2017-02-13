/**
 * Created by axetroy on 17-2-13.
 */

const path = require('path');
const process = require('process');

const root = path.join(process.env.HOME, '.gpm');
const config = path.join(root, 'gpm.json');
const temp = path.join(root, 'temp');

module.exports = {
  paths: {
    root,
    config,
    temp,
    defaultConfig: path.join(__dirname, '../default-config.json')
  }
};
