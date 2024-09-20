import express from "express"
import { getBarChart, getDashboardStata, getLineChart, getPieChart } from "../controllers/stats.controller.js"
const app = express.Router()

app.get("/stats", getDashboardStata)

app.get("/pie", getPieChart)

app.get("/bar", getBarChart)

app.get("/line", getLineChart)

export default app;