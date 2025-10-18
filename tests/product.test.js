import request from "supertest";
import app from "../src/app.js";
import fs from "fs"
import { openDb } from "../src/db/db.js";
import { createTable } from "../src/table/product.table.js"; // adjust path

beforeAll(async () => {
  if (fs.existsSync("products.db")) fs.unlinkSync("products.db");
  const db = await openDb();
  await createTable(db);
});

afterAll(async () => {
  const db = await openDb();
  await db.close();
});

describe("Product APIs with SQLite", () => {
  // Test the GET /products endpoint
  it("should return an empty product list initially", async () => {
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("limit");
    expect(res.body).toHaveProperty("total_products");
    expect(res.body.success).toBe(true);
  });

  // Test the POST /upload endpoint
  it("should upload a CSV file successfully", async () => {
    const res = await request(app)
      .post("/upload")
      .attach("file", "tests/sample-products.csv");
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("stored");
    expect(typeof res.body.data.stored).toBe("number");
    expect(Array.isArray(res.body.data.failed)).toBe(true);
    expect(res.body.success).toBe(true);
  });
  
});


// Test for GET /products/search
describe("Product Search APIs with SQLite", () => {
  it("should return products filtered by brand", async () => {
    const res = await request(app).get("/products/search?brand=StreamThreads");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(0);

    if (res.body.data.length > 0) {
      expect(res.body.data[0].brand).toBe("StreamThreads");
    }

    expect(res.body.success).toBe(true);
  });

  it("should return products filtered by color", async () => {
    const res = await request(app).get("/products/search?color=Red");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(0);

    if (res.body.data.length > 0) {
      expect(res.body.data[0].color).toBe("Red");
    }

    expect(res.body.success).toBe(true);
  });

  it("should return products filtered by size", async () => {
    const res = await request(app).get("/products/search?size=XL");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(0);

    if (res.body.data.length > 0) {
      expect(res.body.data[0].size).toBe("XL");
    }

    expect(res.body.success).toBe(true);
  });

  it("should return products within a given price range", async () => {
    const res = await request(app).get("/products/search?minPrice=400&maxPrice=800");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(0);

    if (res.body.data.length > 0) {
      const first = res.body.data[0];
      expect(first.price).toBeGreaterThanOrEqual(400);
      expect(first.price).toBeLessThanOrEqual(800);
    }

    expect(res.body.success).toBe(true);
  });
});
