import * as vscode from "vscode";
import {Environment} from "./environment";
import {PromisedDatabase} from "promised-sqlite3";

import { ExtensionList, ExtensionValue, ProfileList, StorageValue } from "./types";

export class Storage {
  private env: Environment;
  private db: PromisedDatabase;
  private dbOpened = false;

  constructor(env: Environment) {
    this.env = env;
    this.db = new PromisedDatabase();
  }

  async closeDb() {
    await this.db.close();
    this.dbOpened = false;
  }

  async openDb() {
    if (!this.dbOpened) {
      await this.db.open(this.env.getGlobalStorageStateDbFile());
      this.dbOpened = true;
    }
  }

  /**
   * Get the list of extensions by state (enabled or disabled)
   * currently set in vscode session
   */
  public async getSessionExtensions(key: "enabled" | "disabled"): Promise<ExtensionValue[]> {
    const sql = "SELECT key, value FROM ItemTable WHERE key = ?";
    await this.openDb();

    return await this.db.get(sql, `extensionsIdentifiers/${key}`).then((result: string) => {
      return JSON.parse(result) as ExtensionValue[];
    });
  }

  public async setSessionExtensions(key: "enabled" | "disabled", extensions: ExtensionValue[]) {
    const sql = "INSERT OR REPLACE INTO ItemTable (key, value) VALUES (?, ?)";
    await this.openDb();

    return await this.db.run(sql, `extensionsIdentifiers/${key}`, JSON.stringify(extensions)).then((result: string) => {
      return JSON.parse(result) as ExtensionValue[];
    });
  }  

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

