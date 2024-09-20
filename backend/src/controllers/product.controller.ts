import { rm } from "fs";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NewProductReqBody, ProductDocument, Query, searchRequestBody } from "../types/types.js";
import { Request } from "express";
import { FilterQuery, isValidObjectId } from "mongoose";
import mongoose from "mongoose"
import { myCache } from "../app.js";
import { revalidateCahce } from "../utils/revalidateCache.js";

const newProduct = asyncHandler(async (req: Request<{}, {}, NewProductReqBody>, res, next) => {
    const { category, name, price, stock } = req.body
    const photo = req.file
    console.log(req.file)
    if (!photo) {
        return next(new ApiError("Image missing", 400))
    }

    if (!name || !price || !stock || !category) {
        rm(photo.path, () => {
            console.log("Deleted")
        })
        return next(new ApiError("All fields required", 400))
    }

    await Product.create({ name, price, stock, category: category.toLowerCase(), photo: photo?.path })

    await revalidateCahce({ product: true })

    // console.log(req.file)
    // {
    //     fieldname: 'photo',
    //     originalname: 'img.jpg',
    //     encoding: '7bit',
    //     mimetype: 'image/jpeg',
    //     destination: 'uploads',
    //     filename: 'img.jpg',
    //     path: 'uploads\\img.jpg',
    //     size: 308300
    //   }

    return res.status(201).json(new ApiResponse(201, {}, true, "Product created Successfully"))
})

// Caching Used
const getLatestProducts = asyncHandler(async (req, res, next) => {
    let products;
    if (myCache.has("latestProducts")) {
        products = JSON.parse(myCache.get("latestProducts") as string)
    } else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5).select(["-updatedAt", "-createdAt"])
        myCache.set("latestProducts", JSON.stringify(products))
    }

    return res.status(200).json(new ApiResponse(200, { products }, true))
})

const getAllCategories = asyncHandler(async (req, res, next) => {
    let categories;
    if (myCache.has("categories")) {
        categories = JSON.parse(myCache.get("categories") as string)
    } else {
        categories = await Product.distinct("category")
        myCache.set("categories", JSON.stringify(categories))
    }
    categories = await Product.distinct("category")
    return res.status(200).json(new ApiResponse(200, { categories }, true))
})

const getAllProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find({})
    return res.status(200).json(new ApiResponse(200, { products }, true))
})

const getProduct = asyncHandler(async (req: Request<{ id: string }>, res, next) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
        return next(new ApiError("Invalid Product Id", 400))
    }
    const product = await Product.findById(new mongoose.Types.ObjectId(id))
    if (!product) {
        return next(new ApiError("Product Not found", 404))
    }
    return res.status(200).json(new ApiResponse(200, { product }, true))
})

// To add Request<{id:string}, {}, NewProductReqBody>
// use Request<any> in Controller in types.ts
const updateProduct = asyncHandler(async (req: Request<{ pid: string }, {}, NewProductReqBody>, res, next) => {
    const { pid } = req.params
    const { name, price, stock, category } = req.body
    const photo = req.file
    let product = await Product.findById(pid)

    if (!product) {
        return next(new ApiError("Invalid Product Id", 404))
    }

    if (photo) {
        rm(product.photo, () => {
            console.log("Old Photo Deleted")
        })
        product.photo = photo.path
    }
    if (name) product.name = name
    if (category) product.category = category
    if (stock) product.stock = stock
    if (price) product.price = price

    await product.save()
    await revalidateCahce({ product: true })
    product = await Product.findById(pid)

    return res.status(200).json(new ApiResponse(200, { product }, true, "Product Updated Successfully"))
})

const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) {
        return next(new ApiError("Product Not found", 404))
    }
    rm(product.photo, () => {
        console.log("Product Photo Deleted Successfully")
    })
    const status = await Product.deleteOne({ _id: id })
    await revalidateCahce({ product: true })
    return res.status(200).json(new ApiResponse(200, {}, true, "Product Deleted Successfully"))
})

const searchProduct = asyncHandler(async (req: Request<{}, {}, {}, searchRequestBody>, res, next) => {

    const { category, sort, search, price } = req.query
    const page = Number(req.query.page) || 1
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8
    const skip = limit * (page - 1)
    const query: FilterQuery<ProductDocument> = {}

    if (search) {
        query.name = {
            $regex: search, // fuzzy search
            $options: "i", // case insensitive search
        };
    }
    if (category) {
        query.category = category;
    }
    if (price) {
        query.price = {
            $lte: Number(price),
        };
    }


    const [products, allProducts] = await Promise.all([
        Product.find(query).sort(sort ? { price: sort === "asc" ? 1 : -1 } : undefined).limit(limit).skip(skip),
        Product.find(query)
    ])

    // const products = await Product.find(query)
    //     .sort(sort ? { price: sort === "asc" ? 1 : -1 } : undefined)
    //     .limit(limit)
    //     .skip(skip);

    // const allProducts = await Product.find(query);


    const totalPage = Math.ceil(allProducts.length / limit);
    console.log("hi2")
    return res.status(200).json(new ApiResponse(200, { products, length: totalPage }, true))

})


export { deleteProduct, getAllCategories, getAllProducts, getLatestProducts, getProduct, newProduct, updateProduct, searchProduct };

