/**
 * Created by axetroy on 17-2-14.
 */
const process = require('process');
const path = require('path');
const Promise = require('bluebird');
const prettyjson = require('prettyjson');
const fs = Promise.promisifyAll(require('fs-extra'));
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();

const config = require('../config');
const {writeJsonAsync} = require('../common');

function *init(options) {
  yield fs.ensureDirAsync(config.paths.root);

  const baseInput = yield prompt({
    type: 'input',
    name: 'base',
    message: `Set a base dir, The root of all repository. relative to ${'$HOME'.yellow}`,
    "default": config.defaults.base
  });

  yield writeJsonAsync(config.paths.config, baseInput);

  const gpmConfig = yield fs.readJSONAsync(config.paths.config);

  gpmConfig.base = path.join(process.env.HOME, gpmConfig.base);
  process.stdout.write(`generate ${config.paths.config.green.underline}\n`);
  process.stdout.write(`=========================\n`);
  process.stdout.write((prettyjson.render(gpmConfig)) + '\n');
  process.stdout.write(`=========================\n`);
}

module.exports = function (options) {
  return init(options);
};