/**
 * Created by axetroy on 17-2-15.
 */
require('colors');
const test = require('ava');
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const gitUrlParse = require("git-url-parse");

const CONFIG = require('../lib/config');
const prepare = require('../lib/prepare');
const add = require('../lib/command/add');

const {home, root, temp, config} = CONFIG.paths;

test.serial.beforeEach(async function (t) {
  await fs.ensureDir(home);
  await prepare();
  t.pass();
});

test.serial.afterEach(async function (t) {
  await fs.emptydirAsync(home);
  await fs.removeAsync(home);
  t.pass();
});

test.serial('prepare', async(t) => {
  await fs.readdirAsync(home);
  const __root__ = await fs.readdirAsync(root);
  const __temp__ = await fs.readdirAsync(temp);
  const __config__ = await fs.readJsonAsync(config);
  t.deepEqual(__root__.length, 2);
  t.deepEqual(__temp__.length, 0);
  t.deepEqual(__config__, CONFIG.defaults);
  t.pass();
});

test.serial('add', async(t) => {
  const url = 'https://github.com/gpmer/gpm-empty-repository-for-test.git';
  const argv = {repo: url}, options = {force: true, quiet: true};
  const gitInfo = gitUrlParse(url);

  const gpmConfig = await fs.readJsonAsync(config);
  const baseDir = path.join(home, gpmConfig.base);
  const sourceDir = path.join(baseDir, gitInfo.source);
  const ownerDir = path.join(sourceDir, gitInfo.owner);
  const repoDir = path.join(ownerDir, typeof options.name === 'string' ? options.name : gitInfo.name);

  await add(argv, options);

  await fs.ensureDirAsync(baseDir);
  await fs.ensureDirAsync(sourceDir);
  await fs.ensureDirAsync(ownerDir);
  await fs.ensureDirAsync(repoDir);
  t.pass();
});