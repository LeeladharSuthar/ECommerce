import express, { NextFunction, Request, Response } from "express"

import NodeCache from "node-cache"
export const myCache = new NodeCache()

import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})

import { connectDB } from "./db/connectDb.js"

const app = express()
const port = process.env.PORT || 8080
const stripeKey = process.env.STRIPE_KEY || ""

import cors from "cors"
app.use(cors())

import Stripe from "stripe"
export const stripe = new Stripe(stripeKey)

app.use(express.json())

// Logs the requests made to the server in terminal
import morgan from "morgan"
app.use(morgan("dev"))

app.use("/uploads", express.static("uploads"))





// Importing Routes
import userRoutes from "./routes/user.route.js"
import productRoutes from "./routes/product.route.js"
import paymentRoutes from "./routes/payment.route.js"
import orderRoutes from "./routes/order.route.js"
import dashboardRoutes from "./routes/stats.route.js"
import { ApiError } from "./utils/ApiError.js"
import { ErrorMiddleware } from "./middlewares/ErrorMiddleware.js"

// Routes declarations
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/order", orderRoutes)
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1/dashboard", dashboardRoutes)

app.get("/", (req, res) => {
    res.send("hello")
})

app.use(ErrorMiddleware)

app.listen(port, () => {
    connectDB();
    console.log(`Server is listening at ${port}`)
})