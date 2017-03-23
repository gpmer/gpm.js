/**
 * Created by axetroy on 17-3-23.
 */
const EventEmitter = require('events').EventEmitter;
const path = require('path');
const Promise = require('bluebird');
const co = require('co');
const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs-extra'));

const {isExistPath, runShell} = require('./utils');

class Gpmrc extends EventEmitter {
  constructor() {
    super();
    this.exist = false;
    this.rc = {};
  }

  load(dir) {
    const self = this;
    return co(function *() {
      const rcPath = path.join(dir, '.gpmrc');
      if (yield isExistPath(rcPath)) {
        self.rc = yield fs.readJsonAsync(rcPath);
        self.exist = true;
      }
    });
  }

  runHook(hookName, options = {}) {
    const self = this;
    return co(function*() {
      const hooks = self.rc.hooks || {};
      if (hooks[hookName]) {
        yield runShell(hooks.add, _.extend({stdio: 'inherit'}, options));
      }
    });
  }

}

module.exports = Gpmrc;