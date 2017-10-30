/**
 * Created by axetroy on 17-2-14.
 */
const path = require('path');
const fs = require('fs-extra');
const spawn = require('cross-spawn');
const parseGitConfig = require('parse-git-config');
const _ = require('lodash');
import chalk from 'chalk';

/**
 * 判断是否存在该路径
 * @param dir
 * @returns {Promise<boolean>}
 */
export async function isExistPath(dir): Promise<boolean> {
  try {
    await fs.stat(dir);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 判断项目目录是否是git项目目录
 * @param dir {string}
 * @returns {Promise<boolean>}
 */
export async function isGitRepoDir(dir: string): Promise<boolean> {
  return await isExistPath(path.join(dir, '.git'));
}

export type ParseGitConfigOptions$ =
  | string
  | Function
  | ParseGitConfigObjectOptions$;
export interface ParseGitConfigObjectOptions$ {
  cwd: string;
  path: string;
}

export interface GitConfig$ {
  [key: string]: {
    [subkey: string]: string;
  };
}

/**
 * 解析.git目录的配置文件
 * @param options
 * @returns {Promise<GitConfig$ | any>}
 */
export async function parseGitConfigAsync(
  options: ParseGitConfigOptions$
): Promise<GitConfig$ | any> {
  return await new Promise((resolve, reject) => {
    parseGitConfig(options, function(err: Error | null, config: GitConfig$) {
      if (err) return reject(err);
      return resolve(config);
    });
  });
}

/**
 * 判断是否是link
 * @param path
 * @returns {Promise<boolean>}
 */
export async function isLink(path: string): Promise<boolean> {
  try {
    await fs.readlink(path);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 判断是否是目录
 * @param path
 * @returns {Promise<boolean>}
 */
export async function isDir(path: string): Promise<boolean> {
  try {
    await fs.readdir(path);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 把路径转化为unix格式
 * @param path
 * @returns {string}
 */
export function unixify(path: string): string {
  return (
    '/' +
    path
      .replace(/^\/+/g, '')
      .replace(/^[A-Z]/, match => match.toLowerCase())
      .replace(/\:/, '')
      .replace(/\\/g, '/')
  );
}

/**
 * 路径正常化
 * @param path
 * @param options
 * @returns {string}
 */
export function normalizePath(
  path: string,
  options: { unixify: boolean } = { unixify: false }
): string {
  return options.unixify ? unixify(path) : path;
}

/**
 * - 转换为驼峰式写法
 * @param flag
 * @returns {string}
 */
export function camelcase(flag): string {
  return flag.split('-').reduce(function(str, word) {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

/**
 * 以spawn的方式运行shell命令
 * @param {string} command
 * @param {string[]} argv
 * @param {{}} options
 * @returns {Promise<any>}
 */
export async function spawnShell(
  command: string,
  argv: string[] = [],
  options = {}
): Promise<any> {
  const stream = spawn(
    command,
    argv,
    _.extend(
      { env: process.env, cwd: process.cwd(), stdio: 'inherit' },
      options
    )
  );
  return await new Promise((resolve, reject) => {
    stream.on('close', (code, signal) => {
      code === 0
        ? resolve()
        : reject(
            new Error(
              `<${chalk.red(
                command + ' ' + argv.join(' ')
              )}> Error Code: ${code}, Exist Signal: ${signal}`
            )
          );
    });
  });
}

/**
 * 运行简单的shell命令
 * @param {string} cmd
 * @param {{}} options
 * @returns {Promise<void>}
 */
export async function runShell(cmd: string, options = {}): Promise<void> {
  const cmds: string[] = cmd.split(/\&\&/);
  while (cmds.length) {
    let cmd: string = <string>cmds.shift();
    const cmdArray: string[] = cmd.split(/\&/).map(v => v.trim());
    while (cmdArray.length) {
      let __cmd = <string>cmdArray.shift();
      const subCmd: string[] = __cmd
        .split(/\s+/)
        .map(v => v.trim())
        .filter(v => !!v);
      let command = (<string>subCmd.shift()).trim();
      let argv: string[] = subCmd || [];
      let full_command = command + ' ' + argv.join(' ');
      console.info(`Running Command ${chalk.yellow(full_command)}`);
      await spawnShell(command, <never>argv, options);
    }
  }
}
