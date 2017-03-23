/**
 * Created by axetroy on 17-2-14.
 */
const path = require('path');
const process = require('process');
const Promise = require('bluebird');
const co = require('co');
const fs = Promise.promisifyAll(require('fs-extra'));
const spawn = require('cross-spawn');
const parseGitConfig = require('parse-git-config');
const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('UTILS');

function isExistPath(dir) {
  return fs.statAsync(dir)
    .then(() => Promise.resolve(true))
    .catch(() => Promise.resolve(false));
}

function isGitRepoDir(dir) {
  return isExistPath(path.join(dir, '.git'));
}

function parseGitConfigAsync(options) {
  return new Promise(function (resolve, reject) {
    parseGitConfig(options, function (err, config) {
      if (err) return reject(err);
      return resolve(config);
    })
  })
}

function isLink(path) {
  return fs.readlinkAsync(path)
    .then(() => Promise.resolve(true))
    .catch(err => Promise.resolve(false));
}

function isDir(path) {
  return fs.readdirAsync(path)
    .then(() => Promise.resolve(true))
    .catch(err => Promise.resolve(false));
}

function unixify(path) {
  return '/' + path
      .replace(/^\/+/g, '').replace(/^[A-Z]/, function (match, index, input) {
        return match.toLowerCase();
      })
      .replace(/\:/, '')
      .replace(/\\/g, '/');
}

function normalizePath(path, options) {
  return (options || {}).unixify ? unixify(path) : path;
}

function camelcase(flag) {
  return flag.split('-').reduce(function (str, word) {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

function spawnShell(command, argv = [], options = {}) {
  const cmd = spawn(command, argv, _.extend({env: process.env, cwd: process.cwd(), stdio: 'inherit'}, options));
  return new Promise(function (resolve, reject) {
    cmd.on('close', (code, signal) => {
      code === 0 ? resolve() : reject(new Error(`<${(command + ' ' + argv.join(' ')).red}> Error Code: ${code}, Exist Signal: ${signal}`));
    });
  });
}

function runShell(cmd, options) {
  const cmds = cmd.split(/\&\&/);
  return co(function *() {
    while (cmds.length) {
      let cmd = cmds.shift();
      const _cmd = cmd.split(/\&/).map(v => v.trim());
      while (_cmd.length) {
        let __cmd = _cmd.shift();
        __cmd = __cmd.split(/\s+/).map(v => v.trim()).filter(v => !!v);
        let command = __cmd.shift().trim();
        let argv = __cmd || [];
        let full_command = command + ' ' + argv.join(' ');
        logger.debug(`Running Command ${full_command.yellow}`);
        yield spawnShell(command, argv, options);
      }
    }
  });
}

function parseLicense(str) {
  const MIT_LICENSE = /ermission is hereby granted, free of charge, to any/;
  const BSD_LICENSE = /edistribution and use in source and binary forms, with or withou/;
  const BSD_SOURCE_CODE_LICENSE = /edistribution and use of this software in source and binary forms, with or withou/;
  const WTFPL_LICENSE = /DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE/;
  const ISC_LICENSE = /The ISC License/;
  const MIT = /MIT\b/;
  const BSD = /BSD\b/;
  const ISC = /ISC\b/;
  const APACHE = /Apache License\b/;
  const WTFPL = /WTFPL\b/;
// https://creativecommons.org/publicdomain/zero/1.0/
  const CC0_1_0 = /The\s+person\s+who\s+associated\s+a\s+work\s+with\s+this\s+deed\s+has\s+dedicated\s+the\s+work\s+to\s+the\s+public\s+domain\s+by\s+waiving\s+all\s+of\s+his\s+or\s+her\s+rights\s+to\s+the\s+work\s+worldwide\s+under\s+copyright\s+law,\s+including\s+all\s+related\s+and\s+neighboring\s+rights,\s+to\s+the\s+extent\s+allowed\s+by\s+law.\s+You\s+can\s+copy,\s+modify,\s+distribute\s+and\s+perform\s+the\s+work,\s+even\s+for\s+commercial\s+purposes,\s+all\s+without\s+asking\s+permission./i; // jshint ignore:line


  if (str) {
    str = str.replace('\n', '');
  }
  if (typeof str === 'undefined' || !str) {
    return 'unknown';
  } else if (ISC_LICENSE.test(str)) {
    return 'ISC*';
  } else if (MIT_LICENSE.test(str)) {
    return 'MIT*';
  } else if (BSD_LICENSE.test(str)) {
    return 'BSD*';
  } else if (BSD_SOURCE_CODE_LICENSE.test(str)) {
    // https://spdx.org/licenses/BSD-Source-Code.html
    return 'BSD-Source-Code*';
  } else if (WTFPL_LICENSE.test(str)) {
    return 'WTFPL*';
  } else if (ISC.test(str)) {
    return 'ISC*';
  } else if (MIT.test(str)) {
    return 'MIT*';
  } else if (BSD.test(str)) {
    return 'BSD*';
  } else if (WTFPL.test(str)) {
    return 'WTFPL*';
  } else if (APACHE.test(str)) {
    return 'Apache*';
  } else if (CC0_1_0.test(str)) {
    return 'CC0-1.0*';
  }
  return null;
}

module.exports = {
  isExistPath,
  isGitRepoDir,
  parseLicense,
  parseGitConfigAsync,
  isLink,
  isDir,
  unixify,
  normalizePath,
  camelcase,
  runShell,
  spawnShell
};