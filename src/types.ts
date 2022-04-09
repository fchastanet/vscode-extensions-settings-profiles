import * as vscode from "vscode";

export interface LightExtension {
  globalState: {
    update(key: string, value: any): Thenable<void>;
  },
  readonly globalStorageUri: vscode.Uri;
}

export enum OsType {
  Windows = "win32",
  Linux = "linux",
  Mac = "darwin"
}

export type CommandType =
  "extensions-settings-profiles.active-profiles-setup" |
  "extensions-settings-profiles.activate-profile"

export interface ProfileConfig {
	extensions: Array<string>
	disabledExtensions?: Array<string>,
	settings?: {[key: string]: any},
	temporaryProfile?: boolean
}

export interface ProfilesConfig {
	[key: string]: ProfileConfig;
}

export interface Config {
	profiles: ProfilesConfig
	activeProfiles: Array<string>
	enableStartupCheck: boolean,
	listActiveProfilesFirst: boolean
}

export enum ProfileAction {
	ACTIVATE,
	DEACTIVATE,
	STARTUP,
	VIEW
}

export class ProfileRef {
	name: string;
	activated = false;
	exists = true;
	constructor(name: string) {
		this.name = name;
	}
	displayName() {
		return (this.activated ? "(Active) " : "") + this.name + (!this.exists ? " (PROFILE NOT DEFINED)" : "") ;
	}
}

export type StorageValue = { key: string; value: string };
export type ExtensionValue = { id: string; uuid: string; label?: string; description?: string };

export type ExtensionValueListByState = {
  enabled: ExtensionValue[];
  disabled: ExtensionValue[];
};

export type ProfileList = {
  [key: string]: ExtensionList;
};

export type ExtensionList = {
  [key: string]: {
    uuid: string;
    label?: string;
    description?: string;
  };
};

export type PackageJson = {
  "name": string,
  "displayName": string,
  "description": string,
  "version": string,
  "publisher": string,
  "__metadata": {
    "id": string,
    "publisherId": string,
    "publisherDisplayName": string,
    "installedTimestamp": number
  },
  [key: string]: any
};

export type StorageKeyID = "profiles" | "extensions";
export type ProfilesAndExtensionsSettings = {
  profiles: ProfileList,
  extensions: ExtensionList
}