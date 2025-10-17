import { openDb } from "../db/db.js";

export async function createTable() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        sku TEXT,
        name TEXT,
        brand TEXT,
        color TEXT,
        size TEXT,
        mrp REAL,
        price REAL,
        quantity REAL
    )
  `);
  console.log("Products table ready");
}