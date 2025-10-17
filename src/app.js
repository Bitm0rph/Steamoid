import express, { urlencoded } from "express";
import cors from "cors"
export const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static('public'))


import productRouter from "./routes/product.route.js"

// routes
app.use(productRouter);
