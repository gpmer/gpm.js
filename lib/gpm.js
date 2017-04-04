let startTime = new Date();
const program = require('caporal');
program.__start__ && (startTime = program.__start__);

const process = require('process');
const path = require('path');
const EventEmitter = require('events').EventEmitter;

// 3th lib
const co = require('co');
const inquirer = require('inquirer');
const __ = require('i18n').__;
inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);

const pkg = require(path.join(__dirname, '../package.json'));
const config = require('./config');

const event = new EventEmitter();

event.on('done', code => {
  if (process.env.GPM_ENV !== 'development' && code === 0) {
    process.stdout.write(
      `Done in ${((new Date() - startTime) / 1000).toFixed(2).green}s.\n`
    );
  }
});

function errorHandler(err) {
  if (err) {
    console.error(err);
  }
  process.exit(1);
}

process.on('exit', code => event.emit('done', code));

process.on('unhandledRejection', errorHandler);

process.on('uncaughtException', errorHandler);

process.on('warning', warning => {
  console.warn(warning.name); // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack); // Print the stack trace
});

const FLAGS = {
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

program.version(pkg.version).description(pkg.description);

program
  .command('add')
  .alias('a')
  .argument('<repo>', __('commands.add.argv.repo.desc'), /^(https|git)(.*)\.git$/)
  .description(__('commands.add.desc'))
  .option('-n, --name <name>', __('commands.add.options.name.desc'))
  .option('-p, --plugin <plugin>', __('commands.add.options.plugin.desc'))
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .option(FLAGS.ignoreRc.flag, FLAGS.ignoreRc.desc)
  .action(function(argv, options) {
    co(require('./command/add')(argv, options)).catch(errorHandler);
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
    co(require('./command/remove')(argv, options)).catch(errorHandler);
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
    co(require('./command/list')(argv, options)).catch(errorHandler);
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
    co(require('./command/tree')(argv, options)).catch(errorHandler);
  });

program
  .command('clean')
  .alias('cl')
  .description(__('commands.clean.desc', { tempPath: config.paths.temp }))
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(function(argv, options) {
    co(require('./command/clean')(argv, options)).catch(errorHandler);
  });

program
  .command('find')
  .alias('fd')
  .description(__('commands.find.desc'))
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(function(argv, options) {
    co(require('./command/find')(argv, options)).catch(errorHandler);
  });

program
  .command('relink')
  .alias('rl')
  .description(__('commands.relink.desc'))
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(function(argv, options) {
    co(require('./command/relink')(argv, options)).catch(errorHandler);
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
    co(require('./command/config')(argv, options)).catch(errorHandler);
  });

program
  .command('runtime')
  .alias('rt')
  .description(__('commands.runtime.desc'))
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(function(argv, options) {
    co(require('./command/runtime')(argv, options)).catch(errorHandler);
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
    co(require('./command/import')(argv, options)).catch(errorHandler);
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
    co(require('./command/foreach')(argv, options)).catch(errorHandler);
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
    co(require('./command/plugin')(argv, options)).catch(errorHandler);
  });
program
  .command('licenses')
  .alias('lc')
  .description(__('commands.licenses.desc'))
  .option(FLAGS.unixify.flag, FLAGS.unixify.desc)
  .option(FLAGS.force.flag, FLAGS.force.desc)
  .option(FLAGS.nolog.flag, FLAGS.nolog.desc)
  .action(function(argv, options) {
    co(require('./command/licenses')(argv, options)).catch(errorHandler);
  });

program.parse(process.argv);
