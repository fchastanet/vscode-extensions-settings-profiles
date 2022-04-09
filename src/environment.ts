"use strict";

import { normalize, resolve } from "path";
import * as vscode from "vscode";
import { OsType, LightExtension } from "./types";
import path = require("path");
import fs = require("fs");

export const SUPPORTED_OS: string[] = Object.keys(OsType)
  .filter(k => !/\d/.test(k))
  .map(k => k.toLowerCase()); // . ["windows", "linux", "mac"];

export class Environment {
  public context: LightExtension;
  public isPortable: boolean;
  public osType: string;
  public vsCodeFolderPath: string; //eg: /home/wsl/.vscode-server
  public userFolderPath: string;
  public thisExtensionPath: string;
  public extensionFolder: string;
  
  constructor(context: LightExtension) {
		this.context = context;

    // Make sure the global state folder exists. 
		// This is needed for using this.context.globalStoragePath to access user folder
    this.context.globalState.update("_", undefined); 

    this.isPortable = !!process.env.VSCODE_PORTABLE;
    this.osType = process.platform as OsType;

    if (this.isPortable) {
      this.thisExtensionPath = String(process.env.VSCODE_PORTABLE); 
			this.vsCodeFolderPath = String(process.env.VSCODE_PORTABLE);
      this.userFolderPath = resolve(this.vsCodeFolderPath, "user-data/User").concat(
        normalize("/")
      );
      this.extensionFolder = resolve(this.vsCodeFolderPath, "extensions").concat(
        normalize("/")
      );
    } else {
      this.thisExtensionPath = context.globalStorageUri.path; 
			this.vsCodeFolderPath = resolve(this.thisExtensionPath, "../../..").concat(
        normalize("/")
      );
      this.userFolderPath = resolve(this.vsCodeFolderPath, "User").concat(normalize("/"));
      this.extensionFolder = resolve(
        vscode.extensions.all.filter(
          extension => !extension.packageJSON.isBuiltin
        )[0].extensionPath,
        ".."
      ).concat(normalize("/")); // Gets first non-builtin extension's path
    }
  }

  public getGlobalStorageStateDbFile(): string {
    return resolve(this.userFolderPath, 'globalStorage/state.vscdb');
  }
}