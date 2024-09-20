import { NextFunction, Request, Response } from "express"
import { ApiError } from "../utils/ApiError.js"

export const ErrorMiddleware = (error: ApiError, req: Request, res: Response, next: NextFunction) => {
    error.message ||= ""
    return res.status(500).json({
        statusCode: error.statusCode || 500,
        successs: false,
        message: error.message,
        // stack: error.stack
    })
}