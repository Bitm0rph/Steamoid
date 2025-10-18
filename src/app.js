import express from "express";
import cors from "cors"
const app = express();
import { createTable } from "./table/product.table.js";

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static('public'))

createTable()


import productRouter from "./routes/product.route.js"

// routes
app.use(productRouter);

export default app