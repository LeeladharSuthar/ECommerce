import express from "express";

import { deleteOrder, myOrders, newOrder, allOrders, singleOrder, processOrder } from "../controllers/order.controller.js"
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.post("/new", newOrder)
app.get("/myOrders", myOrders)
app.get("/allOrders", adminOnly, allOrders)
app.put("/process/:id", adminOnly, processOrder)
app.get("/:id", singleOrder)
app.delete("/:id", adminOnly, deleteOrder)


export default app;