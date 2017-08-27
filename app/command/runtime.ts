/**
 * Created by axetroy on 17-2-15.
 */

const os = require('os');

const prettyjson = require('prettyjson');

const pkg = require('../../package.json');
const config = require('../config');

interface Argv$ {}

interface Options$ {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
}

async function runtime(argv: Argv$, options: Options$) {
  const info = {
    node: process.version,
    [config.name]: pkg.version,
    arch: os.arch(),
    os: os.type() + ' ' + os.release(),
    platform: os.platform()
  };

  !options.nolog && process.stdout.write(prettyjson.render(info) + '\n');
  return info;
}

export default async function(argv: Argv$, options: Options$) {
  return runtime(argv, options);
}
