import { green, blue, yellow, red } from 'colors';

import * as moment from 'moment';

function getTime(date = new Date()): string {
  return moment(date).format(`YYYY-MM-DD HH:mm:ss`);
}

function generateTemplate(action: string, message: string): string {
  return `${action + getTime()}: ${message}\n`;
}

export function log(message: string): void {
  const tpl: string = generateTemplate('[LOG]'.green, message);
  process.stdout.write(tpl);
}

export function info(message: string): void {
  const tpl: string = generateTemplate('[INFO]'.blue, message);
  process.stdout.write(tpl);
}

export function warn(message: string): void {
  const tpl: string = generateTemplate('[WARN]'.yellow, message);
  process.stdout.write(tpl);
}

export function error(message: string): void {
  const tpl: string = generateTemplate('[ERROR]'.red, message);
  process.stderr.write(tpl);
}
