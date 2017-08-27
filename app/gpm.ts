const startTime: Date = new Date();
import * as path from 'path';
import * as program from 'caporal';
import * as inquirer from 'inquirer';
import 'colors';
import { EventEmitter } from 'events';
import prepare from './prepare';
import checkUpdate from './check-update';
import globalConfig from './global-config';

// 3th lib
import { __ } from 'i18n';

// command handler
import listHandler from './command/list';
import relinkHandler from './command/relink';
import addHandler from './command/add';
import treeHandler from './command/tree';
import runtimeHandler from './command/runtime';
import configHandler from './command/config';
import cleanHandler from './command/clean';
import findHandler from './command/find';
import licensesHandler from './command/licenses';
import foreachHandler from './command/foreach';
import importHandler from './command/import';
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
      .command('add')
      .alias('a')
      .argument(
        '<repo>',
        __('commands.add.argv.repo.desc'),
        /^(https|git)(.*)\.git$/
      )
      .description(__('commands.add.desc'))
      .option('-n, --name <name>', __('commands.add.options.name.desc'))
      .option('-p, --plugin <plugin>', __('commands.add.options.plugin.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .option(FLAGS.ignoreRc.flag, FLAGS.ignoreRc.desc)
      .action(function(argv, options) {
        return addHandler(argv, options).catch(errorHandler);
      });

    program
      .command('remove')
      .alias('rm')
      .description(__('commands.remove.desc'))
      .argument('[owner]', __('commands.remove.argv.owner.desc'))
      .argument('[repo]', __('commands.remove.argv.repo.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(argv, options) {
        return removeHandler(argv, options).catch(errorHandler);
      });

    program
      .command('list')
      .alias('ls')
      .description(__('commands.list.desc'))
      .argument('[key]', __('commands.list.argv.key.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(argv, options) {
        return listHandler(argv, options).catch(errorHandler);
      });

    program
      .command('tree')
      .alias('tr')
      .description(__('commands.tree.desc'))
      .argument('[key]', __('commands.tree.argv.key.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(argv, options) {
        return treeHandler(argv, options).catch(errorHandler);
      });

    program
      .command('clean')
      .alias('cl')
      .description(__('commands.clean.desc', { tempPath: config.paths.temp }))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(argv, options) {
        return cleanHandler(argv, options).catch(errorHandler);
      });

    program
      .command('find')
      .alias('fd')
      .description(__('commands.find.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(argv, options) {
        return findHandler(argv, options).catch(errorHandler);
      });

    program
      .command('relink')
      .alias('rl')
      .description(__('commands.relink.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(argv, options) {
        return relinkHandler(argv, options).catch(errorHandler);
      });

    program
      .command('config')
      .alias('cf')
      .description(__('commands.config.desc'))
      .argument('<action>', __('commands.config.argv.action.desc'))
      .argument('[key]', __('commands.config.argv.key.desc'))
      .argument('[value]', __('commands.config.argv.value.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(argv, options) {
        return configHandler(argv, options).catch(errorHandler);
      });

    program
      .command('runtime')
      .alias('rt')
      .description(__('commands.runtime.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(argv, options) {
        return runtimeHandler(argv, options).catch(errorHandler);
      });

    program
      .command('import')
      .alias('ip')
      .description(__('commands.import.desc'))
      .argument('<dir>', __('commands.import.argv.dir.desc'))
      .option('--hard', __('commands.import.options.hard.desc'))
      .option('--all', __('commands.import.options.all.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(argv, options) {
        importHandler(argv, options).catch(errorHandler);
      });

    program
      .command('foreach')
      .alias('fe')
      .description(__('commands.foreach.desc'))
      .argument('<plugin>', __('commands.foreach.argv.plugin.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(argv, options) {
        return foreachHandler(argv, options).catch(errorHandler);
      });

    program
      .command('plugin')
      .alias('pl')
      .description(__('commands.plugin.desc'))
      .argument('<action>', __('commands.plugin.argv.action.desc'))
      .argument('[key]', __('commands.plugin.argv.key.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(argv, options) {
        return pluginHandler(argv, options).catch(errorHandler);
      });
    program
      .command('licenses')
      .alias('lc')
      .description(__('commands.licenses.desc'))
      .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
      .option(FLAGS.force.flag, FLAGS.force.desc)
      .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
      .action(function(argv, options) {
        return licensesHandler(argv, options).catch(errorHandler);
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
        `Done in ${((new Date().getTime() - startTime.getTime()) /
          1000).toFixed(2).green}s.\n`
      );
    }
  }
}

export default new Gpm({});
