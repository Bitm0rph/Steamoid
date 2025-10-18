import { openDb } from "../db/db.js";

export async function createTable() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sku TEXT UNIQUE,
        name TEXT,
        brand TEXT,
        color TEXT,
        size TEXT,
        mrp REAL,
        price REAL,
        quantity INTEGER
    )
  `);
  console.log("Products table ready");
}