import mongoose from "mongoose";
import { ProductDocument } from "../types/types.js";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"]
    },
    photo: {
        type: String,
        required: [true, "Please enter photo"]
    },
    price: {
        type: Number,
        required: [true, "Please enter proce"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter stock"]
    },
    category: {
        type: String,
        required: [true, "Please enter product category"],
        trim: true
    },
}, {
    timestamps: true
})

export const Product = mongoose.model<ProductDocument>("Product", ProductSchema)