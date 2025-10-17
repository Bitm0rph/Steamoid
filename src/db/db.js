import sqlite3 from "sqlite3";
import { open } from "sqlite";

// open() automatically creates the DB file if it doesn’t exist
export async function openDb() {
  return open({
    filename: "./products.db",
    driver: sqlite3.Database
  });
}
