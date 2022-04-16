import {Environment} from "../environment";
import { SqliteDatabase } from './database';
import { ExtensionValue } from "../types";

export class Storage {
  private env: Environment;
  private db: SqliteDatabase;

  constructor(env: Environment) {
    // TODO remove env dependency
    this.env = env;
    this.db = new SqliteDatabase(this.env.getGlobalStorageStateDbFile());
  }

  public async closeDb() {
    await this.db.close();
  }

  /**
   * Get the list of extensions by state (enabled or disabled)
   * currently set in vscode session
   */
  public async getSessionExtensions(key: "enabled" | "disabled"): Promise<ExtensionValue[]> {
    const sql = "SELECT key, value FROM ItemTable WHERE key = ?";
    
    return await this.db.get<string>(sql, `extensionsIdentifiers/${key}`).then((result: string|undefined) => {
      if (typeof result === undefined) {
        return [];
      }

      return JSON.parse(result as string) as ExtensionValue[];
    });
  }

  /**
   * set extensions state inside sqlite database
   */
  public async setSessionExtensions(key: "enabled" | "disabled", extensions: ExtensionValue[]) {
    const sql = "INSERT OR REPLACE INTO ItemTable (key, value) VALUES (?, ?)";

    return await this.db.run(sql, `extensionsIdentifiers/${key}`, JSON.stringify(extensions));
  }  

}

