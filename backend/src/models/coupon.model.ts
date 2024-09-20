import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: [true, "Please enter coupon"]
    },
    amount: {
        type: Number,
        required: [true, "Please enter coupon amount"]
    }
}, {})

export const Coupon = mongoose.model("Coupon", CouponSchema)