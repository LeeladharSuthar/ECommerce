import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminOnly = asyncHandler(async (req, res, next) => {
    const { id } = req.query
    if(!id){
        return next(new ApiError("Id required"))
    }
    
    const user = await User.findById(id)
    
    if (!user) {
        return next(new ApiError("User not found", 401))
    }
    if (user.role !== "admin") {
        return next(new ApiError("User not authorized", 402))
    }
    return next()
})