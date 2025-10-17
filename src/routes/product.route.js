import { Router } from "express";
import { getAllProducts, storeProduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


export const router = Router()

router.route("/upload").post(
    upload.single("file"),
    storeProduct
)

router.route("/products").get(getAllProducts);