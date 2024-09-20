import { myCache } from "../app.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { calculatePercentage } from "../utils/calculatePercentage.js";

const getDashboardStata = asyncHandler(async (req, res, next) => {
    let stats = {}
    if (myCache.has("adminStats")) {
        stats = JSON.parse(myCache.get("adminStats") as string)
    } else {
        const todayDate = new Date()
        const sixMonthAgoDate = new Date(todayDate.getFullYear(), todayDate.getMonth() - 6, 1)

        let thisMonth = {
            start: new Date(todayDate.getFullYear(), todayDate.getMonth(), 1),
            end: todayDate
        }
        let lastMonth = {
            start: new Date(todayDate.getFullYear(), todayDate.getMonth() - 1, 1),
            end: new Date(todayDate.getFullYear(), todayDate.getMonth(), 0)
        }

        const [thisMonthProducts, lastMonthProducts, thisMonthUsers, lastMonthUsers, thisMonthOrders, lastMonthOrders, totalUsers, totalProducts, orders, categories, femaleCount, maleCount, latestTransactions] = await Promise.all([
            Product.aggregate([
                {
                    '$match': {
                        'createdAt': {
                            '$gte': thisMonth.start,
                            '$lte': thisMonth.end
                        }
                    }
                }
            ]),
            Product.aggregate([
                {
                    '$match': {
                        'createdAt': {
                            '$gte': lastMonth.start,
                            '$lte': lastMonth.end
                        }
                    }
                }
            ]),
            User.find({
                "createdAt": {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end
                }
            }),
            User.find({
                "createdAt": {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end
                }
            }),
            Order.find({
                "createdAt": {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end
                }
            }),
            Order.aggregate([{
                "$match": {
                    "createdAt": {
                        $gte: lastMonth.start,
                        $lte: lastMonth.end
                    }
                }
            }]),
            User.countDocuments(),
            Product.countDocuments(),
            Order.find({}).select("total"),
            Product.aggregate([
                {
                    $group: {
                        _id: "$category",   // Group by the 'category' field
                        totalItems: { $sum: 1 } // Count the number of items in each category
                    }
                },
                {
                    $project: {
                        _id: 0,               // Exclude the default _id field from the output
                        category: "$_id",     // Include the category as 'category'
                        totalItems: 1         // Include the totalItems field
                    }
                }
            ]),
            User.countDocuments({ "gender": "female" }),
            User.countDocuments({ "gender": "male" }),
            Order.find({}).select(["total", "discount", "orderItems", "status"]).limit(4)
        ])

        const thisMonthRevenue = thisMonthOrders.reduce((total: number, order) => total + order.total, 0)
        const lastMonthRevenue = lastMonthOrders.reduce((total: number, order) => total + order.total, 0)

        const revenueChangePercentage = calculatePercentage(thisMonthRevenue, lastMonthRevenue)
        const userChangePercentage = calculatePercentage(thisMonthUsers.length, lastMonthUsers.length)
        const productChangePercentage = calculatePercentage(thisMonthProducts.length, lastMonthProducts.length)
        const orderChangePercentage = calculatePercentage(thisMonthOrders.length, lastMonthOrders.length)

        const totalRevenue = orders.reduce((total: number, order) => total + order.total, 0)

        const lastSixMonthsOrders = await Order.find({
            "createdAt": {
                $gte: sixMonthAgoDate,
                $lte: todayDate
            }
        })

        const revenueOrderGrowth = lastSixMonthsOrders.reduce((accumulator, order) => {
            const date = order.createdAt
            const idx = todayDate.getMonth() - date.getMonth()
            accumulator.revenue[5 - idx] += order.total
            accumulator.order[5 - idx]++
            return accumulator
        }, { revenue: Array(6).fill(0), order: Array(6).fill(0) })

        categories.forEach((obj) => {
            obj.totalItems = Math.round(obj.totalItems / totalProducts * 100)
        })

        const modifiedlatestTransactions = latestTransactions.map((i) => {
            return {
                _id: i._id,
                amount: i.total,
                discount: i.discount,
                quantity: i.orderItems.length,
                status: i.status
            }
        })


        stats = {
            latestTransactions: modifiedlatestTransactions,
            categories,
            percentage: {
                userChangePercentage,
                productChangePercentage,
                orderChangePercentage,
                revenueChangePercentage
            },
            total: {
                totalUsers,
                totalProducts,
                totalOrders: orders.length,
                totalRevenue
            },
            revenueOrderGrowth,
            userRatio: {
                "male": maleCount,
                "female": femaleCount
            }
        }
        myCache.set("adminStats", JSON.stringify(stats))
    }

    return res.status(200).json(new ApiResponse(200, { stats }))
})

