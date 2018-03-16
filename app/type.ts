export interface ICommonOption {
  nolog?: boolean;
  unixify?: boolean;
  force?: boolean;
  ignoreRc?: boolean;
}

export interface IAddOption extends ICommonOption {
  name?: string;
}
export interface IRemoveOption extends ICommonOption {}
export interface IFindOption extends ICommonOption {}
export interface IPruneOption extends ICommonOption {}
export interface ICleanOption extends ICommonOption {}
export interface IRelinkOption extends ICommonOption {}
export interface IListOption extends ICommonOption {}
export interface IConfigOption extends ICommonOption {}
export interface IRuntimeOption extends ICommonOption {}

export type IConfigAction =
  | "list"
  | "LIST"
  | "get"
  | "GET"
  | "set"
  | "SET"
  | "remove"
  | "REMOVE"
  | "reset"
  | "RESET";

export interface IConfigArgv {
  key?: string;
  value?: string;
  action: IConfigAction;
}

export interface IFlag {
  flag: string;
  desc: string;
}

export interface IGlobalFlag {
  unixify: IFlag;
  force: IFlag;
  nolog: IFlag;
  ignoreRc: IFlag;
}
