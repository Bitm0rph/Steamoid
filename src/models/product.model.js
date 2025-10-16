import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    SKU: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Brand: {
        type: String,
        required: true
    },
    Color: {
        type: String,
        required: true
    },
    Size: {
        type: String,
        required: true
    },
    MRP: {
        type: Number,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Quantity: {
        type: Number,
        required: true
    }
})

export const Product = mongoose.model("Product",productSchema);