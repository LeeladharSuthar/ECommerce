import express from "express"
import { allUser, newUser, getUser, deleteUser } from "../controllers/user.controller.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();

app.post("/new", newUser)
app.get("/all", adminOnly, allUser)
app.get("/:id", getUser)
app.delete("/:id", deleteUser)

export default app;