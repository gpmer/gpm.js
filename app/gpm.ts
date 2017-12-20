const startTime: Date = new Date();
require('@axetroy/graceful')(true);
import * as path from 'path';
const program = require('caporal');
import * as inquirer from 'inquirer';
import prepare from './prepare';
import checkUpdate from './check-update';
import globalConfig from './global-config';
import chalk from 'chalk';
import * as i18n from 'i18n';
const { __ } = i18n;

// command handler
import listHandler from './command/list';
import relinkHandler from './command/relink';
import addHandler from './command/add';
import runtimeHandler from './command/runtime';
import configHandler from './command/config';
import cleanHandler from './command/clean';
import pruneHandler from './command/prune';
import findHandler from './command/find';
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

process.on('exit', function(code: number) {
  if (process.env.GPM_ENV !== 'development' && code === 0) {
    // 耗时
    const take: number = (new Date().getTime() - startTime.getTime()) / 1000;
    process.stdout.write(`Done in ${chalk.green(take.toFixed(2))}s.\n`);
  }
});

async function main() {
  await prepare();

  if ((globalConfig.entity.checkUpgrade + '').trim() === 'true') {
    checkUpdate();
  }

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

  program
    .version(pkg.version)
    .description(pkg.description)
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
    .action(function(argv, options) {
      return addHandler(<any>argv, options).catch(errorHandler);
    });

  program
    .command('remove', __('commands.remove.desc'))
    .alias('rm')
    .argument('[owner]', __('commands.remove.argv.owner.desc'))
    .argument('[repo]', __('commands.remove.argv.repo.desc'))
    .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
    .option(FLAGS.force.flag, FLAGS.force.desc)
    .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
    .action(function(argv, options) {
      return removeHandler(<any>argv, options).catch(errorHandler);
    });

  program
    .command('list', __('commands.list.desc'))
    .alias('ls')
    .argument('[key]', __('commands.list.argv.key.desc'))
    .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
    .option(FLAGS.force.flag, FLAGS.force.desc)
    .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
    .action(function(argv, options) {
      return listHandler(<any>argv, options).catch(errorHandler);
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
    .action(function(argv, options) {
      return cleanHandler(argv, options).catch(errorHandler);
    });

  program
    .command('prune', __('commands.prune.desc'))
    .alias('pr')
    .action(function() {
      return pruneHandler().catch(errorHandler);
    });

  program
    .command('find', __('commands.find.desc'))
    .alias('fd')
    .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
    .option(FLAGS.force.flag, FLAGS.force.desc)
    .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
    .action(function(argv, options) {
      return findHandler(argv, options).catch(errorHandler);
    });

  program
    .command('relink', __('commands.relink.desc'))
    .alias('rl')
    .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
    .option(FLAGS.force.flag, FLAGS.force.desc)
    .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
    .action(function(argv, options) {
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
    .action(function(argv, options) {
      return configHandler(<any>argv, options).catch(errorHandler);
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

  program.parse(process.argv);
}

main().catch(errorHandler);
