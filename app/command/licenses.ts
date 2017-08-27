/**
 * Created by axetroy on 17-3-23.
 */

const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const jt = require('json-toy');

import config from '../config';
import registry, { Target$ } from '../registry';
import globalConfig from '../global-config';

import {
  normalizePath,
  isExistPath,
  isGitRepoDir,
  parseGitConfigAsync,
  parseLicense
} from '../utils';

interface Argv$ {}

interface Options$ {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
}

export default async function licenses(argv: Argv$, options: Options$) {
  const output = {};
  const repositories = registry.repositories.slice();
  while (repositories.length) {
    const repo: Target$ = <Target$>repositories.shift();
    const sourceKey = repo.source;
    const ownerKey = repo.owner;
    const nameKey = repo.name;
    const source = (output[sourceKey] = output[sourceKey] || {});
    const owner = (source[ownerKey] = source[ownerKey] || {});
    const project = owner[nameKey];

    const repoDir = normalizePath(repo.path, options);

    if (!await isGitRepoDir(repoDir)) return;
    let gitConfig = await parseGitConfigAsync({
      cwd: repoDir,
      path: path.join('.git', 'config')
    });
    const origin = gitConfig[`remote "origin"`] || {};
    if (!origin.url || _.isEmpty(origin)) return;

    const entity = {
      URL: origin.url,
      License: 'unkown'
    };

    const licensePath = path.join(repoDir, 'LICENSE');
    if (await isExistPath(licensePath)) {
      const raw = await fs.readFile(licensePath, { encoding: 'utf8' });
      let license: string = parseLicense(raw) + '';
      entity.License = license.trim().replace(/\*+$/, '');
    }

    if (!_.isEmpty(project)) {
      if (_.isString(project)) {
        owner[nameKey] = [project].concat(entity);
      } else if (_.isArray(project)) {
        owner[nameKey].push(entity);
      }
    } else {
      owner[nameKey] = entity;
    }
  }

  const basePath = path.join(
    config.paths.home,
    globalConfig.entity.base || config.defaults.base
  );

  const ROOT = normalizePath(basePath, options);

  !options.nolog &&
    process.stdout.write(
      jt.treeString(
        output,
        {
          space: 4,
          vSpace: 0,
          valueOut: true,
          rootName: normalizePath(ROOT, options)
        }
      ) + '\n'
    );
  return output;
}
