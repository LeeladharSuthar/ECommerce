import express from "express"
import { newProduct, getLatestProducts, getAllCategories, getAllProducts, getProduct, updateProduct, deleteProduct, searchProduct   } from "../controllers/product.controller.js"

import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new", adminOnly, singleUpload, newProduct)
app.get("/latest", getLatestProducts)
app.get("/category", getAllCategories)
app.get("/all", adminOnly, getAllProducts)
app.get("/search", searchProduct)

app.get("/:id", getProduct)
app.put("/:pid", adminOnly,  singleUpload, updateProduct)
app.delete("/:id", adminOnly, deleteProduct)


export default app; 