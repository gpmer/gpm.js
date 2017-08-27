/**
 * Created by axetroy on 17-2-15.
 */
const fs = require('fs-extra');

import { __ } from 'i18n';
import * as i18n from 'i18n';

import { paths, defaults } from './config';
import globalConfig from './global-config';
import registry from './registry';

/**
 1. make sure root directory has exist
 2. make sure [temp, config] has exist
 3. make sure [config] must be a json file even it's empty
 */
export default async function(): Promise<any> {
  await fs.ensureDir(paths.root);
  await [
    await fs.ensureDir(paths.temp),
    await globalConfig.init(),
    await registry.init()
  ];

  const supports = ['en_US', 'zh_CN'];

  const currentLocale = globalConfig.get('locale') || defaults.locale;

  i18n.configure({
    locales: ['en_US', 'zh_CN'],
    defaultLocale: supports.includes(currentLocale)
      ? currentLocale
      : defaults.locale,
    directory: paths.project + '/locales',
    extension: '.json',
    register: global,
    objectNotation: true
  });
}
