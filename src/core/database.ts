import { Database as sqlite3Database, Statement as sqlite3Statement } from 'sqlite3';
import { open, Database, ISqlite } from 'sqlite';

export class SqliteDatabase {
  private filename: string;
  private db: Database|null = null;

  constructor(filename: string) {
    this.filename = filename;
  }

  public async close() {
    if (this.db !== null) {
      this.db.close();
      this.db = null;
    }
  }

  private async open() {
    if (this.db === null) {
      this.db = await open<sqlite3Database, sqlite3Statement>({
        filename: this.filename,
        driver: sqlite3Database
      });
    }

    return this.db;
  }

  public async get<T>(sql: ISqlite.SqlType, ...params: any[]): Promise<T | undefined> {
    const db = await this.open();

    return db.get<T | undefined>(sql, params);
  }


  public async run(sql: ISqlite.SqlType, ...params: any[]): Promise<ISqlite.RunResult<sqlite3Statement>> {
    const db = await this.open();

    return await db.run(sql, params);
  }

}

