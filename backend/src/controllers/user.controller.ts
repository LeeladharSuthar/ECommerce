import { Request } from "express";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { newUserRequestBody } from "../types/types.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const newUser = asyncHandler(async (req: Request<{}, {}, newUserRequestBody>, res, next) => {
    const { dob, email, photo, role, gender, name, _id } = req.body;

    if (email) {
        const user = await User.findOne({ email })
        if (user) {
            return next(new ApiError("email already exists"))
        }
    }

    if (!email || !photo || !name || !_id) {
        return next(new ApiError("All Fields Required"))
    }

    const user = await User.create({
        dob: dob ? new Date(dob) : null,
        email,
        gender: gender ? gender : null,
        name,
        photo,
        role: "user",
        _id
    })

    return res.status(200).json(new ApiResponse(200, {}, true, `Welcome ${user.name}`))
})

const allUser = asyncHandler(async (req, res, next) => {
    const users = await User.find({})
    return res.status(200).json(new ApiResponse(200, { users }, true))
})

const getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const user = await User.findById(id).select(["-createdAt", "-updatedAt"])

    if (!user) {
        return next(new ApiError("Invalid Id", 400))
    }
    
    return res.status(200).json(new ApiResponse(200, { user }, true))
})

const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
        return next(new ApiError("Invalid Id", 400))
    }

    await user.deleteOne()

    return res.status(200).json(new ApiResponse(200, {}, true, "User Deleted Successfully"))
})

export { allUser, deleteUser, getUser, newUser };

