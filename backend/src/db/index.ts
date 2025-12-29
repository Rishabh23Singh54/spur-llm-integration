import * as sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import * as fs from "fs";
import * as path from "path";

let db: Database<sqlite3.Database, sqlite3.Statement>;

export async function initDb() {
  db = await open({
    filename: "chat.db",
    driver: sqlite3.Database
  });

  const schema = fs.readFileSync(
    path.join(__dirname, "schema.sql"),
    "utf-8"
  );

  await db.exec(schema);
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}
