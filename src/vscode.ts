import * as vscode from "vscode";
import { ExtensionValue } from "./types";

export class VsCode {

  /**
   * VSCode hides disabled extensions
   * @see https://github.com/microsoft/vscode/issues/15466
   */
  public getEnabledExtensions(): ExtensionValue[] {
    return vscode.extensions.all
      .filter((e) => !/.*(?:\\\\|\/)resources(?:\\\\|\/)app(?:\\\\|\/)extensions(?:\\\\|\/).*/i.test(e.extensionPath)) // ignore internal extensions
      .map(item => ({
        id: item.id,
        uuid: item?.packageJSON.uuid,
        label: item?.packageJSON.displayName,
        description: item?.packageJSON.description
      }) as ExtensionValue);
  }  

}

