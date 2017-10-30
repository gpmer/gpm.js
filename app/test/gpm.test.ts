/**
 * Created by axetroy on 17-2-15.
 */
const path = require('path');
const os = require('os');
import chalk from 'chalk';
const test = require('ava');
const _ = require('lodash');
const fs = require('fs-extra');
const gitUrlParse = require('git-url-parse');

const pkg = require('../../package.json');
import CONFIG from '../config';
import prepare from '../prepare';
import addCommand from '../command/add';
import listCommand from '../command/list';
import runtimeCommand from '../command/runtime';
import configCommand, { Argv$ as ConfigArgv$ } from '../command/config';
import cleanCommand from '../command/clean';
import globalConfig from '../global-config';

const { home, root, temp, config } = CONFIG.paths;

test.before(async function(t) {
  await fs.emptydir(home);
  await fs.remove(home);
  t.pass();
});

test.serial.beforeEach(async function(t) {
  await fs.ensureDir(home);
  await prepare();
  await globalConfig.init();
  t.pass();
});

test.serial.afterEach(async function(t) {
  await globalConfig.reset();
  await fs.emptydir(home);
  await fs.remove(home);
  t.pass();
});

test.serial('prepare', async t => {
  await fs.readdir(home);
  const __root__ = await fs.readdir(root);
  const __temp__ = await fs.readdir(temp);
  const __config__ = await fs.readJson(config);
  t.deepEqual(__root__.length, 3);
  t.deepEqual(__temp__.length, 0);
  t.deepEqual(__config__, CONFIG.defaults);
  t.pass();
});

test.serial('add & list', async t => {
  const url = 'https://github.com/gpmer/gpm-empty-repository-for-test.git';
  const argv = { repo: url },
    options: any = { force: true, nolog: true };
  const gitInfo = gitUrlParse(url);

  const gpmConfig = await fs.readJson(config);
  const baseDir = path.join(home, gpmConfig.base);
  const sourceDir = path.join(baseDir, gitInfo.source);
  const ownerDir = path.join(sourceDir, gitInfo.owner);
  const repoDir = path.join(
    ownerDir,
    typeof options.name === 'string' ? options.name : gitInfo.name
  );

  await addCommand(argv, options);

  await fs.ensureDir(baseDir);
  await fs.ensureDir(sourceDir);
  await fs.ensureDir(ownerDir);
  await fs.ensureDir(repoDir);

  const result = await listCommand({ key: '' }, { nolog: true });

  const source = chalk.red('github.com');
  const owner = chalk.yellow('gpmer');
  const name = chalk.green('gpm-empty-repository-for-test');

  t.deepEqual(_.keys(result), [source]);
  t.deepEqual(_.keys(result[source]), [owner]);
  t.deepEqual(_.keys(result[source][owner]), [name]);
  // t.deepEqual(result[source][owner][name], repoDir.white);

  t.pass();
});

test('runtime', async t => {
  const info = await runtimeCommand({}, { nolog: true });

  t.deepEqual(info.node, process.version);
  t.deepEqual(info[CONFIG.name], pkg.version);
  t.deepEqual(info.arch, os.arch());
  t.deepEqual(info.os, os.type() + ' ' + os.release());
  t.deepEqual(info.platform, os.platform());

  t.pass();
});

test.serial('config list', async t => {
  const __CONFIG__ = await configCommand({ action: 'list' }, { nolog: true });

  t.deepEqual(__CONFIG__.version, pkg.version);
  t.deepEqual(__CONFIG__.owner, CONFIG.name);
  t.deepEqual(__CONFIG__.base, CONFIG.name);

  t.pass();
});

test.serial('config get', async t => {
  const version = await configCommand(
    { action: 'get', key: 'version' },
    { nolog: true }
  );
  const owner = await configCommand(
    { action: 'get', key: 'owner' },
    { nolog: true }
  );
  const base = await configCommand(
    { action: 'get', key: 'base' },
    { nolog: true }
  );

  t.deepEqual(globalConfig.entity.version, version);
  t.deepEqual(globalConfig.entity.owner, owner);
  t.deepEqual(globalConfig.entity.base, base);

  t.pass();
});

test.serial('config set', async t => {
  const actions = [
    { action: 'set', key: 'version', value: 'test version' },
    { action: 'set', key: 'owner', value: 'test owner' },
    { action: 'set', key: 'base', value: 'test base' }
  ];

  const __actions__ = actions.slice();

  while (actions.length) {
    const action: ConfigArgv$ = <ConfigArgv$>actions.shift();
    await configCommand(action, { nolog: true });
  }

  t.deepEqual(globalConfig.entity.version, __actions__[0].value);
  t.deepEqual(globalConfig.entity.owner, __actions__[1].value);
  t.deepEqual(globalConfig.entity.base, __actions__[2].value);

  t.pass();
});

test.serial('config remove', async t => {
  const actions = [
    { action: 'remove', key: 'version' },
    { action: 'remove', key: 'owner' },
    { action: 'remove', key: 'base' }
  ];

  while (actions.length) {
    const action: ConfigArgv$ = <ConfigArgv$>actions.shift();
    await configCommand(action, { nolog: true });
    t.deepEqual(globalConfig.entity[<string>action.key], void 0);
  }

  t.pass();
});

test.serial('config reset', async t => {
  const __config__ = await configCommand({ action: 'reset' }, { nolog: true });

  const configJSON = await fs.readJson(config);

  t.deepEqual(__config__, configJSON);
  t.deepEqual(__config__, CONFIG.defaults);

  t.pass();
});
