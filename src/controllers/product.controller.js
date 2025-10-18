import fs from 'fs'
import csv from 'csv-parser'
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { openDb } from '../db/db.js';

const valid = (data) => {
    let {sku, name, brand, mrp, price, quantity} = data;
    mrp = Number(mrp)
    price = Number(price);
    quantity = Number(quantity)
    return (
        sku && name && brand && mrp && price && quantity && !isNaN(price) && !isNaN(mrp)
        && !isNaN(quantity) && price <= mrp && quantity>=0
    )
}

export const storeProduct = asyncHandler(async (req,res) => {
    const db = await openDb();
    const validRows = [], invalidRows = [];
    
    const path = req.file?.path;
    if(!path){
        throw new ApiError(400, "File is required!!")
    }

    const allowedMime = ["text/csv", "application/vnd.ms-excel"];
    if(!allowedMime.includes(req.file.mimetype)) {
        throw new ApiError(400, "Only CSV file is accepted!!")
    }

    fs.createReadStream(path)
    .pipe(csv())
    .on("data", (data) => {
        if(!valid(data)){
            invalidRows.push(data);
        } else {
            data.mrp = Number(data.mrp);
            data.price = Number(data.price);
            data.quantity = Number(data.quantity);

            validRows.push(data);
        }
    })
    .on("end", async () => {
        for(const row of validRows){
            await db.run(
                "INSERT OR IGNORE INTO products (sku, name, brand, color, size, mrp, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [row.sku, row.name, row.brand, row.color, row.size, row.mrp, row.price, row.quantity]
            );
        }
        fs.unlinkSync(path)
        return res.status(200).json(
            new ApiResponse(200, {
                "stored": validRows.length,
                "failed": invalidRows
            },"Upload completed.")
        )
    })
})

export const getAllProducts = asyncHandler(async (req,res) => {
    const db = await openDb()

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1 || limit > 100) {
        throw new ApiError(400, "Invalid pagination parameters");
    }

    const offset = (page-1)*limit;

    const products = await db.all("SELECT * FROM products LIMIT ? OFFSET ?",[limit, offset]);

    const totalProducts = await db.all("SELECT * FROM products");
    const total = totalProducts.length

    let msg = "Success";
    if(products.length === 0) msg = "No product found"

    return res.status(200).json(
        new ApiResponse(200, products, msg, page, limit, total)
    )
})

export const getSelectedProducts = asyncHandler(async (req,res) => {
    const db = await openDb();

    const { brand, color, size, maxPrice, minPrice } = req.query;

    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if(brand){
        query += " AND brand = ?";
        params.push(brand);
    }
    if(color){
        query += " AND color = ?";
        params.push(color);
    }
    if(size){
        query += " AND size = ?";
        params.push(size);
    }
    if(minPrice){
        query += " AND price >= ?";
        params.push(Number(minPrice));
    }
    if(maxPrice){
        query += " AND price <= ?";
        params.push(Number(maxPrice));
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1 || limit > 100) {
        throw new ApiError(400, "Invalid pagination parameters");
    }
    
    const offset = (page-1)*limit;
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const products = await db.all(query, params);
    
    let countQuery = "SELECT COUNT(*) AS total FROM products WHERE 1=1";
    const countParams = [];

    if(brand) countParams.push(brand), countQuery += " AND brand = ?";
    if(color) countParams.push(color), countQuery += " AND color = ?";
    if(size) countParams.push(size), countQuery += " AND size = ?";
    if(minPrice) countParams.push(Number(minPrice)), countQuery += " AND price >= ?";
    if(maxPrice) countParams.push(Number(maxPrice)), countQuery += " AND price <= ?";

    const totalResult = await db.get(countQuery, countParams);
    const total = totalResult.total;

    let msg = "Success";
    if(products.length === 0) msg = "No product found"

    return res.status(200).json(
        new ApiResponse(200, products, msg, page, limit, total)
    )
})