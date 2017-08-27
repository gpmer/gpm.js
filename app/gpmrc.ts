/**
 * Created by axetroy on 17-3-23.
 */
import * as path from 'path';
import * as fs from 'fs-extra';
import { EventEmitter } from 'events';

import { isExistPath, runShell } from './utils';

interface Rc$ {
  hooks: PlainObject$;
}

interface PlainObject$ {
  [s: string]: string;
}

class Gpmrc extends EventEmitter {
  public exist: boolean = false;
  public rc: Rc$ = { hooks: {} };
  constructor() {
    super();
  }

  async load(dir: string): Promise<void> {
    const rcPath = path.join(dir, '.gpmrc');
    if (await isExistPath(rcPath)) {
      this.rc = <Rc$>await fs.readJson(rcPath);
      this.exist = true;
    }
  }

  async runHook(hookName: string, options: PlainObject$ = {}): Promise<void> {
    const hooks = this.rc.hooks || {};
    if (hooks[hookName]) {
      await runShell(hooks.add, { ...{ stdio: 'inherit' }, ...options });
    }
  }
}

export default Gpmrc;
