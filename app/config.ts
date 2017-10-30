/**
 * Created by axetroy on 17-2-13.
 */
const path = require('path');
const os = require('os');
const osLocale = require('os-locale');
const pkg = require('../package.json');

export const name: string = <string>pkg.name.replace(/^\@[\w\-\_]+\//gim, '');

const home =
  process.env.GPM_ENV === 'development'
    ? path.join(__dirname, '..', '.home')
    : os.homedir();

export const root: string = path.join(home, `.${name}`);

const config: string = path.join(root, `${name}.config.json`);

const temp: string = path.join(root, 'temp');

const storage: string = path.join(root, 'storage');

const project: string = path.join(__dirname, '..');

export const systemLocale: string = osLocale.sync(); // 系统语言

export const paths = {
  home, // home目录，test模式下为当前目录下的.home目录
  root, // gpm在home目录下的根目录
  config, // gpm配置文件
  temp, // gpm缓存目录
  storage, // gpm数据存储目录
  project // 项目源码目录
};

export const defaults = {
  version: pkg.version,
  owner: name,
  base: name,
  checkUpgrade: true,
  locale: systemLocale
};

export default {
  name,
  paths,
  defaults
};
