const startTime: Date = new Date();
import * as path from 'path';
const program = require('caporal');
import * as inquirer from 'inquirer';
import { EventEmitter } from 'events';
import prepare from './prepare';
import checkUpdate from './check-update';
import globalConfig from './global-config';
import chalk from 'chalk';

// 3th lib
import { __ } from 'i18n';

// command handler
import listHandler from './command/list';
import relinkHandler from './command/relink';
import addHandler from './command/add';
import runtimeHandler from './command/runtime';
import configHandler from './command/config';
import cleanHandler from './command/clean';
import findHandler from './command/find';
import pluginHandler from './command/plugin';
import removeHandler from './command/remove';

inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);

const pkg = require(path.join(__dirname, '../package.json'));
const config = require('./config');

interface Flag$ {
  flag: string;
  desc: string;
}

interface GlobalFlags$ {
  unixify: Flag$;
  force: Flag$;
  nolog: Flag$;
  ignoreRc: Flag$;
}

let FLAGS: GlobalFlags$;

function errorHandler(err) {
  if (err) {
    console.error(err);
  }
  process.exit(1);
}

class Gpm extends EventEmitter {
  constructor(private config?: any) {
    super();
    process.on('exit', this.onExist);
    process.on('unhandledRejection', errorHandler);
    process.on('uncaughtException', errorHandler);
    this.bootstrap();
  }

  /**
   * 启动gpm
   * @returns {Promise<void>}
   */
  async bootstrap() {
    try {
      await this.init();

      FLAGS = {
        unixify: {
          flag: '-u, --unixify',
          desc: __('global.options.unixify.desc')
        },
        force: { flag: '-f, --force', desc: __('global.options.force.desc') },
        nolog: { flag: '--nolog', desc: __('global.options.nolog.desc') },
        ignoreRc: {
          flag: '--ignore-rc',
          desc: __('global.options.ignore_rc.desc')
        }
      };

      this.define();
      this.exec();
    } catch (err) {
      throw err;
    }
  }

  /**
   * init gpm
   * @returns {Promise<void>}
   */
  async init() {
    await prepare();
    if ((globalConfig.entity.checkUpgrade + '').trim() === 'true') {
      await checkUpdate();
    }
  }

  /**
   * define command
   */
  define() {
    program.version(pkg.version).description(pkg.description);

    program
      .command('add', __('commands.add.desc'))
      .alias('a')
      .argument(
        '<repo>',
        __('commands.add.argv.repo.desc'),
        /^(https|git)(.*)\.git$/
      )
      .option('-n, --name <name>', __('commands.add.options.name.desc'))
      .option('-p, --plugin <plugin>', __('commands.add.options.plugin.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .option(FLAGS.ignoreRc.flag, FLAGS.ignoreRc.desc)
      .action(function(
        argv: { repo: string },
        options: {
          unixify?: boolean;
          force?: boolean;
          nolog?: boolean;
          ignoreRc?: boolean;
          name?: string;
          plugin?: string;
        }
      ) {
        return addHandler(argv, options).catch(errorHandler);
      });

    program
      .command('remove', __('commands.remove.desc'))
      .alias('rm')
      .argument('[owner]', __('commands.remove.argv.owner.desc'))
      .argument('[repo]', __('commands.remove.argv.repo.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(
        argv: { owner: string; repo: string },
        options: { unixify?: boolean; force?: boolean; nolog?: boolean }
      ) {
        return removeHandler(argv, options).catch(errorHandler);
      });

    program
      .command('list', __('commands.list.desc'))
      .alias('ls')
      .argument('[key]', __('commands.list.argv.key.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(
        argv: { key?: string },
        options: {
          unixify?: boolean;
          force?: boolean;
          nolog?: boolean;
        }
      ) {
        return listHandler(argv, options).catch(errorHandler);
      });

    program
      .command(
        'clean',
        __('commands.clean.desc', { tempPath: config.paths.temp })
      )
      .alias('cl')
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(
        argv,
        options: {
          unixify?: boolean;
          force?: boolean;
          nolog?: boolean;
        }
      ) {
        return cleanHandler(argv, options).catch(errorHandler);
      });

    program
      .command('find', __('commands.find.desc'))
      .alias('fd')
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(
        argv,
        options: {
          unixify?: boolean;
          force?: boolean;
          nolog?: boolean;
        }
      ) {
        return findHandler(argv, options).catch(errorHandler);
      });

    program
      .command('relink', __('commands.relink.desc'))
      .alias('rl')
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(
        argv,
        options: {
          unixify?: boolean;
          force?: boolean;
          nolog?: boolean;
        }
      ) {
        return relinkHandler(argv, options).catch(errorHandler);
      });

    program
      .command('config', __('commands.config.desc'))
      .alias('cf')
      .argument('<action>', __('commands.config.argv.action.desc'))
      .argument('[key]', __('commands.config.argv.key.desc'))
      .argument('[value]', __('commands.config.argv.value.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(
        argv: {
          action: any;
          key?: string;
          value?: string;
        },
        options: {
          unixify?: boolean;
          force?: boolean;
          nolog?: boolean;
        }
      ) {
        return configHandler(argv, options).catch(errorHandler);
      });

    program
      .command('runtime', __('commands.runtime.desc'))
      .alias('rt')
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(argv, options) {
        return runtimeHandler(argv, options).catch(errorHandler);
      });

    program
      .command('plugin', __('commands.plugin.desc'))
      .alias('pl')
      .argument('<action>', __('commands.plugin.argv.action.desc'))
      .argument('[key]', __('commands.plugin.argv.key.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(
        argv: {
          action: any;
          key: string;
        },
        options
      ) {
        return pluginHandler(argv, options).catch(errorHandler);
      });
  }

  /**
   * exec command
   */
  exec() {
    program.parse(process.argv);
  }

  onExist(code) {
    if (process.env.GPM_ENV !== 'development' && code === 0) {
      process.stdout.write(
        `Done in ${chalk.green(
          ((new Date().getTime() - startTime.getTime()) / 1000).toFixed(2)
        )}s.\n`
      );
    }
  }
}

export default new Gpm({});
