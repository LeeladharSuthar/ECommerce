import { Request } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.model.js";
import { reduceStock } from "../utils/reduceStock.js";
import { revalidateCahce } from "../utils/revalidateCache.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const newOrder = asyncHandler(async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
  const { ShippingInfo, discount, orderItems, shippingCharges, subTotal, tax, total, user } = req.body

  if (!ShippingInfo || !orderItems || !subTotal || !tax || !total || !user) {
    return next(new ApiError("Bad Request", 401))
  }

  await Order.create({ ShippingInfo, discount, orderItems, shippingCharges, subTotal, tax, total, user })

  await reduceStock(orderItems)

  await revalidateCahce({ product: true, order: true, admin: true })

  return res.status(200).json(new ApiResponse(200, {}, true, "Order Placed Successfully"))
})

const myOrders = asyncHandler(async (req, res, next) => {
  const { id } = req.query;
  const myOrders = await Order.find({ user: id })
  return res.status(200).json(new ApiResponse(200, { myOrders }))
})

// admin
const allOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.aggregate([
    {
      '$lookup': {
        'from': 'users',
        'localField': 'user',
        'foreignField': '_id',
        'as': 'userInfo',
        'pipeline': [
          {
            '$project': {
              'name': 1
            }
          }
        ]
      }
    }
  ])
  return res.status(200).json(new ApiResponse(200, { orders }))
})

const singleOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const orders = await Order.aggregate([
    {
      '$match': {
        '_id': new mongoose.Types.ObjectId(id)
      }
    },
    {
      '$lookup': {
        'from': 'users',
        'localField': 'user',
        'foreignField': '_id',
        'as': 'userInfo',
        'pipeline': [
          {
            '$project': {
              'name': 1
            }
          }
        ]
      }
    }
  ])
  if (!orders) {
    return next(new ApiError("Order Not Found", 404))
  }
  return res.status(200).json(new ApiResponse(200, { orders }))
})

const processOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const order = await Order.findById(id)
  if (!order) {
    return next(new ApiError("Order Not Found", 404))
  }
  order.status = order.status === "Processing" ? "Shipped" : "Delivered"
  await order.save()
  return res.status(200).json(new ApiResponse(200, {}, true, "Order Processed"))

})

const deleteOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const order = await Order.findById(id)
  if (!order) {
    return next(new ApiError("Order Not Found", 404))
  }
  await order.deleteOne()
  return res.status(200).json(new ApiResponse(200, {}, true, "Order deleted Successfully"))
})

export { newOrder, myOrders, allOrders, deleteOrder, singleOrder, processOrder }