import { openDb } from "./src/db/db.js"; // adjust path
import sqlite3 from "sqlite3";

const clearProducts = async () => {
  const db = await openDb();

  // Delete all products
  await db.run("DELETE FROM products");

  // Reset auto-increment ID
  await db.run("DELETE FROM sqlite_sequence WHERE name='products'");

  console.log("Products cleared and ID reset.");
  process.exit(0);
};

clearProducts();

