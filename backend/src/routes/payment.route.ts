import express from "express"
import { applyDiscount, newCoupon, allCoupons, deleteCoupon, createPaymentIntent } from "../controllers/payment.controller.js"
import { adminOnly } from "../middlewares/auth.js"

const app = express.Router()


app.post("/create", createPaymentIntent)


app.post("/coupon/new", adminOnly, newCoupon)
app.get("/discount", applyDiscount)
app.get("/coupon/all", adminOnly, allCoupons)
app.delete("/coupon/:code", adminOnly, deleteCoupon)

export default app