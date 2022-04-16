import {assert, expect} from "chai";
import exp = require("constants");
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { SqliteDatabase } from '../../../core/database';

suite("Test database", () => {
  let tmpDir: string;
  let dbFileName: string;
  const DATABASE_DIRNAME = 'databaseTest';
  const DATABASE_FILENAME = 'databaseName';

  setup(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), DATABASE_DIRNAME));
    dbFileName = path.join(tmpDir, DATABASE_FILENAME);
  });

  teardown(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  test("Create Database", async () => {
    const db = getDb(dbFileName);

    const result = await db.get("SELECT 1");
    assert.ok(fs.existsSync(dbFileName));
    expect(result).to.be.eql({"1": 1});
  });

  test("Create Table", async () => {
    const db = getDb(dbFileName);

    await createTable(dbFileName, db);
  });

  test("Query empty table", async () => {
    const db = getDb(dbFileName);
    await createTable(dbFileName, db);

    const queryEmptyTableResult = await db.get("SELECT * FROM groups");
    expect(queryEmptyTableResult).to.be.an('undefined');
  });

  test("insert row", async () => {
    const db = getDb(dbFileName);
    await createTable(dbFileName, db);

    await insertRow(db);
  });

  test("query one row", async () => {
    const db = getDb(dbFileName);
    await createTable(dbFileName, db);
    await insertRow(db);

    // query one row
    const queryResult = await db.get("SELECT * FROM groups");
    expect(queryResult).to.be.eql({ group_id: 1, name: 'coucou' });
  });


  const getDb = function(dbFileName: string): SqliteDatabase {
    const db = new SqliteDatabase(dbFileName);
    assert.notOk(fs.existsSync(dbFileName));

    return db;
  };

  const createTable = async function(dbFileName: string, db: SqliteDatabase) {
    //create table
    const createTableResult = await db.run(
      `CREATE TABLE groups (
        group_id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      );`
    );

    expect(createTableResult).to.have.a.property('changes', 0);
    expect(createTableResult).to.have.a.property('lastID', 0);
    assert.ok(fs.existsSync(dbFileName));
  };

  const insertRow = async function(db: SqliteDatabase) {
    const insertResult = await db.run(
      `INSERT INTO groups VALUES (1, "coucou");`
    );
    expect(insertResult).to.have.a.property('changes', 1);
    expect(insertResult).to.have.a.property('lastID', 1);
  };

});
