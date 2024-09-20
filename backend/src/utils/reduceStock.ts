import { Product } from "../models/product.model.js"
import { OrderItemType } from "../types/types.js"
import { ApiError } from "./ApiError.js"
export const reduceStock = async (orderItems: OrderItemType[]) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i]
        const product = await Product.findById(order.productId)
        if (!product) {
            throw new ApiError("Product not found")
        }
        product.stock -= order.quantity
        product.save()
    }
}