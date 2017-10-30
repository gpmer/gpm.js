import chalk from 'chalk';

import * as moment from 'moment';

function getTime(date = new Date()): string {
  return moment(date).format(`YYYY-MM-DD HH:mm:ss`);
}

function generateTemplate(action: string, message: string): string {
  return `${action + getTime()}: ${message}\n`;
}

export function log(message: string): void {
  const tpl: string = generateTemplate(chalk.green('[LOG]'), message);
  process.stdout.write(tpl);
}

export function info(message: string): void {
  const tpl: string = generateTemplate(chalk.blue('[INFO]'), message);
  process.stdout.write(tpl);
}

export function warn(message: string): void {
  const tpl: string = generateTemplate(chalk.yellow('[WARN]'), message);
  process.stdout.write(tpl);
}

export function error(message: string): void {
  const tpl: string = generateTemplate(chalk.red('[ERROR]'), message);
  process.stderr.write(tpl);
}