const getPieChart = asyncHandler(async (req, res, next) => {
    let pie;
    if (myCache.has("pieChart")) {
        pie = JSON.parse(myCache.get("pieChart") as string)
    } else {
        const [orderFulfillmentRatio, productCategoryRatio, productCount, outOfStock, orders, users] = await Promise.all([
            Order.aggregate([
                {
                    $group: {
                        _id: "$status",   // Group by the 'category' field
                        count: { $sum: 1 } // Count the number of items in each category
                    }
                },
                {
                    $project: {
                        _id: 0,               // Exclude the default _id field from the output
                        status: "$_id",     // Include the category as 'category'
                        count: 1         // Include the totalItems field
                    }
                }
            ]),
            Product.aggregate([
                {
                    $group: {
                        _id: "$category",   // Group by the 'category' field
                        count: { $sum: 1 } // Count the number of items in each category
                    }
                },
                {
                    $project: {
                        _id: 0,               // Exclude the default _id field from the output
                        category: "$_id",     // Include the category as 'category'
                        count: 1         // Include the totalItems field
                    }
                }
            ]),
            Product.countDocuments({}),
            Product.countDocuments({ "stock": 0 }),
            Order.find({}).select(["total", "discount", "shippingCharges", "tax", "subTotal"]),
            User.find({}).select(["role", "dob"])
        ])


        type revenueDistrubutionProp = {
            grossIncome: number,
            discount: number,
            productionCharges: number,
            burnt: number,
            marketingCost: number,
            netmargin: number,
        }

        let revenueDistrubution: revenueDistrubutionProp = {
            grossIncome: 0, // sum of total
            discount: 0, // sum of discount
            productionCharges: 0, // sum of shippingCharges
            burnt: 0, // sum of tax
            marketingCost: 0, // 30% of grossIncome
            netmargin: 0 // grossIncome - discount - productionCost - burnt - marketingCost
        }

        revenueDistrubution = orders.reduce((accumulator, order) => {
            accumulator.grossIncome += order.total
            accumulator.discount += order.discount
            accumulator.productionCharges += order.shippingCharges
            accumulator.burnt += order.tax
            return accumulator
        }, revenueDistrubution)

        // Calculate marketingCost as 30% of grossIncome
        revenueDistrubution.marketingCost = parseFloat((revenueDistrubution.grossIncome * 0.30).toFixed(2));

        // Calculate netMargin
        revenueDistrubution.netmargin = revenueDistrubution.grossIncome
            - revenueDistrubution.discount
            - revenueDistrubution.productionCharges
            - revenueDistrubution.burnt
            - revenueDistrubution.marketingCost;

        let ageGroup = {
            teen: 0,
            adult: 0,
            old: 0
        }
        let roleDistribution = {
            admin: 0,
            user: 0
        }

        let temp = users.reduce((accumulator, user) => {
            user.role == "admin" ? accumulator.roleDistribution.admin++ : accumulator.roleDistribution.user++
            user.age <= 18 ? accumulator.ageGroup.teen++ : user.age <= 40 ? accumulator.ageGroup.adult++ : accumulator.ageGroup.old++
            return accumulator
        }, { ageGroup, roleDistribution })

        pie = {
            orderFulfillmentRatio,
            productCategoryRatio,
            stockAvailbility: {
                stock: productCount - outOfStock,
                outOfStock
            },
            revenueDistrubution,
            ageGroup: temp.ageGroup,
            roleDistribution: temp.roleDistribution
        }

        myCache.set("pieChart", JSON.stringify(pie))
    }
    return res.status(200).json(new ApiResponse(200, { pie }))
})

