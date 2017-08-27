/**
 * Created by axetroy on 17-3-23.
 */
import { EventEmitter } from 'events';
const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');

import { isExistPath, runShell } from './utils';

class Gpmrc extends EventEmitter {
  public exist: boolean = false;
  public rc: any = {};
  constructor() {
    super();
  }

  async load(dir) {
    const self = this;
    const rcPath = path.join(dir, '.gpmrc');
    if (await isExistPath(rcPath)) {
      self.rc = await fs.readJson(rcPath);
      self.exist = true;
    }
  }

  async runHook(hookName, options = {}) {
    const self = this;
    const hooks = self.rc.hooks || {};
    if (hooks[hookName]) {
      await runShell(hooks.add, _.extend({ stdio: 'inherit' }, options));
    }
  }
}

export default Gpmrc;
