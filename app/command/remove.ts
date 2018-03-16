/**
 * Created by axetroy on 17-2-14.
 */

import chalk from "chalk";
const fs = require("fs-extra");
const _ = require("lodash");
const inquirer = require("inquirer");
const __ = require("i18n").__;

export const prompt: any = inquirer.createPromptModule();

import registry, { Target$ } from "../registry";
import { normalizePath } from "../utils";
import { decoratorIndex } from "./find";
import { info } from "../logger";
import { IRemoveOption } from "../type";

export interface ExtendTarget$ extends Target$ {
  __index__: string;
}

export interface Answer$ {
  repository: string;
}

export default async function remove(
  owner: string,
  repo: string,
  options: IRemoveOption
): Promise<void> {
  let repositories: Target$[] = registry.repositories.slice();
  let target: Target$;
  if (owner) {
    if (!repo)
      return info(__("commands.remove.log.err_missing_repo", { owner: owner }));
    target = _.find(
      repositories,
      repo => repo.owner === owner.trim() && repo.name === repo.trim()
    );
  } else {
    repositories = _.map(repositories, decoratorIndex);

    const answer: Answer$ = await inquirer.prompt([
      {
        name: "repository",
        message: __("commands.remove.log.info_type_to_search") + ":",
        type: "autocomplete",
        pageSize: 10,
        source: (answers, input) =>
          Promise.resolve(
            registry
              .find(input)
              .map(decoratorIndex)
              .map((repo: any) => repo.__index__)
          )
      }
    ]);

    target = _.find(
      repositories,
      (v: ExtendTarget$) => v.__index__ === answer.repository
    );
  }

  if (
    (await prompt({
      type: "confirm",
      name: "result",
      message:
        `[${chalk.red("DANGER")}]` +
        __("commands.remove.log.warn_confirm_del", {
          repo: chalk.red(normalizePath(target.path, options))
        }) +
        ":",
      ["default"]: false
    })).result == false
  ) {
    !options.nolog && info(__("global.tips.good_bye"));
    return process.exit(0);
  }

  await fs.ensureDir(target.path);
  await fs.emptyDir(target.path);
  await fs.remove(target.path);

  await registry.remove(target);

  info(
    __("commands.remove.log.del", {
      repo: chalk.green(normalizePath(target.path, options))
    })
  );
}