const getBarChart = asyncHandler(async (req, res, next) => {
    let bar;
    if (myCache.has("barChart")) {
        bar = JSON.parse(myCache.get("barChart") || "{}")
        // bar = JSON.parse(myCache.get("barChart") !)
        // bar = JSON.parse(myCache.get("barChart") as string)
    } else {
        let today = new Date();
        let sixMonthAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1)
        let twelveMonthAgo = new Date(today.getFullYear(), today.getMonth() - 12, 1)

        const [products, users, orders] = await Promise.all([
            Product.aggregate([
                {
                    '$match': {
                        'createdAt': {
                            '$gte': sixMonthAgo,
                            '$lte': today
                        }
                    }
                }, {
                    '$project': {
                        "createdAt": 1
                    }
                }
            ]),
            User.find({
                "createdAt": {
                    '$gte': sixMonthAgo,
                    '$lte': today
                }
            }).select(["createdAt"]),
            Order.find({
                "createdAt": {
                    '$gte': twelveMonthAgo,
                    '$lte': today
                }
            }).select(["createdAt"]),
        ])

        let sixMonthProdut = products.reduce((accumulator, i) => {
            let idx = today.getMonth() - i.createdAt.getMonth() + 6
            if (idx > 5) idx = idx % 6
            accumulator[5 - idx]++
            return accumulator
        }, Array(6).fill(0))
        let sixMonthUser = users.reduce((accumulator, i) => {
            let idx = today.getMonth() - i.createdAt.getMonth() + 6
            if (idx > 5) idx = idx % 6
            accumulator[5 - idx]++
            return accumulator
        }, Array(6).fill(0))
        let twelveMonthorder = orders.reduce((accumulator, i) => {
            let idx = today.getMonth() - i.createdAt.getMonth() + 12
            if (idx > 5) idx = idx % 12
            accumulator[11 - idx]++
            return accumulator
        }, Array(12).fill(0))

        bar = {
            sixMonthProdut,
            sixMonthUser,
            twelveMonthorder
        }

        myCache.set("barChart", JSON.stringify(bar))
    }
    return res.status(200).json(new ApiResponse(200, { bar }))

})

const getLineChart = asyncHandler(async (req, res, next) => {
    let line;
    if (myCache.has("lineChart")) {
        line = JSON.parse(myCache.get("lineChart") as string)
    } else {
        let today = new Date()
        let yearAgo = new Date(today.getFullYear(), today.getMonth() - 11)

        let [products, users, orders] = await Promise.all([
            Product.aggregate([
                {
                    '$match': {
                        'createdAt': {
                            '$gte': yearAgo,
                            '$lte': today
                        }
                    }
                }, {
                    '$project': {
                        "createdAt": 1
                    }
                }
            ]),
            User.find({
                'createdAt': {
                    '$gte': yearAgo,
                    '$lte': today
                }
            }).select(["createdAt"]),
            Order.find({
                'createdAt': {
                    '$gte': yearAgo,
                    '$lte': today
                }
            }).select(["createdAt", "total", "discount"])
        ])
        let activeUsers = users.reduce((accumulator, i) => {
            let idx = today.getMonth() - i.createdAt.getMonth()
            if (idx < 0) idx += 12
            accumulator[11 - idx]++
            return accumulator
        }, Array(12).fill(0))

        let totalProducts = products.reduce((accumulator, i) => {
            let idx = today.getMonth() - i.createdAt.getMonth()
            if (idx < 0) idx += 12
            accumulator[11- idx]++
            return accumulator
        }, Array(12).fill(0))

        let total = orders.reduce((accumulator, i) => {
            let idx = today.getMonth() - i.createdAt.getMonth()
            if (idx < 0) idx += 12
            accumulator.discount[11-idx] += i.discount
            accumulator.revenue[11-idx] += i.total
            return accumulator
        }, { discount: Array(12).fill(0), revenue: Array(12).fill(0) })

        line = {
            activeUsers,
            totalProducts,
            totalRevenue: total.revenue,
            totalDiscount: total.discount
        }
        myCache.set("lineChart", JSON.stringify(line))

    }
    return res.status(200).json(new ApiResponse(200, { line }))
})

export { getDashboardStata, getPieChart, getBarChart, getLineChart }