import { stripe } from "../app.js";
import { Coupon } from "../models/coupon.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPaymentIntent = asyncHandler(async (req, res, next) => {
    const { amount } = req.body
    console.log("gello")
    if (!amount) {
        return next(new ApiError("Please enter amount", 400))
    }
    const paymentIntent = await stripe.paymentIntents.create({ 'amount': Number(amount) * 100, currency: "inr" })
    
    return res.status(201).json(new ApiResponse(201, { client_secret: paymentIntent.client_secret }))
})

const newCoupon = asyncHandler(async (req, res, next) => {
    const { coupon, amount } = req.body

    if (!coupon || !amount) {
        return next(new ApiError("Please provide the required fields", 400))
    }

    await Coupon.create({ code: coupon, amount })
    return res.status(200).json(new ApiResponse(200, {}, true, "Coupon Created Successfully"))
})

const applyDiscount = asyncHandler(async (req, res, next) => {
    const { coupon } = req.query

    if (!coupon) {
        return next(new ApiError("Please provide the required fields", 400))
    }

    const couponDoc = await Coupon.findOne({ code: coupon })

    if (!couponDoc) {
        return next(new ApiError("Invalid Coupon Code"))
    }
    return res.status(200).json(new ApiResponse(200, { couponDoc }))
})

const allCoupons = asyncHandler(async (req, res, next) => {
    const coupons = await Coupon.find({})
    return res.status(200).json(new ApiResponse(200, { coupons }))
})

const deleteCoupon = asyncHandler(async (req, res, next) => {
    const { code } = req.params

    const couponDoc = await Coupon.findOne({ code })

    if (!couponDoc) {
        return next(new ApiError("Invalid Coupon Code", 400))
    }

    await couponDoc.deleteOne()

    return res.status(200).json(new ApiResponse(200, {}, true, "Coupon deleted Successfully"))
})

export { newCoupon, applyDiscount, allCoupons, deleteCoupon, createPaymentIntent }