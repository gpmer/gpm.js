/**
 * Created by axetroy on 17-2-15.
 */
const test = require('ava');
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));

const CONFIG = require('../lib/config');
const prepare = require('../lib/prepare');

const {home, root, temp, config} = CONFIG.paths;

test.beforeEach(async function (t) {
  await fs.ensureDir(home);
  await prepare();
  t.pass();
});

test.afterEach(async function (t) {
  await fs.removeAsync(home);
  t.pass();
});

test('prepare', async(t) => {
  await fs.ensureDir(home);
  await fs.readdirAsync(home);
  const __root__ = await fs.readdirAsync(root);
  const __temp__ = await fs.readdirAsync(temp);
  const __config__ = await fs.readJsonAsync(config);
  t.deepEqual(__root__.length, 2);
  t.deepEqual(__temp__.length, 0);
  t.deepEqual(__config__, CONFIG.defaults);
  t.pass();
});