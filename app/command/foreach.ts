/**
 * Created by axetroy on 17-3-13.
 */
const log4js = require('log4js');
const __ = require('i18n').__;

import plugin from '../plugin';
import registry, { Target$ } from '../registry';

const ACTION = Symbol('foreach every repository');

interface Argv$ {
  plugin: string;
}

interface Options$ {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
}

async function foreach(argv: Argv$, options: Options$) {
  let repositories = registry.repositories.slice();
  const cwd = process.cwd();
  while (repositories.length) {
    let repository: Target$ = <Target$>repositories.shift();
    const plugins = plugin.get(ACTION);
    await new Promise((resolve, reject) => {
      process.chdir(repository.path);
      plugins.forEach(plugin => {
        const runner = plugin.foreach;
        if (typeof runner !== 'function')
          throw new Error(__('commands.foreach.log.not_export_foreach_method'));
        runner.call(repository, function(err) {
          err ? reject(err) : resolve();
        });
      });
    });
  }
  process.chdir(cwd);
}

export default function(argv: Argv$, options: Options$) {
  plugin.load(ACTION, argv.plugin);
  return foreach(argv, options);
}
