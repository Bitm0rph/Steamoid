import fs from 'fs'
import csv from 'csv-parser'
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { openDb } from '../db/db.js';

const valid = (data) => {
    return (
        data.sku && data.name && data.brand && data.mrp && data.price
        && data.quantity && !isNaN(data.price) && !isNaN(data.mrp)
        && !isNaN(data.quantity) && (data.price <= data.mrp) && (data.quantity>=0)
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
                "INSERT INTO products (sku, name, brand, color, size, mrp, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [row.sku, row.name, row.brand, row.color, row.size, row.mrp, row.price, row.quantity]
            );
        }
        fs.unlinkSync(path)
        return res.status(201).json(
            new ApiResponse(200, {
                "stored": validRows.length(),
                "failed": invalidRows
            },"Upload completed.")
        )
    })
})

export const getAllProducts = asyncHandler(async (req,res) => {
    const db = await openDb()
    const products = await db.all("SELECT * FROM products")
    return res.status(201).json(
        new ApiResponse(200, products)
    )
})
