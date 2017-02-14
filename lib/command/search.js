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

function *search(key, options) {

}

module.exports = function (options) {
  return init(key, options);
};