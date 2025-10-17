import { Router } from "express";
import { getAllProducts, storeProduct } from "../controllers/product.controller.js";


export const router = Router()

router.route("/upload").post(storeProduct);

router.route("/products").get(getAllProducts);