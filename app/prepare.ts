/**
 * Created by axetroy on 17-2-15.
 */
const fs = require('fs-extra');
import * as i18n from 'i18n';
import { __ } from 'i18n';

import { paths, defaults } from './config';
import globalConfig from './global-config';
import registry from './registry';

export interface I18nConfig$ {
  locales: string[];
  defaultLocale: string;
  directory: string;
  extension: string;
  register: any;
  objectNotation: boolean;
}

/**
 1. make sure root directory has exist
 2. make sure [temp, config] has exist
 3. make sure [config] must be a json file even it's empty
 */
export default async function(): Promise<void> {
  await fs.ensureDir(paths.root); // ensure gpm root dir exist
  await [
    await fs.ensureDir(paths.temp), // ensure gpm temp dir exist
    await globalConfig.init(), // ensure global config have been init
    await registry.init() // ensure registry init
  ];

  const supports = ['en_US', 'zh_CN'];

  const currentLocale = globalConfig.get('locale') || defaults.locale;

  const i18nConfig: I18nConfig$ = {
    locales: ['en_US', 'zh_CN'],
    defaultLocale: supports.includes(currentLocale)
      ? currentLocale
      : defaults.locale,
    directory: paths.project + '/locales',
    extension: '.json',
    register: global,
    objectNotation: true
  };

  i18n.configure(i18nConfig);
}
