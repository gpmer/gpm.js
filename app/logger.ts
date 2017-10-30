import chalk from 'chalk';

import * as moment from 'moment';

/**
 * get time with format
 * @param {Date} date
 * @returns {string}
 */
function getTime(date = new Date()): string {
  return moment(date).format(`YYYY-MM-DD HH:mm:ss`);
}

/**
 * generate the message template
 * @param {string} action
 * @param {string} message
 * @returns {string}
 */
function generateTemplate(action: string, message: string): string {
  return `${action + getTime()}: ${message}\n`;
}

/**
 * log message
 * @param {string} message
 */
export function log(message: string): void {
  const tpl: string = generateTemplate(chalk.green('[LOG]'), message);
  process.stdout.write(tpl);
}

/**
 * info message
 * @param {string} message
 */
export function info(message: string): void {
  const tpl: string = generateTemplate(chalk.blue('[INFO]'), message);
  process.stdout.write(tpl);
}

/**
 * warn message
 * @param {string} message
 */
export function warn(message: string): void {
  const tpl: string = generateTemplate(chalk.yellow('[WARN]'), message);
  process.stdout.write(tpl);
}

/**
 * error message
 * @param {string} message
 */
export function error(message: string): void {
  const tpl: string = generateTemplate(chalk.red('[ERROR]'), message);
  process.stderr.write(tpl);
}
